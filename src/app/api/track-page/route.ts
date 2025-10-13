import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Debug: Log the received data
    console.log('Track page received data:', data);
    
    const {
      user_id,
      guest_id,
      page_path,
      page_title,
      session_id,
      referrer,
      user_agent,
      timestamp
    } = data;
    
    // Debug: Log the extracted values
    console.log('Extracted values:', {
      user_id,
      guest_id,
      page_path,
      page_title,
      session_id,
      referrer,
      user_agent,
      timestamp
    });

    // Validate required fields
    if (!page_path) {
      console.error('Missing required field: page_path');
      return NextResponse.json(
        { error: 'Missing required field: page_path' },
        { status: 400 }
      );
    }

    // Insert page usage data (user_id can be null for guests)
    await query(`
      INSERT INTO page_usage (
        user_id, 
        guest_id,
        page_path, 
        page_title, 
        session_id, 
        referrer, 
        user_agent, 
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      user_id || null,
      guest_id || null,
      page_path,
      page_title,
      session_id,
      referrer,
      user_agent,
      timestamp || new Date().toISOString()
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page:', error);
    return NextResponse.json(
      { error: 'Failed to track page' },
      { status: 500 }
    );
  }
}
