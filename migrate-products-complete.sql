-- ============================================
-- KOMPLETTES MIGRATIONS-SKRIPT
-- ============================================
-- Dieses Skript:
-- 1. Deaktiviert RLS temporär für Migration
-- 2. Aktiviert RLS wieder nach Migration
-- 3. Erstellt die korrekten Policies

-- Schritt 1: RLS temporär deaktivieren
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Schritt 2: Hier sollten Sie jetzt npm run migrate:products ausführen
-- Die Migration kann jetzt durchgeführt werden

-- Schritt 3: RLS wieder aktivieren
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Schritt 4: Bestehende Policies löschen
DROP POLICY IF EXISTS "Produkte sind öffentlich lesbar" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte verwalten" ON products;
DROP POLICY IF EXISTS "Temporär: INSERT für Migration erlauben" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte erstellen" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte aktualisieren" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte löschen" ON products;

-- Schritt 5: Korrekte Policies erstellen

-- Policy: Jeder kann aktive Produkte lesen (öffentlich, ohne Authentifizierung)
CREATE POLICY "Produkte sind öffentlich lesbar"
    ON products FOR SELECT
    USING (is_active = true);

-- Policy: Nur Admins können Produkte erstellen
CREATE POLICY "Nur Admins können Produkte erstellen"
    ON products FOR INSERT
    WITH CHECK (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter');

-- Policy: Nur Admins können Produkte aktualisieren
CREATE POLICY "Nur Admins können Produkte aktualisieren"
    ON products FOR UPDATE
    USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter')
    WITH CHECK (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter');

-- Policy: Nur Admins können Produkte löschen
CREATE POLICY "Nur Admins können Produkte löschen"
    ON products FOR DELETE
    USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter');

-- Prüfung: Policies anzeigen
SELECT 'Products Policies:' as info, policyname, cmd
FROM pg_policies
WHERE tablename = 'products' AND schemaname = 'public';

-- Prüfung: Produkte zählen
SELECT 'Products Count:' as info, COUNT(*) as total_products, 
       COUNT(*) FILTER (WHERE is_active = true) as active_products,
       COUNT(*) FILTER (WHERE language = 'de') as german_products,
       COUNT(*) FILTER (WHERE language = 'en') as english_products
FROM products;
