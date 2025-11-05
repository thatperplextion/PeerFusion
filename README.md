# PeerFusion — Quick start

This repository contains a Next.js client and an Express + TypeScript server with PostgreSQL as the database.

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

- Copy `server/.env.example` to `server/.env` and fill in values (especially `JWT_SECRET`).
- If you don't have PostgreSQL running and want to start the server anyway, set `SKIP_DB_TEST=true` in `.env`.

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

## To run with PostgreSQL (recommended)

You can run a local Postgres instance (using Docker or native install) and then configure `.env` with the database credentials. Once Postgres is available, remove `SKIP_DB_TEST` or set it to `false` and restart the server.

## Notes

- The client calls the API at `http://localhost:5050` by default. You can override with `NEXT_PUBLIC_API_URL` in the client environment.
- The server uses JWT for auth; ensure `JWT_SECRET` is set before using auth endpoints.

If you want, I can add a `docker-compose.yml` to bring up Postgres quickly. 