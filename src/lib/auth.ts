import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  plan: string;
  subscriptionStatus: string;
  dailyUsageCount: number;
  lastUsageResetDate: string;
  storageQuotaMb?: number;
  storageUsedMb?: number;
}

export interface JWTPayload {
  userId: number;
  email: string;
  plan: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Extract token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  console.log('getTokenFromRequest - Authorization header:', authHeader);
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    console.log('getTokenFromRequest - Found Bearer token in header');
    return authHeader.substring(7);
  }
  
  // Also check cookies
  const cookieToken = request.cookies.get('auth-token')?.value;
  console.log('getTokenFromRequest - Cookie token:', cookieToken ? 'Present' : 'Missing');
  
  return cookieToken || null;
}

// Get user from request
export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    console.log('getUserFromRequest - Available cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value}`));
    
    const token = getTokenFromRequest(request);
    console.log('getUserFromRequest - Auth token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('No token found in request');
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.log('Invalid token');
      return null;
    }

    console.log('getUserFromRequest - Token payload:', payload);

    // Fetch user from database
    const { query } = await import('./db');
    const result = await query(
      'SELECT id, email, first_name, last_name, plan, subscription_status, daily_usage_count, last_usage_reset_date, storage_quota_mb, storage_used_mb FROM users WHERE id = $1',
      [payload.userId]
    );

    if (result.rows.length === 0) {
      console.log('User not found in database for ID:', payload.userId);
      return null;
    }

    const user = result.rows[0];
    console.log('getUserFromRequest - User found:', { id: user.id, email: user.email, dailyUsageCount: user.daily_usage_count });
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      plan: user.plan,
      subscriptionStatus: user.subscription_status,
      dailyUsageCount: user.daily_usage_count,
      lastUsageResetDate: user.last_usage_reset_date,
      storageQuotaMb: user.storage_quota_mb,
      storageUsedMb: user.storage_used_mb,
    };
  } catch (error) {
    console.error('Error in getUserFromRequest:', error);
    return null;
  }
}

// Get user from token string (for API routes that pass token directly)
export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = verifyToken(token);
  if (!payload) return null;

  // Fetch user from database
  const { query } = await import('./db');
  const result = await query(
    'SELECT id, email, first_name, last_name, plan, subscription_status, daily_usage_count, last_usage_reset_date, storage_quota_mb, storage_used_mb FROM users WHERE id = $1',
    [payload.userId]
  );

  if (result.rows.length === 0) return null;

  const user = result.rows[0];
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    plan: user.plan,
    subscriptionStatus: user.subscription_status,
    dailyUsageCount: user.daily_usage_count,
    lastUsageResetDate: user.last_usage_reset_date,
    storageQuotaMb: user.storage_quota_mb,
    storageUsedMb: user.storage_used_mb,
  };
}

// Check if user has reached daily limit
export async function checkDailyLimit(userId: number, requestedCount: number): Promise<boolean> {
  const { query } = await import('./db');
  const result = await query(
    `SELECT daily_usage_count, last_usage_reset_date, plan 
     FROM users 
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) return false;

  const user = result.rows[0];
  const today = new Date().toISOString().split('T')[0];
  
  // Reset daily count if it's a new day
  if (user.last_usage_reset_date !== today) {
    await query(
      'UPDATE users SET daily_usage_count = 0, last_usage_reset_date = $1 WHERE id = $2',
      [today, userId]
    );
    user.daily_usage_count = 0;
  }

  // All registered users get 50 images per day (free)
  const limit = 50;
  return user.daily_usage_count + requestedCount > limit;
}

// Update usage count
export async function updateUsageCount(userId: number, count: number): Promise<void> {
  try {
    const { query } = await import('./db');
    await query(
      'UPDATE users SET daily_usage_count = daily_usage_count + $1 WHERE id = $2',
      [count, userId]
    );
  } catch (error) {
    console.error('Failed to update usage count:', error);
    // Don't throw error - allow processing to continue
  }
}

// Track usage without limit checking (for after processing)
export async function trackUsage(userId: number, count: number): Promise<void> {
  try {
    const { query } = await import('./db');
    
    console.log(`Tracking usage for user ${userId}: +${count} images`);
    
    // First, ensure daily count is reset if it's a new day
    const today = new Date().toISOString().split('T')[0];
    const resetResult = await query(
      `UPDATE users 
       SET daily_usage_count = 0, last_usage_reset_date = $1 
       WHERE id = $2 AND last_usage_reset_date != $1`,
      [today, userId]
    );
    console.log('Daily reset query result:', resetResult.rowCount);
    
    // Then update the usage count
    const updateResult = await query(
      'UPDATE users SET daily_usage_count = daily_usage_count + $1 WHERE id = $2',
      [count, userId]
    );
    console.log('Usage update query result:', updateResult.rowCount);
    
    // Verify the update by reading the current count
    const verifyResult = await query(
      'SELECT daily_usage_count FROM users WHERE id = $1',
      [userId]
    );
    if (verifyResult.rows.length > 0) {
      console.log(`Verified usage count for user ${userId}: ${verifyResult.rows[0].daily_usage_count}`);
    }
  } catch (error) {
    console.error('Failed to track usage in database:', error);
    // Don't throw error - allow processing to continue
  }
}