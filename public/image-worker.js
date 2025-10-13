// Web Worker for image processing to avoid blocking the main thread
self.onmessage = function(e) {
  const { imageData, options, id } = e.data;
  
  try {
    const canvas = new OffscreenCanvas(options.width, options.height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Create image from data
    const img = new Image();
    img.onload = function() {
      // Calculate dimensions with aspect ratio
      let targetWidth = options.width;
      let targetHeight = options.height;

      if (options.keepAspectRatio) {
        const ratio = Math.min(
          options.width / img.width,
          options.height / img.height
        );
        targetWidth = Math.round(img.width * ratio);
        targetHeight = Math.round(img.height * ratio);
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Enable better image quality settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw image with better quality
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Add watermark if needed
      if (options.hasWatermark) {
        ctx.font = '14px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        
        const watermarkText = 'ImageResizerNow';
        const iconSize = 16;
        const padding = 10;
        
        const textMetrics = ctx.measureText(watermarkText);
        const textWidth = textMetrics.width;
        const totalWidth = textWidth + iconSize + 8;
        
        const x = targetWidth - totalWidth - padding;
        const y = targetHeight - padding;
        
        // Draw watermark icon
        ctx.save();
        ctx.translate(x, y - iconSize);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(21, 12);
        ctx.lineTo(17, 16);
        ctx.moveTo(21, 12);
        ctx.lineTo(17, 8);
        ctx.moveTo(12, 3);
        ctx.lineTo(12, 21);
        ctx.moveTo(12, 3);
        ctx.lineTo(16, 7);
        ctx.moveTo(12, 3);
        ctx.lineTo(8, 7);
        ctx.stroke();
        ctx.restore();
        
        // Draw text
        ctx.strokeText(watermarkText, x + iconSize + 8, y);
        ctx.fillText(watermarkText, x + iconSize + 8, y);
      }
      
      // Calculate effective quality based on both quality and compression settings
      const effectiveQuality = Math.max(0.1, options.quality * (options.compression || 1));
      
      // Convert to blob
      canvas.convertToBlob({
        type: options.format,
        quality: effectiveQuality
      }).then(blob => {
        // Convert blob to array buffer for transfer
        const reader = new FileReader();
        reader.onload = function() {
          self.postMessage({
            success: true,
            id,
            blobData: reader.result,
            width: targetWidth,
            height: targetHeight,
            size: blob.size
          });
        };
        reader.readAsArrayBuffer(blob);
      });
    };
    
    img.onerror = function() {
      self.postMessage({
        success: false,
        id,
        error: 'Failed to load image'
      });
    };
    
    img.src = imageData;
    
  } catch (error) {
    self.postMessage({
      success: false,
      id,
      error: error.message
    });
  }
};
