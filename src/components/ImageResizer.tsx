
"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import {
  UploadCloud,
  X,
  ChevronDown,
  FileDown,
  Sparkles,
  Ratio,
  AlertTriangle,
  Check,
  Zap,
  CheckCircle,
  Download,
  Eye,
  HelpCircle,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/hooks/use-toast";
import type { ResizedImage } from "@/lib/types";
import { socialPresets, webPresets, printPresets, basicPresets, shopifyPresets } from "@/lib/presets";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImageStore } from "@/store/image-store";
import Link from "next/link";
import JSZip from "jszip";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
// import { NativeAd } from './ads/NativeAd'; // Disabled
// import { AdWrapper } from './ads/AdWrapper'; // Disabled
// import { ModalAd } from './ads/ModalAd'; // Disabled


const plans = {
  ANONYMOUS: { 
    name: 'Anonymous', 
    dailyLimit: 5, 
    batchLimit: 1,
    hasBasicPresets: true,
    hasAllPresets: true,
    hasQualityControl: true,
    hasCloudStorage: false,
    storageQuotaMB: 0,
    description: 'No registration required - 5 images daily'
  },
  REGISTERED: { 
    name: 'Registered', 
    dailyLimit: 50, 
    batchLimit: 10,
    hasBasicPresets: true,
    hasAllPresets: true,
    hasQualityControl: true,
    hasCloudStorage: true,
    storageQuotaMB: 500,
    description: 'Free account - 50 images daily + cloud storage'
  }
};


const getPlan = (planName: string) => {
    return plans[planName as keyof typeof plans] || plans['ANONYMOUS'];
}

