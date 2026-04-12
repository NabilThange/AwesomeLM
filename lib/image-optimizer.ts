/**
 * Image Optimization Utilities for Supabase Storage
 * 
 * Supabase Storage supports native image transformations via URL parameters.
 * This utility helps optimize images for faster loading without requiring a CDN.
 */

const PROJECT_ID = 'qyhtrqobtwmbymviezcs'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${PROJECT_ID}.supabase.co`

export interface ImageTransformOptions {
  width?: number
  height?: number
  quality?: number // 20-100, default 80
  resize?: 'cover' | 'contain' | 'fill' // default: cover
  format?: 'origin' | 'webp' // default: auto (webp for supported browsers)
}

/**
 * Extract bucket and path from a Supabase Storage URL
 * Example: https://project.supabase.co/storage/v1/object/public/bucket/path/image.jpg
 * Returns: { bucket: 'bucket', path: 'path/image.jpg' }
 */
function parseSupabaseUrl(url: string): { bucket: string; path: string } | null {
  try {
    // Handle full Supabase URLs
    const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/)
    if (match) {
      return { bucket: match[1], path: match[2] }
    }
    
    // Handle bucket/path format
    const parts = url.split('/')
    if (parts.length >= 2) {
      return { bucket: parts[0], path: parts.slice(1).join('/') }
    }
    
    return null
  } catch (error) {
    console.error('Failed to parse Supabase URL:', error)
    return null
  }
}

/**
 * Transform a Supabase Storage URL to use image transformation API
 * This enables on-the-fly image optimization and resizing
 */
export function optimizeSupabaseImage(
  url: string,
  options: ImageTransformOptions = {}
): string {
  // Return as-is if not a Supabase URL or empty
  if (!url || url.startsWith('/')) {
    return url
  }

  const parsed = parseSupabaseUrl(url)
  if (!parsed) {
    return url
  }

  const { bucket, path } = parsed
  const params = new URLSearchParams()

  // Add transformation parameters
  if (options.width) params.append('width', options.width.toString())
  if (options.height) params.append('height', options.height.toString())
  if (options.quality) params.append('quality', options.quality.toString())
  if (options.resize) params.append('resize', options.resize)
  if (options.format) params.append('format', options.format)

  const queryString = params.toString()
  const baseUrl = `${SUPABASE_URL}/storage/v1/render/image/public/${bucket}/${path}`
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

/**
 * Preset configurations for common use cases
 */
export const ImagePresets = {
  // Thumbnail for grid/list views
  thumbnail: (url: string) => optimizeSupabaseImage(url, {
    width: 400,
    height: 300,
    quality: 75,
    resize: 'cover'
  }),
  
  // Medium size for carousel/detail views
  medium: (url: string) => optimizeSupabaseImage(url, {
    width: 800,
    height: 600,
    quality: 80,
    resize: 'contain'
  }),
  
  // Large size for full-screen views
  large: (url: string) => optimizeSupabaseImage(url, {
    width: 1200,
    height: 900,
    quality: 85,
    resize: 'contain'
  }),
  
  // Mobile optimized
  mobile: (url: string) => optimizeSupabaseImage(url, {
    width: 600,
    height: 450,
    quality: 75,
    resize: 'cover'
  }),
}

/**
 * Preload images in the background
 * This helps reduce perceived loading time by fetching images before they're needed
 */
export function preloadImages(urls: string[], priority: 'high' | 'low' = 'low'): void {
  if (typeof window === 'undefined') return

  urls.forEach(url => {
    if (!url || url.startsWith('/')) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high')
    }
    document.head.appendChild(link)
  })
}

/**
 * Preload the first N images from a list
 * Useful for preloading visible images in a carousel or grid
 */
export function preloadFirstImages(
  images: Array<{ url: string }>,
  count: number = 5,
  preset: keyof typeof ImagePresets = 'medium'
): void {
  const urls = images
    .slice(0, count)
    .map(img => ImagePresets[preset](img.url))
    .filter(Boolean)
  
  preloadImages(urls, 'high')
}

/**
 * Create a blur placeholder data URL for progressive loading
 * This creates a tiny base64 image that can be shown while the real image loads
 */
export function createBlurPlaceholder(color: string = '#1a1a1a'): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`
}
