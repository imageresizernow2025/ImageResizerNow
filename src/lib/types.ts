
export interface ResizedImage {
    id: string;
    originalFile: File;
    previewUrl: string;
    resizedUrl?: string;
    originalSize: number;
    resizedSize?: number;
    name: string;
    originalName?: string;
    error?: string;
    width?: number;
    height?: number;
}

export interface ResizingOptions {
    width: number;
    height: number;
    keepAspectRatio: boolean;
    format: string;
    quality: number;
}
