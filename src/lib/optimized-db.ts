import { query } from './db';

// Optimized database queries with proper indexing and caching
export class OptimizedDatabaseService {
  private static queryCache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Cache query results
  private static getCachedQuery(key: string): any | null {
    const cached = this.queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    this.queryCache.delete(key);
    return null;
  }

  private static setCachedQuery(key: string, data: any): void {
    this.queryCache.set(key, { data, timestamp: Date.now() });
  }

  // Optimized user lookup with caching
  static async getUserById(id: number) {
    const cacheKey = `user_${id}`;
    const cached = this.getCachedQuery(cacheKey);
    if (cached) return cached;

    const result = await query(
      `SELECT id, email, first_name, last_name, plan, daily_usage_count, 
              storage_used_mb, storage_quota_mb, last_usage_reset_date
       FROM users WHERE id = $1`,
      [id]
    );

    const user = result.rows[0];
    this.setCachedQuery(cacheKey, user);
    return user;
  }

  // Optimized user lookup by email with caching
  static async getUserByEmail(email: string) {
    const cacheKey = `user_email_${email}`;
    const cached = this.getCachedQuery(cacheKey);
    if (cached) return cached;

    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, plan, 
              daily_usage_count, storage_used_mb, storage_quota_mb
       FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];
    this.setCachedQuery(cacheKey, user);
    return user;
  }

  // Batch insert for better performance
  static async batchInsertImages(images: Array<{
    user_id: number;
    spaces_key: string;
    spaces_url: string;
    cdn_url: string;
    original_filename: string;
    file_size_mb: number;
    content_type: string;
    width?: number;
    height?: number;
  }>) {
    if (images.length === 0) return [];

    const values = images.map((_, index) => {
      const offset = index * 9;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9})`;
    }).join(', ');

    const params = images.flatMap(img => [
      img.user_id,
      img.spaces_key,
      img.spaces_url,
      img.cdn_url,
      img.original_filename,
      img.file_size_mb,
      img.content_type,
      img.width || null,
      img.height || null
    ]);

    const result = await query(
      `INSERT INTO stored_images (user_id, spaces_key, spaces_url, cdn_url, 
                                 original_filename, file_size_mb, content_type, width, height)
       VALUES ${values} RETURNING id`,
      params
    );

    return result.rows;
  }

  // Optimized paginated query for images
  static async getUserImagesPaginated(
    userId: number, 
    limit: number = 50, 
    offset: number = 0,
    sortBy: 'created_at' | 'file_size_mb' | 'original_filename' = 'created_at',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ) {
    const result = await query(
      `SELECT id, spaces_key, spaces_url, cdn_url, original_filename, 
              file_size_mb, content_type, width, height, created_at
       FROM stored_images 
       WHERE user_id = $1 
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  }

  // Optimized storage usage calculation
  static async getUserStorageUsage(userId: number) {
    const cacheKey = `storage_usage_${userId}`;
    const cached = this.getCachedQuery(cacheKey);
    if (cached) return cached;

    const result = await query(
      `SELECT 
         COUNT(*) as total_images,
         COALESCE(SUM(file_size_mb), 0) as total_size_mb,
         COALESCE(AVG(file_size_mb), 0) as avg_size_mb,
         COALESCE(MAX(file_size_mb), 0) as max_size_mb
       FROM stored_images 
       WHERE user_id = $1`,
      [userId]
    );

    const usage = result.rows[0];
    this.setCachedQuery(cacheKey, usage);
    return usage;
  }

  // Optimized bulk delete
  static async bulkDeleteImages(imageIds: number[], userId: number) {
    if (imageIds.length === 0) return { deletedCount: 0, totalSizeReduction: 0 };

    // Get image sizes before deletion
    const sizeResult = await query(
      `SELECT file_size_mb FROM stored_images 
       WHERE id = ANY($1) AND user_id = $2`,
      [imageIds, userId]
    );

    const totalSizeReduction = sizeResult.rows.reduce(
      (sum, row) => sum + parseFloat(row.file_size_mb), 
      0
    );

    // Delete images
    const deleteResult = await query(
      `DELETE FROM stored_images 
       WHERE id = ANY($1) AND user_id = $2`,
      [imageIds, userId]
    );

    return {
      deletedCount: deleteResult.rowCount || 0,
      totalSizeReduction
    };
  }

  // Clear cache for user when data changes
  static clearUserCache(userId: number) {
    this.queryCache.delete(`user_${userId}`);
    this.queryCache.delete(`storage_usage_${userId}`);
  }

  // Clear all cache
  static clearAllCache() {
    this.queryCache.clear();
  }

  // Get cache statistics
  static getCacheStats() {
    return {
      size: this.queryCache.size,
      keys: Array.from(this.queryCache.keys())
    };
  }
}
