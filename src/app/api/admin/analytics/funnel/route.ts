import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get funnel data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Step 1: File Uploads
    const uploadsQuery = await query(`
      SELECT COUNT(DISTINCT COALESCE(user_id, guest_id)) as users
      FROM usage_tracking 
      WHERE action = 'file_upload' AND created_at >= $1
    `, [thirtyDaysAgo]);

    const uploads = parseInt(uploadsQuery.rows[0]?.users || '0');

    // Step 2: Processing Initiated
    const processingQuery = await query(`
      SELECT COUNT(DISTINCT COALESCE(user_id, guest_id)) as users
      FROM usage_tracking 
      WHERE action = 'image_resize' AND created_at >= $1
    `, [thirtyDaysAgo]);

    const processing = parseInt(processingQuery.rows[0]?.users || '0');

    // Step 3: Processing Completed (successful processing)
    const completedQuery = await query(`
      SELECT COUNT(DISTINCT COALESCE(user_id, guest_id)) as users
      FROM usage_tracking 
      WHERE action = 'image_resize' AND processing_time_ms > 0 AND created_at >= $1
    `, [thirtyDaysAgo]);

    const completed = parseInt(completedQuery.rows[0]?.users || '0');

    // Step 4: Downloads
    const downloadsQuery = await query(`
      SELECT COUNT(DISTINCT COALESCE(user_id, guest_id)) as users
      FROM usage_tracking 
      WHERE action = 'download' AND created_at >= $1
    `, [thirtyDaysAgo]);

    const downloads = parseInt(downloadsQuery.rows[0]?.users || '0');

    // Step 5: Signups (conversion)
    const signupsQuery = await query(`
      SELECT COUNT(DISTINCT user_id) as users
      FROM users 
      WHERE created_at >= $1
    `, [thirtyDaysAgo]);

    const signups = parseInt(signupsQuery.rows[0]?.users || '0');

    // Calculate conversion rates and drop-off rates
    const steps = [
      {
        name: 'File Upload',
        users: uploads,
        conversionRate: uploads > 0 ? 100 : 0,
        dropoffRate: 0
      },
      {
        name: 'Processing Started',
        users: processing,
        conversionRate: uploads > 0 ? Math.round((processing / uploads) * 100) : 0,
        dropoffRate: uploads > 0 ? Math.round(((uploads - processing) / uploads) * 100) : 0
      },
      {
        name: 'Processing Completed',
        users: completed,
        conversionRate: uploads > 0 ? Math.round((completed / uploads) * 100) : 0,
        dropoffRate: processing > 0 ? Math.round(((processing - completed) / processing) * 100) : 0
      },
      {
        name: 'Download Completed',
        users: downloads,
        conversionRate: uploads > 0 ? Math.round((downloads / uploads) * 100) : 0,
        dropoffRate: completed > 0 ? Math.round(((completed - downloads) / completed) * 100) : 0
      },
      {
        name: 'Account Created',
        users: signups,
        conversionRate: uploads > 0 ? Math.round((signups / uploads) * 100) : 0,
        dropoffRate: downloads > 0 ? Math.round(((downloads - signups) / downloads) * 100) : 0
      }
    ];

    // Calculate average time to convert (from upload to download)
    const avgTimeQuery = await query(`
      SELECT AVG(processing_time_ms) as avg_time
      FROM usage_tracking 
      WHERE action = 'image_resize' AND processing_time_ms > 0 AND created_at >= $1
    `, [thirtyDaysAgo]);

    const averageTimeToConvert = Math.round(parseFloat(avgTimeQuery.rows[0]?.avg_time || '0') / 1000);

    // Overall conversion rate (uploads to signups)
    const overallConversion = uploads > 0 ? Math.round((signups / uploads) * 100) : 0;

    const funnelData = {
      steps,
      overallConversion,
      averageTimeToConvert
    };

    return NextResponse.json(funnelData);
  } catch (error) {
    console.error('Error fetching funnel analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funnel analytics' },
      { status: 500 }
    );
  }
}
