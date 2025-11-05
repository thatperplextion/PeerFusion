# Supabase Setup Guide for PeerFusion

This guide will help you set up Supabase as the database and file storage solution for PeerFusion.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js installed on your machine

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: PeerFusion (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (this may take a few minutes)

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in the sidebar)
2. Click on **API** in the left menu
3. You'll see the following credentials:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`
   - **service_role key**: Another long string (keep this secret!)

## Step 3: Set Up the Database Schema

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `server/src/database/supabase_schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** to execute the schema
6. You should see a success message

This will create all the necessary tables, indexes, and Row Level Security (RLS) policies.

## Step 4: Set Up Storage Buckets

1. In your Supabase dashboard, click on **Storage** in the left sidebar
2. Create the following buckets (click **"New bucket"** for each):

   **Bucket 1: avatars**
   - Name: `avatars`
   - Public bucket: ✅ Yes
   - File size limit: 2 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

   **Bucket 2: post-images**
   - Name: `post-images`
   - Public bucket: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

   **Bucket 3: documents**
   - Name: `documents`
   - Public bucket: ❌ No (private)
   - File size limit: 10 MB
   - Allowed MIME types: `application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`

   **Bucket 4: attachments**
   - Name: `attachments`
   - Public bucket: ❌ No (private)
   - File size limit: 10 MB
   - Allowed MIME types: Leave empty (all types allowed)

3. For each bucket, set up storage policies:
   - Click on the bucket name
   - Go to **Policies**
   - Add policies as needed (the schema already includes basic RLS policies)

## Step 5: Configure Environment Variables

1. In the `server` directory, create a `.env` file (or update the existing one)
2. Copy the template from `.env.example`
3. Fill in your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Server Configuration
PORT=5050
JWT_SECRET=your_secure_random_secret_at_least_32_characters_long
```

**Important Security Notes:**
- Never commit the `.env` file to version control
- Keep your `SUPABASE_SERVICE_KEY` secret - it has admin access
- Use a strong, random `JWT_SECRET` (you can generate one with: `openssl rand -base64 32`)

## Step 6: Install Dependencies

If you haven't already, install the required npm packages:

```bash
cd server
npm install
```

The Supabase client library (`@supabase/supabase-js`) should already be installed.

## Step 7: Test the Connection

1. Start the server:
```bash
npm run dev
```

2. You should see:
```
🔄 Testing database connection...
✅ Database connection test successful (Supabase)
🚀 Server running on http://localhost:5050
✅ Server is ready to accept connections
```

If you see any errors, double-check your environment variables.

## Step 8: Seed Initial Data (Optional)

You can create a seed script to populate your database with initial data. Example:

```bash
cd server
node scripts/seed.js
```

## Using Supabase in Your Code

### Database Queries

Instead of raw SQL queries, use the Supabase client:

```typescript
import { supabase } from './supabase';

// SELECT
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);

// INSERT
const { data, error } = await supabase
  .from('users')
  .insert([
    { email: 'user@example.com', first_name: 'John', last_name: 'Doe' }
  ]);

// UPDATE
const { data, error } = await supabase
  .from('users')
  .update({ bio: 'New bio' })
  .eq('id', userId);

// DELETE
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId);
```

### File Uploads

Use the storage utility functions:

```typescript
import { uploadAvatar, uploadPostImage } from './utils/storage';

// Upload avatar
const avatarUrl = await uploadAvatar(fileBuffer, 'avatar.jpg', userId);

// Upload post image
const imageUrl = await uploadPostImage(fileBuffer, 'post.jpg', userId);
```

## Monitoring and Debugging

### Supabase Dashboard

- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom queries
- **Database**: View table structure and relationships
- **Storage**: Manage files and buckets
- **Logs**: View real-time logs and errors
- **API Docs**: Auto-generated API documentation

### Common Issues

**Issue: "Database connection test failed"**
- Check that your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Ensure the `users` table exists in your database
- Check the Supabase dashboard for any errors

**Issue: "Upload failed"**
- Verify that the storage bucket exists
- Check that the bucket is public (for avatars and post images)
- Ensure file size is within limits
- Verify MIME type is allowed

**Issue: "Row Level Security policy violation"**
- Check that RLS policies are set up correctly
- For testing, you can temporarily disable RLS on a table
- Make sure you're using the correct authentication

## Next Steps

1. **Authentication**: Set up Supabase Auth for user authentication
2. **Real-time**: Enable real-time subscriptions for live updates
3. **Edge Functions**: Deploy serverless functions for complex operations
4. **Backups**: Set up automated database backups
5. **Production**: Configure production environment variables

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

## Support

If you encounter any issues:
1. Check the Supabase dashboard logs
2. Review the server console output
3. Consult the Supabase documentation
4. Ask for help in the Supabase Discord community

---

**Happy coding with Supabase! 🚀**
