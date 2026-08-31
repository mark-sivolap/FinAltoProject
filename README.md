# InvoiceFlow

Next.js 14 App Router skeleton matching the MCore portal layout: thin `page.tsx` routes, feature components, client `actions/` wrappers, and `app/api/` Route Handlers.

## Run

```bash
cd ~/Desktop/website-starter
npm install
npm run dev
```

Copy `.env.example` to `.env.local`, start the Python Azure Functions app on
port 7071, then open http://localhost:3000. With no
`NEXT_PUBLIC_MSAL_CLIENT_ID`, auth is a local developer bypass.

The home screen accepts PDF invoices and uses an asynchronous job flow:

1. `POST /api/jobs` sends file names and sizes and receives temporary upload URLs.
2. The browser uploads each PDF directly to private Azure Blob Storage.
3. `POST /api/jobs/{job_id}/complete` queues Document Intelligence processing.
4. The browser polls `GET /api/jobs/{job_id}` and downloads the combined CSV
   from `GET /api/jobs/{job_id}/download` when it is ready.

Set `NEXT_PUBLIC_INVOICE_API_URL` to the Function API base URL, including
`/api` but excluding `/jobs`.

## Functions backend

The Python Azure Functions backend is maintained separately in
`/Users/marksivolap/Desktop/invoice-functions`. See that project's README for
local setup, Azure configuration, storage permissions, and deployment details.

## Microsoft login

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_MSAL_CLIENT_ID`. Implement whitelist logic in `src/app/api/_HelperFunctions/authenticate.ts`.

## Add a feature

1. `src/app/<feature>/page.tsx` — `'use client'` wrapper that renders the component
2. `src/components/<Feature>/Main.tsx` — UI and logic
3. Optional: `src/actions/<name>.ts` + `src/app/api/<name>/route.ts` for a backend call
4. Add the path to `NAV_LINKS` in `src/components/shared/Header.tsx`
