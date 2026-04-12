-- Clear existing treasures data
TRUNCATE TABLE treasures RESTART IDENTITY CASCADE;

-- Insert Business & Professional templates
INSERT INTO treasures (title, description, prompt, main_image_url, additional_images, tags, category, is_featured) VALUES
(
  'Modern Newspaper',
  'Business reports and data-heavy content with clean typography',
  'modern newspaper layout, business report design, data visualization, clean typography, professional',
  '',
  '[]'::jsonb,
  ARRAY['business', 'professional', 'data', 'reports'],
  'business',
  true
),
(
  'Sharp-Edged Minimalism',
  'Portfolio and consulting presentations with premium brand aesthetics',
  'sharp minimalist design, portfolio layout, consulting presentation, premium branding, geometric',
  '',
  '[]'::jsonb,
  ARRAY['business', 'professional', 'portfolio', 'consulting'],
  'business',
  false
),
(
  'Seminar Minimal Text',
  'Academic seminars and conference presentations with minimal text',
  'academic seminar design, conference presentation, minimal text, scholarly, clean layout',
  '',
  '[]'::jsonb,
  ARRAY['business', 'professional', 'academic', 'conference'],
  'business',
  false
),
(
  'Dark Founder Minimal',
  'Startup pitches and VC presentations with dark minimal aesthetic',
  'dark minimal design, startup pitch deck, VC presentation, founder style, sleek',
  '',
  '[]'::jsonb,
  ARRAY['business', 'professional', 'startup', 'pitch'],
  'business',
  true
),
(
  'SaaS Friendly Bold',
  'B2B SaaS, HR tools, and marketplace presentations',
  'saas design, b2b presentation, hr tools, marketplace, bold typography, friendly',
  '',
  '[]'::jsonb,
  ARRAY['business', 'professional', 'saas', 'b2b'],
  'business',
  false
);

-- Insert Creative & Editorial templates
INSERT INTO treasures (title, description, prompt, main_image_url, additional_images, tags, category, is_featured) VALUES
(
  'Yellow × Black Editorial',
  'Fashion and trend reports with bold editorial style',
  'yellow black editorial, fashion design, trend report, bold contrast, magazine style',
  '',
  '[]'::jsonb,
  ARRAY['creative', 'editorial', 'fashion', 'trends'],
  'creative',
  true
),
(
  'Black × Orange Creative Agency',
  'Agency pitches and product launches with creative energy',
  'black orange design, creative agency, product launch, bold colors, dynamic layout',
  '',
  '[]'::jsonb,
  ARRAY['creative', 'editorial', 'agency', 'launch'],
  'creative',
  false
),
(
  'Gallery Serif Editorial',
  'Art galleries and creative studios with elegant typography',
  'gallery editorial, serif typography, art studio, elegant design, cultural',
  '',
  '[]'::jsonb,
  ARRAY['creative', 'editorial', 'art', 'gallery'],
  'creative',
  false
),
(
  'Creative Industry Directory Editorial',
  'Agency rosters and talent directories with editorial flair',
  'creative directory, agency roster, talent showcase, editorial layout, portfolio grid',
  '',
  '[]'::jsonb,
  ARRAY['creative', 'editorial', 'directory', 'talent'],
  'creative',
  false
),
(
  'French Candy Brutalist',
  'Creative agencies and youth brands with brutalist aesthetic',
  'french brutalist, candy colors, youth brand, creative agency, bold experimental',
  '',
  '[]'::jsonb,
  ARRAY['creative', 'editorial', 'brutalist', 'youth'],
  'creative',
  true
);

-- Insert Tech & Developer templates
INSERT INTO treasures (title, description, prompt, main_image_url, additional_images, tags, category, is_featured) VALUES
(
  'Tech Art Neon',
  'AI and tech research with neon aesthetic',
  'tech neon design, ai research, futuristic, glowing elements, cyberpunk',
  '',
  '[]'::jsonb,
  ARRAY['tech', 'developer', 'ai', 'research'],
  'tech',
  true
),
(
  'Anti-Gravity Living Artifact',
  'AI products and agent systems with floating elements',
  'anti-gravity design, living artifact, ai product, agent system, floating ui',
  '',
  '[]'::jsonb,
  ARRAY['tech', 'developer', 'ai', 'product'],
  'tech',
  false
),
(
  'Neo-Retro Dev Deck',
  'Developer tools and coding products with retro-futuristic style',
  'neo retro design, developer tools, coding product, terminal aesthetic, vintage tech',
  '',
  '[]'::jsonb,
  ARRAY['tech', 'developer', 'tools', 'coding'],
  'tech',
  false
),
(
  'Blueprint Technical Manual',
  'Software documentation and engineering guides',
  'blueprint design, technical manual, software documentation, engineering, schematic',
  '',
  '[]'::jsonb,
  ARRAY['tech', 'developer', 'documentation', 'engineering'],
  'tech',
  true
),
(
  'Apple-Adjacent Product Minimal',
  'macOS/iOS apps and indie software with Apple-inspired design',
  'apple minimal design, macos app, ios product, indie software, clean interface',
  '',
  '[]'::jsonb,
  ARRAY['tech', 'developer', 'apple', 'software'],
  'tech',
  false
);

