-- ============================================
-- Migration: FAQs Spalte zur products Tabelle hinzufügen
-- ============================================

-- FAQs Spalte hinzufügen
ALTER TABLE products
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- Kommentar zur Spalte hinzufügen
COMMENT ON COLUMN products.faqs IS 'Array von FAQs für das Produkt. Format: [{"question": "...", "answer": "..."}]';

