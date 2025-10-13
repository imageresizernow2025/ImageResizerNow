import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('=== PRODUCTION DATABASE INITIALIZATION ===');
    
    // Only allow this in production and with a secret key for security
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({
        success: false,
        error: 'This endpoint is only available in production'
      }, { status: 403 });
    }
    
    const { secret } = await request.json();
    
    // Check for secret key to prevent unauthorized access
    if (secret !== process.env.DB_INIT_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Invalid secret key'
      }, { status: 401 });
    }
    
    console.log('Initializing production database...');
    await initializeDatabase();
    console.log('Production database initialization completed successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Production database initialized successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Production database initialization failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
