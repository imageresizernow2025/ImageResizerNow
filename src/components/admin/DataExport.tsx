'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Database, 
  Calendar as CalendarIcon,
  Filter,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ExportData {
  type: 'analytics' | 'users' | 'usage' | 'funnel' | 'performance';
  format: 'csv' | 'json' | 'excel';
  dateRange: {
    from: Date;
    to: Date;
  };
  filters: {
    userType?: 'all' | 'registered' | 'anonymous';
    feature?: 'all' | 'image_resizer' | 'bulk_resizer' | 'compressor';
    minFileCount?: number;
    maxFileCount?: number;
  };
}

export function DataExport() {
  const [exportData, setExportData] = useState<ExportData>({
    type: 'analytics',
    format: 'csv',
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date()
    },
    filters: {
      userType: 'all',
      feature: 'all',
      minFileCount: 1,
      maxFileCount: 100
    }
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<Array<{
    id: string;
    type: string;
    format: string;
    dateRange: string;
    status: 'completed' | 'processing' | 'failed';
    downloadUrl?: string;
    createdAt: Date;
  }>>([]);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Try to fetch from API first
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-export-${format(new Date(), 'yyyy-MM-dd')}.${exportData.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Add to export history
        const newExport = {
          id: Date.now().toString(),
          type: exportData.type,
          format: exportData.format,
          dateRange: `${format(exportData.dateRange.from, 'MMM dd')} - ${format(exportData.dateRange.to, 'MMM dd')}`,
          status: 'completed' as const,
          downloadUrl: url,
          createdAt: new Date()
        };
        
        setExportHistory(prev => [newExport, ...prev.slice(0, 9)]);
      } else {
        // Generate demo data when API is unavailable
        const demoData = generateDemoExportData(exportData);
        const blob = new Blob([demoData], { 
          type: exportData.format === 'csv' ? 'text/csv' : 
                exportData.format === 'json' ? 'application/json' : 
                'application/vnd.ms-excel' 
        });
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `demo-${exportData.type}-export-${format(new Date(), 'yyyy-MM-dd')}.${exportData.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Add to export history
        const newExport = {
          id: Date.now().toString(),
          type: exportData.type,
          format: exportData.format,
          dateRange: `${format(exportData.dateRange.from, 'MMM dd')} - ${format(exportData.dateRange.to, 'MMM dd')}`,
          status: 'completed' as const,
          downloadUrl: url,
          createdAt: new Date()
        };
        
        setExportHistory(prev => [newExport, ...prev.slice(0, 9)]);
      }
      
    } catch (error) {
      console.error('Export error:', error);
      
      // Add failed export to history
      const failedExport = {
        id: Date.now().toString(),
        type: exportData.type,
        format: exportData.format,
        dateRange: `${format(exportData.dateRange.from, 'MMM dd')} - ${format(exportData.dateRange.to, 'MMM dd')}`,
        status: 'failed' as const,
        createdAt: new Date()
      };
      
      setExportHistory(prev => [failedExport, ...prev.slice(0, 9)]);
    } finally {
      setIsExporting(false);
    }
  };

  // Generate demo export data
  const generateDemoExportData = (data: ExportData): string => {
    const sampleData = {
      analytics: [
        { date: '2024-01-01', users: 150, sessions: 200, conversions: 25 },
        { date: '2024-01-02', users: 180, sessions: 250, conversions: 30 },
        { date: '2024-01-03', users: 220, sessions: 300, conversions: 35 }
      ],
      users: [
        { id: 1, email: 'user1@example.com', signup_date: '2024-01-01', total_actions: 15 },
        { id: 2, email: 'user2@example.com', signup_date: '2024-01-02', total_actions: 8 }
      ],
      usage: [
        { action: 'image_resize', count: 150, avg_time: 2.5 },
        { action: 'download', count: 120, avg_time: 1.2 }
      ],
      funnel: [
        { step: 'File Upload', users: 1000, conversion_rate: 100 },
        { step: 'Processing', users: 850, conversion_rate: 85 },
        { step: 'Download', users: 580, conversion_rate: 58 }
      ],
      performance: [
        { page: 'Homepage', load_time: 850, grade: 'excellent' },
        { page: 'Resizer', load_time: 1200, grade: 'excellent' }
      ]
    };

    const selectedData = sampleData[data.type as keyof typeof sampleData] || [];

    switch (data.format) {
      case 'csv':
        if (selectedData.length === 0) return '';
        const headers = Object.keys(selectedData[0]).join(',');
        const rows = selectedData.map(row => Object.values(row).join(','));
        return [headers, ...rows].join('\n');
      
      case 'json':
        return JSON.stringify(selectedData, null, 2);
      
      case 'excel':
        if (selectedData.length === 0) return '';
        const excelHeaders = Object.keys(selectedData[0]).join('\t');
        const excelRows = selectedData.map(row => Object.values(row).join('\t'));
        return [excelHeaders, ...excelRows].join('\n');
      
      default:
        return JSON.stringify(selectedData, null, 2);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Data Export & Reports</h2>
        <p className="text-muted-foreground">
          Export analytics data for external analysis and reporting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Export Configuration
            </CardTitle>
            <CardDescription>
              Configure your data export settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export Type */}
            <div className="space-y-2">
              <Label htmlFor="export-type">Data Type</Label>
              <Select 
                value={exportData.type} 
                onValueChange={(value: any) => setExportData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytics">Analytics Overview</SelectItem>
                  <SelectItem value="users">User Data</SelectItem>
                  <SelectItem value="usage">Usage Statistics</SelectItem>
                  <SelectItem value="funnel">Conversion Funnel</SelectItem>
                  <SelectItem value="performance">Performance Metrics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Format */}
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select 
                value={exportData.format} 
                onValueChange={(value: any) => setExportData(prev => ({ ...prev, format: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
                  <SelectItem value="json">JSON (Raw Data)</SelectItem>
                  <SelectItem value="excel">Excel (Formatted)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !exportData.dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {exportData.dateRange.from ? format(exportData.dateRange.from, "MMM dd") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={exportData.dateRange.from}
                      onSelect={(date) => setExportData(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, from: date || new Date() }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !exportData.dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {exportData.dateRange.to ? format(exportData.dateRange.to, "MMM dd") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={exportData.dateRange.to}
                      onSelect={(date) => setExportData(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, to: date || new Date() }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Label>
              
              <div className="space-y-3">
                <Select 
                  value={exportData.filters.userType} 
                  onValueChange={(value: any) => setExportData(prev => ({ 
                    ...prev, 
                    filters: { ...prev.filters, userType: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="registered">Registered Users</SelectItem>
                    <SelectItem value="anonymous">Anonymous Users</SelectItem>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="min-files" className="text-xs">Min Files</Label>
                    <Input
                      id="min-files"
                      type="number"
                      value={exportData.filters.minFileCount}
                      onChange={(e) => setExportData(prev => ({ 
                        ...prev, 
                        filters: { ...prev.filters, minFileCount: parseInt(e.target.value) || 1 }
                      }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-files" className="text-xs">Max Files</Label>
                    <Input
                      id="max-files"
                      type="number"
                      value={exportData.filters.maxFileCount}
                      onChange={(e) => setExportData(prev => ({ 
                        ...prev, 
                        filters: { ...prev.filters, maxFileCount: parseInt(e.target.value) || 100 }
                      }))}
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export History
            </CardTitle>
            <CardDescription>
              Recent exports and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No exports yet. Create your first export above.
                </p>
              ) : (
                exportHistory.map((exportItem) => (
                  <div key={exportItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(exportItem.status)}
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {exportItem.type} ({exportItem.format.toUpperCase()})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exportItem.dateRange} • {exportItem.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(exportItem.status)}>
                        {exportItem.status}
                      </Badge>
                      {exportItem.status === 'completed' && exportItem.downloadUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Export Preview</CardTitle>
          <CardDescription>
            Preview of what will be included in your export
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Data Type:</span>
              <span className="text-sm font-medium capitalize">{exportData.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Format:</span>
              <span className="text-sm font-medium uppercase">{exportData.format}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Date Range:</span>
              <span className="text-sm font-medium">
                {format(exportData.dateRange.from, "MMM dd, yyyy")} - {format(exportData.dateRange.to, "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">User Type:</span>
              <span className="text-sm font-medium capitalize">{exportData.filters.userType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">File Count Range:</span>
              <span className="text-sm font-medium">
                {exportData.filters.minFileCount} - {exportData.filters.maxFileCount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
