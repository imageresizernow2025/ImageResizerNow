'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { debugAuthState, clearAllAuthData } from '@/lib/auth-debug';

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

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        console.log('User authenticated successfully:', data.user.email);
      } else if (response.status === 401) {
        // This is normal for unauthenticated users - no need to log
        setUser(null);
        // Only clear auth data if we had a user before (to avoid unnecessary operations)
        if (user) {
          clearAllAuthData();
        }
      } else if (response.status === 503) {
        // Database temporarily unavailable - keep current state but log warning
        console.warn('Database temporarily unavailable, keeping current session');
      } else {
        // For other errors (500, etc.), keep the current user state
        console.warn('Failed to refresh user data, but keeping current session:', response.status);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Don't logout on network errors, keep current user state
      console.warn('Network error during user refresh, keeping current session');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        console.log('Login successful for user:', data.user.email);
        return { success: true };
      } else {
        console.error('Login failed:', data.error);
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login network error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear user state and cookies
      setUser(null);
      // Clear authentication cookies
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Enable detailed debugging in development mode
        if (process.env.NODE_ENV === 'development' && window.location.search.includes('debug=auth')) {
          debugAuthState();
        }
        
        await refreshUser();
      } catch (error) {
        console.error('Initial auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
