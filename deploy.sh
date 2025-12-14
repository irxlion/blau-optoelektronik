#!/bin/bash
# Netlify Deployment Script

echo "🚀 Netlify Deployment Script"
echo "============================"
echo ""

# Prüfe ob Netlify CLI installiert ist
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI nicht gefunden!"
    echo "📦 Installiere Netlify CLI..."
    npm install -g netlify-cli
fi

# Prüfe ob eingeloggt
echo "🔐 Prüfe Netlify Login..."
if ! netlify status &> /dev/null; then
    echo "⚠️  Nicht eingeloggt. Bitte einloggen:"
    netlify login
fi

# Prüfe ob Site initialisiert ist
if [ ! -f ".netlify/state.json" ]; then
    echo "📝 Site noch nicht initialisiert. Initialisiere..."
    netlify init
fi

# Baue das Projekt
echo ""
echo "🔨 Baue Projekt..."
pnpm install
pnpm build

# Prüfe Build
if [ ! -d "dist/public" ]; then
    echo "❌ Build fehlgeschlagen! dist/public nicht gefunden."
    exit 1
fi

echo "✅ Build erfolgreich!"
echo ""

# Frage nach Deployment-Typ
read -p "Production Deployment? (j/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Jj]$ ]]; then
    echo "🚀 Deploye zu Production..."
    netlify deploy --prod
else
    echo "🧪 Deploye zu Preview..."
    netlify deploy
fi

echo ""
echo "✅ Deployment abgeschlossen!"
echo ""
echo "📋 Nächste Schritte:"
echo "1. Prüfen Sie die Umgebungsvariablen in Netlify Dashboard"
echo "2. Stellen Sie sicher, dass SUPABASE_SERVICE_ROLE_KEY gesetzt ist"
echo "3. Testen Sie die API-Endpunkte"
echo "4. Prüfen Sie die Function Logs bei Problemen"
