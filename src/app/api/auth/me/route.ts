import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { checkDatabaseHealth } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // First check database health
    const healthCheck = await checkDatabaseHealth();
    if (!healthCheck.healthy) {
      console.error('Database health check failed in /api/auth/me:', healthCheck.error);
      return NextResponse.json(
        { 
          error: 'Database temporarily unavailable',
          details: 'Please try again in a moment'
        },
        { status: 503 }
      );
    }

    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('Auth/me endpoint - user daily usage count:', user.dailyUsageCount);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
        dailyUsageCount: user.dailyUsageCount,
        lastUsageResetDate: user.lastUsageResetDate
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    
    // If it's a database connection error, return 503 instead of 500
    if (error instanceof Error && (
      error.message.includes('timeout') ||
      error.message.includes('Connection terminated') ||
      error.message.includes('connection') ||
      error.message.includes('ECONNRESET')
    )) {
      return NextResponse.json(
        { 
          error: 'Database temporarily unavailable',
          details: 'Please try again in a moment'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
