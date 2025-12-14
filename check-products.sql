-- ============================================
-- DIAGNOSE-SKRIPT: Produkte und RLS prüfen
-- ============================================
-- Dieses Skript hilft bei der Diagnose, warum keine Produkte angezeigt werden

-- 1. Prüfen ob RLS aktiviert ist
SELECT 
    'RLS Status:' as info,
    tablename, 
    rowsecurity,
    CASE 
        WHEN rowsecurity = true THEN '⚠️ RLS ist AKTIV - Policies müssen korrekt sein'
        ELSE '✅ RLS ist DEAKTIVIERT - Service Role Key kann zugreifen'
    END as status
FROM pg_tables 
WHERE tablename = 'products';

-- 2. Prüfen welche RLS-Policies existieren
SELECT 
    'RLS Policies:' as info,
    policyname, 
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'products' AND schemaname = 'public';

-- 3. Prüfen ob Produkte in der Datenbank sind
SELECT 
    'Produkte in DB:' as info,
    COUNT(*) as total_products,
    COUNT(*) FILTER (WHERE is_active = true) as active_products,
    COUNT(*) FILTER (WHERE is_active = false) as inactive_products,
    COUNT(*) FILTER (WHERE language = 'de') as german_products,
    COUNT(*) FILTER (WHERE language = 'en') as english_products
FROM products;

-- 4. Zeige alle aktiven Produkte
SELECT 
    'Aktive Produkte:' as info,
    product_id,
    language,
    name,
    category,
    is_active,
    created_at
FROM products
WHERE is_active = true
ORDER BY product_id, language;

-- 5. Test: Versuche Produkte mit ANON_KEY zu lesen (simuliert öffentlichen Zugriff)
-- Hinweis: Dies funktioniert nur, wenn RLS-Policy "Produkte sind öffentlich lesbar" existiert
-- und RLS aktiviert ist. Wenn Service Role Key verwendet wird, wird RLS umgangen.

-- 6. Prüfe ob Service Role Key in Umgebungsvariablen gesetzt ist
-- (Dies kann nur in der Netlify-Konfiguration überprüft werden)
