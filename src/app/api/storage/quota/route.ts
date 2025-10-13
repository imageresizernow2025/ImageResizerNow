import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

// Get user storage quota and usage information
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get storage statistics
    const statsResult = await query(
      `SELECT 
         COUNT(*) as total_images,
         COALESCE(SUM(file_size_mb), 0) as total_size_mb,
         COALESCE(AVG(file_size_mb), 0) as avg_size_mb
       FROM stored_images 
       WHERE user_id = $1`,
      [user.id]
    );

    const stats = statsResult.rows[0];

    // Get recent uploads
    const recentResult = await query(
      `SELECT * FROM stored_images 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [user.id]
    );

    const recentImages = recentResult.rows.map(row => ({
      id: row.id,
      originalName: row.original_filename,
      size: row.file_size_mb,
      contentType: row.content_type,
      width: row.width,
      height: row.height,
      uploadedAt: row.created_at,
      cdnUrl: row.cdn_url,
    }));

    return NextResponse.json({
      quota: {
        total: user.storageQuotaMb || 0,
        used: user.storageUsedMb || 0,
        available: (user.storageQuotaMb || 0) - (user.storageUsedMb || 0),
        percentage: Math.round(((user.storageUsedMb || 0) / (user.storageQuotaMb || 1)) * 100),
      },
      statistics: {
        totalImages: parseInt(stats.total_images),
        totalSizeMB: parseFloat(stats.total_size_mb),
        averageSizeMB: parseFloat(stats.avg_size_mb),
      },
      recentImages,
      plan: user.plan,
    });

  } catch (error) {
    console.error('Storage quota error:', error);
    return NextResponse.json({ error: 'Failed to get storage info' }, { status: 500 });
  }
}
