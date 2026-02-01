# Deployment Guide - Rapid Launch Agent

## ✅ GitHub Push Complete!

Your code has been successfully pushed to GitHub:
- **Repository**: https://github.com/maxwellt7/rapid-launch-agent
- **Commit**: "Update Claude API to Sonnet 4.5 and add legal pages"
- **Files Changed**: 18 files (653 insertions, 33 deletions)

## 🚂 Deploy to Railway (Recommended for Full-Stack Apps)

### Option 1: Deploy via Railway Dashboard (Easiest)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Sign in to your account

2. **Create New Project or Use Existing**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `maxwellt7/rapid-launch-agent`

3. **Configure Environment Variables**
   
   Go to your project → **Variables** tab, add these:

   ```
   ANTHROPIC_API_KEY=sk-ant-api03-YOUR-ACTUAL-KEY-HERE
   CLAUDE_MODEL=claude-sonnet-4-5-20250929
   CLAUDE_TEMPERATURE=0.7
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2xpbWJpbmctZ29yaWxsYS03Ni5jbGVyay5hY2NvdW50cy5kZXYk
   CLERK_SECRET_KEY=sk_test_LeyUlGdzDlHvBAdi6RvAteNVibVoYzZw9p3DF1lQW5
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=*
   ```

4. **Deploy**
   - Railway will automatically detect your Dockerfile
   - Click "Deploy"
   - Wait for build to complete (~2-5 minutes)

5. **Get Your URL**
   - Go to Settings → Generate Domain
   - Your app will be live at: `https://your-app.up.railway.app`

### Option 2: Deploy via Railway CLI

```bash
# 1. Login to Railway (this will open browser)
railway login

# 2. Link to existing project OR create new one
railway link   # if you have an existing project
# OR
railway init   # to create a new project

# 3. Set environment variables
railway variables set ANTHROPIC_API_KEY="sk-ant-api03-YOUR-ACTUAL-KEY-HERE"
railway variables set CLAUDE_MODEL="claude-sonnet-4-5-20250929"
railway variables set CLAUDE_TEMPERATURE="0.7"
railway variables set VITE_CLERK_PUBLISHABLE_KEY="pk_test_Y2xpbWJpbmctZ29yaWxsYS03Ni5jbGVyay5hY2NvdW50cy5kZXYk"
railway variables set CLERK_SECRET_KEY="sk_test_LeyUlGdzDlHvBAdi6RvAteNVibVoYzZw9p3DF1lQW5"
railway variables set PORT="5000"
railway variables set NODE_ENV="production"

# 4. Deploy
railway up
```

---

## ▲ Deploy to Vercel (Alternative - Frontend Focus)

**Note**: Vercel is primarily for frontend. For this full-stack app, Railway is recommended.

### If Using Vercel:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in to your account

2. **Import Project**
   - Click "Add New" → "Project"
   - Import from GitHub: `maxwellt7/rapid-launch-agent`

3. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   
   Go to Settings → Environment Variables:

   ```
   ANTHROPIC_API_KEY=sk-ant-api03-YOUR-ACTUAL-KEY-HERE
   CLAUDE_MODEL=claude-sonnet-4-5-20250929
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2xpbWJpbmctZ29yaWxsYS03Ni5jbGVyay5hY2NvdW50cy5kZXYk
   CLERK_SECRET_KEY=sk_test_LeyUlGdzDlHvBAdi6RvAteNVibVoYzZw9p3DF1lQW5
   ```

5. **Deploy Backend Separately**
   - Vercel focuses on frontend
   - You'll need Railway or another service for the Node.js backend

---

## 📋 Post-Deployment Checklist

### After Deployment:

1. **Test Your Live Site**
   - [ ] Visit your production URL
   - [ ] Test sign up/sign in with Clerk
   - [ ] Create a test project
   - [ ] Test the Offer Builder AI feature
   - [ ] Check Privacy Policy page (`/privacy`)
   - [ ] Check Terms of Service page (`/terms`)

2. **Update Clerk Settings**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Add your production URL to allowed origins
   - Update redirect URLs if needed

3. **Monitor Your Deployment**
   - **Railway**: Check logs at dashboard
   - **Anthropic**: Monitor API usage at https://console.anthropic.com/settings/usage
   - **Clerk**: Monitor auth at https://dashboard.clerk.com

4. **DNS Configuration** (if using custom domain)
   - Add CNAME record pointing to Railway/Vercel
   - Update SSL certificates (automatic on both platforms)

---

## 🎯 Quick Command Reference

### Railway Commands
```bash
railway login                    # Login to Railway
railway link                     # Link to existing project
railway init                     # Create new project
railway up                       # Deploy
railway logs                     # View logs
railway status                   # Check deployment status
railway variables                # List environment variables
railway open                     # Open project in browser
```

### Vercel Commands
```bash
vercel login                     # Login to Vercel
vercel                          # Deploy to preview
vercel --prod                    # Deploy to production
vercel logs                      # View logs
vercel env add                   # Add environment variable
```

### Git Commands
```bash
git status                       # Check status
git add .                        # Stage all changes
git commit -m "message"          # Commit changes
git push origin main             # Push to GitHub
```

---

## 🔧 Troubleshooting

### If Deployment Fails:

1. **Check Environment Variables**
   - Ensure all required variables are set
   - No typos in variable names
   - API keys are valid

2. **Check Logs**
   ```bash
   # Railway
   railway logs
   
   # Vercel
   vercel logs
   ```

3. **Verify Build**
   - Make sure `npm install` works locally
   - Test `npm run build` locally
   - Check Node.js version compatibility

4. **Common Issues**
   - Missing environment variables → Add them in dashboard
   - Build timeout → Increase build timeout in settings
   - Port conflicts → Railway uses PORT env var automatically

---

## 📊 What Was Deployed

### Changes in This Deployment:

1. ✅ **Claude API Fix**
   - Updated from invalid model to `claude-sonnet-4-5-20250929`
   - Fixed all documentation

2. ✅ **Legal Pages**
   - Added Privacy Policy at `/privacy`
   - Added Terms of Service at `/terms`
   - Added footer with links

3. ✅ **Documentation**
   - Updated README.md
   - Created BUGFIX_SUMMARY.md
   - Created LEGAL_PAGES_ADDED.md

4. ✅ **Environment Configuration**
   - Updated .env.example
   - Configured Clerk authentication
   - Configured Anthropic API

---

## 🎉 Next Steps

1. **Deploy using one of the methods above**
2. **Test your live application**
3. **Share the URL** with users/testers
4. **Monitor usage** and costs
5. **Iterate** based on feedback

---

**Need Help?**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Clerk Docs: https://clerk.com/docs
- Anthropic Docs: https://docs.anthropic.com

**Contact**: max@growthgod.io

