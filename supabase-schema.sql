-- ============================================
-- 1. ADMINS Tabelle (für Dashboard-Login)
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Index für schnelle Login-Abfragen
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_active ON admins(is_active);

-- ============================================
-- 2. CUSTOMERS Tabelle (für Kunden-Login/Tools)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    company_name VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Indizes für Customers
CREATE INDEX IF NOT EXISTS idx_customers_username ON customers(username);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_active ON customers(is_active);

-- ============================================
-- 3. PRODUCTS Tabelle (für Dashboard-Produktverwaltung)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) UNIQUE NOT NULL, -- Eindeutige Produkt-ID (z.B. "machine-vision")
    language VARCHAR(2) NOT NULL CHECK (language IN ('de', 'en')), -- Sprache: 'de' oder 'en'
    
    -- Basis-Informationen
    name VARCHAR(500) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    long_description TEXT,
    
    -- Bilder
    image VARCHAR(500), -- Hauptbild URL
    images JSONB DEFAULT '[]'::jsonb, -- Array von Bild-URLs
    
    -- Features als JSON Array
    features JSONB DEFAULT '[]'::jsonb,
    
    -- Spezifikationen als JSON Object
    specifications JSONB DEFAULT '{}'::jsonb,
    
    -- Anwendungen als JSON Array
    applications JSONB DEFAULT '[]'::jsonb,
    
    -- Downloads als JSON Array von Objekten
    downloads JSONB DEFAULT '[]'::jsonb, -- Format: [{"name": "...", "type": "...", "url": "..."}]
    
    -- Metadaten
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Eindeutiger Constraint für Produkt-ID + Sprache Kombination
    UNIQUE(product_id, language)
);

-- Indizes für Products
CREATE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);
CREATE INDEX IF NOT EXISTS idx_products_language ON products(language);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('german', name));

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- RLS für Admins aktivieren
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy: Admins können nur ihre eigenen Daten sehen (außer Superuser)
CREATE POLICY "Admins können eigene Daten sehen"
    ON admins FOR SELECT
    USING (auth.uid()::text = id::text OR auth.jwt()->>'role' = 'admin');

-- Policy: Nur authentifizierte Admins können neue Admins erstellen
CREATE POLICY "Nur Admins können neue Admins erstellen"
    ON admins FOR INSERT
    WITH CHECK (auth.jwt()->>'role' = 'admin');

-- RLS für Customers aktivieren
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Customers können nur ihre eigenen Daten sehen
CREATE POLICY "Customers können eigene Daten sehen"
    ON customers FOR SELECT
    USING (auth.uid()::text = id::text);

-- Policy: Customers können ihre eigenen Daten aktualisieren
CREATE POLICY "Customers können eigene Daten aktualisieren"
    ON customers FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Policy: Öffentliche Registrierung erlauben (optional)
CREATE POLICY "Öffentliche Registrierung erlaubt"
    ON customers FOR INSERT
    WITH CHECK (true);

-- RLS für Products aktivieren
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann Produkte lesen (öffentlich)
CREATE POLICY "Produkte sind öffentlich lesbar"
    ON products FOR SELECT
    USING (is_active = true);

-- Policy: Nur Admins können Produkte erstellen/aktualisieren/löschen
CREATE POLICY "Nur Admins können Produkte verwalten"
    ON products FOR ALL
    USING (auth.jwt()->>'role' = 'admin')
    WITH CHECK (auth.jwt()->>'role' = 'admin');

-- ============================================
-- 5. Funktionen und Trigger
-- ============================================

-- Funktion für automatisches updated_at Update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für updated_at bei Admins
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger für updated_at bei Customers
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger für updated_at bei Products
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. Initiale Daten einfügen (optional)
-- ============================================

-- Beispiel Admin einfügen (Passwort sollte gehasht werden!)
-- WICHTIG: Ersetze 'hashed_password_here' mit einem bcrypt Hash des Passworts
-- Du kannst bcrypt online generieren oder eine Supabase Edge Function verwenden
INSERT INTO admins (username, password_hash, email)
VALUES ('Guste', '$2a$10$hashed_password_here', 'admin@blau-optoelektronik.de')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- 7. Views für einfachere Abfragen
-- ============================================

-- View für Produkte gruppiert nach Sprache
CREATE OR REPLACE VIEW products_by_language AS
SELECT 
    product_id,
    language,
    name,
    category,
    description,
    image,
    created_at,
    updated_at
FROM products
WHERE is_active = true
ORDER BY product_id, language;

