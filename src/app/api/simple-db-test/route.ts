import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET(request: NextRequest) {
  let pool: Pool | null = null;
  
  try {
    console.log('=== SIMPLE DATABASE TEST ===');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not set'
      }, { status: 500 });
    }
    
    // Parse the URL
    const url = new URL(process.env.DATABASE_URL);
    console.log('Parsed URL:');
    console.log('- Host:', url.hostname);
    console.log('- Port:', url.port);
    console.log('- Database:', url.pathname.slice(1));
    console.log('- Username:', url.username);
    
    // Create a simple pool with minimal settings
    pool = new Pool({
      user: url.username,
      password: url.password,
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1),
      ssl: process.env.NODE_ENV === 'production' ? { 
        rejectUnauthorized: false 
      } : false,
      max: 1, // Only 1 connection
      min: 0, // No minimum
      idleTimeoutMillis: 10000, // 10 seconds
      connectionTimeoutMillis: 5000, // 5 seconds
    });
    
    console.log('Pool created, attempting connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('Connected successfully!');
    
    const result = await client.query('SELECT current_user, current_database(), version()');
    console.log('Query executed successfully!');
    
    client.release();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        user: result.rows[0].current_user,
        database: result.rows[0].current_database,
        version: result.rows[0].version
      }
    });
    
  } catch (error) {
    console.error('Simple database test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    if (pool) {
      try {
        await pool.end();
        console.log('Pool closed');
      } catch (closeError) {
        console.error('Error closing pool:', closeError);
      }
    }
  }
}
