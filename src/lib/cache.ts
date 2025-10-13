import Redis from 'ioredis';

// Redis configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

// Cache interface
interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

class CacheService {
  private redis: Redis;
  private defaultTTL: number;

  constructor(redisInstance: Redis, defaultTTL: number = 3600) {
    this.redis = redisInstance;
    this.defaultTTL = defaultTTL;
  }

  // Generate cache key
  private getKey(key: string, prefix?: string): string {
    return prefix ? `${prefix}:${key}` : key;
  }

  // Set cache value
  async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    try {
      const cacheKey = this.getKey(key, options.prefix);
      const serializedValue = JSON.stringify(value);
      const ttl = options.ttl || this.defaultTTL;
      
      await this.redis.setex(cacheKey, ttl, serializedValue);
    } catch (error) {
      console.error('Cache set error:', error);
      // Fail silently - don't break the application if cache fails
    }
  }

  // Get cache value
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      const cacheKey = this.getKey(key, options.prefix);
      const value = await this.redis.get(cacheKey);
      
      if (!value) return null;
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Delete cache value
  async del(key: string, options: CacheOptions = {}): Promise<void> {
    try {
      const cacheKey = this.getKey(key, options.prefix);
      await this.redis.del(cacheKey);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Clear cache by pattern
  async clearPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache clear pattern error:', error);
    }
  }

  // Check if key exists
  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const cacheKey = this.getKey(key, options.prefix);
      const result = await this.redis.exists(cacheKey);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Get multiple keys
  async mget<T>(keys: string[], options: CacheOptions = {}): Promise<(T | null)[]> {
    try {
      const cacheKeys = keys.map(key => this.getKey(key, options.prefix));
      const values = await this.redis.mget(...cacheKeys);
      
      return values.map(value => value ? JSON.parse(value) as T : null);
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  // Set multiple keys
  async mset(keyValuePairs: Record<string, any>, options: CacheOptions = {}): Promise<void> {
    try {
      const ttl = options.ttl || this.defaultTTL;
      const pipeline = this.redis.pipeline();
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        const cacheKey = this.getKey(key, options.prefix);
        const serializedValue = JSON.stringify(value);
        pipeline.setex(cacheKey, ttl, serializedValue);
      }
      
      await pipeline.exec();
    } catch (error) {
      console.error('Cache mset error:', error);
    }
  }

  // Get cache statistics
  async getStats(): Promise<{ memory: string; keys: number; connected: boolean }> {
    try {
      const info = await this.redis.info('memory');
      const keys = await this.redis.dbsize();
      
      return {
        memory: info,
        keys,
        connected: this.redis.status === 'ready'
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return {
        memory: 'N/A',
        keys: 0,
        connected: false
      };
    }
  }
}

// Create cache service instance
export const cache = new CacheService(redis);

// Cache key constants
export const CACHE_KEYS = {
  USER: 'user',
  USAGE: 'usage',
  PRESETS: 'presets',
  IMAGES: 'images',
  TEAMS: 'teams',
} as const;

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  USER: 1800, // 30 minutes
  USAGE: 300, // 5 minutes
  PRESETS: 3600, // 1 hour
  IMAGES: 1800, // 30 minutes
  TEAMS: 1800, // 30 minutes
} as const;

export default cache;
