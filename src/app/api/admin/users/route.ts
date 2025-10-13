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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const sortByParam = searchParams.get('sortBy') || 'registeredAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Map frontend sortBy to database column names (case-insensitive)
    const sortByMapping: { [key: string]: string } = {
      'name': 'name',
      'email': 'email',
      'registeredat': 'created_at',  // Handle lowercase
      'registeredAt': 'created_at',  // Handle camelCase
      'registered_at': 'created_at', // Handle snake_case
      'lastactive': 'updated_at',    // Handle lowercase
      'lastActive': 'updated_at',    // Handle camelCase
      'last_active': 'updated_at'    // Handle snake_case
    };
    
    const sortBy = sortByMapping[sortByParam?.toLowerCase()] || 'created_at';

    // console.log('Received params:', { search, status, sortByParam, sortBy, sortOrder, page, limit });

    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // Search by name or email
    if (search) {
      whereConditions.push(`(CONCAT(first_name, ' ', last_name) ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Filter by status (using subscription_status as status)
    if (status !== 'all') {
      whereConditions.push(`subscription_status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // First, let's check if the usage_logs table exists
    const tableCheckQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'usage_logs'
    `;
    
    const tableCheckResult = await query(tableCheckQuery);
    const hasUsageLogs = tableCheckResult.rows.length > 0;
    // console.log('Has usage_logs:', hasUsageLogs);
    
    // Build the query based on available tables
    let usersQuery;
    if (hasUsageLogs) {
      // Full query with both tables
      usersQuery = `
        SELECT 
          u.id,
          CASE 
            WHEN u.first_name IS NOT NULL AND u.last_name IS NOT NULL 
            THEN CONCAT(u.first_name, ' ', u.last_name)
            WHEN u.first_name IS NOT NULL 
            THEN u.first_name
            WHEN u.last_name IS NOT NULL 
            THEN u.last_name
            ELSE 'Unknown User'
          END as name,
          u.email,
          u.created_at as registered_at,
          u.updated_at as last_active,
          COALESCE(u.plan, 'FREE') as plan,
          COALESCE(u.subscription_status, 'active') as status,
          COALESCE(img_stats.total_images, 0) as total_images_processed,
          COALESCE(usage_stats.total_usage, 0) as total_usage_count
        FROM users u
        LEFT JOIN (
          SELECT 
            user_id, 
            SUM(file_count) as total_images
          FROM usage_logs 
          WHERE action IN ('image_resize', 'image_compress', 'bulk_resize')
          GROUP BY user_id
        ) img_stats ON u.id = img_stats.user_id
        LEFT JOIN (
          SELECT 
            user_id, 
            COUNT(*) as total_usage
          FROM usage_logs 
          GROUP BY user_id
        ) usage_stats ON u.id = usage_stats.user_id
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
    } else {
      // Simple query without joins
      usersQuery = `
        SELECT 
          u.id,
          CASE 
            WHEN u.first_name IS NOT NULL AND u.last_name IS NOT NULL 
            THEN CONCAT(u.first_name, ' ', u.last_name)
            WHEN u.first_name IS NOT NULL 
            THEN u.first_name
            WHEN u.last_name IS NOT NULL 
            THEN u.last_name
            ELSE 'Unknown User'
          END as name,
          u.email,
          u.created_at as registered_at,
          u.updated_at as last_active,
          COALESCE(u.plan, 'FREE') as plan,
          COALESCE(u.subscription_status, 'active') as status,
          0 as total_images_processed,
          0 as total_usage_count
        FROM users u
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
    }

    queryParams.push(limit, offset);

    // console.log('Executing users query:', usersQuery);
    // console.log('Query params:', queryParams);
    
    const usersResult = await query(usersQuery, queryParams);
    // console.log('Users query result:', usersResult.rows.length, 'users found');

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams.slice(0, -2)); // Remove limit and offset params
    const totalCount = parseInt(countResult.rows[0].total);
    // console.log('Total users count:', totalCount);

    // Format users data
    const users = usersResult.rows.map(user => ({
      id: user.id.toString(),
      name: user.name || 'Unknown User',
      email: user.email,
      registeredAt: user.registered_at,
      lastActive: user.last_active,
      totalImagesProcessed: parseInt(user.total_images_processed || 0),
      plan: user.plan || 'FREE',
      status: user.status || 'active',
      totalUsageCount: parseInt(user.total_usage_count || 0)
    }));

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users data:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch users data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
