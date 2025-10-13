'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, TrendingUp, BarChart3, Eye, Download, Clock, Globe, RefreshCw, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminRoute } from '@/components/AdminRoute';

interface AnalyticsData {
  totalUsers: number;
  guestUsers: number;
  registeredUsers: number;
  totalSessions: number;
  mostUsedFeatures: Array<{
    name: string;
    usage: number;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  totalImagesProcessed: number;
  averageSessionDuration: number;
  conversionRate: number;
  pageUsage: Array<{
    page: string;
    visits: number;
    uniqueUsers: number;
    percentage: number;
  }>;
  pageUsageByDay: Array<{
    date: string;
    page: string;
    visits: number;
  }>;
  popularPages: Array<{
    page: string;
    uniqueUsers: number;
    totalVisits: number;
    avgTimeOnPage: number;
  }>;
}

function AdminPageContent() {
  const { user, isLoading } = useAuth();
  const { adminUser, adminLogout } = useAdminAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setAnalyticsData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Fallback to empty data on error
      setAnalyticsData({
        totalUsers: 0,
        guestUsers: 0,
        registeredUsers: 0,
        totalSessions: 0,
        mostUsedFeatures: [],
        trafficSources: [],
        dailyActiveUsers: 0,
        weeklyActiveUsers: 0,
        monthlyActiveUsers: 0,
        totalImagesProcessed: 0,
        averageSessionDuration: 0,
        conversionRate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAnalyticsData();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchAnalyticsData, 30000);
    
    // Listen for image processing completion events
    const handleImageProcessed = () => {
      console.log('🔄 Image processing completed, refreshing analytics...');
      fetchAnalyticsData();
    };
    
    window.addEventListener('imageProcessed', handleImageProcessed);
    
    // Cleanup interval and event listener on unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener('imageProcessed', handleImageProcessed);
    };
  }, []);

  if (isLoading || loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {adminUser?.name}
            </span>
            <Button onClick={adminLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Data Tracking</h1>
            <p className="text-muted-foreground mt-2">
              Track: number of guest users vs signed-in users, most used features, traffic sources.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This tells you which features are essential for your audience before monetization.
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button 
            onClick={fetchAnalyticsData} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {analyticsData && (
        <div className="space-y-8">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/users'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.registeredUsers} registered, {analyticsData.guestUsers} guests
                </p>
                <p className="text-xs text-primary mt-1">Click to view details →</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalSessions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.dailyActiveUsers} daily active users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images Processed</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalImagesProcessed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.averageSessionDuration}min avg session
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Guest to registered users
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Guest users vs registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">Guest Users</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{analyticsData.guestUsers}</div>
                      <div className="text-xs text-muted-foreground">
                        {((analyticsData.guestUsers / analyticsData.totalUsers) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(analyticsData.guestUsers / analyticsData.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Registered Users</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{analyticsData.registeredUsers}</div>
                      <div className="text-xs text-muted-foreground">
                        {((analyticsData.registeredUsers / analyticsData.totalUsers) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(analyticsData.registeredUsers / analyticsData.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>User engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Daily Active Users</span>
                    </div>
                    <Badge variant="secondary">{analyticsData.dailyActiveUsers}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Weekly Active Users</span>
                    </div>
                    <Badge variant="secondary">{analyticsData.weeklyActiveUsers}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Monthly Active Users</span>
                    </div>
                    <Badge variant="secondary">{analyticsData.monthlyActiveUsers}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Most Used Features */}
          <Card>
            <CardHeader>
              <CardTitle>Most Used Features</CardTitle>
              <CardDescription>Essential features for your audience before monetization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.mostUsedFeatures.map((feature, index) => (
                  <div key={feature.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{feature.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold">{feature.usage.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{feature.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${feature.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your users are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{source.visits.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{source.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Page Usage Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Page Usage Analytics</CardTitle>
              <CardDescription>Most visited pages and user engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.pageUsage.map((page, index) => (
                  <div key={page.page} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{page.page}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{page.visits.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {page.uniqueUsers} unique users ({page.percentage}%)
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Pages by Unique Users */}
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Pages</CardTitle>
              <CardDescription>Pages with the most unique users and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.popularPages.map((page, index) => (
                  <div key={page.page} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{page.page}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{page.uniqueUsers} unique users</div>
                        <div className="text-xs text-muted-foreground">
                          {page.totalVisits} total visits
                          {page.avgTimeOnPage > 0 && ` • ${Math.round(page.avgTimeOnPage)}s avg`}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((page.uniqueUsers / Math.max(...analyticsData.popularPages.map(p => p.uniqueUsers))) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminPageContent />
    </AdminRoute>
  );
}
