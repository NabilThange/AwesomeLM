import { Treasure, ImageData } from '@/types/treasure'
import { optimizeSupabaseImage } from './image-optimizer'

const PROJECT_ID = 'qyhtrqobtwmbymviezcs'
const FALLBACK_IMAGE = '/404.png'

/**
 * Transform Supabase treasure row to ImageData format
 * Uses 404.png as fallback if main_image_url is empty
 * Optimizes images using Supabase's transformation API
 */
function transformToImageData(treasure: Treasure): ImageData {
  // Optimize main image for medium display (800x600)
  const optimizedUrl = treasure.main_image_url 
    ? optimizeSupabaseImage(treasure.main_image_url, {
        width: 800,
        height: 600,
        quality: 80,
        resize: 'contain'
      })
    : FALLBACK_IMAGE

  // Optimize additional images
  const optimizedAdditionalImages = (treasure.additional_images || []).map(url =>
    optimizeSupabaseImage(url, {
      width: 1200,
      height: 900,
      quality: 85,
      resize: 'contain'
    })
  )

  return {
    id: treasure.id,
    url: optimizedUrl,
    description: treasure.description,
    title: treasure.title,
    prompt: treasure.prompt,
    additionalImages: optimizedAdditionalImages,
    tags: treasure.tags || [],
    category: treasure.category
  }
}

/**
 * Fetch all treasures from Supabase
 */
export async function fetchTreasures(): Promise<ImageData[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not found in environment variables')
      return []
    }

    // Fetch treasures from Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/treasures?select=*&order=created_at.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Ensure fresh data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch treasures: ${response.status} ${response.statusText}`)
    }

    const data: Treasure[] = await response.json()
    return data.map(transformToImageData)
  } catch (error) {
    console.error('Failed to fetch treasures:', error)
    return []
  }
}

/**
 * Fetch featured treasures
 */
export async function fetchFeaturedTreasures(): Promise<ImageData[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not found in environment variables')
      return []
    }

    // Fetch only featured treasures from Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/treasures?select=*&is_featured=eq.true&order=created_at.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch featured treasures: ${response.status} ${response.statusText}`)
    }

    const data: Treasure[] = await response.json()
    return data.map(transformToImageData)
  } catch (error) {
    console.error('Failed to fetch featured treasures:', error)
    return []
  }
}

/**
 * Increment view count for a treasure
 */
export async function incrementViewCount(treasureId: string): Promise<void> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not found')
      return
    }

    // Increment view count using Supabase RPC or direct update
    await fetch(`${supabaseUrl}/rest/v1/rpc/increment_view_count`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ treasure_id: treasureId })
    })
  } catch (error) {
    console.error('Failed to increment view count:', error)
  }
}

/**
 * Search treasures by query
 */
export async function searchTreasures(query: string): Promise<ImageData[]> {
  const allTreasures = await fetchTreasures()
  const lowerQuery = query.toLowerCase()
  
  return allTreasures.filter(treasure => 
    treasure.title.toLowerCase().includes(lowerQuery) ||
    treasure.description.toLowerCase().includes(lowerQuery) ||
    treasure.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}
