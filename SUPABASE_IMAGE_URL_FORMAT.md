# Supabase Storage Image URL Format Guide

## How to Get Image URLs from Supabase Storage

### Step 1: Upload Images to Supabase Storage

1. Go to your Supabase project dashboard
2. Navigate to Storage → Buckets
3. Create a public bucket (e.g., "treasures")
4. Upload your images

### Step 2: Get the Public URL

After uploading, you'll get a URL in this format:

```
https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/object/public/treasures/image.jpg
```

### Step 3: Use in Database

Copy this URL and paste it into your treasure's `main_image_url` field:

```sql
INSERT INTO treasures (title, description, prompt, main_image_url, ...) VALUES
(
  'Modern Newspaper',
  'Business reports and data-heavy content with clean typography',
  'modern newspaper layout, business report design',
  'https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/object/public/treasures/modern-newspaper.jpg',
  ...
);
```

### Step 4: Automatic Optimization

The image optimizer will automatically transform this URL to:

```
https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/render/image/public/treasures/modern-newspaper.jpg?width=800&height=600&quality=80
```

## URL Structure Breakdown

### Original URL (Direct Access)
```
https://{project_id}.supabase.co/storage/v1/object/public/{bucket}/{path}
```

### Optimized URL (Transformation API)
```
https://{project_id}.supabase.co/storage/v1/render/image/public/{bucket}/{path}?{params}
```

**Key Differences:**
- `/object/` → `/render/image/` (enables transformation)
- Added query parameters for optimization

## Supported URL Formats

The optimizer supports multiple input formats:

### 1. Full Supabase URL
```
https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/object/public/treasures/image.jpg
```

### 2. Bucket/Path Format
```
treasures/image.jpg
```

### 3. Already Optimized URL
```
https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/render/image/public/treasures/image.jpg?width=800
```
(Will preserve existing parameters and add new ones)

## Example Migration with Real URLs

```sql
-- Update migration with Supabase Storage URLs
INSERT INTO treasures (title, description, prompt, main_image_url, additional_images, tags, category, is_featured) VALUES
(
  'Modern Newspaper',
  'Business reports and data-heavy content with clean typography',
  'modern newspaper layout, business report design, data visualization',
  'https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/object/public/treasures/modern-newspaper.jpg',
  '["https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/object/public/treasures/modern-newspaper-1.jpg", "https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/object/public/treasures/modern-newspaper-2.jpg"]'::jsonb,
  ARRAY['business', 'professional', 'data', 'reports'],
  'business',
  true
);
```

## Bucket Configuration

### Make Bucket Public

1. Go to Storage → Buckets
2. Click on your bucket
3. Go to Policies
4. Add policy:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'treasures' );
```

Or use the Supabase dashboard to make the bucket public.

## Testing URLs

### Test Direct Access
```
https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/object/public/treasures/image.jpg
```
Should display the image directly in browser.

### Test Transformation API
```
https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/render/image/public/treasures/image.jpg?width=400&quality=75
```
Should display a smaller, optimized version.

## Common Issues

### Issue: 404 Not Found
**Cause:** Image doesn't exist or bucket is private
**Solution:** 
- Verify image exists in Storage
- Make bucket public
- Check URL spelling

### Issue: Image not optimized
**Cause:** Using `/object/` instead of `/render/image/`
**Solution:** 
- Let the optimizer handle URLs automatically
- Don't manually construct transformation URLs

### Issue: CORS errors
**Cause:** Bucket CORS not configured
**Solution:**
- Supabase Storage has CORS enabled by default
- Check browser console for specific error
- Verify bucket is public

## Best Practices

1. **Organize by category:**
   ```
   treasures/business/modern-newspaper.jpg
   treasures/creative/yellow-black-editorial.jpg
   treasures/tech/neon-tech.jpg
   ```

2. **Use descriptive names:**
   ```
   ✅ modern-newspaper-main.jpg
   ✅ yellow-black-editorial-slide-1.jpg
   ❌ image1.jpg
   ❌ IMG_0001.jpg
   ```

3. **Keep original quality:**
   - Upload high-quality originals (1920x1080 or higher)
   - Let transformation API handle optimization
   - Don't pre-optimize before uploading

4. **Use consistent format:**
   - JPEG for photos
   - PNG for graphics with transparency
   - WebP conversion happens automatically

## Quick Reference

| Action | URL Format |
|--------|-----------|
| Upload to Storage | Use Supabase dashboard |
| Get public URL | Copy from Storage UI |
| Store in database | Use full URL as-is |
| Display in app | Optimizer handles automatically |
| Manual optimization | Use `optimizeSupabaseImage()` |
| Presets | Use `ImagePresets.medium()` etc. |

## Example Workflow

1. Upload `modern-newspaper.jpg` to `treasures` bucket
2. Copy URL: `https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/object/public/treasures/modern-newspaper.jpg`
3. Add to migration:
   ```sql
   main_image_url: 'https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/object/public/treasures/modern-newspaper.jpg'
   ```
4. Run migration
5. App automatically optimizes to:
   ```
   https://qyhtrqobtwmbymviezcs.supabase.co/storage/v1/render/image/public/treasures/modern-newspaper.jpg?width=800&height=600&quality=80
   ```
6. Image loads fast with WebP format!