export function ImageResizer() {
  const { user, isLoading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  // const { toast } = useToast();
  const { 
    images, setImages, resizingOptions, setResizingOptions, 
    isResizing, setIsResizing, resizeProgress, setResizeProgress, reset,
    undo, redo, canUndo, canRedo, saveToHistory
  } = useImageStore((state) => state);
  
  const [isDragging, setIsDragging] = useState(false);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.9);
  const [saveToCloud, setSaveToCloud] = useState(false);
  const [cloudUploadProgress, setCloudUploadProgress] = useState(0);
  const [isUploadingToCloud, setIsUploadingToCloud] = useState(false);
  const [compression, setCompression] = useState(0.8);
  const [clientProcessing, setClientProcessing] = useState(true);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [downloadQuality, setDownloadQuality] = useState(0.9);
  const [resamplingFilter, setResamplingFilter] = useState<'lanczos' | 'bicubic' | 'bilinear' | 'nearest'>('lanczos');
  const [resizeMode, setResizeMode] = useState<'fit' | 'fill' | 'cover' | 'stretch'>('cover');
  const [useServerProcessing, setUseServerProcessing] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Handle processing mode change
  const handleProcessingModeChange = (value: string) => {
    const newMode = value === 'server';
    setUseServerProcessing(newMode);
    
    // If switching to client-side and advanced formats are selected, switch to WebP
    if (!newMode && (format === 'image/avif' || format === 'image/heif')) {
      setFormat('image/webp');
    }
  };
  const [smartQuality, setSmartQuality] = useState(true);

  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState<ResizedImage | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonImage, setComparisonImage] = useState<ResizedImage | null>(null);
  const [anonymousUsage, setAnonymousUsage] = useState(0);
  const [currentProcessingImage, setCurrentProcessingImage] = useState<string | null>(null);
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [imageProcessingStates, setImageProcessingStates] = useState<Map<string, 'pending' | 'processing' | 'completed' | 'error'>>(new Map());

  // Computed values
  const successfulImages = images.filter(img => img.resizedUrl && !img.error);
  const processedImageCount = successfulImages.length;

  const [currentPlan, setCurrentPlan] = useState(() => {
    if (authLoading) return plans['ANONYMOUS'];
    return user ? plans['REGISTERED'] : plans['ANONYMOUS'];
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);




  useEffect(() => {
    if (!authLoading) {
      const plan = user ? plans['REGISTERED'] : plans['ANONYMOUS'];
      setCurrentPlan(plan);
    }
  }, [user, authLoading]);


  // Load anonymous usage on mount
  useEffect(() => {
    if (!user && !authLoading) {
      const today = new Date().toISOString().split('T')[0];
      const savedUsage = localStorage.getItem('imageResizerAnonymousUsage');
      
      if (savedUsage) {
        const { date, count } = JSON.parse(savedUsage);
        if (date === today) {
          setAnonymousUsage(count);
        } else {
          setAnonymousUsage(0);
        }
      } else {
        setAnonymousUsage(0);
      }
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (showResultsModal && images.length > 0 && !isResizing && resizeProgress === 0) {
      performResize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResultsModal]);

  // Keyboard shortcuts
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + O to open file dialog
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
      
      // Ctrl/Cmd + Enter to start processing
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (images.length > 0 && !isResizing) {
          performResize();
        }
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        if (showResultsModal) {
          handleCloseResults();
        }
        if (showPreviewDialog) {
          setShowPreviewDialog(false);
        }
      }
      
      // Ctrl/Cmd + D to download all
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const currentSuccessfulImages = images.filter(img => img.resizedUrl && !img.error);
        if (currentSuccessfulImages.length > 0) {
          downloadAll();
        }
      }
      
      // Ctrl/Cmd + A to clear all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        if (images.length > 0) {
          clearAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, isResizing, showResultsModal, showPreviewDialog]);

  const checkUsageLimit = async (fileCount: number) => {
    if (!user) {
      // For anonymous users, use localStorage to track daily usage
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        // If not in browser, allow processing (SSR fallback)
        return false;
      }
      
      const savedUsage = localStorage.getItem('imageResizerAnonymousUsage');
      
      let currentUsage = 0;
      if (savedUsage) {
        const { date, count } = JSON.parse(savedUsage);
        if (date === today) {
          currentUsage = count;
        }
      }
      
      if (currentUsage + fileCount > plans['ANONYMOUS'].dailyLimit) {
        setShowLimitModal(true);
        return true;
      }
      
      // Update localStorage usage
      const newUsage = currentUsage + fileCount;
      localStorage.setItem('imageResizerAnonymousUsage', JSON.stringify({
        date: today,
        count: newUsage
      }));
      
      // Update state for UI
      setAnonymousUsage(newUsage);
      
      return false;
    }

    // For logged-in users, allow upload and check limits during processing
    // This prevents blocking users due to API issues
      return false;
  };


  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    const filesArray = Array.from(files);

    // For anonymous users, check limits before processing
    if (!user) {
    const hasLimit = await checkUsageLimit(filesArray.length);
    if (hasLimit) {
      setPendingFiles(files);
      return;
    }
    }

    processFiles(files);
  };

  const processFiles = (files: FileList) => {
    const filesArray = Array.from(files);
    const newImages: ResizedImage[] = filesArray
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}`,
        originalFile: file,
        previewUrl: URL.createObjectURL(file),
        originalSize: file.size,
        name: file.name.substring(0, file.name.lastIndexOf('.')),
      }));

    setImages([...images, ...newImages]);
  };

  const handleContinueAsGuest = () => {
    if (pendingFiles) {
      processFiles(pendingFiles);
      setPendingFiles(null);
    }
    setShowLimitModal(false);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    saveToHistory(); // Save state before removal
    const imageToRemove = images.find(img => img.id === id);
    if(imageToRemove) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    setImages(images.filter((img) => img.id !== id));
  };
  
  const clearAll = () => {
    saveToHistory(); // Save state before clearing
    images.forEach(image => {
      URL.revokeObjectURL(image.previewUrl);
      if (image.resizedUrl) {
        URL.revokeObjectURL(image.resizedUrl);
      }
    });
    reset(); // Reset all store state including images, history, resizing options, etc.
  };

  const handlePresetChange = (value: string) => {
    if (!value) {
      setActivePreset(null);
      return;
    }
    
    const [w, h] = value.split("x").map(Number);
    console.log('🎯 Preset selected:', { preset: value, width: w, height: h });
    
    // Force exact preset dimensions
    setWidth(w);
    setHeight(h);
    
    // When selecting a preset, default to 'cover' mode for consistent sizing
    // This ensures the image fills the exact preset dimensions
    setResizeMode('cover');
    
    // Disable aspect ratio for presets to ensure exact dimensions
    setKeepAspectRatio(false);
    
    // Track active preset
    setActivePreset(value);
    
    console.log('🎯 Preset applied - EXACT dimensions:', w, 'x', h, 'mode: cover', 'aspectRatio: OFF');
    
    // Show toast notification (temporarily disabled for debugging)
    // toast({
    //   title: "Preset Applied",
    //   description: `Set to ${w}×${h} pixels with Cover mode for precise sizing`,
    //   duration: 3000,
    // });
  };

  // Advanced resizing function with perfect logic
  const resizeImage = async (
    imageFile: ResizedImage,
    options: { 
      width: number; 
      height: number; 
      keepAspectRatio: boolean; 
      format: string; 
      quality: number; 
      compression: number;
      resamplingFilter: 'lanczos' | 'bicubic' | 'bilinear' | 'nearest';
      resizeMode: 'fit' | 'fill' | 'cover' | 'stretch';
    }
  ): Promise<ResizedImage> => {
    return new Promise((resolve, reject) => {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return reject(new Error('Not in browser environment'));
      }

      const img = new window.Image();
      img.src = imageFile.previewUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));

        // Calculate target dimensions based on resize mode
        console.log('🎯 Resizing:', {
          original: `${img.width}x${img.height}`,
          target: `${options.width}x${options.height}`,
          mode: options.resizeMode,
          keepAspectRatio: options.keepAspectRatio,
          willResize: img.width !== options.width || img.height !== options.height
        });
        
        // Test cover mode calculation
        if (options.resizeMode === 'cover') {
          testCoverMode(img.width, img.height, options.width, options.height);
        }
        
        const { targetWidth, targetHeight, sourceX, sourceY, sourceWidth, sourceHeight } = 
          calculateResizeDimensions(
            img.width, 
            img.height, 
            options.width, 
            options.height, 
            options.resizeMode
          );
          
        console.log('🎯 Calculated dimensions:', {
          target: `${targetWidth}x${targetHeight}`,
          source: `${sourceWidth}x${sourceHeight}`,
          sourceOffset: `${sourceX},${sourceY}`
        });

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Apply advanced resampling filter settings
        applyResamplingFilter(ctx, options.resamplingFilter);
        
        // Handle different resize modes
        if (options.resizeMode === 'cover') {
          // For cover mode, we need to draw from a cropped source
          ctx.drawImage(
            img, 
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, targetWidth, targetHeight
          );
        } else {
          // For fit, fill, and stretch modes
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        }
        
        // Calculate effective quality based on both quality and compression settings
        const effectiveQuality = Math.max(0.1, options.quality * options.compression);
        
        console.log('🎯 Quality settings:', {
          baseQuality: options.quality,
          compression: options.compression,
          effectiveQuality: effectiveQuality,
          format: options.format
        });

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Canvas to Blob failed'));
            
            const result = {
              ...imageFile,
              resizedUrl: URL.createObjectURL(blob),
              resizedSize: blob.size,
              width: targetWidth,
              height: targetHeight,
              originalWidth: img.width,
              originalHeight: img.height,
            };
            
            console.log('🎯 Resize complete:', {
              original: `${img.width}x${img.height}`,
              result: `${targetWidth}x${targetHeight}`,
              originalSize: imageFile.size,
              newSize: blob.size,
              sizeChange: ((blob.size - imageFile.size) / imageFile.size * 100).toFixed(1) + '%'
            });
            
            resolve(result);
          },
          options.format,
          effectiveQuality
        );
      };
    });
  };

  // Test function to verify cover mode calculation
  const testCoverMode = (originalWidth: number, originalHeight: number, targetWidth: number, targetHeight: number) => {
    const originalRatio = originalWidth / originalHeight;
    const targetRatio = targetWidth / targetHeight;
    
    console.log('🧪 Testing cover mode:', {
      original: `${originalWidth}x${originalHeight} (ratio: ${originalRatio.toFixed(2)})`,
      target: `${targetWidth}x${targetHeight} (ratio: ${targetRatio.toFixed(2)})`,
      shouldCrop: originalRatio !== targetRatio ? 'Yes' : 'No'
    });
    
    let coverSourceX = 0;
    let coverSourceY = 0;
    let coverSourceWidth = originalWidth;
    let coverSourceHeight = originalHeight;

    if (originalRatio > targetRatio) {
      // Image is wider, crop width
      coverSourceWidth = Math.round(originalHeight * targetRatio);
      coverSourceX = Math.round((originalWidth - coverSourceWidth) / 2);
    } else {
      // Image is taller, crop height
      coverSourceHeight = Math.round(originalWidth / targetRatio);
      coverSourceY = Math.round((originalHeight - coverSourceHeight) / 2);
    }

    console.log('🧪 Cover mode result:', {
      target: `${targetWidth}x${targetHeight}`,
      source: `${coverSourceWidth}x${coverSourceHeight}`,
      offset: `${coverSourceX},${coverSourceY}`,
      cropWidth: originalWidth - coverSourceWidth,
      cropHeight: originalHeight - coverSourceHeight
    });
    
    return { targetWidth, targetHeight, sourceX: coverSourceX, sourceY: coverSourceY, sourceWidth: coverSourceWidth, sourceHeight: coverSourceHeight };
  };

  // Helper function to calculate resize dimensions based on mode
  const calculateResizeDimensions = (
    originalWidth: number,
    originalHeight: number,
    targetWidth: number,
    targetHeight: number,
    mode: 'fit' | 'fill' | 'cover' | 'stretch'
  ) => {
    const originalRatio = originalWidth / originalHeight;
    const targetRatio = targetWidth / targetHeight;

    switch (mode) {
      case 'stretch':
        return {
          targetWidth,
          targetHeight,
          sourceX: 0,
          sourceY: 0,
          sourceWidth: originalWidth,
          sourceHeight: originalHeight
        };

      case 'fit':
        // Resize to fit within target dimensions while maintaining aspect ratio
        // But if user explicitly sets dimensions, respect them unless they would distort the image
        const fitRatio = Math.min(targetWidth / originalWidth, targetHeight / originalHeight);
        
        // If the target dimensions are larger than original, allow upscaling
        // If the target dimensions are smaller, scale down to fit
        const shouldScale = targetWidth !== originalWidth || targetHeight !== originalHeight;
        
        if (shouldScale) {
          return {
            targetWidth: Math.round(originalWidth * fitRatio),
            targetHeight: Math.round(originalHeight * fitRatio),
            sourceX: 0,
            sourceY: 0,
            sourceWidth: originalWidth,
            sourceHeight: originalHeight
          };
        } else {
          // Even if dimensions are the same, we still need to process the image
          // for quality/format changes, so return the target dimensions
          return {
            targetWidth,
            targetHeight,
            sourceX: 0,
            sourceY: 0,
            sourceWidth: originalWidth,
            sourceHeight: originalHeight
          };
        }

      case 'fill':
        // Resize to fill target dimensions exactly, may crop
        const fillRatio = Math.max(targetWidth / originalWidth, targetHeight / originalHeight);
        const fillWidth = Math.round(originalWidth * fillRatio);
        const fillHeight = Math.round(originalHeight * fillRatio);
        const fillX = (fillWidth - targetWidth) / 2;
        const fillY = (fillHeight - targetHeight) / 2;
        
        return {
          targetWidth,
          targetHeight,
          sourceX: Math.round(fillX / fillRatio),
          sourceY: Math.round(fillY / fillRatio),
          sourceWidth: Math.round(targetWidth / fillRatio),
          sourceHeight: Math.round(targetHeight / fillRatio)
        };

      case 'cover':
        // Cover mode: ALWAYS produce exact target dimensions by cropping source
        const coverRatio = Math.max(targetWidth / originalWidth, targetHeight / originalHeight);
        
        // Calculate source dimensions that will fill the target exactly
        const coverSourceWidth = Math.round(targetWidth / coverRatio);
        const coverSourceHeight = Math.round(targetHeight / coverRatio);
        
        // Center the crop area
        const coverSourceX = Math.round((originalWidth - coverSourceWidth) / 2);
        const coverSourceY = Math.round((originalHeight - coverSourceHeight) / 2);

        console.log('🎯 Cover mode calculation:', {
          original: `${originalWidth}x${originalHeight}`,
          target: `${targetWidth}x${targetHeight}`,
          coverRatio: coverRatio.toFixed(3),
          sourceCrop: `${coverSourceWidth}x${coverSourceHeight}`,
          sourceOffset: `${coverSourceX},${coverSourceY}`,
          willCrop: coverSourceWidth < originalWidth || coverSourceHeight < originalHeight
        });

        return {
          targetWidth, // ALWAYS exact target dimensions
          targetHeight, // ALWAYS exact target dimensions
          sourceX: coverSourceX,
          sourceY: coverSourceY,
          sourceWidth: coverSourceWidth,
          sourceHeight: coverSourceHeight
        };

      default:
        return {
          targetWidth,
          targetHeight,
          sourceX: 0,
          sourceY: 0,
          sourceWidth: originalWidth,
          sourceHeight: originalHeight
        };
    }
  };

  // Helper function to apply resampling filters
  const applyResamplingFilter = (
    ctx: CanvasRenderingContext2D,
    filter: 'lanczos' | 'bicubic' | 'bilinear' | 'nearest'
  ) => {
    switch (filter) {
      case 'nearest':
        ctx.imageSmoothingEnabled = false;
        break;
      case 'bilinear':
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'low';
        break;
      case 'bicubic':
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        break;
      case 'lanczos':
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        break;
      default:
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
    }
  };

  // Smart quality calculation based on format and resize mode
  const getSmartQuality = (format: string, resizeMode: string, isDownscaling: boolean) => {
    if (!smartQuality) return quality;

    let baseQuality = 0.9;

    // Adjust based on format
    switch (format) {
      case 'image/jpeg':
        baseQuality = isDownscaling ? 0.85 : 0.9; // Lower quality for downscaling
        break;
      case 'image/webp':
        baseQuality = 0.8; // WebP can use lower quality for same visual result
        break;
      case 'image/avif':
        baseQuality = 0.75; // AVIF is very efficient
        break;
      case 'image/heif':
        baseQuality = 0.8; // HEIF is very efficient
        break;
      case 'image/png':
        return 1.0; // PNG is lossless
    }

    // Adjust based on resize mode
    switch (resizeMode) {
      case 'cover':
        baseQuality += 0.05; // Higher quality for cropping
        break;
      case 'stretch':
        baseQuality -= 0.1; // Lower quality for stretching
        break;
      case 'fit':
        baseQuality += 0.02; // Slightly higher for fit mode
        break;
    }

    return Math.min(1.0, Math.max(0.1, baseQuality));
  };

  // Server-side image processing with Sharp
  const processImageServerSide = async (
    imageFile: ResizedImage,
    options: { 
      width: number; 
      height: number; 
      format: string; 
      quality: number; 
      resamplingFilter: 'lanczos' | 'bicubic' | 'bilinear' | 'nearest';
      resizeMode: 'fit' | 'fill' | 'cover' | 'stretch';
    }
  ): Promise<ResizedImage> => {
    try {
      // Convert preview URL to blob
      const response = await fetch(imageFile.previewUrl);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', blob, imageFile.name);
      formData.append('width', options.width.toString());
      formData.append('height', options.height.toString());
      formData.append('format', options.format.split('/')[1] || 'jpeg');
      formData.append('quality', options.quality.toString());
      formData.append('resamplingFilter', options.resamplingFilter);
      formData.append('resizeMode', options.resizeMode);

      // Send to server for processing
      const processResponse = await fetch('/api/image/process', {
        method: 'POST',
        body: formData,
      });

      if (!processResponse.ok) {
        throw new Error(`Server processing failed: ${processResponse.statusText}`);
      }

      // Get processed image blob
      const processedBlob = await processResponse.blob();
      const processedUrl = URL.createObjectURL(processedBlob);

      // Get metadata from response headers
      const processedWidth = parseInt(processResponse.headers.get('X-Image-Width') || '0');
      const processedHeight = parseInt(processResponse.headers.get('X-Image-Height') || '0');
      const processedSize = parseInt(processResponse.headers.get('X-Image-Size') || '0');

      return {
        ...imageFile,
        resizedUrl: processedUrl,
        resizedSize: processedSize,
        width: processedWidth,
        height: processedHeight,
        originalWidth: parseInt(processResponse.headers.get('X-Image-Width') || '0'),
        originalHeight: parseInt(processResponse.headers.get('X-Image-Height') || '0'),
      };

    } catch (error) {
      console.error('Server-side processing failed:', error);
      throw error;
    }
  };

  // Upload image to cloud storage
  const uploadToCloud = async (image: ResizedImage): Promise<boolean> => {
    if (!user || !saveToCloud) return false;

    try {
      setIsUploadingToCloud(true);
      setCloudUploadProgress(0);

      // Convert resized image to blob
      if (!image.resizedUrl) {
        console.error('No resized URL for image:', image.name);
        return false;
      }
      const response = await fetch(image.resizedUrl!);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, image.originalName);
      formData.append('width', image.width?.toString() || '');
      formData.append('height', image.height?.toString() || '');
      

      // Upload to our API
      const uploadResponse = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Upload failed');
      }

      setCloudUploadProgress(100);
      return true;
    } catch (error) {
      console.error('Cloud upload error:', error);
      // toast({
      //   title: "Cloud Upload Failed",
      //   description: error instanceof Error ? error.message : "Failed to upload to cloud storage",
      //   variant: "destructive",
      // });
      return false;
    } finally {
      setIsUploadingToCloud(false);
      setCloudUploadProgress(0);
    }
  };

  const performResize = async () => {
    console.log('🎯 performResize called!');
    console.log('🎯 Images count:', images.length);
    
    // Calculate smart quality if enabled
    const effectiveQuality = smartQuality 
      ? getSmartQuality(format, resizeMode, width < 1200 && height < 1200) 
      : downloadQuality;

    console.log('🎯 Current state values:', {
      width,
      height,
      keepAspectRatio,
      format,
      quality: effectiveQuality,
      compression,
      resamplingFilter,
      resizeMode
    });
    
    // Force specific dimensions for testing if needed
    if (width === 800 && height === 600) {
      console.log('🎯 Using default dimensions 800x600 - did you select a preset?');
    }

    const currentResizingOptions = { 
      width, 
      height, 
      keepAspectRatio, 
      format, 
      quality: effectiveQuality,
      compression: compression,
      resamplingFilter,
      resizeMode
    };
    if (images.length === 0) {
      console.log('⚠️ No images to process');
      return;
    }
    
    console.log('🎯 Starting image processing...');
    setIsResizing(true);
    setResizeProgress(0);
    setProcessingStartTime(Date.now());
    setEstimatedTimeRemaining(null);
    
    // Initialize processing states for all images
    const initialState = new Map<string, 'pending' | 'processing' | 'completed' | 'error'>();
    images.forEach(img => initialState.set(img.id, 'pending'));
    setImageProcessingStates(initialState);

    const unprocessedImages = images.filter((img) => !img.resizedUrl);

    if (unprocessedImages.length === 0) {
      setIsResizing(false);
      setResizeProgress(100);
      setCurrentProcessingImage(null);
      return;
    }

    const processSingleImage = async (image: ResizedImage, index: number) => {
      try {
        // Update state to processing
        setCurrentProcessingImage(image.name);
        setImageProcessingStates(prev => new Map(prev.set(image.id, 'processing')));
        
        const resized = useServerProcessing 
          ? await processImageServerSide(image, currentResizingOptions)
          : await resizeImage(image, currentResizingOptions);
        setImages(currentImages => currentImages.map(i => i.id === resized.id ? resized : i));
        
        // Update state to completed
        setImageProcessingStates(prev => new Map(prev.set(image.id, 'completed')));
        
        // Calculate estimated time remaining
        if (processingStartTime) {
          const elapsed = Date.now() - processingStartTime;
          const progress = (index + 1) / images.length;
          const estimatedTotal = elapsed / progress;
          const remaining = estimatedTotal - elapsed;
          setEstimatedTimeRemaining(Math.max(0, remaining));
        }
        
        return resized;
      } catch (error) {
        console.error('Resize error:', error);
        const errorImage = { ...image, error: 'Failed to resize' };
        setImages(currentImages => currentImages.map(i => i.id === errorImage.id ? errorImage : i));
        
        // Update state to error
        setImageProcessingStates(prev => new Map(prev.set(image.id, 'error')));
        
        return errorImage;
      } finally {
        setResizeProgress(p => p + 100 / images.length);
      }
    };
  
    let processedCount = 0;
    for (const image of images) {
        await processSingleImage(image, processedCount);
        processedCount++;
    }
    
    setCurrentProcessingImage(null);
    
    // Upload to cloud if enabled
    if (saveToCloud && user) {
      const cloudImages = images.filter(img => img.resizedUrl && !img.error);
      for (const image of cloudImages) {
        await uploadToCloud(image);
      }
    }
    
    setIsResizing(false);

    // Track image processing for all users (both registered and guest)
    if (images.length > 0) {
      console.log('🔍 Tracking image processing:', images.length, 'images');
      console.log('🔍 User:', user ? `ID ${user.id}` : 'Guest');
      console.log('🔍 Processing time:', Date.now() - (processingStartTime || Date.now()));
      
      try {
        const trackingData = {
          user_id: user?.id || null,
          guest_id: user ? null : (localStorage.getItem('guest_id') || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
          action: 'image_resize',
          file_count: images.length,
          processing_time_ms: Date.now() - (processingStartTime || Date.now()),
          file_size_bytes: images.reduce((total, img) => total + (img.file?.size || 0), 0)
        };

        console.log('🔍 Tracking data:', trackingData);

        // Store guest_id in localStorage if it's a new guest
        if (!user && !localStorage.getItem('guest_id')) {
          localStorage.setItem('guest_id', trackingData.guest_id);
          console.log('🔍 Stored new guest_id:', trackingData.guest_id);
        }

        const response = await fetch('/api/usage/track-processing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trackingData)
        });
        
        if (response.ok) {
          console.log('✅ Image processing tracked successfully');
          
          // Dispatch custom event to notify admin pages
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('imageProcessed', {
              detail: {
                user_id: user?.id,
                guest_id: trackingData.guest_id,
                file_count: trackingData.file_count,
                timestamp: new Date().toISOString()
              }
            }));
          }
        } else {
          const errorText = await response.text();
          console.error('❌ Tracking failed:', response.status, errorText);
        }
        
        // Note: User data refresh removed to prevent automatic logout
        // The tracking API will update the database, and the user data will be
        // refreshed naturally on the next page load or manual refresh
      } catch (error) {
        console.error('❌ Failed to track image processing:', error);
      }
    } else {
      console.log('⚠️ No images to track');
    }

    // toast({
    //   title: 'Resizing complete!',
    //   description: `${images.length} image(s) have been processed.${saveToCloud && user ? ' Images saved to cloud storage.' : ''}`,
    // });
  };

  const handleResizeClick = async () => {
    console.log('🚀 Resize button clicked!');
    console.log('🚀 Images count:', images.length);
    
    if (images.length === 0) {
      console.log('⚠️ No images selected');
      // toast({
      //   title: "No images selected",
      //   description: "Please upload some images to resize.",
      //   variant: "destructive",
      // });
      return;
    }
    
    const unresizedCount = images.filter(img => !img.resizedUrl).length;
    console.log('🚀 Unresized count:', unresizedCount);
    
    const hasLimit = await checkUsageLimit(unresizedCount);
    if (hasLimit) {
      console.log('⚠️ Usage limit reached');
      return;
    }

    const options = { width, height, keepAspectRatio, format, quality };
    setResizingOptions(options);
    console.log('🚀 Setting showResultsModal to true');
    setShowResultsModal(true);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const downloadImage = (image: ResizedImage) => {
    if (!image.resizedUrl) return;
    
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      console.error('Download not available - not in browser environment');
      return;
    }
    
    const link = document.createElement('a');
    link.href = image.resizedUrl;
    const extension = format.split('/')[1] || 'jpg';
    link.download = `${image.name}_${image.width}x${image.height}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = async () => {
    const imagesToDownload = images.filter((image) => image.resizedUrl);

    if (imagesToDownload.length === 0) {
      // toast({
      //   title: 'No images to download',
      //   description: 'No images have been resized yet.',
      //   variant: 'destructive',
      // });
      return;
    }

    if (imagesToDownload.length === 1) {
      downloadImage(imagesToDownload[0]);
      return;
    }

    // For multiple images, check if user is logged in
    if (!user) {
      // toast({
      //   title: `Sign up required for batch download`,
      //   description: `Sign up to access paid plans with batch download and no watermarks.`,
      //   variant: 'destructive',
      // });
      return;
    }

    const batchLimit = currentPlan.batchLimit;
    if (imagesToDownload.length > batchLimit) {
      // toast({
      //   title: `Batch limit exceeded`,
      //   description: `Your plan allows downloading up to ${batchLimit} images at once. Upgrade for higher limits.`,
      //   variant: 'destructive',
      // });
      return;
    }

    // toast({
    //   title: 'Preparing ZIP file...',
    //   description: `Zipping ${imagesToDownload.length} images.`,
    // });

    const zip = new JSZip();

    for (const image of imagesToDownload) {
      if (image.resizedUrl) {
        try {
          const response = await fetch(image.resizedUrl);
          const blob = await response.blob();
          const extension = format.split('/')[1] || 'jpg';
          zip.file(`${image.name}_${image.width}x${image.height}.${extension}`, blob);
        } catch (error) {
          console.error('Failed to fetch resized image for zipping:', error);
          // toast({
          //   title: 'Error Zipping File',
          //   description: `Could not add ${image.name} to the zip.`,
          //   variant: 'destructive',
          // });
        }
      }
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Check if we're in a browser environment
      if (typeof document === 'undefined' || typeof URL === 'undefined') {
        console.error('Download not available - not in browser environment');
        return;
      }
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'resized_images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      // toast({
      //   title: 'Download started!',
      //   description: 'Your ZIP file is being downloaded.',
      // });
    } catch (error) {
      console.error('Failed to generate zip file', error);
      // toast({
      //   title: 'Zip Generation Failed',
      //   description: 'Could not create the ZIP file. Please try downloading images individually.',
      //   variant: 'destructive',
      // });
    }
  };

  const handleCloseResults = () => {
    setShowResultsModal(false);
    reset();
  };

  const handleShowPreview = (image: ResizedImage) => {
    setPreviewImage(image);
    setShowPreviewDialog(true);
  };

  const handleCompareImages = (image: ResizedImage) => {
    // Create original image data for comparison
    const originalImage: ResizedImage = {
      ...image,
      previewUrl: image.previewUrl, // Original preview URL
      width: image.originalWidth, // Original dimensions
      height: image.originalHeight,
      originalSize: image.originalSize,
      resizedSize: undefined, // No resized size for original
      resizedUrl: undefined
    };

    // Create resized image data for comparison
    const resizedImage: ResizedImage = {
      ...image,
      previewUrl: image.resizedUrl || image.previewUrl, // Use resized URL if available
      width: image.width, // Resized dimensions
      height: image.height,
      originalSize: image.originalSize, // Keep original size for comparison
      resizedSize: image.resizedSize, // Resized size
      resizedUrl: image.resizedUrl
    };

    setPreviewImage(originalImage);
    setComparisonImage(resizedImage);
    setShowComparison(true);
    setShowPreviewDialog(true);
  };


  useEffect(() => {
    if (!showResultsModal) {
      reset();
    }
  }, [showResultsModal, reset]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        <div className="lg:col-span-3">
          <Card
            className={`relative border-2 border-dashed transition-colors ${
              isDragging ? "border-primary" : ""
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <CardContent className="p-4">
              {images.length === 0 ? (
                <div
                  className="flex h-80 cursor-pointer flex-col items-center justify-center text-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="text-2xl font-semibold">
                    Drag and drop your images here
                  </h3>
                  <p className="text-muted-foreground">
                    or click to browse. Supports JPG, PNG, WebP.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <HelpCircle className="h-4 w-4" />
                    <span>Keyboard shortcuts: Ctrl+O (open), Ctrl+Enter (process), Ctrl+D (download), Ctrl+A (clear all)</span>
                  </div>
                  {currentPlan && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      {!user ? 'Anonymous User' : 'Registered User'}: {isFinite(currentPlan.dailyLimit) ? `${currentPlan.dailyLimit} images per day.` : 'Unlimited image processing.'}
                      {user ? (
                        <span className="block mt-1">
                          Used: {user.dailyUsageCount} today
                          <span className="block text-green-600">• No watermarks</span>
                          <span className="block text-blue-600">• {currentPlan.storageQuotaMB}MB cloud storage</span>
                          <span className="block text-green-600">• All presets available</span>
                        </span>
                      ) : (
                        <span className="block mt-1">
                          Used: {anonymousUsage} today
                          <span className="block text-green-600">• No watermarks</span>
                          <span className="block text-green-600">• All presets available</span>
                          <span className="block text-blue-600">• Sign up for 50 images daily + cloud storage</span>
                        </span>
                      )}
                    </p>
                  )}
                </div>
              ) : (
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                  {images.map((image) => (
                    <Card key={image.id} className="group relative overflow-hidden">
                      <Image
                        src={image.previewUrl}
                        alt={image.originalFile.name}
                        width={200}
                        height={200}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeImage(image.id)}
                        aria-label={`Remove ${image.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                        <p className="truncate text-xs font-medium">{image.name}</p>
                        <p className="text-xs text-gray-300">
                          {formatBytes(image.originalSize)}
                        </p>
                      </div>
                    </Card>
                  ))}
                  <Card 
                    className="flex h-full min-h-[150px] cursor-pointer items-center justify-center border-2 border-dashed"
                    onClick={() => fileInputRef.current?.click()}
                  >
                      <div className="text-center text-muted-foreground">
                          <UploadCloud className="mx-auto h-8 w-8" />
                          <p className="mt-2 text-sm">Add more</p>
                      </div>
                  </Card>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                id="file-upload"
                name="file-upload"
                aria-label="Upload images"
              />
            </CardContent>
          </Card>
          {images.length > 0 && 
              <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={undo} 
                    disabled={!canUndo()}
                    size={isMobile ? "sm" : "default"}
                    aria-label="Undo last action"
                  >
                      <Undo className="mr-2 h-4 w-4" />
                      Undo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={redo} 
                    disabled={!canRedo()}
                    size={isMobile ? "sm" : "default"}
                    aria-label="Redo last undone action"
                  >
                      <Redo className="mr-2 h-4 w-4" />
                      Redo
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                      <X className="mr-2 h-4 w-4" />
                      Clear All
                  </Button>
              </div>
          }
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span>Resize Options</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="preset-select">Presets</Label>
                  {activePreset && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Active: {activePreset}
                    </Badge>
                  )}
                </div>
                <p id="preset-description" className="text-sm text-muted-foreground mb-2">
                  Choose from popular image size presets for social media, web, or print. Presets use Cover mode for exact dimensions.
                </p>
                  <select 
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Choose a preset...</option>
                    <optgroup label="Social Media">
                      {socialPresets.map((p) => (
                        <option key={p.name} value={`${p.width}x${p.height}`}>
                          {p.name} ({p.width}×{p.height})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Web">
                      {webPresets.map((p) => (
                        <option key={p.name} value={`${p.width}x${p.height}`}>
                          {p.name} ({p.width}×{p.height})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Print">
                      {printPresets.map((p) => (
                        <option key={p.name} value={`${p.width}x${p.height}`}>
                          {p.name} ({p.width}×{p.height})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Shopify">
                      {shopifyPresets.map((p) => (
                        <option key={p.name} value={`${p.width}x${p.height}`}>
                          {p.name} ({p.width}×{p.height})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                <div className="flex items-center justify-between mt-2">
                  {!user && <p className="text-xs text-green-600">✓ All presets available for free users</p>}
                  {activePreset && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setActivePreset(null);
                        setKeepAspectRatio(true);
                        setResizeMode('fit');
                        // toast({
                        //   title: "Preset Cleared",
                        //   description: "Using manual dimensions with Fit mode",
                        //   duration: 2000,
                        // });
                      }}
                      className="text-xs"
                    >
                      Clear Preset
                    </Button>
                  )}
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width</Label>
                      <Input 
                        id="width" 
                        name="width"
                        type="number" 
                        value={width} 
                        onChange={e => {
                          setWidth(Number(e.target.value));
                          setActivePreset(null); // Clear preset when manually changing
                        }}
                        aria-label="Image width in pixels"
                      />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input 
                      id="height" 
                      name="height"
                      type="number" 
                      value={height} 
                      onChange={e => {
                        setHeight(Number(e.target.value));
                        setActivePreset(null); // Clear preset when manually changing
                      }}
                      aria-label="Image height in pixels"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="aspect-ratio" 
                      checked={keepAspectRatio} 
                      onCheckedChange={setKeepAspectRatio}
                      aria-label="Maintain aspect ratio"
                    />
                    <Label htmlFor="aspect-ratio" className="flex items-center gap-2">
                      <Ratio className="h-4 w-4" />
                      Maintain aspect ratio
                    </Label>
                  </div>
                  {keepAspectRatio ? (
                    <p className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>Image proportions will be preserved. Width and height will scale together to prevent distortion.</span>
                    </p>
                  ) : (
                    <p className="flex items-start gap-2 text-xs text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                      <span>Image may be stretched or squashed to fit exact dimensions. Turn on to prevent distortion.</span>
                    </p>
                  )}
                </div>

                {/* Advanced Resizing Options */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resize-mode">Resize Mode</Label>
                    <Select value={resizeMode} onValueChange={(value: 'fit' | 'fill' | 'cover' | 'stretch') => setResizeMode(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resize mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fit">Fit (Preserve aspect ratio, fit within dimensions)</SelectItem>
                        <SelectItem value="cover">Cover (Fill exact dimensions, crop if needed) - Best for presets</SelectItem>
                        <SelectItem value="fill">Fill (Fill dimensions, may stretch)</SelectItem>
                        <SelectItem value="stretch">Stretch (Force exact dimensions)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {resizeMode === 'fit' && 'Best for maintaining image quality and proportions'}
                      {resizeMode === 'cover' && 'Perfect for presets! Fills exact dimensions, crops if needed for consistent sizing'}
                      {resizeMode === 'fill' && 'Fills target area, may crop edges'}
                      {resizeMode === 'stretch' && 'Forces exact dimensions, may distort image'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resampling-filter">Resampling Filter</Label>
                    <Select value={resamplingFilter} onValueChange={(value: 'lanczos' | 'bicubic' | 'bilinear' | 'nearest') => setResamplingFilter(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resampling filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lanczos">LANCZOS (Highest quality, best for photos)</SelectItem>
                        <SelectItem value="bicubic">Bicubic (High quality, good balance)</SelectItem>
                        <SelectItem value="bilinear">Bilinear (Medium quality, faster)</SelectItem>
                        <SelectItem value="nearest">Nearest Neighbor (Pixelated, for pixel art)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {resamplingFilter === 'lanczos' && 'Best for downscaling large images, preserves sharpness and detail'}
                      {resamplingFilter === 'bicubic' && 'Great default for most images, especially photographs'}
                      {resamplingFilter === 'bilinear' && 'Faster processing, slightly blurry but smooth'}
                      {resamplingFilter === 'nearest' && 'Fastest, blocky/pixelated, good for pixel art only'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processing-mode">Processing Mode</Label>
                    <Select value={useServerProcessing ? 'server' : 'client'} onValueChange={handleProcessingModeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select processing mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client-side (Fast, browser-based)</SelectItem>
                        <SelectItem value="server">Server-side (High quality, Sharp library)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {useServerProcessing 
                        ? 'Uses Sharp library on server for superior quality and advanced features. Slightly slower but much better results.'
                        : 'Processes images in your browser using Canvas API. Faster but limited quality compared to server processing.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="format">Format</Label>
                      <p id="format-description" className="text-sm text-muted-foreground mb-2">
                        Choose the output image format
                      </p>
                      <Select value={format} onValueChange={setFormat}>
                          <SelectTrigger 
                            id="format" 
                            name="format" 
                            aria-label="Choose image format"
                            aria-describedby="format-description"
                          >
                          <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="image/jpeg">JPEG (Best for photos, smaller size)</SelectItem>
                          <SelectItem value="image/png">PNG (Lossless, transparency support)</SelectItem>
                          <SelectItem value="image/webp">WebP (Modern, excellent compression)</SelectItem>
                          {useServerProcessing && (
                            <>
                              <SelectItem value="image/avif">AVIF (Next-gen, smallest size)</SelectItem>
                              <SelectItem value="image/heif">HEIF (Apple's format, better than JPEG)</SelectItem>
                            </>
                          )}
                          </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {format === 'image/jpeg' && 'Best for photographs. Lossy compression with excellent file size reduction.'}
                        {format === 'image/png' && 'Lossless format with transparency support. Larger files but perfect quality.'}
                        {format === 'image/webp' && 'Modern format with superior compression. 25-35% smaller than JPEG.'}
                        {format === 'image/avif' && 'Cutting-edge format with best compression. 50% smaller than JPEG. Requires server processing.'}
                        {format === 'image/heif' && 'Apple\'s modern format with superior compression. 30% smaller than JPEG. Requires server processing.'}
                        {!useServerProcessing && (format === 'image/avif' || format === 'image/heif') && 'Advanced formats require server-side processing. Switch to server mode to use this format.'}
                      </p>
                  </div>
                  {format !== 'image/png' && (
                      <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="quality">
                              Quality: {Math.round((smartQuality ? getSmartQuality(format, resizeMode, width < 1200 && height < 1200) : quality) * 100)}%
                              {smartQuality && ' (Smart)'}
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="smart-quality"
                                checked={smartQuality}
                                onCheckedChange={setSmartQuality}
                                size="sm"
                              />
                              <Label htmlFor="smart-quality" className="text-xs">Smart Quality</Label>
                            </div>
                          </div>
                          <Slider
                              id="quality"
                              min={0.1}
                              max={1}
                              step={0.01}
                              value={[quality]}
                              onValueChange={([val]) => setQuality(val)}
                              disabled={(!user || !currentPlan.hasQualityControl) || smartQuality}
                          />
                          {(!user || !currentPlan.hasQualityControl) ? (
                            <p className="text-xs text-muted-foreground">Upgrade to control quality.</p>
                          ) : smartQuality ? (
                            <p className="text-xs text-muted-foreground">
                              🧠 Smart quality automatically optimizes based on format and resize mode for best results.
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Higher quality = larger file size. Effective quality: {Math.round(Math.max(0.1, quality * compression) * 100)}%
                            </p>
                          )}
                      </div>
                  )}
                  <div className="space-y-2">
                          <Label htmlFor="compression">Compression: {Math.round(compression * 100)}%</Label>
                          <Slider
                              id="compression"
                              min={0.1}
                              max={1}
                              step={0.01}
                              value={[compression]}
                              onValueChange={([val]) => setCompression(val)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Higher compression = smaller file size but lower quality. Works with quality setting.
                          </p>
                      </div>
              </div>
              
              <Separator />

              <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                      <Switch 
                        id="client-processing" 
                        checked={clientProcessing} 
                        onCheckedChange={setClientProcessing}
                        aria-label="Enable fast client-side processing"
                      />
                      <Label htmlFor="client-processing" className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Fast client-side processing
                      </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                      {clientProcessing
                          ? "Images processed in your browser for maximum speed and privacy"
                          : "Images processed on our servers (slower but more features)"
                      }
                  </p>
              </div>

              <Separator />

              {/* Cloud Storage Option */}
              {user && currentPlan.hasCloudStorage && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="cloud-storage" 
                      checked={saveToCloud} 
                      onCheckedChange={setSaveToCloud}
                      disabled={isUploadingToCloud}
                      aria-label="Save images to cloud storage"
                    />
                    <Label htmlFor="cloud-storage" className="flex items-center gap-2">
                      <UploadCloud className="h-4 w-4" />
                      Save to Cloud Storage
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {saveToCloud 
                      ? `Images will be saved to your cloud storage (${currentPlan.storageQuotaMB}MB quota)`
                      : "Images will only be downloaded locally"
                    }
                  </p>
                  {isUploadingToCloud && (
                    <div className="space-y-2">
                      <Progress value={cloudUploadProgress} className="w-full" />
                      <p className="text-xs text-muted-foreground">Uploading to cloud...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Native Ad for Registered Users - DISABLED */}
              {/* {user && (
                <NativeAd 
                  userType="registered"
                  title="Enhance Your Workflow"
                  description="Discover more professional image editing tools and productivity apps"
                  ctaText="Explore Tools"
                />
              )} */}

              {/* Registration Prompt for Anonymous Users */}
              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="text-base font-semibold text-blue-900">
                        Want 50 images daily + cloud storage?
                      </h3>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      Create a free account to get 10x more images and save your work in the cloud.
                    </p>
                    <div className="flex flex-col gap-2 justify-center max-w-full">
                      <Link href="/signup" className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Create Free Account
                        </Button>
                      </Link>
                    <Button
                      variant="outline"
                        onClick={handleContinueAsGuest}
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                        Continue as Guest
                    </Button>
                      </div>
                  </div>
                </div>
              )}

              <Button onClick={handleResizeClick} disabled={images.length === 0} className="w-full" size={isMobile ? "lg" : "default"}>
                  <Sparkles className="mr-2 h-4 w-4" />Resize Images
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar Ad - Desktop Only - DISABLED */}
        {/* <div className="hidden lg:block lg:col-span-1">
          <AdWrapper type="sidebar" userType={user ? 'registered' : 'anonymous'} />
        </div> */}
      </div>
      <AlertDialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <AlertDialogContent className="mx-4 max-w-md sm:max-w-lg">
          <AlertDialogHeader className="text-center sm:text-left">
            <AlertDialogTitle className="text-lg sm:text-xl">Daily Limit Reached</AlertDialogTitle>
            <div className="text-sm sm:text-base">
              {!user ? (
                <div className="space-y-3">
                  <p>You've reached the daily limit of {currentPlan.dailyLimit} images for anonymous users.</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 font-medium">
                      Create a free account to get 50 images daily + cloud storage!
                    </p>
                    <p className="text-blue-600 text-sm mt-1">
                      No verification needed - just email + password
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p>You've reached your daily limit of {currentPlan.dailyLimit} images.</p>
                  <p className="text-muted-foreground">
                    You've used {user ? user.dailyUsageCount : anonymousUsage} images today.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 font-medium">
                      Come back tomorrow for more free processing!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild className="w-full sm:w-auto order-1 sm:order-2">
              {!user ? (
                <Link href="/signup" className="w-full">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Free Account
                  </Button>
                </Link>
              ) : (
                <Button onClick={() => setShowLimitModal(false)} className="w-full sm:w-auto">
                  OK
                  </Button>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showResultsModal} onOpenChange={handleCloseResults}>
        <DialogContent className={cn(
          "max-w-5xl max-h-[95vh] w-full overflow-y-auto",
          isMobile ? "max-w-[95vw] mx-2 scrollbar-hide" : "max-w-5xl"
        )}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
            Image Resizing Progress
            </DialogTitle>
              {isResizing || resizeProgress < 100 ? (
                <DialogDescription className="flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <span>Resizing in progress...</span>
                </DialogDescription>
              ) : (
                <DialogDescription className="flex items-center gap-2 text-base">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Complete! {processedImageCount} of {images.length} completed</span>
                </DialogDescription>
              )}
          </DialogHeader>
          <div className="flex flex-col h-full max-h-[85vh]">
            {/* Progress Section - Fixed at top */}
            <div className="space-y-3 flex-shrink-0">
              <div className="flex items-center gap-4">
                <Progress value={resizeProgress} className="flex-1"/>
                <span className="text-sm font-medium">{Math.round(resizeProgress)}%</span>
              </div>
              
              {/* Current processing image */}
              {currentProcessingImage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span>Processing: {currentProcessingImage}</span>
                </div>
              )}
              
              {/* Estimated time remaining */}
              {estimatedTimeRemaining !== null && estimatedTimeRemaining > 1000 && (
                <div className="text-sm text-muted-foreground">
                  Estimated time remaining: {Math.round(estimatedTimeRemaining / 1000)}s                                                                        
                </div>
              )}
              
              {/* Individual image status */}
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {images.map((image) => {
                  const status = imageProcessingStates.get(image.id) || 'pending';
                  return (
                    <div key={image.id} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1 mr-2">{image.name}</span>
                      <div className="flex items-center gap-2">
                        {status === 'pending' && <div className="w-2 h-2 rounded-full bg-gray-300" />}
                        {status === 'processing' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                        {status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {status === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Separator className="flex-shrink-0" />

            {/* Ad between progress and download quality - High engagement spot - DISABLED */}
            {/* <div className="flex-shrink-0 py-2">
              <ModalAd position="top" userType={user ? 'registered' : 'anonymous'} />
            </div> */}

            {/* Download Quality Section - Fixed */}
            <div className="flex-shrink-0 py-4 space-y-3">
              <div>
                <Label className="text-base font-medium">Download Quality</Label>
                <p className="text-sm text-muted-foreground">Choose the quality for your downloads</p>
              </div>
              <div className="flex gap-2">
                 <Button
                  variant={downloadQuality === 0.9 ? 'default' : 'outline'}     
                  onClick={() => setDownloadQuality(0.9)}
                >
                  High Quality (90%)
                </Button>
                <Button
                  variant={downloadQuality === 0.7 ? 'default' : 'outline'}     
                  onClick={() => setDownloadQuality(0.7)}
                >
                  Medium Quality (70%)
                </Button>
              </div>
            </div>

            {/* Images Grid - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-2 min-h-0">
              {/* Ad at top of images grid - High visibility - DISABLED */}
              {/* <div className="mb-4">
                <ModalAd position="middle" userType={user ? 'registered' : 'anonymous'} />
              </div> */}
              
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden p-4">
                    <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-md">
                      {image.resizedUrl ? (
                        <Image
                          src={image.resizedUrl}
                          alt={`Resized ${image.name}`}
                          fill
                          className="object-contain"
                        />
                      ) : isResizing ? (
                        <div className="flex h-full items-center justify-center">
                            <Sparkles className="h-8 w-8 animate-pulse text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                      )}
                    </div>
                      <div className="flex-grow min-w-0">
                        <p className="truncate text-sm font-medium mb-2">{image.name}</p>
                      {image.resizedSize && image.width && image.height ? (
                        <>
                            <div className="text-xs text-muted-foreground space-y-1 mb-3">
                            <div>Original: {formatBytes(image.originalSize)}</div>
                            <div className={cn("font-semibold", ((image.originalSize - image.resizedSize) / image.originalSize) > 0 ? 'text-green-500' : 'text-red-500' )}>
                              Resized: {formatBytes(image.resizedSize)} (
                              {Math.round(
                                Math.abs((image.originalSize - image.resizedSize) /
                                  image.originalSize) *
                                  100
                              )}
                              % smaller)
                            </div>
                            <div>Size: {image.width} x {image.height}</div>
                          </div>
                            <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleShowPreview(image)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Show Preview
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleCompareImages(image)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Compare
                              </Button>
                              <Button
                                size="sm"
                                className="w-full"
                            onClick={() => downloadImage(image)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download {downloadQuality === 0.9 ? 'HQ' : 'MQ'}
                          </Button>
                            </div>
                        </>
                      ) : image.error ? (
                        <p className="mt-2 text-xs text-destructive">{image.error}</p>
                      ) : (
                        <p className="mt-2 text-xs text-muted-foreground">Waiting to process...</p>
                      )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <Separator className="flex-shrink-0" />
            
            {/* Native ad for registered users before footer */}
            {/* {user && (
              <div className="flex-shrink-0 py-2">
                <NativeAd 
                  userType="registered"
                  title="Need More Tools?"
                  description="Discover our full suite of image editing tools for professionals"
                  ctaText="Explore All Tools"
                />
              </div>
            )} */}
            
            {/* Bottom ad for all users - DISABLED */}
            {/* <div className="flex-shrink-0 py-2">
              <ModalAd position="bottom" userType={user ? 'registered' : 'anonymous'} />
            </div> */}
            
            {/* Footer - Fixed at bottom */}
            <div className="flex items-center justify-between flex-shrink-0 py-4">
               <p className="text-sm text-muted-foreground">{successfulImages.length} image{successfulImages.length !== 1 && 's'} processed successfully</p>
               <div className="flex gap-2">
                 <Button onClick={downloadAll} disabled={Boolean(isResizing || successfulImages.length === 0 || (!user && successfulImages.length > 1) || (user && successfulImages.length > (currentPlan.batchLimit || 0))) }>
                   <FileDown className="mr-2 h-4 w-4" />
                   Download All {downloadQuality === 0.9 ? 'HQ' : 'MQ'}
                 </Button>
                  <Button onClick={handleCloseResults} variant="outline">
                   Close
                 </Button>
               </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Image Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={(open) => {
        setShowPreviewDialog(open);
        if (!open) {
          setShowComparison(false);
          setComparisonImage(null);
        }
      }}>
        <DialogContent className={cn(
          "max-w-6xl max-h-[90vh] w-full overflow-y-auto",
          isMobile ? "max-w-[95vw] max-h-[95vh] mx-2 scrollbar-hide" : "max-w-6xl max-h-[90vh]"
        )}>
          <DialogHeader className={cn(
            "space-y-2",
            isMobile ? "px-1" : ""
          )}>
            <DialogTitle className={cn(
              "flex items-center gap-2",
              isMobile ? "text-lg" : ""
            )}>
              <Eye className="h-5 w-5" />
              {showComparison ? 'Image Comparison' : 'Image Preview'}
            </DialogTitle>
            <DialogDescription className={cn(
              isMobile ? "text-sm" : ""
            )}>
              {showComparison && comparisonImage ? (
                `${previewImage?.name} vs ${comparisonImage.name}`
              ) : (
                `${previewImage?.name} - ${previewImage?.width} x ${previewImage?.height}`
              )}
            </DialogDescription>
          </DialogHeader>
          
          {previewImage && (
            <div className={cn(
              "space-y-3",
              isMobile ? "space-y-2" : "space-y-4"
            )}>
              {showComparison && comparisonImage ? (
                <div className={cn(
                  "grid gap-3",
                  isMobile ? "grid-cols-1" : "grid-cols-2"
                )}>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Original</h4>
                    <div className={cn(
                      "relative w-full bg-muted rounded-lg overflow-hidden",    
                      isMobile ? "h-[30vh] min-h-[150px] max-h-[200px]" : "h-[50vh]"
                    )}>
                      <Image
                        src={previewImage.previewUrl}
                        alt={`Original ${previewImage.name}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {previewImage.width} x {previewImage.height} - {formatBytes(previewImage.originalSize)}                                                   
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Resized</h4>
                    <div className={cn(
                      "relative w-full bg-muted rounded-lg overflow-hidden",    
                      isMobile ? "h-[30vh] min-h-[150px] max-h-[200px]" : "h-[50vh]"
                    )}>
                      <Image
                        src={comparisonImage.resizedUrl || comparisonImage.previewUrl}                                                                          
                        alt={`Resized ${comparisonImage.name}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {comparisonImage.width} x {comparisonImage.height} - {formatBytes(comparisonImage.resizedSize || comparisonImage.originalSize)}           
                    </div>
                  </div>
                </div>
              ) : (
                <div className={cn(
                  "relative w-full bg-muted rounded-lg overflow-hidden",        
                  isMobile ? "h-[30vh] max-h-[250px]" : "h-[60vh]"
                )}>
                  <Image
                    src={previewImage.resizedUrl || previewImage.previewUrl}    
                    alt={`Preview of ${previewImage.name}`}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              
              <div className={cn(
                "grid gap-3 text-sm",
                isMobile ? "grid-cols-1 gap-2" : "grid-cols-2"
              )}>
                <div className={cn(
                  "flex justify-between items-center",
                  isMobile ? "py-1 border-b border-border/50" : ""
                )}>
                  <span className="text-muted-foreground">Original Size:</span> 
                  <span className="font-medium">{formatBytes(previewImage.originalSize)}</span>                                                                 
                </div>
                <div className={cn(
                  "flex justify-between items-center",
                  isMobile ? "py-1 border-b border-border/50" : ""
                )}>
                  <span className="text-muted-foreground">Resized Size:</span>  
                  <span className="font-medium">
                    {showComparison && comparisonImage && comparisonImage.resizedSize ? 
                      formatBytes(comparisonImage.resizedSize) : 
                      previewImage.resizedSize ? formatBytes(previewImage.resizedSize) : 'N/A'
                    }                                                                  
                  </span>
                </div>
                <div className={cn(
                  "flex justify-between items-center",
                  isMobile ? "py-1 border-b border-border/50" : ""
                )}>
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span className="font-medium">
                    {showComparison && comparisonImage ? 
                      `${previewImage.width} x ${previewImage.height} → ${comparisonImage.width} x ${comparisonImage.height}` :
                      `${previewImage.width} x ${previewImage.height}`
                    }
                  </span>
                </div>
                <div className={cn(
                  "flex justify-between items-center",
                  isMobile ? "py-1" : ""
                )}>
                  <span className="text-muted-foreground">Size Reduction:</span>
                  <span className={cn(
                    "font-medium",
                    (() => {
                      if (showComparison && comparisonImage && comparisonImage.resizedSize && previewImage.originalSize) {
                        const reduction = (previewImage.originalSize - comparisonImage.resizedSize) / previewImage.originalSize;
                        return reduction > 0 ? 'text-green-500' : 'text-red-500';
                      } else if (previewImage.resizedSize && previewImage.originalSize) {
                        const reduction = (previewImage.originalSize - previewImage.resizedSize) / previewImage.originalSize;
                        return reduction > 0 ? 'text-green-500' : 'text-red-500';
                      }
                      return 'text-gray-500';
                    })()
                  )}>
                    {(() => {
                      if (showComparison && comparisonImage && comparisonImage.resizedSize && previewImage.originalSize) {
                        const reduction = Math.abs((previewImage.originalSize - comparisonImage.resizedSize) / previewImage.originalSize) * 100;
                        return `${Math.round(reduction)}%`;
                      } else if (previewImage.resizedSize && previewImage.originalSize) {
                        const reduction = Math.abs((previewImage.originalSize - previewImage.resizedSize) / previewImage.originalSize) * 100;
                        return `${Math.round(reduction)}%`;
                      }
                      return 'N/A';
                    })()}
                  </span>
                </div>
              </div>
              
              <div className={cn(
                "flex gap-2",
                isMobile ? "flex-col gap-2" : "flex-row"
              )}>
                <Button 
                  onClick={() => downloadImage(previewImage)}
                  className={cn(
                    "flex-1",
                    isMobile ? "w-full" : ""
                  )}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreviewDialog(false)}
                  className={cn(
                    isMobile ? "w-full" : ""
                  )}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
