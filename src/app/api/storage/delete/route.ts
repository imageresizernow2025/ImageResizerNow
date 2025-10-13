import { NextRequest, NextResponse } from 'next/server';
import { deleteFromSpaces } from '@/lib/spaces';
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

// Delete image from Spaces and database
export async function DELETE(request: NextRequest) {
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

    // Delete from Spaces
    const deleted = await deleteFromSpaces(image.spaces_key);
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete from storage' }, { status: 500 });
    }

    // Delete from database
    await query(
      `DELETE FROM stored_images WHERE id = $1 AND user_id = $2`,
      [imageId, user.id]
    );

    // Update user storage usage
    await query(
      `UPDATE users SET storage_used_mb = storage_used_mb - $1 WHERE id = $2`,
      [image.file_size_mb, user.id]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

// Bulk delete images
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { imageIds } = await request.json();

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json({ error: 'Image IDs array required' }, { status: 400 });
    }

    // Get images details from database
    const result = await query(
      `SELECT * FROM stored_images WHERE id = ANY($1) AND user_id = $2`,
      [imageIds, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No images found' }, { status: 404 });
    }

    let deletedCount = 0;
    let totalSizeReduction = 0;

    // Delete each image
    for (const image of result.rows) {
      const deleted = await deleteFromSpaces(image.spaces_key);
      if (deleted) {
        await query(
          `DELETE FROM stored_images WHERE id = $1`,
          [image.id]
        );
        deletedCount++;
        totalSizeReduction += parseFloat(image.file_size_mb);
      }
    }

    // Update user storage usage
    if (totalSizeReduction > 0) {
      await query(
        `UPDATE users SET storage_used_mb = storage_used_mb - $1 WHERE id = $2`,
        [totalSizeReduction, user.id]
      );
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      totalSizeReduction,
    });

  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ error: 'Bulk delete failed' }, { status: 500 });
  }
}
