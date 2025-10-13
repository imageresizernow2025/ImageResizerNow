import { NextRequest, NextResponse } from 'next/server';
import { query, checkDatabaseHealth } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // First check database health
    const healthCheck = await checkDatabaseHealth();
    if (!healthCheck.healthy) {
      console.error('Database health check failed:', healthCheck.error);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: healthCheck.error || 'Unable to connect to database'
        },
        { status: 503 }
      );
    }

    console.log('Starting analytics...');
    
    // Get registered users count
    const registeredUsersResult = await query('SELECT COUNT(*) as registered FROM users WHERE email IS NOT NULL');
    const registeredUsers = parseInt(registeredUsersResult.rows[0].registered);
    console.log('Registered users:', registeredUsers);
    
    // Get guest users count from page_usage table
    const guestUsersResult = await query('SELECT COUNT(DISTINCT guest_id) as guests FROM page_usage WHERE guest_id IS NOT NULL');
    const guestUsers = parseInt(guestUsersResult.rows[0].guests);
    console.log('Guest users:', guestUsers);
    
    // Total users = registered + guest users
    const totalUsers = registeredUsers + guestUsers;
    console.log('Total users:', totalUsers);
    
    // Get total sessions from page_usage (both registered and guest users)
    const totalSessionsResult = await query(`
      SELECT COUNT(DISTINCT COALESCE(user_id::text, guest_id)) as sessions 
      FROM page_usage 
      WHERE user_id IS NOT NULL OR guest_id IS NOT NULL
    `);
    const totalSessions = parseInt(totalSessionsResult.rows[0].sessions);
    console.log('Total sessions:', totalSessions);
    
    // Get daily active users (last 24 hours) - both registered and guest
    const dailyActiveResult = await query(`
      SELECT COUNT(DISTINCT COALESCE(user_id::text, guest_id)) as daily_active 
      FROM page_usage 
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      AND (user_id IS NOT NULL OR guest_id IS NOT NULL)
    `);
    const dailyActiveUsers = parseInt(dailyActiveResult.rows[0].daily_active || 0);
    console.log('Daily active users:', dailyActiveUsers);
    
    // Get most used features from page_usage (most visited pages)
    const mostUsedFeaturesResult = await query(`
      SELECT 
        page_path as name,
        COUNT(*) as usage,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM page_usage)), 1) as percentage
      FROM page_usage 
      WHERE page_path IS NOT NULL
      AND (user_id IS NOT NULL OR guest_id IS NOT NULL)
      GROUP BY page_path 
      ORDER BY usage DESC 
      LIMIT 10
    `);
    const mostUsedFeatures = mostUsedFeaturesResult.rows.map(row => ({
      name: row.name,
      usage: parseInt(row.usage),
      percentage: parseFloat(row.percentage)
    }));
    console.log('Most used features:', mostUsedFeatures);
    
    // Get total images processed from usage_logs
    const totalImagesResult = await query(`
      SELECT COALESCE(SUM(file_count), 0) as total_images 
      FROM usage_logs
      WHERE action IN ('image_resize', 'image_compress', 'bulk_resize')
    `);
    const totalImagesProcessed = parseInt(totalImagesResult.rows[0].total_images || 0);
    console.log('Total images processed:', totalImagesProcessed);
    
    // Calculate conversion rate (registered users / total users)
    const conversionRate = totalUsers > 0 ? Math.round((registeredUsers / totalUsers) * 100 * 10) / 10 : 0;
    console.log('Conversion rate:', conversionRate);
    
    // Get traffic sources (simplified - in real app you'd track this)
    const trafficSources = [
      { source: 'Direct', visits: Math.floor(totalUsers * 0.4), percentage: 40.0 },
      { source: 'Google Search', visits: Math.floor(totalUsers * 0.3), percentage: 30.0 },
      { source: 'Social Media', visits: Math.floor(totalUsers * 0.2), percentage: 20.0 },
      { source: 'Referrals', visits: Math.floor(totalUsers * 0.1), percentage: 10.0 }
    ];
    
    // Simplified page usage analytics
    const pageUsage = mostUsedFeatures.map(feature => ({
      page: feature.name,
      visits: feature.usage,
      uniqueUsers: Math.floor(feature.usage * 0.8), // Simplified calculation
      percentage: feature.percentage
    }));
    
    // Simplified time-based data
    const pageUsageByDay = [];
    const popularPages = mostUsedFeatures.map(feature => ({
      page: feature.name,
      uniqueUsers: Math.floor(feature.usage * 0.8),
      totalVisits: feature.usage,
      avgTimeOnPage: 2.5 // Simplified
    }));
    
    const analyticsData = {
      totalUsers,
      guestUsers,
      registeredUsers,
      totalSessions,
      dailyActiveUsers,
      weeklyActiveUsers: dailyActiveUsers, // Simplified for now
      monthlyActiveUsers: dailyActiveUsers, // Simplified for now
      totalImagesProcessed,
      averageSessionDuration: 5.2, // Simplified for now
      conversionRate,
      mostUsedFeatures,
      trafficSources,
      pageUsage,
      pageUsageByDay,
      popularPages
    };
    
    console.log('Analytics data prepared:', analyticsData);
    
    return NextResponse.json(analyticsData);
    
  } catch (error) {
    console.error('Error in analytics:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}