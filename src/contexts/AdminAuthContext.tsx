'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  email: string;
  name: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isAdminLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'diodah4@gmail.com',
  password: 'DAUDselemani01#'
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is already logged in (from localStorage)
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setAdminUser(adminData);
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setIsAdminLoading(false);
  }, []);

  // Auto-logout when leaving admin pages
  useEffect(() => {
    if (adminUser && !pathname.startsWith('/admin')) {
      console.log('Admin user left admin area, auto-logging out...');
      setAdminUser(null);
      localStorage.removeItem('adminUser');
      
      // Show notification about auto-logout
      toast({
        title: "Admin Session Ended",
        description: "You have been automatically logged out from the admin panel.",
        duration: 5000,
      });
    }
  }, [pathname, adminUser, toast]);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminData = {
        email: ADMIN_CREDENTIALS.email,
        name: 'Admin User'
      };
      
      setAdminUser(adminData);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      return true;
    }
    
    return false;
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  const value = {
    adminUser,
    isAdminAuthenticated: !!adminUser,
    isAdminLoading,
    adminLogin,
    adminLogout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
