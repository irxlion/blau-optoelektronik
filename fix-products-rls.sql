-- ============================================
-- FIX: Products RLS Policy für öffentlichen Zugriff
-- ============================================
-- Dieses Skript sollte VOR der Migration ausgeführt werden

-- Prüfen ob RLS aktiviert ist
SELECT 'Products RLS Status:' as info, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';

-- Bestehende Policies löschen
DROP POLICY IF EXISTS "Produkte sind öffentlich lesbar" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte verwalten" ON products;
DROP POLICY IF EXISTS "Temporär: INSERT für Migration erlauben" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte erstellen" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte aktualisieren" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte löschen" ON products;

-- Policy: Jeder kann aktive Produkte lesen (öffentlich, ohne Authentifizierung)
CREATE POLICY "Produkte sind öffentlich lesbar"
    ON products FOR SELECT
    USING (is_active = true);

-- Policy: Temporär INSERT ohne Authentifizierung erlauben (für Migration)
-- Nach der Migration sollte diese Policy wieder eingeschränkt werden
CREATE POLICY "Temporär: INSERT für Migration erlauben"
    ON products FOR INSERT
    WITH CHECK (true);

-- Policy: Nur Admins können Produkte aktualisieren
CREATE POLICY "Nur Admins können Produkte aktualisieren"
    ON products FOR UPDATE
    USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter')
    WITH CHECK (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter');

-- Policy: Nur Admins können Produkte löschen
CREATE POLICY "Nur Admins können Produkte löschen"
    ON products FOR DELETE
    USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter');

-- Prüfen ob Policies erstellt wurden
SELECT 'Products Policies:' as info, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'products' AND schemaname = 'public';

-- Prüfen ob Produkte vorhanden sind
SELECT 'Products Count:' as info, COUNT(*) as total_products, 
       COUNT(*) FILTER (WHERE is_active = true) as active_products,
       COUNT(*) FILTER (WHERE language = 'de') as german_products,
       COUNT(*) FILTER (WHERE language = 'en') as english_products
FROM products;
