import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUrl } from '@/lib/spaces';
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

// Generate presigned URL for secure access
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

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');
    const expiresIn = parseInt(searchParams.get('expires') || '3600');

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    // Get image details from database
    const result = await query(
      `SELECT * FROM stored_images WHERE id = $1 AND user_id = $2`,
      [imageId, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const image = result.rows[0];

    // Generate presigned URL
    const presignedUrl = await generatePresignedUrl(image.spaces_key, expiresIn);

    if (!presignedUrl) {
      return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
    }

    return NextResponse.json({
      presignedUrl,
      expiresIn,
      image: {
        id: image.id,
        originalName: image.original_filename,
        size: image.file_size_mb,
        contentType: image.content_type,
        width: image.width,
        height: image.height,
        uploadedAt: image.created_at,
      }
    });

  } catch (error) {
    console.error('Generate URL error:', error);
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }
}
