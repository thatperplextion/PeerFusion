# 📋 Render Deployment Checklist

Follow this checklist to deploy PeerFusion to Render successfully.

## Pre-Deployment

- [ ] **Code is working locally**
  - [ ] Server runs on `http://localhost:5050`
  - [ ] Client runs on `http://localhost:3002`
  - [ ] Login/Register works
  - [ ] Dark mode toggle works
  - [ ] Database connection successful

- [ ] **Environment variables documented**
  - [ ] You have your Supabase URL
  - [ ] You have your Supabase anon key
  - [ ] You have your Supabase service key
  - [ ] You have a JWT secret (or will generate one)

- [ ] **Code pushed to GitHub**
  - [ ] All changes committed
  - [ ] Pushed to `main` branch
  - [ ] Repository: `Falco0906/PeerFusion`

## Deployment Steps

### 1. Deploy Backend API

- [ ] **Create Render account** at [render.com](https://render.com)
- [ ] **Connect GitHub** to Render
- [ ] **Create new Web Service**
  - [ ] Select repository: `Falco0906/PeerFusion`
  - [ ] Name: `peerfusion-api`
  - [ ] Root Directory: `server`
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Start Command: `npm start`
  
- [ ] **Set Environment Variables**
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `5050`
  - [ ] `SUPABASE_URL` = `<your-url>`
  - [ ] `SUPABASE_ANON_KEY` = `<your-key>`
  - [ ] `SUPABASE_SERVICE_KEY` = `<your-key>`
  - [ ] `JWT_SECRET` = `<generate-random-string>`

- [ ] **Deploy and wait** (5-10 minutes)
- [ ] **Copy API URL**: `https://peerfusion-api.onrender.com`
- [ ] **Test API**: Visit the URL, should see `{"message":"PeerFusion API running!"}`

### 2. Update CORS for Production

- [ ] **Edit** `server/src/app.ts`
- [ ] **Add** your Render frontend URL to CORS array
- [ ] **Commit and push** changes
- [ ] **Wait** for auto-redeploy

### 3. Deploy Frontend Client

- [ ] **Create new Web Service**
  - [ ] Select repository: `Falco0906/PeerFusion`
  - [ ] Name: `peerfusion-client`
  - [ ] Root Directory: `client`
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Start Command: `npm start`

- [ ] **Set Environment Variables**
  - [ ] `NODE_ENV` = `production`
  - [ ] `NEXT_PUBLIC_API_URL` = `https://peerfusion-api.onrender.com`

- [ ] **Deploy and wait** (5-10 minutes)
- [ ] **Copy Frontend URL**: `https://peerfusion-client.onrender.com`

## Post-Deployment Testing

- [ ] **Visit frontend URL**
- [ ] **Test registration**
  - [ ] Create new account
  - [ ] Verify email validation works
  
- [ ] **Test login**
  - [ ] Login with new account
  - [ ] Check dashboard loads
  
- [ ] **Test features**
  - [ ] Dark mode toggle works
  - [ ] Navigation works
  - [ ] Profile page loads
  
- [ ] **Check API calls**
  - [ ] Open browser DevTools
  - [ ] Check Network tab
  - [ ] Verify API calls succeed (200 status)

## Troubleshooting

If something doesn't work:

- [ ] **Check Render logs**
  - [ ] Go to service → Logs tab
  - [ ] Look for error messages
  
- [ ] **Verify environment variables**
  - [ ] All required vars are set
  - [ ] No typos in values
  
- [ ] **Check CORS**
  - [ ] Frontend URL is in CORS whitelist
  - [ ] Backend redeployed after CORS update
  
- [ ] **Test API directly**
  - [ ] Visit `https://peerfusion-api.onrender.com`
  - [ ] Should return JSON message

## Optional Enhancements

- [ ] **Set up custom domain**
- [ ] **Configure SSL certificate** (automatic on Render)
- [ ] **Set up monitoring/alerts**
- [ ] **Enable auto-deploy** from GitHub (default)

## Success Criteria

✅ **Deployment is successful when:**
- Backend API responds at Render URL
- Frontend loads at Render URL
- Users can register and login
- All features work as in local development
- No CORS errors in browser console

---

**🎉 Congratulations! Your app is live on Render!**

Share your URL: `https://peerfusion-client.onrender.com`
