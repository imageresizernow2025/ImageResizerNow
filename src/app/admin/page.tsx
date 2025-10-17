'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, TrendingUp, BarChart3, Eye, Download, Clock, Globe, RefreshCw, LogOut, Activity, Target, Database } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminRoute } from '@/components/AdminRoute';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { DataExport } from '@/components/admin/DataExport';
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary';

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
  const defaultAnalyticsData: AnalyticsData = {
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
    conversionRate: 0,
    pageUsage: [],
    pageUsageByDay: [],
    popularPages: []
  };

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    try {
      // Add timeout to prevent long waits
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('/api/admin/analytics', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        // Ensure all required arrays are present
        const safeData: AnalyticsData = {
          ...defaultAnalyticsData,
          ...data,
          mostUsedFeatures: data.mostUsedFeatures || [],
          trafficSources: data.trafficSources || [],
          pageUsage: data.pageUsage || [],
          pageUsageByDay: data.pageUsageByDay || [],
          popularPages: data.popularPages || []
        };
        setAnalyticsData(safeData);
        setUsingDemoData(false);
        console.log('Analytics data loaded successfully');
      } else {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log('Using demo data - API unavailable:', error.message);
      setUsingDemoData(true);
      // Keep the default data (which is already set), just update the timestamp
      // The UI will show demo data instead of crashing
    } finally {
      setLastUpdated(new Date());
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

  // Ensure analyticsData is always properly structured with absolute safety
  const safeAnalyticsData = analyticsData ? {
    ...defaultAnalyticsData,
    ...analyticsData,
    mostUsedFeatures: Array.isArray(analyticsData.mostUsedFeatures) ? analyticsData.mostUsedFeatures : [],
    trafficSources: Array.isArray(analyticsData.trafficSources) ? analyticsData.trafficSources : [],
    pageUsage: Array.isArray(analyticsData.pageUsage) ? analyticsData.pageUsage : [],
    pageUsageByDay: Array.isArray(analyticsData.pageUsageByDay) ? analyticsData.pageUsageByDay : [],
    popularPages: Array.isArray(analyticsData.popularPages) ? analyticsData.popularPages : []
  } : defaultAnalyticsData;

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
            <h1 className="text-3xl font-bold tracking-tight">Admin Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive analytics powered by GA4 integration with real-time monitoring
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Track user behavior, conversion funnels, performance metrics, and export data for analysis.
            </p>
            {usingDemoData && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                Demo Data - Database Connection Unavailable
              </div>
            )}
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="export">Data Export</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab - Original Analytics */}
        <TabsContent value="overview" className="space-y-6">
          <div className="space-y-8">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/admin/users'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{safeAnalyticsData.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {safeAnalyticsData.registeredUsers} registered, {safeAnalyticsData.guestUsers} guests
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
                <div className="text-2xl font-bold">{safeAnalyticsData.totalSessions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {safeAnalyticsData.dailyActiveUsers} daily active users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images Processed</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{safeAnalyticsData.totalImagesProcessed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {safeAnalyticsData.averageSessionDuration}min avg session
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{safeAnalyticsData.conversionRate}%</div>
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
                      <div className="text-lg font-bold">{safeAnalyticsData.guestUsers}</div>
                      <div className="text-xs text-muted-foreground">
                        {safeAnalyticsData.totalUsers > 0 ? ((safeAnalyticsData.guestUsers / safeAnalyticsData.totalUsers) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${safeAnalyticsData.totalUsers > 0 ? (safeAnalyticsData.guestUsers / safeAnalyticsData.totalUsers) * 100 : 0}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Registered Users</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{safeAnalyticsData.registeredUsers}</div>
                      <div className="text-xs text-muted-foreground">
                        {safeAnalyticsData.totalUsers > 0 ? ((safeAnalyticsData.registeredUsers / safeAnalyticsData.totalUsers) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${safeAnalyticsData.totalUsers > 0 ? (safeAnalyticsData.registeredUsers / safeAnalyticsData.totalUsers) * 100 : 0}%` }}
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
                    <Badge variant="secondary">{safeAnalyticsData.dailyActiveUsers}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Weekly Active Users</span>
                    </div>
                    <Badge variant="secondary">{safeAnalyticsData.weeklyActiveUsers}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Monthly Active Users</span>
                    </div>
                    <Badge variant="secondary">{safeAnalyticsData.monthlyActiveUsers}</Badge>
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
                {safeAnalyticsData.mostUsedFeatures.length > 0 ? (
                  safeAnalyticsData.mostUsedFeatures.map((feature, index) => (
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
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No feature usage data available yet.
                  </p>
                )}
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
                {safeAnalyticsData.trafficSources.length > 0 ? (
                  safeAnalyticsData.trafficSources.map((source, index) => (
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
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No traffic source data available yet.
                  </p>
                )}
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
                {safeAnalyticsData.pageUsage.length > 0 ? (
                  safeAnalyticsData.pageUsage.map((page, index) => (
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
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No page usage data available yet.
                  </p>
                )}
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
                {safeAnalyticsData.popularPages.length > 0 ? (
                  safeAnalyticsData.popularPages.map((page, index) => (
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
                        style={{ width: `${safeAnalyticsData.popularPages.length > 0 ? Math.min((page.uniqueUsers / Math.max(...safeAnalyticsData.popularPages.map(p => p.uniqueUsers), 1)) * 100, 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No popular pages data available yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        {/* Advanced Analytics Tab */}
        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        {/* Data Export Tab */}
        <TabsContent value="export">
          <DataExport />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Analytics Reports</h2>
              <p className="text-muted-foreground">
                Generate and view comprehensive analytics reports
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Real-time Report
                  </CardTitle>
                  <CardDescription>
                    Live user activity and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    View current user activity, processing status, and system performance in real-time.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveTab('analytics')}
                  >
                    View Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Conversion Funnel
                  </CardTitle>
                  <CardDescription>
                    User journey and conversion analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyze user behavior through the conversion funnel and identify optimization opportunities.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveTab('analytics')}
                  >
                    View Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Performance Report
                  </CardTitle>
                  <CardDescription>
                    System performance and error analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monitor system performance, error rates, and processing efficiency over time.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveTab('analytics')}
                  >
                    View Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    User Behavior
                  </CardTitle>
                  <CardDescription>
                    User segmentation and behavior patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Understand user segments, engagement levels, and behavior patterns.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveTab('analytics')}
                  >
                    View Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-red-600" />
                    Feature Usage
                  </CardTitle>
                  <CardDescription>
                    Feature adoption and usage statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track feature adoption rates, usage patterns, and popular functionality.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveTab('overview')}
                  >
                    View Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    Growth Analysis
                  </CardTitle>
                  <CardDescription>
                    User growth and retention metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyze user growth, retention rates, and long-term engagement trends.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveTab('overview')}
                  >
                    View Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
                <CardDescription>
                  Key metrics at a glance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {safeAnalyticsData.totalUsers.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {safeAnalyticsData.conversionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">Conversion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {safeAnalyticsData.totalImagesProcessed.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Images Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {safeAnalyticsData.dailyActiveUsers}
                    </div>
                    <div className="text-sm text-muted-foreground">Daily Active Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminErrorBoundary>
        <AdminPageContent />
      </AdminErrorBoundary>
    </AdminRoute>
  );
}
