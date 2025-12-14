# Netlify Deployment Script für Windows PowerShell

Write-Host "🚀 Netlify Deployment Script" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Prüfe ob Netlify CLI installiert ist
try {
    $null = Get-Command netlify -ErrorAction Stop
    Write-Host "✅ Netlify CLI gefunden" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify CLI nicht gefunden!" -ForegroundColor Red
    Write-Host "📦 Installiere Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Prüfe ob eingeloggt
Write-Host ""
Write-Host "🔐 Prüfe Netlify Login..." -ForegroundColor Yellow
try {
    $null = netlify status 2>&1
    Write-Host "✅ Bereits eingeloggt" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Nicht eingeloggt. Bitte einloggen:" -ForegroundColor Yellow
    netlify login
}

# Prüfe ob Site initialisiert ist
if (-not (Test-Path ".netlify/state.json")) {
    Write-Host "📝 Site noch nicht initialisiert. Initialisiere..." -ForegroundColor Yellow
    netlify init
}

# Baue das Projekt
Write-Host ""
Write-Host "🔨 Baue Projekt..." -ForegroundColor Yellow
pnpm install
pnpm build

# Prüfe Build
if (-not (Test-Path "dist/public")) {
    Write-Host "❌ Build fehlgeschlagen! dist/public nicht gefunden." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build erfolgreich!" -ForegroundColor Green
Write-Host ""

# Frage nach Deployment-Typ
$deployType = Read-Host "Production Deployment? (j/n)"
Write-Host ""

if ($deployType -eq "j" -or $deployType -eq "J") {
    Write-Host "🚀 Deploye zu Production..." -ForegroundColor Cyan
    netlify deploy --prod
} else {
    Write-Host "🧪 Deploye zu Preview..." -ForegroundColor Cyan
    netlify deploy
}

Write-Host ""
Write-Host "✅ Deployment abgeschlossen!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Nächste Schritte:" -ForegroundColor Yellow
Write-Host "1. Prüfen Sie die Umgebungsvariablen in Netlify Dashboard"
Write-Host "2. Stellen Sie sicher, dass SUPABASE_SERVICE_ROLE_KEY gesetzt ist"
Write-Host "3. Testen Sie die API-Endpunkte"
Write-Host "4. Prüfen Sie die Function Logs bei Problemen"
