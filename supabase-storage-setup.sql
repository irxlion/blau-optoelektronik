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

