-- ============================================
-- CAREERS/JOBS Tabelle (für Karriere-Stellenausschreibungen)
-- ============================================
CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id VARCHAR(255) UNIQUE NOT NULL, -- Eindeutige Job-ID (z.B. "software-engineer")
    language VARCHAR(2) NOT NULL CHECK (language IN ('de', 'en')), -- Sprache: 'de' oder 'en'
    
    -- Basis-Informationen
    title VARCHAR(500) NOT NULL, -- Stellenbezeichnung
    department VARCHAR(255), -- Abteilung
    location VARCHAR(255), -- Standort
    employment_type VARCHAR(100), -- Vollzeit, Teilzeit, etc.
    
    -- Beschreibungen
    short_description TEXT, -- Kurzbeschreibung
    description TEXT NOT NULL, -- Vollständige Stellenbeschreibung
    requirements TEXT, -- Anforderungen (als Text oder JSON)
    benefits TEXT, -- Vorteile/Benefits (als Text oder JSON)
    
    -- Zusätzliche Felder
    salary_range VARCHAR(255), -- Gehaltsangabe (optional)
    application_email VARCHAR(255), -- E-Mail für Bewerbungen
    application_url VARCHAR(500), -- URL für Bewerbungen (optional)
    
    -- Metadaten
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE, -- Veröffentlichungsdatum
    is_active BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE, -- Nur veröffentlichte Stellen werden angezeigt
    
    -- Eindeutiger Constraint für Job-ID + Sprache Kombination
    UNIQUE(job_id, language)
);

-- Indizes für Careers
CREATE INDEX IF NOT EXISTS idx_careers_job_id ON careers(job_id);
CREATE INDEX IF NOT EXISTS idx_careers_language ON careers(language);
CREATE INDEX IF NOT EXISTS idx_careers_active ON careers(is_active);
CREATE INDEX IF NOT EXISTS idx_careers_published ON careers(is_published);
CREATE INDEX IF NOT EXISTS idx_careers_published_at ON careers(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_careers_department ON careers(department);
CREATE INDEX IF NOT EXISTS idx_careers_title ON careers USING gin(to_tsvector('german', title));

-- ============================================
-- ROW LEVEL SECURITY (RLS) für Careers
-- ============================================

-- RLS für Careers aktivieren
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann veröffentlichte und aktive Stellen lesen (öffentlich)
CREATE POLICY "Karriere-Stellen sind öffentlich lesbar"
    ON careers FOR SELECT
    USING (is_active = true AND is_published = true);

-- Policy: Nur Admins können Stellen erstellen/aktualisieren/löschen
CREATE POLICY "Nur Admins können Karriere-Stellen verwalten"
    ON careers FOR ALL
    USING (auth.jwt()->>'role' = 'admin')
    WITH CHECK (auth.jwt()->>'role' = 'admin');

-- ============================================
-- Trigger für updated_at bei Careers
-- ============================================
CREATE TRIGGER update_careers_updated_at
    BEFORE UPDATE ON careers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

