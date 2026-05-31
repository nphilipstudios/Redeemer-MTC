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
| Analytics | Vercel Analytics (`@vercel/analytics`) |
| Package Manager | pnpm (lock file present; npm lock file also present) |
| Deployment | Currently Vercel — migrating to Railway |

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
│   ├── churchtrac-events.ts        # Legacy ChurchTrac hook (wraps Google Calendar API)
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

**Note:** The Google API key is currently hardcoded in the route file. See Security Hardening Recommendations.

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

### Current: Vercel
The site is currently deployed on Vercel. Vercel-specific dependencies include:
- `@vercel/analytics` — used in `app/layout.tsx`
- `metadataBase` URL is hardcoded to `https://redeemer-mtc.vercel.app` in `app/layout.tsx`

### Target: Railway
See Railway Migration Notes below.

---

## Railway Migration Notes

The following Vercel-specific items need to be addressed before deploying to Railway:

1. **`@vercel/analytics`** — Must be replaced or removed. Options:
   - Remove entirely (Google Analytics via `<Script>` tags is already in place)
   - Replace with [Plausible](https://plausible.io) (privacy-friendly, self-hostable)
   - Replace with [PostHog](https://posthog.com) (open source, self-hostable)

2. **`metadataBase`** — Hardcoded to `https://redeemer-mtc.vercel.app` in `app/layout.tsx`. Should be updated to use `process.env.NEXT_PUBLIC_SITE_URL`.

3. **`output: 'standalone'`** — Railway runs Node.js servers in containers. Adding `output: 'standalone'` to `next.config.mjs` creates a self-contained server bundle ideal for containerized deployments.

4. **`images.unoptimized: true`** — Currently set, which disables Next.js built-in image optimization. On Railway, Next.js image optimization works natively so this can be removed to re-enable optimized images.

5. **Start command** — Configure the Railway service to run `pnpm start` (which executes `next start`).

---

## Known Issues / Tech Debt

- `typescript: { ignoreBuildErrors: true }` is set in `next.config.mjs` — TypeScript build errors are silently suppressed
- Two event utility files exist (`lib/google-calendar-events.ts` and `lib/churchtrac-events.ts`) with overlapping logic; `churchtrac-events.ts` is a legacy wrapper that can likely be consolidated
- Both `pnpm-lock.yaml` and `package-lock.json` are present — the project should standardize on one package manager (pnpm)
- `app/globals.css` and `styles/globals.css` both exist — only `app/globals.css` is imported; `styles/globals.css` appears to be a duplicate
