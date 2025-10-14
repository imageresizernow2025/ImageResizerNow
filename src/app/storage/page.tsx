'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, UploadCloud, Trash2, Download, Image as ImageIcon, Calendar, HardDrive } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface StoredImage {
  id: number;
  originalName: string;
  size: number;
  contentType: string;
  width?: number;
  height?: number;
  uploadedAt: string;
  cdnUrl: string;
}

interface StorageInfo {
  quota: {
    total: number;
    used: number;
    available: number;
    percentage: number;
  };
  statistics: {
    totalImages: number;
    totalSizeMB: number;
    averageSizeMB: number;
  };
  recentImages: StoredImage[];
  plan: string;
}

export default function StoragePage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStorageInfo();
      fetchImages();
    }
  }, [user]);

  const fetchStorageInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/storage/quota', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStorageInfo(data);
      }
    } catch (error) {
      console.error('Error fetching storage info:', error);
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/storage/upload?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/storage/delete?id=${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setImages(images.filter(img => img.id !== imageId));
        fetchStorageInfo(); // Refresh storage info
        toast({
          title: "Image Deleted",
          description: "Image has been removed from cloud storage.",
        });
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete image from cloud storage.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/storage/delete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageIds: selectedImages }),
      });

      if (response.ok) {
        const data = await response.json();
        setImages(images.filter(img => !selectedImages.includes(img.id)));
        setSelectedImages([]);
        fetchStorageInfo(); // Refresh storage info
        toast({
          title: "Images Deleted",
          description: `${data.deletedCount} images have been removed from cloud storage.`,
        });
      } else {
        throw new Error('Failed to delete images');
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete images from cloud storage.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const formatFileSize = (sizeMB: number) => {
    if (sizeMB < 1) {
      return `${(sizeMB * 1024).toFixed(0)} KB`;
    }
    return `${sizeMB.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading storage information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Storage Management</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access your cloud storage.</p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Image Resizer
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Cloud Storage</h1>
        <p className="text-muted-foreground">Manage your stored images and monitor storage usage.</p>
      </div>

      {/* Storage Overview */}
      {storageInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Storage Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used</span>
                  <span>{formatFileSize(storageInfo.quota.used)} / {formatFileSize(storageInfo.quota.total)}</span>
                </div>
                <Progress value={storageInfo.quota.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {storageInfo.quota.available.toFixed(1)} MB available
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Total Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageInfo.statistics.totalImages}</div>
              <p className="text-xs text-muted-foreground">
                Average size: {formatFileSize(storageInfo.statistics.averageSizeMB)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-sm">
                {storageInfo.plan} Plan
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {formatFileSize(storageInfo.quota.total)} storage quota
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Images Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stored Images</CardTitle>
              <CardDescription>
                {images.length} images stored in your cloud storage
              </CardDescription>
            </div>
            {selectedImages.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedImages.length} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-12">
              <UploadCloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images stored</h3>
              <p className="text-muted-foreground mb-4">
                Upload and resize images to start using cloud storage.
              </p>
              <Button asChild>
                <Link href="/">Start Resizing Images</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="group relative overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={image.cdnUrl}
                      alt={image.originalName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(image.cdnUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <input
                      type="checkbox"
                      id={`select-image-${image.id}`}
                      name={`select-image-${image.id}`}
                      className="absolute top-2 left-2"
                      checked={selectedImages.includes(image.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedImages([...selectedImages, image.id]);
                        } else {
                          setSelectedImages(selectedImages.filter(id => id !== image.id));
                        }
                      }}
                    />
                  </div>
                  <CardContent className="p-2">
                    <p className="text-xs font-medium truncate" title={image.originalName}>
                      {image.originalName}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatFileSize(image.size)}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(image.uploadedAt)}
                      </span>
                    </div>
                    {image.width && image.height && (
                      <p className="text-xs text-muted-foreground">
                        {image.width} × {image.height}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Images</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedImages.length} image(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete Images'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
