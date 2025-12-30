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



### 1. Entwicklungsserver starten


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
├── shared/                # Geteilte Konstanten
├── patches/               # pnpm Patches
└── supabase-schema.sql    # Datenbankschema
```

## Features

- **Produktkatalog**: Vollständige Präsentation der Optoelektronik-Produkte
- **Karriereseiten**: Stellenausschreibungen und Bewerbungsformular
- **Mehrsprachigkeit**: Deutsch und Englisch
- **Responsive Design**: Optimiert für alle Geräte


Entwickelt von **Ali**
