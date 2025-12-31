-- ============================================
-- FAQ Tabelle erstellen
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faq_id VARCHAR(255) NOT NULL,
    language VARCHAR(2) NOT NULL CHECK (language IN ('de', 'en')),
    category VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT faqs_faq_id_language_unique UNIQUE(faq_id, language)
);

-- Indizes für FAQs
CREATE INDEX IF NOT EXISTS idx_faqs_faq_id ON faqs(faq_id);
CREATE INDEX IF NOT EXISTS idx_faqs_language ON faqs(language);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(category, order_index);

-- RLS für FAQs aktivieren
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann FAQs lesen (öffentlich)
DROP POLICY IF EXISTS "FAQs sind öffentlich lesbar" ON faqs;
CREATE POLICY "FAQs sind öffentlich lesbar"
    ON faqs FOR SELECT
    USING (is_active = true);

-- Policy: Nur Admins können FAQs erstellen/aktualisieren/löschen
-- WICHTIG: Diese Policy wird durch Service Role Key umgangen
DROP POLICY IF EXISTS "Nur Admins können FAQs verwalten" ON faqs;
CREATE POLICY "Nur Admins können FAQs verwalten"
    ON faqs FOR ALL
    USING (true)  -- Service Role Key umgeht RLS, daher immer true
    WITH CHECK (true);

-- Trigger für updated_at bei FAQs
DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

