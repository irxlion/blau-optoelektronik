-- ============================================
-- Supabase Storage Setup für Dashboard-Uploads
-- ============================================
-- Führen Sie dieses SQL im Supabase SQL Editor aus
-- ============================================

-- Storage Bucket erstellen (falls noch nicht vorhanden)
-- Hinweis: Buckets können auch über die Supabase UI erstellt werden

-- Bucket-Policy für öffentlichen Zugriff (nur für Downloads)
-- WICHTIG: Diese Policy ermöglicht öffentlichen Lesezugriff auf Dateien
-- Für Produktion sollten Sie eine restriktivere Policy verwenden

-- Beispiel-Policy für öffentlichen Lesezugriff:
-- CREATE POLICY "Public Access"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'uploads');

-- Für sichere Uploads sollten Sie eine Policy erstellen, die nur authentifizierten Benutzern Uploads erlaubt:
-- CREATE POLICY "Authenticated users can upload"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'uploads' AND
--   auth.role() = 'authenticated'
-- );

-- ============================================
-- Empfohlene Bucket-Konfiguration:
-- ============================================
-- Bucket-Name: uploads
-- Public: Ja (für öffentliche Downloads)
-- File size limit: 10 MB
-- Allowed MIME types: 
--   - image/png
--   - image/jpeg
--   - image/jpg
--   - application/pdf
-- ============================================

-- Hinweis: Die Bucket-Erstellung erfolgt am besten über die Supabase UI:
-- 1. Gehen Sie zu Storage > Buckets
-- 2. Klicken Sie auf "New bucket"
-- 3. Name: "uploads"
-- 4. Public bucket: Aktivieren (für öffentliche Downloads)
-- 5. File size limit: 10485760 (10 MB in Bytes)
-- 6. Klicken Sie auf "Create bucket"

-- ============================================
-- Storage Policies (Row Level Security)
-- ============================================

-- Policy für öffentlichen Lesezugriff auf alle Dateien im uploads-Bucket
CREATE POLICY IF NOT EXISTS "Public read access for uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Policy für authentifizierte Uploads (nur Admins)
-- Hinweis: Diese Policy sollte angepasst werden basierend auf Ihrer Authentifizierungslogik
CREATE POLICY IF NOT EXISTS "Authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'uploads' AND
  auth.role() = 'authenticated'
);

-- Policy für authentifizierte Löschungen (nur Admins)
CREATE POLICY IF NOT EXISTS "Authenticated deletes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'uploads' AND
  auth.role() = 'authenticated'
);

-- ============================================
-- Hinweise zur Sicherheit:
-- ============================================
-- 1. Für Produktion sollten Sie die Policies anpassen, um nur Admins Uploads zu erlauben
-- 2. Erwägen Sie die Verwendung von signed URLs statt öffentlicher URLs für sensible Dateien
-- 3. Implementieren Sie Rate Limiting für Uploads
-- 4. Überwachen Sie Storage-Nutzung und Kosten
-- ============================================

