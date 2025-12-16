# Storage Bucket "uploads" Setup

## Wichtig: Storage Bucket manuell erstellen

Der Storage Bucket "uploads" muss **manuell im Supabase Dashboard** erstellt werden, da dies nicht über SQL möglich ist.

### Schritt-für-Schritt Anleitung:

1. **Öffnen Sie das Supabase Dashboard**
   - Gehen Sie zu https://supabase.com/dashboard
   - Wählen Sie Ihr Projekt aus

2. **Navigieren Sie zu Storage**
   - Klicken Sie im linken Menü auf "Storage"
   - Klicken Sie auf "Buckets"

3. **Erstellen Sie einen neuen Bucket**
   - Klicken Sie auf "New bucket"
   - **Name**: `uploads`
   - **Public bucket**: ✅ Aktivieren (für öffentliche Downloads)
   - **File size limit**: `10485760` (10 MB in Bytes)
   - **Allowed MIME types**: (optional, kann leer bleiben)
   - Klicken Sie auf "Create bucket"

4. **Policies sind bereits eingerichtet**
   - Die Storage Policies wurden bereits über die Migration erstellt
   - Sie sollten automatisch funktionieren

### Verifizierung:

Nach der Erstellung des Buckets sollten Uploads funktionieren. Testen Sie es im Dashboard:
- Gehen Sie zu Dashboard > Shop-Produkte
- Versuchen Sie, ein Bild oder PDF hochzuladen

### Fehlerbehebung:

Falls Sie weiterhin den Fehler "Storage Bucket 'uploads' existiert nicht" erhalten:
1. Prüfen Sie, ob der Bucket-Name genau `uploads` ist (kleingeschrieben)
2. Prüfen Sie, ob der Bucket als "Public" markiert ist
3. Prüfen Sie die Storage Policies im Supabase SQL Editor:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'objects' AND schemaname = 'storage';
   ```
