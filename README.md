# Free Sample Ledger — Setup

A small internal tool: one static page (`index.html`) plus one serverless
API route (`api/entries.js`) that reads/writes a Neon Postgres database.
No framework, no build step.

## 1. Database (Neon)

You said you already have a Neon project wired to another Vercel app — you
can either:

- **Reuse that same Neon project** and just add this new table to it, or
- **Create a new (separate) Neon project** for this app, so it's fully
  isolated from the other one.

Either is fine since the table name (`sample_entries`) won't collide with
anything else. To create the table:

1. Open your Neon project → **SQL Editor**
2. Paste the contents of `schema.sql` and run it
3. Copy the **pooled connection string** from Neon's dashboard
   (Dashboard → Connect → make sure "Pooled connection" is selected —
   important for serverless functions). It looks like:
   `postgresql://user:password@ep-xxxx-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require`

## 2. Deploy to Vercel

1. Push this folder to a new GitHub repo (or drag-and-drop deploy via the
   Vercel dashboard / `vercel` CLI)
2. In the Vercel project settings → **Environment Variables**, add:
   - `DATABASE_URL` = the pooled connection string from step 1
3. Deploy. Vercel will automatically detect `api/entries.js` as a
   serverless function and serve `index.html` as the static homepage —
   no config file needed.

## 3. Use it

Visit your deployment URL. Add a sample, refresh the page — it should
still be there, meaning it's reading from Neon rather than local storage.

On her iPhone: open the URL in **Safari** → tap **Share** → **Add to Home
Screen**. It'll behave like an installed app from then on.

## Notes

- The API does simple upserts — each save sends one entry, not the whole
  table, so it stays fast even with hundreds of entries.
- No login/auth is built in. Anyone with the URL can read and write data.
  If that's a concern (e.g. you want to share the link in a public bio),
  say the word and I'll add simple password protection.
- CSV export still works exactly as before — it just runs client-side on
  whatever's currently loaded.
