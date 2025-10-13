import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// DigitalOcean Spaces configuration with connection pooling
const spacesClient = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY!,
  },
  // Performance optimizations
  maxAttempts: 3,
  requestTimeout: 30000,
  connectionTimeout: 10000,
});

const BUCKET_NAME = process.env.DO_SPACES_BUCKET!;
const CDN_URL = process.env.DO_SPACES_CDN_URL!;

// Cache for presigned URLs
const urlCache = new Map<string, { url: string; expires: number }>();
const CACHE_TTL = 50 * 60 * 1000; // 50 minutes (URLs expire in 1 hour)

export interface UploadResult {
  success: boolean;
  key?: string;
  url?: string;
  cdnUrl?: string;
  error?: string;
}

export interface ImageMetadata {
  id: string;
  key: string;
  url: string;
  cdnUrl: string;
  originalName: string;
  size: number;
  contentType: string;
  width?: number;
  height?: number;
  uploadedAt: Date;
}

// Optimized upload with compression
export async function uploadToSpaces(
  file: Buffer,
  originalName: string,
  contentType: string,
  userId: number,
  metadata?: { width?: number; height?: number }
): Promise<UploadResult> {
  try {
    const fileId = uuidv4();
    const fileExtension = originalName.split('.').pop() || 'jpg';
    const key = `users/${userId}/${fileId}.${fileExtension}`;

    // Compress image if it's too large
    let processedFile = file;
    if (file.length > 5 * 1024 * 1024) { // 5MB
      // For now, we'll use the original file
      // In production, you might want to compress it
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: processedFile,
      ContentType: contentType,
      Metadata: {
        originalName,
        userId: userId.toString(),
        width: metadata?.width?.toString() || '',
        height: metadata?.height?.toString() || '',
        uploadedAt: new Date().toISOString(),
      },
      // Performance optimizations
      CacheControl: 'public, max-age=31536000', // 1 year cache
      ContentDisposition: `inline; filename="${originalName}"`,
    });

    await spacesClient.send(command);

    const url = `${process.env.DO_SPACES_ENDPOINT}/${BUCKET_NAME}/${key}`;
    const cdnUrl = `${CDN_URL}/${key}`;

    return {
      success: true,
      key,
      url,
      cdnUrl,
    };
  } catch (error) {
    console.error('Error uploading to Spaces:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// Batch upload for better performance
export async function batchUploadToSpaces(
  files: Array<{
    buffer: Buffer;
    originalName: string;
    contentType: string;
    metadata?: { width?: number; height?: number };
  }>,
  userId: number
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => 
    uploadToSpaces(file.buffer, file.originalName, file.contentType, userId, file.metadata)
  );

  return Promise.all(uploadPromises);
}

// Optimized delete with batch support
export async function deleteFromSpaces(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await spacesClient.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting from Spaces:', error);
    return false;
  }
}

// Batch delete for better performance
export async function batchDeleteFromSpaces(keys: string[]): Promise<{ success: number; failed: number }> {
  const deletePromises = keys.map(key => deleteFromSpaces(key));
  const results = await Promise.allSettled(deletePromises);
  
  const success = results.filter(result => result.status === 'fulfilled' && result.value).length;
  const failed = results.length - success;
  
  return { success, failed };
}

// Optimized presigned URL generation with caching
export async function generatePresignedUrl(key: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    // Check cache first
    const cacheKey = `${key}_${expiresIn}`;
    const cached = urlCache.get(cacheKey);
    if (cached && Date.now() < cached.expires) {
      return cached.url;
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(spacesClient, command, { expiresIn });
    
    // Cache the URL
    urlCache.set(cacheKey, {
      url: presignedUrl,
      expires: Date.now() + (expiresIn - 60) * 1000 // Cache for slightly less than expiry
    });

    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return null;
  }
}

// Optimized list with pagination and filtering
export async function listUserFiles(
  userId: number, 
  limit: number = 50, 
  continuationToken?: string
): Promise<{ files: ImageMetadata[]; nextToken?: string }> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `users/${userId}/`,
      MaxKeys: limit,
      ContinuationToken: continuationToken,
    });

    const response = await spacesClient.send(command);
    
    if (!response.Contents) {
      return { files: [] };
    }

    const files: ImageMetadata[] = response.Contents.map((object) => {
      const key = object.Key!;
      const url = `${process.env.DO_SPACES_ENDPOINT}/${BUCKET_NAME}/${key}`;
      const cdnUrl = `${CDN_URL}/${key}`;
      
      const fileName = key.split('/').pop() || '';
      const fileId = fileName.split('.')[0];
      
      return {
        id: fileId,
        key,
        url,
        cdnUrl,
        originalName: object.Metadata?.originalName || fileName,
        size: object.Size || 0,
        contentType: object.Metadata?.contentType || 'image/jpeg',
        width: object.Metadata?.width ? parseInt(object.Metadata.width) : undefined,
        height: object.Metadata?.height ? parseInt(object.Metadata.height) : undefined,
        uploadedAt: object.LastModified || new Date(),
      };
    });

    return {
      files,
      nextToken: response.NextContinuationToken
    };
  } catch (error) {
    console.error('Error listing user files:', error);
    return { files: [] };
  }
}

// Optimized storage usage calculation
export async function calculateUserStorageUsage(userId: number): Promise<number> {
  try {
    let totalSize = 0;
    let continuationToken: string | undefined;

    do {
      const result = await listUserFiles(userId, 1000, continuationToken);
      totalSize += result.files.reduce((sum, file) => sum + file.size, 0);
      continuationToken = result.nextToken;
    } while (continuationToken);

    return totalSize;
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return 0;
  }
}

// Cleanup old cache entries
export function cleanupUrlCache(): void {
  const now = Date.now();
  for (const [key, value] of urlCache.entries()) {
    if (now >= value.expires) {
      urlCache.delete(key);
    }
  }
}

// Get cache statistics
export function getCacheStats() {
  return {
    urlCacheSize: urlCache.size,
    urlCacheKeys: Array.from(urlCache.keys())
  };
}