import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DATABASE CONNECTION TEST ===');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    if (process.env.DATABASE_URL) {
      console.log('DATABASE_URL:', process.env.DATABASE_URL);
      
      // Parse the URL to show what we're connecting to
      const url = new URL(process.env.DATABASE_URL);
      console.log('Parsed URL:');
      console.log('- Host:', url.hostname);
      console.log('- Port:', url.port);
      console.log('- Database:', url.pathname.slice(1));
      console.log('- Username:', url.username);
      console.log('- Password:', url.password ? '***' : 'none');
    }
    
    // Test actual connection
    const { query } = await import('@/lib/db');
    const result = await query('SELECT current_user, current_database(), version()');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        user: result.rows[0].current_user,
        database: result.rows[0].current_database,
        version: result.rows[0].version
      },
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
        NODE_ENV: process.env.NODE_ENV
      }
    });
    
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
        NODE_ENV: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}
