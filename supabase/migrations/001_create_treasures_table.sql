-- Create treasures table
CREATE TABLE IF NOT EXISTS treasures (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_treasures_created_at ON treasures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_treasures_category ON treasures(category);
CREATE INDEX IF NOT EXISTS idx_treasures_is_featured ON treasures(is_featured);
CREATE INDEX IF NOT EXISTS idx_treasures_tags ON treasures USING GIN(tags);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_treasures_updated_at
  BEFORE UPDATE ON treasures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE treasures ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON treasures
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON treasures
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON treasures
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON treasures
  FOR DELETE USING (auth.role() = 'authenticated');
