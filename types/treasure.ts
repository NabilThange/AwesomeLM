export interface Treasure {
  id: string
  title: string
  description: string
  prompt: string
  main_image_url: string
  additional_images: string[]
  tags: string[]
  category: string | null
  created_at: string
  updated_at: string
  is_featured: boolean
  view_count: number
  metadata: Record<string, any>
}

export interface ImageData {
  id: string
  url: string
  description: string
  title: string
  prompt: string
  additionalImages: string[]
  tags: string[]
  category: string | null
}
