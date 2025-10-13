import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      user_id,
      guest_id,
      action,
      file_count,
      processing_time_ms,
      file_size_bytes
    } = data;

    // Insert usage tracking data
    await query(`
      INSERT INTO usage_logs (
        user_id, 
        guest_id,
        action, 
        file_count, 
        processing_time_ms, 
        file_size_bytes,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      user_id || null,
      guest_id || null,
      action || 'image_resize',
      file_count || 1,
      processing_time_ms || 0,
      file_size_bytes || 0,
      new Date().toISOString()
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking image processing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to track image processing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
