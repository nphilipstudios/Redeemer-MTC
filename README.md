# Redeemer MTC Website

Public-facing website for **Redeemer Mar Thoma Church (RTMC)**, a Christian community based in Waldwick, NJ. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui components.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui + Radix UI |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Email | Nodemailer (Gmail SMTP) |
| Calendar | Google Calendar API v3 |
| Analytics | Google Analytics (GA4 via `NEXT_PUBLIC_GA_ID`) |
| Package Manager | pnpm (lock file present; npm lock file also present) |
| Deployment | Railway (Docker) |

---

## Project Structure

```
rtmc-website/
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, analytics
│   ├── page.tsx                # Home page
│   ├── about/page.tsx
│   ├── calendar/page.tsx
│   ├── contact/page.tsx
│   ├── events/page.tsx
│   ├── ministries/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx     # Dynamic ministry detail pages
│   ├── rock-of-redeemer/page.tsx
│   ├── services/page.tsx
│   └── api/
│       └── google-calendar/
│           ├── route.ts        # GET — fetches events from Google Calendar API
│           └── contact/
│               └── route.ts   # POST — sends contact form email via Gmail SMTP
├── components/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── hero.tsx
│   ├── about.tsx
│   ├── contact.tsx
│   ├── events.tsx
│   ├── events-teaser.tsx
│   ├── quick-links.tsx
│   ├── service-teasers.tsx
│   ├── services.tsx
│   ├── InstagramStoriesSection.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── google-calendar-events.ts   # Client-side hook + event filtering/formatting
│   ├── events-data.ts
│   ├── eventgroup.ts
│   ├── event-window.ts
│   └── utils.ts
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── public/                         # Static assets — logo, ministry images, OG image
├── styles/globals.css
├── next.config.mjs
├── components.json                 # shadcn/ui config
└── tsconfig.json
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, Quick Links, Service Teasers, Events Teaser, Core Values |
| `/about` | About the church |
| `/services` | Regular services (Holy Qurbana, ACTS Worship, Praise & Worship) |
| `/events` | Upcoming events pulled from Google Calendar |
| `/calendar` | Full monthly calendar view |
| `/ministries` | Ministry overview grid |
| `/ministries/[slug]` | Individual ministry detail page |
| `/rock-of-redeemer` | Youth ministry page |
| `/contact` | Contact form + church info |

---

## API Routes

### `GET /api/google-calendar`
Fetches events from Google Calendar for a rolling window (2 months past → 6 months future). Returns normalized event objects. Cached with `no-store` to always reflect live data.

**Environment variables required:**
- `GOOGLE_CALENDAR_ID` — the calendar's address (defaults to a hardcoded import calendar ID if not set)

**Note:** `GOOGLE_CALENDAR_API_KEY` is read exclusively from environment variables.

### `POST /api/google-calendar/contact`
Accepts a JSON body `{ firstName, lastName, email, message }` and sends an email via Gmail SMTP using Nodemailer.

**Environment variables required:**
- `EMAIL_USER` — Gmail address used to send
- `EMAIL_PASS` — Gmail App Password (not the account password)
- `EMAIL_TO` — recipient address (defaults to `EMAIL_USER` if not set)

---

## Environment Variables

Create a `.env.local` file at the project root (never commit this file):

```env
# Google Calendar
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_API_KEY=your-api-key

# Contact form (Gmail SMTP)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_TO=recipient@redeemermtc.org

# Site URL (used for OpenGraph metadata)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Deployment

### Target: Railway
The site is deployed on Railway using Docker (standalone Next.js build).

- **Build:** `Dockerfile` — multi-stage build using `node:22-alpine`; produces a minimal `output: standalone` image
- **Config:** `railway.toml` — points Railway at the Dockerfile, sets healthcheck on `/`, restart policy on failure
- **Start:** `node server-wrapper.js` (see root `server-wrapper.js`)
- **Port:** `3000`

Set all required environment variables (see [Environment Variables](#environment-variables)) in the Railway service dashboard before deploying.

---

## TODO

- [ ] **Determine the Google project used for Google Calendar** — Nick to confirm which GCP project owns the API key and calendar
- [ ] **Rotate the Google Calendar API key** — The previous key was hardcoded in source and committed to git; must be revoked and replaced
- [x] **Create a Railway staging instance** — Deploy from the `staging` branch; used for testing before production
- [ ] **Create a Railway production instance** — Deploy from `main`; serves live traffic
- [x] **Deploy the site onto Railway staging** — First test deployment to validate Railway config, env vars, and build
- [ ] **Require PR approval to merge to `main`** — Dennis Thomas must approve all pull requests before changes reach production (configure via GitHub branch protection rules)

---

## Known Issues / Tech Debt

No outstanding tech debt items.
