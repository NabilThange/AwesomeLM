import { Treasure, ImageData } from '@/types/treasure'

const PROJECT_ID = 'qyhtrqobtwmbymviezcs'

/**
 * Transform Supabase treasure row to ImageData format
 */
function transformToImageData(treasure: Treasure): ImageData {
  return {
    id: treasure.id,
    url: treasure.main_image_url,
    description: treasure.description,
    title: treasure.title,
    prompt: treasure.prompt,
    additionalImages: treasure.additional_images || [],
    tags: treasure.tags || [],
    category: treasure.category
  }
}

/**
 * Fetch all treasures from Supabase
 */
export async function fetchTreasures(): Promise<ImageData[]> {
  try {
    // This will use Supabase MCP when available
    // For now, return mock data
    const mockData: Treasure[] = [
      {
        id: '1',
        title: 'Mountain Sunset',
        description: 'A stunning sunset over mountain peaks with golden hour lighting illuminating the landscape',
        prompt: 'sunset over mountains, golden hour, dramatic lighting, photorealistic',
        main_image_url: 'https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg',
        additional_images: [
          'https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg'
        ],
        tags: ['nature', 'sunset', 'mountains'],
        category: 'landscapes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: true,
        view_count: 0,
        metadata: {}
      },
      {
        id: '2',
        title: 'Lake Reflection',
        description: 'Serene lake reflection capturing the beauty of nature in perfect symmetry',
        prompt: 'serene lake reflection, mirror-like water, nature photography',
        main_image_url: 'https://cdn.cosmos.so/c4588488-0021-4804-9c29-a43059378bfe?format=jpeg',
        additional_images: [
          'https://cdn.cosmos.so/c4588488-0021-4804-9c29-a43059378bfe?format=jpeg'
        ],
        tags: ['nature', 'lake', 'reflection'],
        category: 'landscapes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: false,
        view_count: 0,
        metadata: {}
      },
      {
        id: '3',
        title: 'Autumn Forest',
        description: 'Vibrant autumn forest with colorful foliage creating a natural tapestry',
        prompt: 'autumn forest, colorful foliage, fall colors, natural tapestry',
        main_image_url: 'https://cdn.cosmos.so/de8c561b-e4e4-48f3-9068-30d63b92c43e?format=jpeg',
        additional_images: [
          'https://cdn.cosmos.so/de8c561b-e4e4-48f3-9068-30d63b92c43e?format=jpeg'
        ],
        tags: ['nature', 'autumn', 'forest'],
        category: 'landscapes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: false,
        view_count: 0,
        metadata: {}
      },
      {
        id: '4',
        title: 'Waterfall Vista',
        description: 'Majestic waterfall cascading down rocky cliffs surrounded by lush greenery',
        prompt: 'majestic waterfall, rocky cliffs, lush greenery, nature photography',
        main_image_url: 'https://cdn.cosmos.so/207b3ba7-13ef-496b-a9cb-2a718e14a24e?format=jpeg',
        additional_images: [
          'https://cdn.cosmos.so/207b3ba7-13ef-496b-a9cb-2a718e14a24e?format=jpeg'
        ],
        tags: ['nature', 'waterfall', 'landscape'],
        category: 'landscapes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: true,
        view_count: 0,
        metadata: {}
      },
      {
        id: '5',
        title: 'Beach Paradise',
        description: 'Peaceful beach scene with crystal clear waters and pristine white sand',
        prompt: 'peaceful beach, crystal clear water, white sand, tropical paradise',
        main_image_url: 'https://cdn.cosmos.so/6c41e632-d300-4516-a7af-9a1f7c0aef94?format=jpeg',
        additional_images: [
          'https://cdn.cosmos.so/6c41e632-d300-4516-a7af-9a1f7c0aef94?format=jpeg'
        ],
        tags: ['nature', 'beach', 'ocean'],
        category: 'landscapes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: false,
        view_count: 0,
        metadata: {}
      },
      {
        id: '6',
        title: 'Alpine Heights',
        description: 'Dramatic mountain range with snow-capped peaks reaching into the clouds',
        prompt: 'dramatic mountain range, snow-capped peaks, alpine landscape',
        main_image_url: 'https://cdn.cosmos.so/e552eaac-8251-4890-b954-e988fc4bf2e0?format=jpeg',
        additional_images: [
          'https://cdn.cosmos.so/e552eaac-8251-4890-b954-e988fc4bf2e0?format=jpeg'
        ],
        tags: ['nature', 'mountains', 'alpine'],
        category: 'landscapes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: false,
        view_count: 0,
        metadata: {}
      },
      {
        id: '7',
        title: 'Mountain Sunset',
        description: 'A stunning sunset over mountain peaks with golden hour lighting illuminating the landscape',
        prompt: 'sunset over mountains, golden hour, dramatic lighting, photorealistic',
        main_image_url: 'https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg',
        additional_images: [
          'https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg'
        ],
        tags: ['nature', 'sunset', 'mountains'],
        category: 'landscapes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: false,
        view_count: 0,
        metadata: {}
      }
    ]

    return mockData.map(transformToImageData)
  } catch (error) {
    console.error('Failed to fetch treasures:', error)
    return []
  }
}

/**
 * Fetch featured treasures
 */
export async function fetchFeaturedTreasures(): Promise<ImageData[]> {
  const allTreasures = await fetchTreasures()
  return allTreasures.filter((_, index) => index % 2 === 0) // Mock: return every other item
}

/**
 * Increment view count for a treasure
 */
export async function incrementViewCount(treasureId: string): Promise<void> {
  try {
    console.log(`Incrementing view count for treasure: ${treasureId}`)
    // TODO: Implement with Supabase MCP when project is active
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
