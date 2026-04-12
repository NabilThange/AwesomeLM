# Supabase Integration Plan for TimeMachine

## Database Schema Design

### Table: `treasures`

```sql
CREATE TABLE treasures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt TEXT NOT NULL,
  main_image_url TEXT NOT NULL,
  additional_images JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_treasures_created_at ON treasures(created_at DESC);
CREATE INDEX idx_treasures_category ON treasures(category);
CREATE INDEX idx_treasures_is_featured ON treasures(is_featured);
CREATE INDEX idx_treasures_tags ON treasures USING GIN(tags);
```

### Column Descriptions

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `title` | TEXT | Image title (e.g., "Mountain Sunset") |
| `description` | TEXT | Detailed description of the image |
| `prompt` | TEXT | AI prompt used to generate the image |
| `main_image_url` | TEXT | Primary image shown in TimeMachine carousel |
| `additional_images` | JSONB | Array of additional image URLs for detail popover carousel |
| `tags` | TEXT[] | Searchable tags (e.g., ["nature", "sunset", "mountains"]) |
| `category` | TEXT | Category grouping (e.g., "landscapes", "abstract", "portraits") |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |
| `is_featured` | BOOLEAN | Flag for featured/highlighted items |
| `view_count` | INTEGER | Track popularity |
| `metadata` | JSONB | Flexible field for additional data |

### Example Data Structure

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Mountain Sunset",
  "description": "A stunning sunset over mountain peaks with golden hour lighting illuminating the landscape",
  "prompt": "A breathtaking sunset over mountain peaks, golden hour lighting, dramatic clouds, photorealistic, 8k",
  "main_image_url": "https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg",
  "additional_images": [
    "https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg",
    "https://cdn.cosmos.so/alternate-view-1.jpeg",
    "https://cdn.cosmos.so/alternate-view-2.jpeg"
  ],
  "tags": ["nature", "sunset", "mountains", "landscape"],
  "category": "landscapes",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "is_featured": true,
  "view_count": 42,
  "metadata": {
    "model": "midjourney-v6",
    "aspect_ratio": "16:9",
    "style": "photorealistic"
  }
}
```

## Integration Steps

### 1. Create Supabase Table

Use Supabase MCP to create the table:

```typescript
// Migration file: create_treasures_table.sql
await mcp_supabase_apply_migration({
  project_id: "your-project-id",
  name: "create_treasures_table",
  query: `
    CREATE TABLE treasures (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      prompt TEXT NOT NULL,
      main_image_url TEXT NOT NULL,
      additional_images JSONB DEFAULT '[]'::jsonb,
      tags TEXT[] DEFAULT ARRAY[]::TEXT[],
      category TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      is_featured BOOLEAN DEFAULT false,
      view_count INTEGER DEFAULT 0,
      metadata JSONB DEFAULT '{}'::jsonb
    );

    CREATE INDEX idx_treasures_created_at ON treasures(created_at DESC);
    CREATE INDEX idx_treasures_category ON treasures(category);
    CREATE INDEX idx_treasures_is_featured ON treasures(is_featured);
    CREATE INDEX idx_treasures_tags ON treasures USING GIN(tags);
  `
});
```

### 2. Update TypeScript Interfaces

```typescript
// types/treasure.ts
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
```

### 3. Create Data Fetching Functions

```typescript
// lib/supabase-queries.ts
import { Treasure, ImageData } from '@/types/treasure'

export async function fetchTreasures(): Promise<ImageData[]> {
  // Use Supabase MCP to fetch data
  const result = await mcp_supabase_execute_sql({
    project_id: "your-project-id",
    query: `
      SELECT 
        id,
        title,
        description,
        prompt,
        main_image_url,
        additional_images,
        tags,
        category,
        created_at
      FROM treasures
      ORDER BY created_at DESC
    `
  });

  // Transform to ImageData format
  return result.rows.map((row: Treasure) => ({
    id: row.id,
    url: row.main_image_url,
    description: row.description,
    title: row.title,
    prompt: row.prompt,
    additionalImages: row.additional_images,
    tags: row.tags,
    category: row.category
  }));
}

export async function fetchFeaturedTreasures(): Promise<ImageData[]> {
  const result = await mcp_supabase_execute_sql({
    project_id: "your-project-id",
    query: `
      SELECT * FROM treasures
      WHERE is_featured = true
      ORDER BY created_at DESC
      LIMIT 10
    `
  });

  return transformToImageData(result.rows);
}

export async function incrementViewCount(treasureId: string): Promise<void> {
  await mcp_supabase_execute_sql({
    project_id: "your-project-id",
    query: `
      UPDATE treasures
      SET view_count = view_count + 1
      WHERE id = $1
    `,
    params: [treasureId]
  });
}
```

### 4. Update TimeMachine Component

```typescript
// components/treasure/time-machine.tsx
export default function TimeMachine({
  shouldImplementPreloading = false,
  simpleMode = false,
}: {
  shouldImplementPreloading?: boolean
  simpleMode?: boolean
}) {
  const [images, setImages] = React.useState<ImageData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadTreasures() {
      try {
        const data = await fetchTreasures()
        setImages(data)
      } catch (error) {
        console.error('Failed to load treasures:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTreasures()
  }, [])

  // Rest of component...
}
```

### 5. Update ImageDetailPopover Props

```typescript
// Pass additional images to popover
<ImageDetailPopover
  isOpen={isPopoverOpen}
  onClose={handleClosePopover}
  images={[
    images[selectedImageIndex].url,
    ...images[selectedImageIndex].additionalImages
  ]}
  title={images[selectedImageIndex].title}
  description={images[selectedImageIndex].description}
  prompt={images[selectedImageIndex].prompt}
/>
```

## Data Migration

### Migrate Existing Data

```typescript
// scripts/migrate-existing-data.ts
const existingImages = [
  {
    title: "Mountain Sunset",
    description: "A stunning sunset over mountain peaks...",
    prompt: "sunset over mountains, golden hour, dramatic lighting",
    main_image_url: "https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg",
    additional_images: [],
    tags: ["nature", "sunset", "mountains"],
    category: "landscapes"
  },
  // ... more images
];

for (const image of existingImages) {
  await mcp_supabase_execute_sql({
    project_id: "your-project-id",
    query: `
      INSERT INTO treasures (
        title, description, prompt, main_image_url, 
        additional_images, tags, category
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    params: [
      image.title,
      image.description,
      image.prompt,
      image.main_image_url,
      JSON.stringify(image.additional_images),
      image.tags,
      image.category
    ]
  });
}
```

## Additional Features to Consider

1. **Row Level Security (RLS)**
   - Public read access
   - Authenticated write access

2. **Storage Integration**
   - Use Supabase Storage for image hosting
   - Generate signed URLs for private images

3. **Search Functionality**
   - Full-text search on title/description
   - Tag-based filtering
   - Category filtering

4. **Analytics**
   - Track view counts
   - Popular treasures
   - User favorites

5. **Admin Features**
   - CRUD operations for treasures
   - Bulk upload
   - Image optimization

## Next Steps

1. ✅ Design database schema
2. ⬜ Create Supabase table using MCP
3. ⬜ Update TypeScript interfaces
4. ⬜ Implement data fetching functions
5. ⬜ Update TimeMachine component
6. ⬜ Update ImageDetailPopover component
7. ⬜ Migrate existing data
8. ⬜ Test integration
9. ⬜ Add error handling and loading states
10. ⬜ Implement caching strategy
