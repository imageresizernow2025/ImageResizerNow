import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, trackUsage } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Debug: Log request details
    console.log('Track-after-processing request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Track-after-processing request cookies:', request.cookies.getAll());
    
    const user = await getUserFromRequest(request);
    
    if (!user) {
      console.log('No user found in track-after-processing request');
      console.log('Available cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value}`));
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { fileCount } = await request.json();
    console.log(`Track-after-processing request for user ${user.id}: ${fileCount} files`);

    if (!fileCount || fileCount <= 0) {
      console.log('Invalid file count:', fileCount);
      return NextResponse.json(
        { error: 'Invalid file count' },
        { status: 400 }
      );
    }

    // Track usage without limit checking
    try {
      await trackUsage(user.id, fileCount);
      console.log('Usage tracked successfully for user:', user.id);
    } catch (trackError) {
      console.error('Failed to track usage:', trackError);
      // Continue even if tracking fails
    }

    // Log usage (optional - don't block if this fails)
    try {
      await query(
        `INSERT INTO usage_logs (user_id, action, file_count, processing_time_ms) 
         VALUES ($1, $2, $3, $4)`,
        [user.id, 'image_resize', fileCount, 0]
      );
      console.log('Usage logged successfully for user:', user.id);
    } catch (logError) {
      console.error('Failed to log usage:', logError);
      // Continue even if logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Usage tracked successfully'
    });
  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

