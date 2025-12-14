# Produkt-Migration Anleitung

## Problem
Die Produktseite zeigt "Keine Produkte in dieser Kategorie gefunden", weil die Produkte noch nicht in die Supabase-Datenbank migriert wurden.

## Lösung

### Option 1: RLS-Policy temporär anpassen (Empfohlen)

1. Öffnen Sie den Supabase SQL Editor
2. Führen Sie das Skript `fix-products-rls.sql` aus
3. Führen Sie das Migrationsskript aus:
   ```bash
   npm run migrate:products
   ```
4. Führen Sie das Skript `fix-products-rls-after-migration.sql` aus, um die RLS-Policy wieder einzuschränken

### Option 2: RLS temporär deaktivieren

1. Öffnen Sie den Supabase SQL Editor
2. Führen Sie aus:
   ```sql
   ALTER TABLE products DISABLE ROW LEVEL SECURITY;
   ```
3. Führen Sie das Migrationsskript aus:
   ```bash
   npm run migrate:products
   ```
4. Aktivieren Sie RLS wieder:
   ```sql
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ```
5. Stellen Sie sicher, dass die RLS-Policies korrekt sind (siehe `fix-products-rls.sql`)

### Option 3: Service Role Key verwenden

Wenn Sie den Service Role Key als Umgebungsvariable setzen, umgeht dieser RLS automatisch:

```bash
# Windows PowerShell
$env:SUPABASE_SERVICE_ROLE_KEY="ihr-service-role-key"
npm run migrate:products

# Oder in .env Datei
SUPABASE_SERVICE_ROLE_KEY=ihr-service-role-key
```

## Nach der Migration

Nach erfolgreicher Migration sollten die Produkte auf der Seite `http://localhost:5174/produkte` sichtbar sein.
