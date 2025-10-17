import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get current timestamp for real-time calculations
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    // Get active users (users with activity in last 5 minutes)
    const activeUsersQuery = await query(`
      SELECT COUNT(DISTINCT user_id) as active_users
      FROM page_usage 
      WHERE created_at >= $1 AND user_id IS NOT NULL
      UNION ALL
      SELECT COUNT(DISTINCT guest_id) as active_users
      FROM page_usage 
      WHERE created_at >= $1 AND guest_id IS NOT NULL AND user_id IS NULL
    `, [fiveMinutesAgo]);

    const activeUsers = activeUsersQuery.rows.reduce((sum, row) => sum + parseInt(row.active_users), 0);

    // Get current sessions (unique sessions in last 5 minutes)
    const currentSessionsQuery = await query(`
      SELECT COUNT(DISTINCT session_id) as current_sessions
      FROM page_usage 
      WHERE created_at >= $1
    `, [fiveMinutesAgo]);

    const currentSessions = parseInt(currentSessionsQuery.rows[0]?.current_sessions || '0');

    // Get live conversions (image processing in last 5 minutes)
    const liveConversionsQuery = await query(`
      SELECT COUNT(*) as conversions
      FROM usage_tracking 
      WHERE action = 'image_resize' AND created_at >= $1
    `, [fiveMinutesAgo]);

    const liveConversions = parseInt(liveConversionsQuery.rows[0]?.conversions || '0');

    // Get processing images (ongoing processing)
    const processingImagesQuery = await query(`
      SELECT COUNT(*) as processing
      FROM usage_tracking 
      WHERE action = 'image_resize' AND created_at >= $1
    `, [fiveMinutesAgo]);

    const processingImages = parseInt(processingImagesQuery.rows[0]?.processing || '0');

    // Get recent activity (last 10 minutes)
    const recentActivityQuery = await query(`
      SELECT 
        ut.id,
        ut.action,
        ut.user_id,
        ut.guest_id,
        ut.created_at,
        ut.file_count,
        ut.processing_time_ms,
        CASE 
          WHEN ut.user_id IS NOT NULL THEN 'registered'
          ELSE 'anonymous'
        END as user_type,
        CASE 
          WHEN ut.action = 'image_resize' THEN 'Processing ' || ut.file_count || ' image(s) in ' || ROUND(ut.processing_time_ms/1000) || 's'
          WHEN ut.action = 'file_upload' THEN 'Uploaded ' || ut.file_count || ' file(s)'
          WHEN ut.action = 'download' THEN 'Downloaded ' || ut.file_count || ' file(s)'
          WHEN ut.action = 'signup' THEN 'Created new account'
          ELSE ut.action
        END as details
      FROM usage_tracking ut
      WHERE ut.created_at >= $1
      ORDER BY ut.created_at DESC
      LIMIT 20
    `, [tenMinutesAgo]);

    const recentActivity = recentActivityQuery.rows.map(row => ({
      id: row.id,
      type: row.action === 'image_resize' ? 'processing' : 
            row.action === 'file_upload' ? 'upload' :
            row.action === 'download' ? 'download' : 'signup',
      userType: row.user_type,
      timestamp: row.created_at,
      details: row.details
    }));

    const realtimeData = {
      activeUsers,
      currentSessions,
      liveConversions,
      processingImages,
      recentActivity
    };

    return NextResponse.json(realtimeData);
  } catch (error) {
    console.error('Error fetching real-time analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch real-time analytics' },
      { status: 500 }
    );
  }
}
