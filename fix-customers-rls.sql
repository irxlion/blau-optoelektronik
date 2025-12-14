DROP POLICY IF EXISTS "Customers können eigene Daten sehen" ON customers;
DROP POLICY IF EXISTS "Customers können eigene Daten aktualisieren" ON customers;
DROP POLICY IF EXISTS "Öffentliche Registrierung erlaubt" ON customers;
DROP POLICY IF EXISTS "Admins können alle Kunden verwalten" ON customers;

CREATE POLICY "Admins können alle Kunden lesen"
    ON customers FOR SELECT
    USING (true);  -- Erlaubt allen Zugriff (da Backend mit Service Role Key arbeitet)

-- Policy: Admins können neue Kunden erstellen
CREATE POLICY "Admins können neue Kunden erstellen"
    ON customers FOR INSERT
    WITH CHECK (true);  -- Erlaubt allen das Erstellen

-- Policy: Admins können Kunden aktualisieren
CREATE POLICY "Admins können Kunden aktualisieren"
    ON customers FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Policy: Admins können Kunden löschen
CREATE POLICY "Admins können Kunden löschen"
    ON customers FOR DELETE
    USING (true);

-- ============================================
-- Prüfen ob RLS aktiviert ist
-- ============================================
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'customers';

-- ============================================
-- Alle Policies für customers anzeigen
-- ============================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'customers';

