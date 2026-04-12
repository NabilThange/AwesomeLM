import { useEffect } from 'react'
import { preloadFirstImages } from '@/lib/image-optimizer'
import { ImageData } from '@/types/treasure'

/**
 * Hook to preload images when component mounts
 * This helps reduce perceived loading time by fetching images in the background
 */
export function useImagePreload(
  images: ImageData[],
  options: {
    count?: number
    preset?: 'thumbnail' | 'medium' | 'large' | 'mobile'
    enabled?: boolean
  } = {}
) {
  const { count = 5, preset = 'medium', enabled = true } = options

  useEffect(() => {
    if (!enabled || !images.length) return

    // Preload images after a short delay to not block initial render
    const timeoutId = setTimeout(() => {
      preloadFirstImages(images, count, preset)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [images, count, preset, enabled])
}
