-- ============================================
-- FIX: Produkte werden nicht angezeigt
-- ============================================
-- Dieses Skript stellt sicher, dass Produkte öffentlich lesbar sind

-- Schritt 1: Prüfen des aktuellen Status
SELECT 
    'Aktueller RLS Status:' as info,
    tablename, 
    rowsecurity
FROM pg_tables 
WHERE tablename = 'products';

-- Schritt 2: Alle bestehenden Policies löschen
DROP POLICY IF EXISTS "Produkte sind öffentlich lesbar" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte verwalten" ON products;
DROP POLICY IF EXISTS "Temporär: INSERT für Migration erlauben" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte erstellen" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte aktualisieren" ON products;
DROP POLICY IF EXISTS "Nur Admins können Produkte löschen" ON products;

-- Schritt 3: RLS aktivieren (falls deaktiviert)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Schritt 4: Öffentliche Lese-Policy erstellen (WICHTIG!)
-- Diese Policy erlaubt JEDEM (auch ohne Authentifizierung) aktive Produkte zu lesen
CREATE POLICY "Produkte sind öffentlich lesbar"
    ON products FOR SELECT
    USING (is_active = true);

-- Schritt 5: Admin-Policies für Schreibzugriff
CREATE POLICY "Nur Admins können Produkte erstellen"
    ON products FOR INSERT
    WITH CHECK (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter');

CREATE POLICY "Nur Admins können Produkte aktualisieren"
    ON products FOR UPDATE
    USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter')
    WITH CHECK (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter');

CREATE POLICY "Nur Admins können Produkte löschen"
    ON products FOR DELETE
    USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter');

-- Schritt 6: Prüfen ob Policies korrekt erstellt wurden
SELECT 
    'Erstellte Policies:' as info,
    policyname, 
    cmd,
    CASE 
        WHEN cmd = 'SELECT' AND qual = '(is_active = true)' THEN '✅ Öffentliche Lese-Policy korrekt'
        WHEN cmd IN ('INSERT', 'UPDATE', 'DELETE') THEN '✅ Admin-Policy korrekt'
        ELSE '⚠️ Policy prüfen'
    END as status
FROM pg_policies
WHERE tablename = 'products' AND schemaname = 'public';

-- Schritt 7: Prüfen ob Produkte vorhanden sind
SELECT 
    'Produkt-Status:' as info,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE is_active = true) as active,
    COUNT(*) FILTER (WHERE language = 'de') as german,
    COUNT(*) FILTER (WHERE language = 'en') as english
FROM products;

-- Schritt 8: Test-Abfrage (sollte alle aktiven Produkte zurückgeben)
SELECT 
    'Test-Abfrage (sollte Produkte zurückgeben):' as info,
    product_id,
    language,
    name,
    is_active
FROM products
WHERE is_active = true
LIMIT 5;
