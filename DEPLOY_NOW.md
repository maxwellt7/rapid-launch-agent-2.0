# 🚀 Deploy to Vercel + Railway - Step by Step

## Quick Deploy (5 Minutes)

### Prerequisites
- [x] GitHub account
- [x] Vercel account (free)
- [x] Railway account (free trial, then pay-as-you-go)
- [x] Anthropic API key

---

## Step 1: Push to GitHub (1 minute)

All your code changes are ready! Run these commands:

```bash
cd /Users/maxmayes/Downloads/rapid-launch-agent

# Stage all changes
git add .

# Commit with message
git commit -m "Deploy: Claude integration complete with all features"

# Push to GitHub
git push origin main
```

**✅ Checkpoint:** Visit https://github.com/maxwellt7/rapid-launch-agent to see your code

---

## Step 2: Deploy Backend to Railway (2 minutes)

### A. Create Railway Project

1. Go to: https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: `maxwellt7/rapid-launch-agent`
5. Railway will automatically detect the Dockerfile

### B. Configure Environment Variables

In Railway dashboard:

1. Click your project → **Variables** tab
2. Add these variables:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-api-key-here
CLAUDE_MODEL=claude-sonnet-4-5-20250929
CLAUDE_TEMPERATURE=0.7
PORT=5000
CORS_ORIGIN=*
NODE_ENV=production
```

3. Click **"Deploy"**

### C. Get Your Backend URL

1. Wait for deployment (2-3 minutes)
2. Railway will provide a URL like: `https://rapid-launch-agent-production.up.railway.app`
3. **Copy this URL** - you'll need it for Vercel!

**✅ Checkpoint:** Visit `https://your-railway-url.up.railway.app/api/health`  
Should return: `{"status":"ok","message":"Rapid Launch Agent API is running"}`

---

## Step 3: Deploy Frontend to Vercel (2 minutes)

### A. Connect to Vercel

1. Go to: https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import from GitHub: `maxwellt7/rapid-launch-agent`

### B. Configure Build Settings

Vercel will auto-detect Vite, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### C. Configure Environment Variable

1. In Vercel project settings → **Environment Variables**
2. Add ONE variable:

```bash
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

**⚠️ IMPORTANT:** Replace `your-railway-url` with the actual Railway URL from Step 2!

3. Click **"Deploy"**

### D. Get Your Frontend URL

1. Wait for deployment (1-2 minutes)
2. Vercel provides URL like: `https://rapid-launch-agent.vercel.app`
3. Visit and test!

**✅ Checkpoint:** Your app should load and work!

---

## Step 4: Update Railway CORS (30 seconds)

Now that you have your Vercel URL, update Railway:

1. Go back to Railway dashboard
2. Add/Update environment variable:

```bash
CORS_ORIGIN=https://rapid-launch-agent.vercel.app
```

3. Railway will auto-redeploy

---

## Step 5: Test Everything (1 minute)

Visit your Vercel URL and test:

1. ✅ Create a new project
2. ✅ Fill out Offer Builder → Click "Analyze Offer"
3. ✅ Should get AI response in 20-30 seconds
4. ✅ Complete Avatar Builder
5. ✅ Test Dashboard query

If everything works: **🎉 YOU'RE LIVE!**

---

## Deployment URLs

**Frontend (Vercel):**
- Production: `https://rapid-launch-agent.vercel.app`
- Build logs: https://vercel.com/dashboard

**Backend (Railway):**
- Production: `https://rapid-launch-agent-production.up.railway.app`
- Logs: https://railway.app/dashboard

---

## Environment Variables Reference

### Railway (Backend)
```env
ANTHROPIC_API_KEY=your-anthropic-api-key-here
CLAUDE_MODEL=claude-sonnet-4-5-20250929
CLAUDE_TEMPERATURE=0.7
PORT=5000
CORS_ORIGIN=https://rapid-launch-agent.vercel.app
NODE_ENV=production
```

### Vercel (Frontend)
```env
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

---

## Troubleshooting

### Frontend loads but API calls fail
- **Check:** CORS_ORIGIN in Railway matches your Vercel URL
- **Check:** VITE_API_URL in Vercel points to Railway URL
- **Fix:** Update env vars and redeploy

### Backend deployment fails
- **Check:** Railway logs for errors
- **Common issue:** Database initialization
- **Fix:** Railway has persistent storage, should work automatically

### "ANTHROPIC_API_KEY not found" error
- **Check:** Variable is set in Railway dashboard
- **Check:** No extra spaces in the key
- **Fix:** Re-add the variable and redeploy

### API calls timeout
- **Check:** Railway service is running (check logs)
- **Check:** Vercel timeout limits (60s default)
- **Fix:** Increase timeout in Railway settings

---

## Cost Estimates

### Railway (Backend)
- Free Trial: $5 credit
- After trial: ~$5-10/month
- Includes: 512MB RAM, persistent storage

### Vercel (Frontend)
- Hobby Plan: FREE forever
- Includes: Unlimited bandwidth, automatic SSL

### Anthropic API
- ~$3-6 per complete project
- Monitor at: https://console.anthropic.com/settings/usage

**Total: ~$5-10/month + usage costs**

---

## Monitoring & Maintenance

### Check Health
```bash
# Backend
curl https://your-railway-url.up.railway.app/api/health

# Should return:
# {"status":"ok","message":"Rapid Launch Agent API is running"}
```

### View Logs

**Railway:**
- Dashboard → Your project → Logs tab
- Real-time streaming logs

**Vercel:**
- Dashboard → Your project → Logs tab
- Shows build and function logs

### Update Deployment

```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push origin main

# Both Vercel and Railway auto-deploy on push!
```

---

## Custom Domain (Optional)

### Add to Vercel
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as shown

### Add to Railway
1. Railway Dashboard → Settings → Domains
2. Add your custom backend domain
3. Update VITE_API_URL in Vercel to use new domain

---

## Security Checklist

- [x] ANTHROPIC_API_KEY stored as environment variable (not in code)
- [x] CORS configured to only allow your Vercel domain
- [x] Database stored on Railway (persistent storage)
- [x] HTTPS enabled by default (Vercel + Railway)
- [x] API keys never exposed to frontend

---

## Quick Commands

```bash
# Check git status
git status

# Stage and commit changes
git add . && git commit -m "Update: your message"

# Push to deploy
git push origin main

# View Railway logs
railway logs

# View Vercel logs  
vercel logs

# Test backend health
curl https://your-railway-url.up.railway.app/api/health

# Test frontend
open https://rapid-launch-agent.vercel.app
```

---

**Ready to deploy? Start with Step 1!** 🚀

