'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
}

export class AdminErrorBoundary extends React.Component<AdminErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Admin Error Boundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Admin Dashboard Error</CardTitle>
              <CardDescription>
                Something went wrong while loading the admin dashboard. This usually happens when the database is unavailable.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Error Details:</h4>
                <p className="text-sm text-gray-600 font-mono">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">Try these solutions:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Refresh the page to reload the dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Check if the database connection is restored</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Try logging in again with admin credentials</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={this.handleRefresh} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Page
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/admin/login'}>
                  Admin Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
