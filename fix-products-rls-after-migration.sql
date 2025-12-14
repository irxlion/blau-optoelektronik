-- ============================================
-- FIX: Products RLS Policy nach Migration einschränken
-- ============================================
-- Dieses Skript sollte NACH der Migration ausgeführt werden,
-- um die INSERT-Policy wieder einzuschränken

-- Temporäre INSERT-Policy löschen
DROP POLICY IF EXISTS "Temporär: INSERT für Migration erlauben" ON products;

-- Sichere INSERT-Policy erstellen (nur für Admins/Mitarbeiter)
CREATE POLICY "Nur Admins können Produkte erstellen"
    ON products FOR INSERT
    WITH CHECK (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'mitarbeiter');

-- Prüfen ob Policies korrekt erstellt wurden
SELECT 'Products Policies nach Migration:' as info, policyname, cmd
FROM pg_policies
WHERE tablename = 'products' AND schemaname = 'public';
