# PeerFusion — Quick start

This repository contains a Next.js client and an Express + TypeScript server with Supabase as the database and file storage solution.

## Quick start (local)

1. Client dependencies

```powershell
cd "C:\Users\JUNAID ASAD KHAN\peerfusion\PeerFusion\client"
npm install
```

2. Server dependencies

```powershell
cd "C:\Users\JUNAID ASAD KHAN\peerfusion\PeerFusion\server"
npm install
```

3. Configure environment for server

- Copy `server/.env.example` to `server/.env` and fill in your Supabase credentials:
  - `SUPABASE_URL`: Your Supabase project URL
  - `SUPABASE_ANON_KEY`: Your Supabase anon/public key
  - `SUPABASE_SERVICE_KEY`: Your Supabase service role key
  - `JWT_SECRET`: A secure random string (minimum 32 characters)
- See **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** for detailed setup instructions

4. Run server (dev)

```powershell
cd "C:\Users\JUNAID ASAD KHAN\peerfusion\PeerFusion\server"
# Start with nodemon (auto restarts on code change)
npm run dev
```

If port 5050 is in use, run with a different port:

```powershell
SET PORT=5051; npm run dev
```

5. Run client (dev)

```powershell
cd "C:\Users\JUNAID ASAD KHAN\peerfusion\PeerFusion\client"
npm run dev
```

Open http://localhost:3000 in your browser.

## Supabase Setup

This project uses **Supabase** for database and file storage. Follow these steps:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Run the database schema**: Copy and run `server/src/database/supabase_schema.sql` in your Supabase SQL Editor
3. **Set up storage buckets**: Run `node server/scripts/setup-storage.js` after configuring your `.env`
4. **Configure environment variables**: Update `server/.env` with your Supabase credentials

For detailed instructions, see **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

For migration help from MySQL/PostgreSQL, see **[server/SUPABASE_MIGRATION_GUIDE.md](server/SUPABASE_MIGRATION_GUIDE.md)**

## Notes

- The client calls the API at `http://localhost:5050` by default. You can override with `NEXT_PUBLIC_API_URL` in the client environment.
- The server uses JWT for auth; ensure `JWT_SECRET` is set before using auth endpoints.
- All file uploads (avatars, post images, documents) are stored in Supabase Storage. 