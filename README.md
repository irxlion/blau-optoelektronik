# Blau Optoelektronik

Eine moderne Webanwendung für Blau Optoelektronik, entwickelt mit React, Vite und Netlify Functions. Die Anwendung bietet eine vollständige Produktpräsentation, einen E-Commerce-Shop, Karriereseiten und ein Admin-Dashboard für die Verwaltung von Produkten, Kunden und Bestellungen.

## Tech-Stack

Ich habe diese Anwendung mit folgenden Technologien entwickelt:

- **Frontend**: React 18 mit TypeScript
- **Build-Tool**: Vite 7
- **Styling**: Tailwind CSS 4 mit Radix UI Komponenten
- **Routing**: Wouter
- **State Management**: React Query (TanStack Query)
- **Backend**: Netlify Functions (Serverless)
- **Datenbank**: Supabase (PostgreSQL)
- **Deployment**: Netlify

## Voraussetzungen

- Node.js 20 oder höher
- pnpm (Package Manager)
- Ein Supabase-Projekt mit konfigurierter Datenbank

## Lokales Setup

### 1. Repository klonen

```bash
git clone <repository-url>
cd blau-optoelektronik
```

### 2. Dependencies installieren

```bash
pnpm install
```

### 3. Umgebungsvariablen konfigurieren

Erstelle eine `.env` Datei im Root-Verzeichnis mit folgenden Variablen:

```env
SUPABASE_URL=deine_supabase_url
SUPABASE_ANON_KEY=dein_anon_key
SUPABASE_SERVICE_ROLE_KEY=dein_service_role_key
```

**Wichtig**: Die `SUPABASE_SERVICE_ROLE_KEY` sollte niemals im Code committet werden und nur in Netlify als Umgebungsvariable gesetzt werden.

### 4. Entwicklungsserver starten

```bash
pnpm dev
```

Dies startet Netlify Dev im Offline-Modus. Die Anwendung ist dann unter `http://localhost:8888` erreichbar.

Alternativ:
- `pnpm dev:online` - Startet Netlify Dev mit Online-Verbindung
- `pnpm dev:client` - Startet nur den Vite Dev-Server (ohne Netlify Functions)

## Verfügbare Scripts

- `pnpm dev` - Startet den Entwicklungsserver (Netlify Dev offline)
- `pnpm dev:online` - Startet Netlify Dev mit Online-Verbindung
- `pnpm dev:client` - Startet nur den Vite Dev-Server
- `pnpm build` - Erstellt einen Production-Build
- `pnpm preview` - Zeigt den Production-Build lokal an
- `pnpm check` - Führt TypeScript-Typenprüfung durch
- `pnpm test` - Startet Vitest im Watch-Modus
- `pnpm test:run` - Führt Tests einmalig aus
- `pnpm format` - Formatiert Code mit Prettier
- `pnpm migrate:products` - Migriert Produkte von `server/products.json` nach Supabase
- `pnpm create:admin` - Erstellt einen neuen Admin-Benutzer

## Projektstruktur

```
blau-optoelektronik/
├── client/                 # Frontend-Anwendung
│   ├── src/
│   │   ├── components/    # React-Komponenten
│   │   ├── pages/         # Seiten-Komponenten
│   │   ├── contexts/      # React Contexts (Theme, Language, Cart)
│   │   ├── hooks/         # Custom React Hooks
│   │   ├── lib/           # Utility-Funktionen und API-Clients
│   │   └── types/         # TypeScript-Typdefinitionen
│   └── public/            # Statische Assets
├── netlify/
│   └── functions/         # Netlify Serverless Functions
├── server/                # Server-seitige Dateien
│   └── products.json      # Produktdaten für Migration
├── shared/                # Geteilte Konstanten
├── patches/               # pnpm Patches
└── supabase-schema.sql    # Datenbankschema
```

## Datenbank-Setup

Die Datenbank-Schemas befinden sich in:
- `supabase-schema.sql` - Hauptschema
- `supabase-storage-setup.sql` - Storage-Konfiguration
- `create-careers-table.sql` - Karriere-Tabelle

Weitere Setup-Anweisungen für Storage-Buckets findest du in `STORAGE_BUCKET_SETUP.md`.

## Deployment

Das Projekt ist für das Deployment auf Netlify konfiguriert:

1. Verbinde dein Repository mit Netlify
2. Setze die Umgebungsvariablen im Netlify Dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Netlify erkennt automatisch die Build-Konfiguration aus `netlify.toml`

Alternativ kannst du die Deployment-Skripte verwenden:
- `deploy.sh` (Linux/Mac)
- `deploy.ps1` (Windows PowerShell)
- `setup-netlify.ps1` (Windows Setup-Skript)

## Features

- **Produktkatalog**: Vollständige Präsentation der Optoelektronik-Produkte
- **E-Commerce-Shop**: Warenkorb, Checkout und Bestellabwicklung
- **Admin-Dashboard**: Verwaltung von Produkten, Kunden und Bestellungen
- **Karriereseiten**: Stellenausschreibungen und Bewerbungsformular
- **Mehrsprachigkeit**: Deutsch und Englisch
- **Responsive Design**: Optimiert für alle Geräte
- **Dark Mode**: Unterstützung für dunkles Theme

## Lizenz

MIT

---

Entwickelt von **Ali**
