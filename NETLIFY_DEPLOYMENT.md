# Netlify Deployment Anleitung

Diese Anleitung erklärt, wie Sie die Anwendung auf Netlify hochladen.

## Voraussetzungen

1. Netlify-Account (kostenlos auf [netlify.com](https://netlify.com))
2. Git-Repository (GitHub, GitLab oder Bitbucket)
3. Supabase Service Role Key (für die Netlify Functions)

## Schritt 1: Repository auf GitHub/GitLab/Bitbucket hochladen

```bash
# Falls noch nicht geschehen, Repository initialisieren
git init
git add .
git commit -m "Initial commit"

# Repository zu GitHub/GitLab/Bitbucket hinzufügen
git remote add origin <IHR_REPOSITORY_URL>
git push -u origin main
```

## Schritt 2: Netlify Site erstellen

### Option A: Über Netlify Dashboard

1. Gehen Sie zu [app.netlify.com](https://app.netlify.com)
2. Klicken Sie auf "Add new site" → "Import an existing project"
3. Wählen Sie Ihr Git-Provider (GitHub/GitLab/Bitbucket)
4. Wählen Sie Ihr Repository aus
5. Netlify erkennt automatisch die `netlify.toml` Konfiguration

### Option B: Über Netlify CLI

```bash
# Netlify CLI installieren (falls noch nicht installiert)
npm install -g netlify-cli

# Einloggen
netlify login

# Site initialisieren
netlify init

# Site deployen
netlify deploy --prod
```

## Schritt 3: Umgebungsvariablen setzen

**WICHTIG**: Die Supabase Service Role Key muss als Umgebungsvariable gesetzt werden!

### Im Netlify Dashboard:

1. Gehen Sie zu Ihrer Site → "Site settings" → "Environment variables"
2. Fügen Sie folgende Umgebungsvariablen hinzu:

```
SUPABASE_URL = https://xtuwjizliuthdgytloju.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dXdqaXpsaXV0aGRneXRsb2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIwMjAsImV4cCI6MjA4MDE4ODAyMH0.U5iQhb_rDZedHFfAMl2tA85jn_kvAp2G6m35CyS0do4
SUPABASE_SERVICE_ROLE_KEY = <IHR_SERVICE_ROLE_KEY>
```

**Wo finde ich den Service Role Key?**
- Gehen Sie zu Ihrem Supabase Dashboard
- Settings → API
- Kopieren Sie den "service_role" Key (NICHT den "anon" Key!)

### Über Netlify CLI:

```bash
netlify env:set SUPABASE_URL "https://xtuwjizliuthdgytloju.supabase.co"
netlify env:set SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dXdqaXpsaXV0aGRneXRsb2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIwMjAsImV4cCI6MjA4MDE4ODAyMH0.U5iQhb_rDZedHFfAMl2tA85jn_kvAp2G6m35CyS0do4"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "<IHR_SERVICE_ROLE_KEY>"
```

## Schritt 4: Build-Einstellungen prüfen

Die Build-Einstellungen sind bereits in `netlify.toml` konfiguriert:

- **Build command**: `pnpm vite build`
- **Publish directory**: `dist/public`
- **Functions directory**: `netlify/functions`

Netlify sollte diese automatisch erkennen.

## Schritt 5: Deployment auslösen

### Automatisch (bei Git Push):

Nach dem ersten Setup wird automatisch bei jedem Push zum `main` Branch deployed.

### Manuell:

```bash
# Production Deployment
netlify deploy --prod

# Preview Deployment (für Tests)
netlify deploy
```

## Schritt 6: Funktionen testen

Nach dem Deployment sollten Sie:

1. Die Hauptseite öffnen: `https://ihre-site.netlify.app`
2. Die Produktseite testen: `https://ihre-site.netlify.app/produkte`
3. Die API testen: `https://ihre-site.netlify.app/api/products`

## Wichtige Hinweise

### RLS (Row Level Security) in Supabase

Stellen Sie sicher, dass die RLS-Policies für die `products` Tabelle korrekt konfiguriert sind:

```sql
-- Öffentliche Lese-Policy (wichtig!)
CREATE POLICY "Produkte sind öffentlich lesbar"
    ON products FOR SELECT
    USING (is_active = true);
```

Führen Sie `fix-products-display.sql` in Supabase aus, falls die Produkte nicht angezeigt werden.

### Service Role Key Sicherheit

⚠️ **NIEMALS** den Service Role Key in Git committen!
- Der Service Role Key umgeht RLS und hat vollen Datenbankzugriff
- Verwenden Sie immer Umgebungsvariablen in Netlify

### Funktionen Debugging

Falls die Netlify Functions nicht funktionieren:

1. Prüfen Sie die Netlify Function Logs im Dashboard
2. Stellen Sie sicher, dass `SUPABASE_SERVICE_ROLE_KEY` gesetzt ist
3. Prüfen Sie die Supabase RLS-Policies

## Troubleshooting

### Problem: Produkte werden nicht angezeigt

**Lösung:**
1. Prüfen Sie die Browser-Konsole auf Fehler
2. Prüfen Sie die Netlify Function Logs
3. Führen Sie `check-products.sql` in Supabase aus
4. Stellen Sie sicher, dass RLS-Policies korrekt sind

### Problem: API gibt HTML statt JSON zurück

**Lösung:**
- Die Redirects in `netlify.toml` sollten korrekt sein
- Prüfen Sie, ob die Functions korrekt gebaut wurden

### Problem: Build schlägt fehl

**Lösung:**
```bash
# Lokal testen
pnpm install
pnpm build

# Falls Fehler auftreten, prüfen Sie:
pnpm check  # TypeScript Fehler
```

## Nützliche Netlify CLI Befehle

```bash
# Site Status prüfen
netlify status

# Logs anzeigen
netlify logs

# Funktionen lokal testen
netlify dev

# Umgebungsvariablen anzeigen
netlify env:list
```

## Support

Bei Problemen:
1. Prüfen Sie die Netlify Build Logs
2. Prüfen Sie die Function Logs
3. Prüfen Sie die Browser-Konsole
4. Prüfen Sie die Supabase Logs
