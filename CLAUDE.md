# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (required first)
pnpm install

# Start dev server (runs on port 3000)
pnpm dev

# Build for production
pnpm build

# Run production server (after build)
pnpm start

# Type-check without emitting
pnpm typecheck

# Lint with ESLint (includes Next.js and TypeScript rules)
pnpm lint
```

## Project Overview

**Redeemer MTC Website** — Public-facing website for Redeemer Mar Thoma Church (RTMC) in Waldwick, NJ.

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + shadcn/ui + Radix UI primitives
- **Package Manager**: pnpm (v11.5.0)
- **Deployment**: Docker + Railway

## High-Level Architecture

### Core Tech Stack

| Layer | Technology |
|---|---|
| UI Components | shadcn/ui (built on Radix UI) + Lucide icons |
| Forms | React Hook Form + Zod validation |
| Animations | Framer Motion |
| Email | Nodemailer (Gmail SMTP) |
| External Data | Google Calendar API v3 |
| Analytics | Google Analytics (GA4, via `<script>` tag + `NEXT_PUBLIC_GA_ID`) |

### Directory Structure

```
app/                       # Next.js App Router
├── page.tsx              # Home page (client component)
├── layout.tsx            # Root layout, fonts, metadata, GA script
├── api/
│   └── google-calendar/
│       ├── route.ts      # GET: fetches Google Calendar events
│       └── contact/route.ts  # POST: sends contact form email
├── about/page.tsx
├── services/page.tsx     # Holy Qurbana, ACTS, Praise & Worship
├── events/page.tsx       # All upcoming events
├── calendar/page.tsx     # Monthly calendar view
├── contact/page.tsx      # Contact form UI
├── rock-of-redeemer/page.tsx  # Youth ministry page
├── ministries/page.tsx   # Ministry grid
└── ministries/[slug]/page.tsx  # Dynamic ministry detail pages

components/
├── header.tsx, footer.tsx
├── hero.tsx, quick-links.tsx, about.tsx
├── services.tsx, events.tsx  # Full page-level components
├── service-teasers.tsx   # Displays upcoming services (home page)
├── events-teaser.tsx     # Displays upcoming events (home page)
├── contact.tsx           # Contact form component
├── InstagramStoriesSection.tsx
├── theme-provider.tsx    # Dark mode setup
└── ui/                   # shadcn/ui components (card, button, form, etc.)

lib/
├── google-calendar-events.ts  # Client hook + event filtering/formatting
├── events-data.ts
├── eventgroup.ts
├── event-window.ts
└── utils.ts

hooks/
├── use-mobile.ts
└── use-toast.ts
```

### Routing

| Route | Type | Description |
|---|---|---|
| `/` | Client | Home with hero, quick links, services, events, core values |
| `/about` | Server | About the church |
| `/services` | Server | Service schedules (Holy Qurbana, ACTS, Praise & Worship) |
| `/events` | Client | All upcoming events (Google Calendar) |
| `/calendar` | Client | Monthly calendar view |
| `/ministries` | Client | Ministry grid |
| `/ministries/[slug]` | Server | Dynamic ministry detail pages |
| `/rock-of-redeemer` | Server | Youth ministry page |
| `/contact` | Client | Contact form + church info |

### API Routes

#### `GET /api/google-calendar`
- Fetches events from Google Calendar API (v3)
- Returns 2 months past → 6 months future
- Expands recurring events with `singleEvents=true`
- Normalizes all-day vs timed event dates
- **Never cached** (`cache: "no-store"`) — always returns live data
- **Env vars**: `GOOGLE_CALENDAR_ID`, `GOOGLE_CALENDAR_API_KEY`

#### `POST /api/google-calendar/contact`
- Sends contact form submissions via Gmail SMTP (Nodemailer)
- Rate limits: 5 submissions per IP per 10 minutes (in-memory)
- Input sanitization: HTML escaping, field length limits, email validation
- **Env vars**: `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`

### Event Filtering & Display Logic

See `lib/google-calendar-events.ts` for the client-side hook and utilities:

- **`useGoogleCalendarEvents()`** — Fetches from `/api/google-calendar`, refetches every 5 minutes
- **Service detection** — Based on **DESCRIPTION keyword matching**: "holy qurbana", "qurbana", "holy communion", "acts worship", "praise & worship"
- **Sunday School detection** — DESCRIPTION contains "sunday school"
- **Service visibility** — Shows upcoming services + up to 6 hours after they end (configurable)
- **Event filtering** — Separates services from general events; filters by date range
- **Title/location normalization** — `prettyTitle()`, `prettyLocation()` for consistent UI display

**Key**: Services are matched by Google Calendar event **DESCRIPTION**, not title. Add keywords like `"holy qurbana"` to the event description to have it appear as a service.

### Environment Variables

Create `.env.local` (never commit):

```env
# Google Calendar API
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_API_KEY=your-api-key

# Contact form email (Gmail SMTP)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_TO=recipient@redeemermtc.org

# Site URL (used for OpenGraph metadata)
NEXT_PUBLIC_SITE_URL=https://redeemermtc.org

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Deployment

**Docker + Railway**

- **Builder**: Multi-stage Dockerfile using `node:22-alpine`
- **Output mode**: `standalone` (Next.js minified server + static assets)
- **Config**: `railway.toml` with healthcheck on `/` and restart policy
- **Start command**: `node server-wrapper.js` (see root `server-wrapper.js`)
- **Port**: 3000
- **Runtime env**: `NODE_ENV=production`, `HOSTNAME=0.0.0.0`


## Styling & Theme

- **Base colors** — Tailwind CSS v4 with `neutral` base color, CSS variables
- **Dark mode** — Configured via `next-themes` in `theme-provider.tsx`
- **Fonts** — DM Sans (body), Playfair Display (serif, headings)
- **shadcn/ui config** — See `components.json` (New York style, RSC enabled, Lucide icons)

