import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, checkDailyLimit, updateUsageCount } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { fileCount, processingOptions } = await request.json();

    // Check daily limit
    const hasExceededLimit = await checkDailyLimit(user.id, fileCount);
    if (hasExceededLimit) {
      return NextResponse.json(
        { 
          error: 'Daily limit exceeded',
          plan: user.plan,
          dailyUsageCount: user.dailyUsageCount
        },
        { status: 429 }
      );
    }

    // Log usage
    await query(
      `INSERT INTO usage_logs (user_id, action, file_count, processing_time_ms) 
       VALUES ($1, $2, $3, $4)`,
      [user.id, 'image_resize', fileCount, 0]
    );

    // Update usage count
    await updateUsageCount(user.id, fileCount);

    return NextResponse.json({
      success: true,
      remainingUsage: user.dailyUsageCount - fileCount,
      plan: user.plan
    });
  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
