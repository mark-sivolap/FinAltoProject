# StatementFlow

Next.js 14 App Router app with a single screen: drop bank statements, get one
combined transactions CSV back.

## Run

```bash
cd ~/Desktop/website-starter
npm install
npm run dev
```

Copy `.env.example` to `.env.local`, start the Python Azure Functions app on
port 7071, then open http://localhost:3000.

The home screen (`src/components/StatementUploader.tsx`) uploads the selected
statements directly to the Functions API in one request and downloads the CSV
it returns:

1. The browser `POST`s the statements as `multipart/form-data` to
   `${NEXT_PUBLIC_STATEMENT_API_URL}/process-statements`.
2. The Function analyzes each statement with Document Intelligence and
   returns one combined transactions CSV as the response body.
3. The browser saves that CSV as a download.

Set `NEXT_PUBLIC_STATEMENT_API_URL` to the Function API base URL, including
`/api`.

## Functions backend

The Python Azure Functions backend is maintained separately in
`/Users/marksivolap/Desktop/finalto_website/bank-statement-functions`. See that
project's README for local setup, Azure configuration, and deployment
details.
