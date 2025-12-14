# Netlify Setup Script für Windows PowerShell
# Dieses Skript hilft beim ersten Setup oder bei Problemen

Write-Host "🔧 Netlify Setup Script" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

# Prüfe ob Netlify CLI installiert ist
try {
    $null = Get-Command netlify -ErrorAction Stop
    Write-Host "✅ Netlify CLI gefunden" -ForegroundColor Green
} catch {
    Write-Host "❌ Netlify CLI nicht gefunden!" -ForegroundColor Red
    Write-Host "📦 Installiere Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
    Write-Host ""
}

# Logout falls Session abgelaufen
Write-Host "🔐 Prüfe Netlify Login..." -ForegroundColor Yellow
try {
    $status = netlify status 2>&1
    if ($LASTEXITCODE -ne 0 -or $status -match "expired|Error") {
        Write-Host "⚠️  Session abgelaufen oder nicht eingeloggt" -ForegroundColor Yellow
        Write-Host "🚪 Logge aus..." -ForegroundColor Yellow
        netlify logout 2>&1 | Out-Null
    } else {
        Write-Host "✅ Bereits eingeloggt" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Aktueller Status:" -ForegroundColor Cyan
        netlify status
        exit 0
    }
} catch {
    Write-Host "⚠️  Keine aktive Session gefunden" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔑 Bitte einloggen bei Netlify..." -ForegroundColor Yellow
Write-Host "   Ein Browser-Fenster wird geöffnet..." -ForegroundColor Gray
Write-Host ""

# Login
netlify login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Login fehlgeschlagen!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Login erfolgreich!" -ForegroundColor Green
Write-Host ""

# Prüfe ob Site bereits initialisiert ist
if (Test-Path ".netlify/state.json") {
    Write-Host "📋 Site bereits initialisiert" -ForegroundColor Green
    Write-Host ""
    Write-Host "Aktueller Status:" -ForegroundColor Cyan
    netlify status
    Write-Host ""
    Write-Host "💡 Um zu deployen, verwenden Sie:" -ForegroundColor Yellow
    Write-Host "   netlify deploy --prod" -ForegroundColor White
} else {
    Write-Host "📝 Site noch nicht initialisiert" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Möchten Sie:" -ForegroundColor Cyan
    Write-Host "1. Eine neue Site erstellen" -ForegroundColor White
    Write-Host "2. Eine bestehende Site verbinden" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Wählen Sie (1 oder 2)"
    
    if ($choice -eq "1") {
        Write-Host ""
        Write-Host "🚀 Erstelle neue Site..." -ForegroundColor Cyan
        netlify init
    } else {
        Write-Host ""
        Write-Host "🔗 Verbinde mit bestehender Site..." -ForegroundColor Cyan
        Write-Host "   Sie können die Site-ID aus dem Netlify Dashboard kopieren" -ForegroundColor Gray
        netlify init
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Site erfolgreich initialisiert!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Nächste Schritte:" -ForegroundColor Yellow
        Write-Host "1. Setzen Sie Umgebungsvariablen:" -ForegroundColor White
        Write-Host "   netlify env:set SUPABASE_SERVICE_ROLE_KEY 'IHR_KEY'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. Deployen Sie:" -ForegroundColor White
        Write-Host "   netlify deploy --prod" -ForegroundColor Gray
    }
}
