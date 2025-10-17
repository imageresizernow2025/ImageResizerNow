import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { type, format, dateRange, filters } = await request.json();

    let query = '';
    let params: any[] = [];
    
    // Base query structure based on export type
    switch (type) {
      case 'analytics':
        query = `
          SELECT 
            DATE(ut.created_at) as date,
            COUNT(DISTINCT COALESCE(ut.user_id, ut.guest_id)) as unique_users,
            COUNT(*) as total_actions,
            COUNT(CASE WHEN ut.action = 'image_resize' THEN 1 END) as processing_actions,
            COUNT(CASE WHEN ut.action = 'download' THEN 1 END) as downloads,
            COUNT(CASE WHEN ut.action = 'signup' THEN 1 END) as signups,
            AVG(ut.processing_time_ms) as avg_processing_time,
            AVG(ut.file_count) as avg_files_per_action
          FROM usage_tracking ut
          WHERE ut.created_at >= $1 AND ut.created_at <= $2
        `;
        params = [dateRange.from, dateRange.to];
        break;

      case 'users':
        query = `
          SELECT 
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.created_at as signup_date,
            u.last_login,
            COUNT(ut.id) as total_actions,
            COUNT(CASE WHEN ut.action = 'image_resize' THEN 1 END) as processing_count,
            SUM(ut.file_count) as total_files_processed,
            AVG(ut.processing_time_ms) as avg_processing_time
          FROM users u
          LEFT JOIN usage_tracking ut ON u.id = ut.user_id
          WHERE u.created_at >= $1 AND u.created_at <= $2
          GROUP BY u.id, u.email, u.first_name, u.last_name, u.created_at, u.last_login
        `;
        params = [dateRange.from, dateRange.to];
        break;

      case 'usage':
        query = `
          SELECT 
            ut.id,
            ut.action,
            ut.user_id,
            ut.guest_id,
            ut.file_count,
            ut.processing_time_ms,
            ut.created_at,
            pu.page,
            pu.session_id
          FROM usage_tracking ut
          LEFT JOIN page_usage pu ON ut.user_id = pu.user_id AND ut.guest_id = pu.guest_id
          WHERE ut.created_at >= $1 AND ut.created_at <= $2
        `;
        params = [dateRange.from, dateRange.to];
        break;

      case 'funnel':
        query = `
          WITH funnel_data AS (
            SELECT 
              COALESCE(ut.user_id, ut.guest_id) as user_id,
              MAX(CASE WHEN ut.action = 'file_upload' THEN 1 ELSE 0 END) as uploaded,
              MAX(CASE WHEN ut.action = 'image_resize' THEN 1 ELSE 0 END) as processed,
              MAX(CASE WHEN ut.action = 'download' THEN 1 ELSE 0 END) as downloaded,
              MAX(CASE WHEN ut.action = 'signup' THEN 1 ELSE 0 END) as signed_up
            FROM usage_tracking ut
            WHERE ut.created_at >= $1 AND ut.created_at <= $2
            GROUP BY COALESCE(ut.user_id, ut.guest_id)
          )
          SELECT 
            'Step 1: Upload' as step,
            SUM(uploaded) as users,
            COUNT(*) as total_users,
            ROUND((SUM(uploaded)::decimal / COUNT(*)) * 100, 2) as conversion_rate
          FROM funnel_data
          UNION ALL
          SELECT 
            'Step 2: Process' as step,
            SUM(processed) as users,
            SUM(uploaded) as total_users,
            CASE WHEN SUM(uploaded) > 0 THEN ROUND((SUM(processed)::decimal / SUM(uploaded)) * 100, 2) ELSE 0 END as conversion_rate
          FROM funnel_data
          UNION ALL
          SELECT 
            'Step 3: Download' as step,
            SUM(downloaded) as users,
            SUM(processed) as total_users,
            CASE WHEN SUM(processed) > 0 THEN ROUND((SUM(downloaded)::decimal / SUM(processed)) * 100, 2) ELSE 0 END as conversion_rate
          FROM funnel_data
          UNION ALL
          SELECT 
            'Step 4: Signup' as step,
            SUM(signed_up) as users,
            SUM(downloaded) as total_users,
            CASE WHEN SUM(downloaded) > 0 THEN ROUND((SUM(signed_up)::decimal / SUM(downloaded)) * 100, 2) ELSE 0 END as conversion_rate
          FROM funnel_data
        `;
        params = [dateRange.from, dateRange.to];
        break;

      case 'performance':
        query = `
          SELECT 
            DATE(ut.created_at) as date,
            ut.action,
            COUNT(*) as total_requests,
            AVG(ut.processing_time_ms) as avg_processing_time,
            MIN(ut.processing_time_ms) as min_processing_time,
            MAX(ut.processing_time_ms) as max_processing_time,
            COUNT(CASE WHEN ut.processing_time_ms = 0 THEN 1 END) as failed_requests,
            ROUND((COUNT(CASE WHEN ut.processing_time_ms = 0 THEN 1 END)::decimal / COUNT(*)) * 100, 2) as error_rate
          FROM usage_tracking ut
          WHERE ut.created_at >= $1 AND ut.created_at <= $2
          GROUP BY DATE(ut.created_at), ut.action
          ORDER BY date, ut.action
        `;
        params = [dateRange.from, dateRange.to];
        break;

      default:
        throw new Error('Invalid export type');
    }

    // Add filters if specified
    if (filters.userType && filters.userType !== 'all') {
      if (filters.userType === 'registered') {
        query += ` AND ut.user_id IS NOT NULL`;
      } else if (filters.userType === 'anonymous') {
        query += ` AND ut.user_id IS NULL AND ut.guest_id IS NOT NULL`;
      }
    }

    if (filters.minFileCount && filters.minFileCount > 1) {
      query += ` AND ut.file_count >= ${filters.minFileCount}`;
    }

    if (filters.maxFileCount && filters.maxFileCount < 100) {
      query += ` AND ut.file_count <= ${filters.maxFileCount}`;
    }

    // Execute query
    const result = await dbQuery(query, params);
    const data = result.rows;

    // Generate file based on format
    let fileContent = '';
    let contentType = '';
    let filename = `analytics-export-${type}-${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'csv':
        if (data.length > 0) {
          // Generate CSV headers
          const headers = Object.keys(data[0]).join(',');
          const rows = data.map(row => 
            Object.values(row).map(value => 
              typeof value === 'string' && value.includes(',') ? `"${value}"` : value
            ).join(',')
          );
          fileContent = [headers, ...rows].join('\n');
        }
        contentType = 'text/csv';
        filename += '.csv';
        break;

      case 'json':
        fileContent = JSON.stringify(data, null, 2);
        contentType = 'application/json';
        filename += '.json';
        break;

      case 'excel':
        // For Excel, we'll create a CSV that Excel can open
        if (data.length > 0) {
          const headers = Object.keys(data[0]).join('\t');
          const rows = data.map(row => 
            Object.values(row).join('\t')
          );
          fileContent = [headers, ...rows].join('\n');
        }
        contentType = 'application/vnd.ms-excel';
        filename += '.xls';
        break;

      default:
        throw new Error('Invalid export format');
    }

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