-- Insert Lifestyle & Consumer templates
INSERT INTO treasures (title, description, prompt, main_image_url, additional_images, tags, category, is_featured) VALUES
(
  'Magazine Style',
  'Consumer content and lifestyle brands with magazine layout',
  'magazine layout, consumer content, lifestyle brand, editorial grid, modern publishing',
  '',
  '[]'::jsonb,
  ARRAY['lifestyle', 'consumer', 'magazine', 'content'],
  'lifestyle',
  true
),
(
  'Pink Street-Style',
  'Youth brands, streetwear, and Gen-Z focused designs',
  'pink street style, youth brand, streetwear, gen-z, urban fashion, vibrant',
  '',
  '[]'::jsonb,
  ARRAY['lifestyle', 'consumer', 'streetwear', 'youth'],
  'lifestyle',
  false
),
(
  'Digital Neo Pop',
  'Community platforms and social apps with pop aesthetic',
  'digital neo pop, community platform, social app, vibrant colors, playful',
  '',
  '[]'::jsonb,
  ARRAY['lifestyle', 'consumer', 'social', 'community'],
  'lifestyle',
  false
),
(
  'Mincho × Handwritten Mix',
  'Fashion editorial and cultural content with mixed typography',
  'mincho handwritten, fashion editorial, cultural content, japanese typography, artistic',
  '',
  '[]'::jsonb,
  ARRAY['lifestyle', 'consumer', 'fashion', 'cultural'],
  'lifestyle',
  false
);

-- Insert Specialized templates
INSERT INTO treasures (title, description, prompt, main_image_url, additional_images, tags, category, is_featured) VALUES
(
  'Manga Style',
  'Educational content and storytelling with manga aesthetics',
  'manga style, educational content, storytelling, comic layout, illustrated',
  '',
  '[]'::jsonb,
  ARRAY['specialized', 'education', 'manga', 'storytelling'],
  'specialized',
  true
),
(
  'Deformed Flat Persona',
  'Character-driven and friendly explanations with flat design',
  'deformed flat design, character driven, friendly persona, cute illustration, approachable',
  '',
  '[]'::jsonb,
  ARRAY['specialized', 'character', 'friendly', 'illustration'],
  'specialized',
  false
),
(
  'Royal Blue × Red Watercolor',
  'Artistic presentations with watercolor aesthetics',
  'royal blue red, watercolor design, artistic presentation, painted texture, elegant',
  '',
  '[]'::jsonb,
  ARRAY['specialized', 'artistic', 'watercolor', 'presentation'],
  'specialized',
  false
),
(
  'Classic Pop Sculpture',
  'Bold brand statements with sculpture and vaporwave elements',
  'classic pop, sculpture vaporwave, bold branding, 3d elements, retro futuristic',
  '',
  '[]'::jsonb,
  ARRAY['specialized', 'bold', 'sculpture', 'vaporwave'],
  'specialized',
  false
),
(
  'Studio Mockup Premium',
  'Product launches and SaaS showcases with premium mockups',
  'studio mockup, premium showcase, product launch, saas presentation, professional photography',
  '',
  '[]'::jsonb,
  ARRAY['specialized', 'product', 'mockup', 'premium'],
  'specialized',
  true
),
(
  'Sports Athletic Energy',
  'Sports brands and high-energy pitches with dynamic design',
  'sports athletic, energy design, dynamic layout, bold typography, action oriented',
  '',
  '[]'::jsonb,
  ARRAY['specialized', 'sports', 'athletic', 'energy'],
  'specialized',
  false
),
(
  'Natural Wine Brutalist Editorial',
  'Artisan food, beverage, wine, and craft with brutalist editorial style',
  'natural wine, brutalist editorial, artisan food, craft beverage, organic aesthetic',
  '',
  '[]'::jsonb,
  ARRAY['specialized', 'food', 'wine', 'artisan'],
  'specialized',
  false
);

-- Verify the data was inserted
SELECT 
  category,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE is_featured = true) as featured_count
FROM treasures
GROUP BY category
ORDER BY category;

SELECT COUNT(*) as total_treasures FROM treasures;
