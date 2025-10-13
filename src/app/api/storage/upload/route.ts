import { NextRequest, NextResponse } from 'next/server';
import { uploadToSpaces, deleteFromSpaces, generatePresignedUrl, listUserFiles, calculateUserStorageUsage } from '@/lib/spaces';
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

// Upload image to Spaces
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const width = formData.get('width') as string;
    const height = formData.get('height') as string;
    const teamId = formData.get('teamId') as string;
    const sharedWithTeam = formData.get('sharedWithTeam') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check storage quota
    const currentUsage = await calculateUserStorageUsage(user.id);
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (currentUsage + fileSizeMB > (user.storageQuotaMb || 0)) {
      return NextResponse.json({ 
        error: 'Storage quota exceeded',
        currentUsage,
        quota: user.storageQuotaMb || 0 
      }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Spaces
    const result = await uploadToSpaces(
      buffer,
      file.name,
      file.type,
      user.id,
      {
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
      }
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Save to database
    await query(
      `INSERT INTO stored_images (user_id, team_id, spaces_key, spaces_url, cdn_url, original_filename, file_size_mb, content_type, width, height, is_shared, shared_with_team)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        user.id,
        teamId ? parseInt(teamId) : null,
        result.key,
        result.url,
        result.cdnUrl,
        file.name,
        fileSizeMB,
        file.type,
        width ? parseInt(width) : null,
        height ? parseInt(height) : null,
        sharedWithTeam === 'true',
        sharedWithTeam === 'true',
      ]
    );

    // Update user storage usage
    await query(
      `UPDATE users SET storage_used_mb = storage_used_mb + $1 WHERE id = $2`,
      [fileSizeMB, user.id]
    );

    return NextResponse.json({
      success: true,
      image: {
        key: result.key,
        url: result.url,
        cdnUrl: result.cdnUrl,
        originalName: file.name,
        size: fileSizeMB,
        contentType: file.type,
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// List user's stored images
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get images from database
    const result = await query(
      `SELECT * FROM stored_images 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [user.id, limit, offset]
    );

    const images = result.rows.map(row => ({
      id: row.id,
      key: row.spaces_key,
      url: row.spaces_url,
      cdnUrl: row.cdn_url,
      originalName: row.original_filename,
      size: row.file_size_mb,
      contentType: row.content_type,
      width: row.width,
      height: row.height,
      uploadedAt: row.created_at,
    }));

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM stored_images WHERE user_id = $1`,
      [user.id]
    );

    return NextResponse.json({
      images,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset,
    });

  } catch (error) {
    console.error('List images error:', error);
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
  }
}
