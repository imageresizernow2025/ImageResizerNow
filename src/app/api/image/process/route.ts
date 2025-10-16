import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getUserFromToken } from '@/lib/auth';

// Server-side image processing with Sharp for superior quality
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    // Optional authentication - allow anonymous usage with limits
    let user = null;
    if (token) {
      user = await getUserFromToken(token);
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const width = parseInt(formData.get('width') as string);
    const height = parseInt(formData.get('height') as string);
    const format = formData.get('format') as string || 'jpeg';
    const quality = parseFloat(formData.get('quality') as string) || 0.9;
    const resamplingFilter = formData.get('resamplingFilter') as string || 'lanczos3';
    const resizeMode = formData.get('resizeMode') as string || 'fit';

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (!width || !height) {
      return NextResponse.json({ error: 'Width and height are required' }, { status: 400 });
    }

    // Convert file to buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Map client-side filters to Sharp kernels
    const sharpKernelMap = {
      'nearest': sharp.kernel.nearest,
      'bilinear': sharp.kernel.linear,
      'bicubic': sharp.kernel.cubic,
      'lanczos': sharp.kernel.lanczos3,
      'lanczos2': sharp.kernel.lanczos2,
      'lanczos3': sharp.kernel.lanczos3,
    };

    const kernel = sharpKernelMap[resamplingFilter as keyof typeof sharpKernelMap] || sharp.kernel.lanczos3;

    // Create Sharp instance
    let sharpInstance = sharp(imageBuffer);

    // Apply resizing based on mode
    switch (resizeMode) {
      case 'fit':
        // Fit within dimensions while maintaining aspect ratio
        sharpInstance = sharpInstance.resize(width, height, {
          kernel,
          fit: 'inside',
          withoutEnlargement: false,
        });
        break;

      case 'cover':
        // Cover mode: fill dimensions, crop if needed
        sharpInstance = sharpInstance.resize(width, height, {
          kernel,
          fit: 'cover',
          position: 'center',
        });
        break;

      case 'fill':
        // Fill mode: fill dimensions exactly
        sharpInstance = sharpInstance.resize(width, height, {
          kernel,
          fit: 'fill',
        });
        break;

      case 'stretch':
        // Stretch mode: force exact dimensions
        sharpInstance = sharpInstance.resize(width, height, {
          kernel,
          fit: 'fill',
        });
        break;

      default:
        // Default to fit
        sharpInstance = sharpInstance.resize(width, height, {
          kernel,
          fit: 'inside',
          withoutEnlargement: false,
        });
    }

    // Apply format-specific optimizations
    let processedBuffer: Buffer;
    const outputFormat = format.toLowerCase();

    switch (outputFormat) {
      case 'jpeg':
      case 'jpg':
        processedBuffer = await sharpInstance
          .jpeg({
            quality: Math.round(quality * 100),
            progressive: true,
            mozjpeg: true, // Use mozjpeg encoder for better compression
          })
          .toBuffer();
        break;

      case 'png':
        processedBuffer = await sharpInstance
          .png({
            quality: Math.round(quality * 100),
            progressive: true,
            compressionLevel: 9,
            adaptiveFiltering: true,
          })
          .toBuffer();
        break;

      case 'webp':
        processedBuffer = await sharpInstance
          .webp({
            quality: Math.round(quality * 100),
            effort: 6, // Higher effort for better compression
          })
          .toBuffer();
        break;

      case 'avif':
        processedBuffer = await sharpInstance
          .avif({
            quality: Math.round(quality * 100),
            effort: 6,
          })
          .toBuffer();
        break;

      case 'heif':
      case 'heic':
        // HEIF support requires additional dependencies - fallback to JPEG for now
        console.log('HEIF format requested, falling back to JPEG (HEIF requires libheif)');
        processedBuffer = await sharpInstance
          .jpeg({
            quality: Math.round(quality * 100),
            progressive: true,
            mozjpeg: true,
          })
          .toBuffer();
        break;

      default:
        // Default to JPEG
        processedBuffer = await sharpInstance
          .jpeg({
            quality: Math.round(quality * 100),
            progressive: true,
            mozjpeg: true,
          })
          .toBuffer();
    }

    // Get image metadata
    const metadata = await sharp(processedBuffer).metadata();

    // Return processed image
    return new NextResponse(processedBuffer, {
      status: 200,
      headers: {
        'Content-Type': `image/${outputFormat === 'jpg' ? 'jpeg' : outputFormat}`,
        'Content-Length': processedBuffer.length.toString(),
        'X-Image-Width': metadata.width?.toString() || '0',
        'X-Image-Height': metadata.height?.toString() || '0',
        'X-Image-Size': processedBuffer.length.toString(),
        'X-Original-Size': imageBuffer.length.toString(),
        'X-Compression-Ratio': (imageBuffer.length / processedBuffer.length).toFixed(2),
      },
    });

  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json(
      { 
        error: 'Image processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Test Sharp functionality
    const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    await sharp(testBuffer).resize(1, 1).toBuffer();
    
    return NextResponse.json({
      status: 'healthy',
      sharp: 'available',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        sharp: 'unavailable',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
