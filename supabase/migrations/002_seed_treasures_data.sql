-- Seed treasures table with initial data
INSERT INTO treasures (title, description, prompt, main_image_url, additional_images, tags, category, is_featured) VALUES
(
  'Mountain Sunset',
  'A stunning sunset over mountain peaks with golden hour lighting illuminating the landscape',
  'sunset over mountains, golden hour, dramatic lighting, photorealistic, 8k, cinematic',
  'https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg',
  '["https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200", "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&w=1200"]'::jsonb,
  ARRAY['nature', 'sunset', 'mountains', 'landscape'],
  'landscapes',
  true
),
(
  'Lake Reflection',
  'Serene lake reflection capturing the beauty of nature in perfect symmetry',
  'serene lake reflection, mirror-like water, nature photography, peaceful, symmetrical composition',
  'https://cdn.cosmos.so/c4588488-0021-4804-9c29-a43059378bfe?format=jpeg',
  '["https://cdn.cosmos.so/c4588488-0021-4804-9c29-a43059378bfe?format=jpeg", "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200", "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200", "https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg?auto=compress&w=1200"]'::jsonb,
  ARRAY['nature', 'lake', 'reflection', 'water'],
  'landscapes',
  false
),
(
  'Autumn Forest',
  'Vibrant autumn forest with colorful foliage creating a natural tapestry',
  'autumn forest, colorful foliage, fall colors, natural tapestry, vibrant leaves, woodland',
  'https://cdn.cosmos.so/de8c561b-e4e4-48f3-9068-30d63b92c43e?format=jpeg',
  '["https://cdn.cosmos.so/de8c561b-e4e4-48f3-9068-30d63b92c43e?format=jpeg", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200", "https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&w=1200"]'::jsonb,
  ARRAY['nature', 'autumn', 'forest', 'fall'],
  'landscapes',
  false
),
(
  'Waterfall Vista',
  'Majestic waterfall cascading down rocky cliffs surrounded by lush greenery',
  'majestic waterfall, rocky cliffs, lush greenery, nature photography, cascading water, tropical',
  'https://cdn.cosmos.so/207b3ba7-13ef-496b-a9cb-2a718e14a24e?format=jpeg',
  '["https://cdn.cosmos.so/207b3ba7-13ef-496b-a9cb-2a718e14a24e?format=jpeg", "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200", "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1200", "https://images.pexels.com/photos/2743287/pexels-photo-2743287.jpeg?auto=compress&w=1200"]'::jsonb,
  ARRAY['nature', 'waterfall', 'landscape', 'water'],
  'landscapes',
  true
),
(
  'Beach Paradise',
  'Peaceful beach scene with crystal clear waters and pristine white sand',
  'peaceful beach, crystal clear water, white sand, tropical paradise, turquoise ocean, serene',
  'https://cdn.cosmos.so/6c41e632-d300-4516-a7af-9a1f7c0aef94?format=jpeg',
  '["https://cdn.cosmos.so/6c41e632-d300-4516-a7af-9a1f7c0aef94?format=jpeg", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200", "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&w=1200"]'::jsonb,
  ARRAY['nature', 'beach', 'ocean', 'tropical'],
  'landscapes',
  false
),
(
  'Alpine Heights',
  'Dramatic mountain range with snow-capped peaks reaching into the clouds',
  'dramatic mountain range, snow-capped peaks, alpine landscape, majestic mountains, cloudy sky',
  'https://cdn.cosmos.so/e552eaac-8251-4890-b954-e988fc4bf2e0?format=jpeg',
  '["https://cdn.cosmos.so/e552eaac-8251-4890-b954-e988fc4bf2e0?format=jpeg", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&w=1200"]'::jsonb,
  ARRAY['nature', 'mountains', 'alpine', 'snow'],
  'landscapes',
  false
),
(
  'Golden Hour Peaks',
  'A stunning sunset over mountain peaks with golden hour lighting illuminating the landscape',
  'sunset over mountains, golden hour, dramatic lighting, photorealistic, warm tones, epic vista',
  'https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg',
  '["https://cdn.cosmos.so/5689a5cd-92a5-4cb1-b014-263da4f55731?format=jpeg", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1200", "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&w=1200"]'::jsonb,
  ARRAY['nature', 'sunset', 'mountains', 'golden hour'],
  'landscapes',
  false
);

-- Verify the data was inserted
SELECT COUNT(*) as total_treasures FROM treasures;
