'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAdminAuthenticated, isAdminLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminLoading && !isAdminAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAdminAuthenticated, isAdminLoading, router]);

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription>
                You need admin privileges to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full">
                <Link href="/admin/login">
                  <Lock className="mr-2 h-4 w-4" />
                  Go to Admin Login
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
