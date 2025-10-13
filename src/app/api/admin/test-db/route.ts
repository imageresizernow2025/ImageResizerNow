import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const testQuery = await query('SELECT NOW() as current_time');
    console.log('Database time:', testQuery.rows[0]);
    
    // Check if users table exists and has data
    const usersCount = await query('SELECT COUNT(*) as count FROM users');
    console.log('Users count:', usersCount.rows[0].count);
    
    // Get sample users
    const sampleUsers = await query('SELECT id, email, first_name, last_name, created_at FROM users LIMIT 5');
    console.log('Sample users:', sampleUsers.rows);
    
    return NextResponse.json({
      success: true,
      databaseTime: testQuery.rows[0].current_time,
      usersCount: parseInt(usersCount.rows[0].count),
      sampleUsers: sampleUsers.rows
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
