# 🚀 Deploy PeerFusion to Render

This guide will help you deploy both the backend API and frontend client to Render.

## Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Supabase Account** - You already have this set up

## Deployment Options

### Option 1: Automatic Deployment (Recommended)

Use the `render.yaml` blueprint for one-click deployment:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click **"New +"** → **"Blueprint"**

3. **Connect Repository**
   - Select your GitHub repository: `Falco0906/PeerFusion`
   - Render will detect the `render.yaml` file

4. **Configure Environment Variables**
   
   For **peerfusion-api**:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_KEY` - Your Supabase service role key
   - `JWT_SECRET` - Will be auto-generated (or set your own)
   - `PORT` - Already set to 5050

   For **peerfusion-client**:
   - `NEXT_PUBLIC_API_URL` - Will be set to your API URL (update after API deploys)

5. **Deploy**
   - Click **"Apply"**
   - Render will deploy both services

---

### Option 2: Manual Deployment

#### Step 1: Deploy Backend API

1. **Create New Web Service**
   - Go to Render Dashboard
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `peerfusion-api`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=5050
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_KEY=<your-service-key>
   JWT_SECRET=<generate-random-32-char-string>
   ```

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment (5-10 minutes)
   - Note your API URL: `https://peerfusion-api.onrender.com`

#### Step 2: Deploy Frontend Client

1. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `peerfusion-client`
   - **Region**: Oregon (same as API)
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://peerfusion-api.onrender.com
   ```
   ⚠️ **Important**: Replace with your actual API URL from Step 1

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment (5-10 minutes)

---

## Post-Deployment Steps

### 1. Update CORS Settings

After deployment, update the server CORS to allow your Render frontend URL:

Edit `server/src/app.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'https://peerfusion-client.onrender.com' // Add your Render URL
  ],
  credentials: true
}));
```

Push changes and Render will auto-redeploy.

### 2. Set Up Supabase Database

Your Supabase database should already be set up from local development. If not:

1. Go to Supabase SQL Editor
2. Run the schema from `server/src/database/supabase_schema.sql`
3. Run storage setup: `node server/scripts/setup-storage.js` (locally with production env vars)

### 3. Test Your Deployment

1. Visit your frontend URL: `https://peerfusion-client.onrender.com`
2. Try registering a new account
3. Test login functionality
4. Check that dark mode toggle works

---

## Important Notes

### Free Tier Limitations

- **Spin Down**: Free services sleep after 15 minutes of inactivity
- **Cold Starts**: First request after sleep takes 30-60 seconds
- **Build Time**: Limited to 15 minutes per build

### Environment Variables

Never commit `.env` files! Always set environment variables in Render dashboard.

### Custom Domain (Optional)

To use a custom domain:
1. Go to your service settings
2. Click **"Custom Domain"**
3. Add your domain and configure DNS

---

## Troubleshooting

### Build Fails

**Issue**: TypeScript compilation errors
- Check `server/tsconfig.json` is correct
- Ensure all TypeScript files are valid
- Check build logs in Render dashboard

**Issue**: Missing dependencies
- Verify `package.json` includes all dependencies
- Check that `node_modules` is in `.gitignore`

### Runtime Errors

**Issue**: "Cannot connect to database"
- Verify Supabase environment variables are set correctly
- Check Supabase project is active

**Issue**: CORS errors
- Add your Render frontend URL to CORS whitelist
- Redeploy backend after updating CORS

**Issue**: 404 errors on API calls
- Verify `NEXT_PUBLIC_API_URL` is set correctly in frontend
- Check API service is running

### Service Won't Start

**Issue**: Port binding errors
- Render automatically sets `PORT` - don't hardcode it
- Use `process.env.PORT || 5050` in your code

---

## Monitoring

### View Logs

1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. Monitor real-time logs

### Check Service Health

- Render automatically monitors your service
- Health checks run on the `/` endpoint
- Service restarts automatically if unhealthy

---

## Updating Your Deployment

### Automatic Deploys

Render auto-deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Deploys

1. Go to service in Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## Cost Optimization

### Free Tier Tips

- Use a single region for all services
- Combine services if possible
- Monitor usage in Render dashboard

### Upgrade Options

If you need better performance:
- **Starter Plan**: $7/month - No sleep, faster builds
- **Standard Plan**: $25/month - More resources, better uptime

---

## Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Render Community**: [community.render.com](https://community.render.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

## Quick Reference

### Service URLs (Update these after deployment)

- **API**: `https://peerfusion-api.onrender.com`
- **Frontend**: `https://peerfusion-client.onrender.com`

### Required Environment Variables

**Backend (peerfusion-api)**:
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
JWT_SECRET
PORT=5050
NODE_ENV=production
```

**Frontend (peerfusion-client)**:
```
NEXT_PUBLIC_API_URL
NODE_ENV=production
```

---

**🎉 Your PeerFusion app is now live on Render!**
