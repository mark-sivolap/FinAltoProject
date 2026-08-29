# Website starter

Next.js 14 App Router skeleton matching the MCore portal layout: thin `page.tsx` routes, feature components, client `actions/` wrappers, and `app/api/` Route Handlers.

## Run

```bash
cd ~/Desktop/website-starter
npm install
npm run dev
```

Open http://localhost:3000. With no `NEXT_PUBLIC_MSAL_CLIENT_ID`, auth is a local developer bypass.

## Microsoft login

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_MSAL_CLIENT_ID`. Implement whitelist logic in `src/app/api/_HelperFunctions/authenticate.ts`.

## Add a feature

1. `src/app/<feature>/page.tsx` — `'use client'` wrapper that renders the component
2. `src/components/<Feature>/Main.tsx` — UI and logic
3. Optional: `src/actions/<name>.ts` + `src/app/api/<name>/route.ts` for a backend call
4. Add the path to `NAV_LINKS` in `src/components/shared/Header.tsx`
