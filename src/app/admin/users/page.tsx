'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Search, Mail, Calendar, User, Filter, RefreshCw, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { AdminRoute } from '@/components/AdminRoute';

interface User {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  lastActive: string;
  totalImagesProcessed: number;
  plan: 'FREE' | 'PRO' | 'PREMIUM';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
}

function UsersPageContent() {
  const { user, isLoading } = useAuth();
  const { adminUser, adminLogout } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'registeredAt' | 'lastActive'>('registeredAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus,
        sortBy: sortBy,
        sortOrder: sortOrder,
        page: '1',
        limit: '1000' // Get all users for now
      });

      // console.log('Frontend sending params:', { searchTerm, filterStatus, sortBy, sortOrder });
      // console.log('URL params string:', params.toString());
      const response = await fetch(`/api/admin/users?${params}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch users data: ${response.status}`);
      }
      
      const data = await response.json();
      // console.log('API Response:', data);
      
      const usersData = data.users.map((user: any) => ({
        ...user,
        avatar: undefined // Remove avatar for now since we don't store it in DB
      }));
      
      // console.log('Processed users data:', usersData);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching users data:', error);
      // Fallback to empty data on error
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUsers();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchUsers, 30000);
    
    // Listen for image processing completion events
    const handleImageProcessed = () => {
      console.log('🔄 Image processing completed, refreshing users...');
      fetchUsers();
    };
    
    window.addEventListener('imageProcessed', handleImageProcessed);
    
    // Cleanup interval and event listener on unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener('imageProcessed', handleImageProcessed);
    };
  }, [searchTerm, filterStatus, sortBy, sortOrder]);

  // Update filtered users when users data changes
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'PREMIUM':
        return 'bg-purple-100 text-purple-800';
      case 'PRO':
        return 'bg-blue-100 text-blue-800';
      case 'FREE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
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
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Analytics
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
            <h1 className="text-3xl font-bold tracking-tight">Registered Users</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view all registered users ({filteredUsers.length} of {users.length} users)
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button 
            onClick={fetchUsers} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="registeredAt-desc">Newest First</option>
                <option value="registeredAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="lastActive-desc">Recently Active</option>
                <option value="lastActive-asc">Least Active</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      <Badge className={getPlanColor(user.plan)}>
                        {user.plan}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined: {formatDate(user.registeredAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>Last active: {formatDate(user.lastActive)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Filter className="h-3 w-3" />
                        <span>{user.totalImagesProcessed} images processed</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {user.totalImagesProcessed.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    images processed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No registered users found in the database.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <div className="text-sm text-muted-foreground">
                  <p>This could mean:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>No users have registered yet</li>
                    <li>Database connection issue</li>
                    <li>Users table is empty</li>
                  </ul>
                  <p className="mt-2">
                    <a href="/api/admin/test-db" target="_blank" className="text-primary hover:underline">
                      Test database connection
                    </a>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <AdminRoute>
      <UsersPageContent />
    </AdminRoute>
  );
}
