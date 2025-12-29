-- Tools Spalte hinzufügen
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tools JSONB DEFAULT '[]'::jsonb;

-- Technical Properties HTML Spalte hinzufügen
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS technical_properties_html TEXT;

-- SEO Head HTML Spalte hinzufügen
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS seo_head_html TEXT;

-- Kommentare hinzufügen
COMMENT ON COLUMN products.tools IS 'Array von Tool-IDs (z.B. ["max-power-simulation", "line-thickness-simulation"])';
COMMENT ON COLUMN products.technical_properties_html IS 'HTML-Code für technische Daten Tabellen';
COMMENT ON COLUMN products.seo_head_html IS 'HTML-Code für SEO Meta-Tags im <head> Bereich';

