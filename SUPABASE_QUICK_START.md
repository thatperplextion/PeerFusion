# Supabase Quick Start Guide

Get PeerFusion running with Supabase in 5 minutes!

## Prerequisites
- A Supabase account (free tier is fine)
- Node.js installed

## Step 1: Create Supabase Project (2 minutes)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - Name: `PeerFusion`
   - Database Password: (choose a strong password)
   - Region: (closest to you)
4. Click **"Create new project"**
5. Wait for provisioning to complete

## Step 2: Get Your Credentials (30 seconds)

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these three values:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (keep this secret!)

## Step 3: Set Up Database Schema (1 minute)

1. In Supabase dashboard, click **SQL Editor**
2. Click **"New query"**
3. Open `server/src/database/supabase_schema.sql` from this project
4. Copy all contents and paste into the SQL editor
5. Click **"Run"**
6. You should see "Success. No rows returned"

## Step 4: Configure Your Project (1 minute)

1. In the `server` directory, create a `.env` file:

```bash
cd server
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=your_random_secret_at_least_32_characters_long
PORT=5050
```

**Generate a secure JWT_SECRET:**
```bash
openssl rand -base64 32
```

## Step 5: Set Up Storage Buckets (1 minute)

Run the automated setup script:

```bash
cd server
node scripts/setup-storage.js
```

This creates the required storage buckets for avatars, post images, and documents.

## Step 6: Start the Application (30 seconds)

**Terminal 1 - Start the server:**
```bash
cd server
npm install  # if you haven't already
npm run dev
```

You should see:
```
✅ Database connection test successful (Supabase)
🚀 Server running on http://localhost:5050
```

**Terminal 2 - Start the client:**
```bash
cd client
npm install  # if you haven't already
npm run dev
```

You should see:
```
▲ Next.js ready on http://localhost:3000
```

## Step 7: Test It Out!

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### "Database connection test failed"
- Double-check your `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- Make sure you ran the schema SQL in Step 3
- Check the Supabase dashboard for any errors

### "Storage bucket not found"
- Run `node scripts/setup-storage.js` again
- Or manually create buckets in Supabase Dashboard → Storage

### "Port 5050 already in use"
- Change `PORT=5051` in your `.env` file
- Or kill the process using port 5050

## What's Next?

- **Add test data**: Create some users and posts in the Supabase Table Editor
- **Explore the API**: Check out the endpoints in `server/src/routes/`
- **Customize**: Modify the schema, add new features
- **Deploy**: Deploy to Vercel (client) and your preferred hosting (server)

## Need More Help?

- 📖 [Full Setup Guide](SUPABASE_SETUP.md)
- 🔄 [Migration Guide](server/SUPABASE_MIGRATION_GUIDE.md)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 📚 [Supabase Docs](https://supabase.com/docs)

---

**You're all set! Happy coding! 🚀**
