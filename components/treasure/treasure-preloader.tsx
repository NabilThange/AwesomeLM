"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { preloadImages } from '@/lib/image-optimizer'
import { fetchTreasures } from '@/lib/supabase-queries'

/**
 * Global component that preloads treasure images when user is on other pages
 * This ensures images are cached before user navigates to /treasure page
 */
export function TreasurePreloader() {
  const pathname = usePathname()

  useEffect(() => {
    // Only preload if NOT on treasure page (to avoid double loading)
    if (pathname === '/treasure') return

    // Preload treasure images in the background after a delay
    const timeoutId = setTimeout(async () => {
      try {
        const treasures = await fetchTreasures()
        
        // Preload first 5 images with low priority
        const urls = treasures
          .slice(0, 5)
          .map(t => t.url)
          .filter(url => url && !url.startsWith('/'))
        
        preloadImages(urls, 'low')
      } catch (error) {
        console.error('Failed to preload treasures:', error)
      }
    }, 3000) // Wait 3 seconds after page load

    return () => clearTimeout(timeoutId)
  }, [pathname])

  return null // This component doesn't render anything
}
