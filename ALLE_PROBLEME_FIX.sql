-- ============================================
-- 1. KUNDEN-ERSTELLUNG FIX (RLS deaktivieren)
-- ============================================
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

-- Prüfen
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'customers';
-- rowsecurity sollte 'false' sein

-- ============================================
-- 2. STORAGE BUCKET POLICIES FIX
-- ============================================
-- Policies für Storage Bucket "uploads"

-- Löschen bestehender Policies
DROP POLICY IF EXISTS "Public read access for uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Service Role uploads" ON storage.objects;

-- Neue Policies erstellen (Service Role Key umgeht RLS, aber Policies müssen existieren)
CREATE POLICY "Public read access for uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Service Role can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Service Role can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads')
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Service Role can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads');

-- ============================================
-- 3. PRÜFUNGEN
-- ============================================

-- Prüfen ob customers RLS deaktiviert ist
SELECT 'customers RLS Status:' as info, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'customers';

-- Prüfen ob Storage Policies existieren
SELECT 'Storage Policies:' as info, policyname, cmd
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';