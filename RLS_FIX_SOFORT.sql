
DROP POLICY IF EXISTS "Customers können eigene Daten sehen" ON customers;
DROP POLICY IF EXISTS "Customers können eigene Daten aktualisieren" ON customers;
DROP POLICY IF EXISTS "Öffentliche Registrierung erlaubt" ON customers;
DROP POLICY IF EXISTS "Admins können alle Kunden verwalten" ON customers;
DROP POLICY IF EXISTS "Service Role kann alle Kunden lesen" ON customers;
DROP POLICY IF EXISTS "Service Role kann Kunden erstellen" ON customers;
DROP POLICY IF EXISTS "Service Role kann Kunden aktualisieren" ON customers;
DROP POLICY IF EXISTS "Service Role kann Kunden löschen" ON customers;

ALTER TABLE customers DISABLE ROW LEVEL SECURITY;


SELECT 
    'RLS Status:' as info,
    tablename, 
    rowsecurity,
    CASE 
        WHEN rowsecurity = false THEN '✅ RLS ist DEAKTIVIERT - Funktioniert!'
        ELSE '❌ RLS ist noch AKTIV - Problem!'
    END as status
FROM pg_tables 
WHERE tablename = 'customers';



