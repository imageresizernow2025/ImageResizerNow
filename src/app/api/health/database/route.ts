import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const health = await checkDatabaseHealth();
    
    if (health.healthy) {
      return NextResponse.json({
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        database: 'disconnected',
        error: health.error,
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
