# StatementFlow

Next.js 14 App Router app with a single screen: drop bank statements, get one
combined transactions CSV back.

## Prerequisites

- Node.js 18+ and npm
- The `bank-statement-functions` repository cloned separately, with its own
  dependencies installed and the Azure Functions Core Tools (`func`)
  available to run it locally. See that project's README for setup.

## Setup

Clone this repository, then install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and point it at your local
Functions API:

```bash
NEXT_PUBLIC_STATEMENT_API_URL=http://localhost:7071/api
```

If this variable is not set, the app falls back to
`http://localhost:7071/api` automatically, so `.env.local` is only required
if you want to point at a different backend (e.g. a deployed Functions app).

## Run

Start the Functions backend from the `bank-statement-functions` repository
(typically `func start`, listening on port 7071), then in this repository
run:

```bash
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    layout.tsx        Root layout: global styles, PrimeReact theme, <Header />
    page.tsx           The "/" route — loads HomePage client-side only (ssr: false)
    globals.css         Global styles
  components/
    HomePage.tsx        Renders the single screen: just <StatementUploader />
    StatementUploader.tsx  The actual page: drag/drop UI, upload logic,
                            calls the Functions API, triggers the CSV download
    shared/
      Header.tsx        Site header
public/                 Static assets (icons, manifest.json)
data/                   Empty placeholder, not used at runtime
.github/workflows/      Azure Static Web Apps deployment workflow
```

**If you're looking for "the page"**, start at
`src/components/StatementUploader.tsx` — that's where the upload UI, the
call to `${NEXT_PUBLIC_STATEMENT_API_URL}/process-statements`, and the CSV
download all live. `src/app/page.tsx` and `src/components/HomePage.tsx` are
just thin wrappers that route to it (the app only has this one screen).

## How it works

The home screen (`src/components/StatementUploader.tsx`) uploads the
selected statements directly to the Functions API in one request and
downloads the CSV it returns:

1. The browser `POST`s the statements as `multipart/form-data` to
   `${NEXT_PUBLIC_STATEMENT_API_URL}/process-statements`.
2. The Function analyzes each statement with Document Intelligence and
   returns one combined transactions CSV as the response body.
3. The browser saves that CSV as a download.

## Deployment

This app deploys to Azure Static Web Apps via the GitHub Actions workflow in
`.github/workflows/`. The build step reads `NEXT_PUBLIC_STATEMENT_API_URL`
from a GitHub Actions secret of the same name — set it to the deployed
Functions API base URL (including `/api`) in the repository's secrets, not
in a committed file.

## Functions backend

The Python Azure Functions backend that this app calls is maintained
separately in the `bank-statement-functions` repository. See that project's
README for local setup, Azure configuration, and deployment details.
