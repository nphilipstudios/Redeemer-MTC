# AGENTS.md

Guidance for coding agents working in this repository.

## Project Overview

Redeemer MTC Website is a public-facing site for Redeemer Mar Thoma Church in Waldwick, NJ.

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS v4, shadcn/ui, Radix UI primitives
- Package manager: pnpm
- Deployment: Docker on Railway

## Development Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm typecheck
pnpm lint
pnpm test
```

Use `pnpm` for dependency and script commands. The development server runs on port 3000 by default.

## Repository Structure

- `app/` contains Next.js App Router pages, layout, and API routes.
- `components/` contains page-level components and shared UI.
- `components/ui/` contains shadcn/ui components.
- `lib/` contains calendar/event utilities and shared helpers.
- `hooks/` contains shared React hooks.
- `public/` contains static assets.
- `Dockerfile`, `railway.toml`, and `server-wrapper.js` support Railway deployment.

## App Routes

- `/` home page
- `/about`
- `/services`
- `/events`
- `/calendar`
- `/ministries`
- `/ministries/[slug]`
- `/rock-of-redeemer`
- `/contact`

## API Routes

### `GET /api/calendar`

Fetches ChurchTrac iCal events for a rolling window from two months in the past through six months in the future. It expands recurring events, normalizes all-day and timed event dates, and is intentionally uncached so it reflects live calendar data.

Optional environment variable:

- `CALENDAR_ICAL_URL` — overrides the default Redeemer MTC ChurchTrac feed URL

`GET /api/google-calendar` remains a compatibility alias.

### `POST /api/google-calendar/contact`

Sends contact form submissions via Gmail SMTP using Nodemailer.

Required environment variables:

- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_TO`

## Event Display Rules

Calendar display logic lives in `lib/calendar-events.ts`.

- Services are detected from event descriptions, falling back to titles only when descriptions are empty.
- Service keywords include `holy qurbana`, `qurbana`, `holy communion`, `acts worship`, and `praise & worship`.
- Sunday School uses the same description/title fallback and matches `sunday school`.
- Service visibility includes upcoming services plus a short window after they end.
- Use the existing title/location normalization helpers instead of duplicating display logic.
- Parse date-only event strings with `parseCalendarDate` to keep all-day events on their local calendar day.
- Server-side iCal parsing and recurrence expansion live in `lib/ical-events.ts`.

## Styling Guidelines

- Follow the existing shadcn/ui and Radix component patterns.
- Use `lucide-react` icons where an icon is needed.
- Keep page and component styles consistent with the existing Tailwind CSS v4 setup in `app/globals.css`.
- Prefer existing UI primitives in `components/ui/` before introducing new component libraries.

## Environment

Create `.env.local` locally when needed. Do not commit secrets.

```env
CALENDAR_ICAL_URL=https://www.churchtrac.com/ical?ui=E6511E07
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_TO=recipient@redeemermtc.org
NEXT_PUBLIC_SITE_URL=https://redeemermtc.org
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Deployment Notes

- Railway builds from the Dockerfile.
- Next.js is configured for `output: "standalone"`.
- Production startup uses `node server-wrapper.js`.
- Runtime port is 3000 and hostname should bind to `0.0.0.0`.

## Working Conventions

- Keep changes scoped to the requested behavior.
- Run `pnpm typecheck` and `pnpm lint` when practical after TypeScript or UI changes.
- Run `pnpm build` for deployment-impacting changes.
- Do not commit `.env.local` or secrets.
- Preserve existing user changes in the worktree.
