import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Test auth endpoint - headers:', Object.fromEntries(request.headers.entries()));
    console.log('Test auth endpoint - cookies:', request.cookies.getAll());
    
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { 
          authenticated: false, 
          message: 'No user found',
          cookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value }))
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json(
      { 
        authenticated: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
