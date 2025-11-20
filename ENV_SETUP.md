# Environment Variables Setup

## 🔐 Security Important: NEVER Commit .env Files to Git!

The `.env` file contains secrets and API keys. It is already in `.gitignore` and should NEVER be pushed to GitHub.

---

## Local Development Setup

### 1. Copy the Template

```bash
cp .env.template .env
```

### 2. Fill in Your Keys

Edit `.env` and replace the placeholder values:

```bash
# Anthropic API Key (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here

# Clerk Authentication Keys (REQUIRED for auth features)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
CLERK_SECRET_KEY=sk_test_your-secret-key-here
```

### 3. Get Your API Keys

**Anthropic Claude:**
- Get key at: https://console.anthropic.com/settings/keys
- Key format: `sk-ant-api03-...`

**Clerk Authentication:**
- Get keys at: https://dashboard.clerk.com
- Publishable key format: `pk_test_...` or `pk_live_...`
- Secret key format: `sk_test_...` or `sk_live_...`

---

## Production Deployment

### Vercel (Frontend)

Add these environment variables in Vercel Dashboard:
- Settings → Environment Variables

```
VITE_API_URL=https://rapid-launch-agent-production.up.railway.app/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
```

**Important:** 
- Clerk publishable key is safe in frontend (starts with `pk_`)
- Do NOT add the secret key to Vercel (it's for backend only)

### Railway (Backend)

Add these environment variables in Railway Dashboard:
- Project → Variables

```
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
CLAUDE_MODEL=claude-sonnet-4-5-20250929
CLAUDE_TEMPERATURE=0.7
PORT=5000
CORS_ORIGIN=https://rapidlaunchagent.com,https://www.rapidlaunchagent.com
NODE_ENV=production
CLERK_SECRET_KEY=sk_test_your-secret-key-here
```

**Important:**
- Secret keys stay in backend only
- CORS_ORIGIN includes all your domains (comma-separated, no spaces)

---

## Required Variables by Service

### Local Development (.env)
- `ANTHROPIC_API_KEY` - Required for AI features
- `CLAUDE_MODEL` - Optional (defaults to claude-sonnet-4-5-20250929)
- `CLAUDE_TEMPERATURE` - Optional (defaults to 0.7)
- `PORT` - Optional (defaults to 5001 locally)
- `VITE_CLERK_PUBLISHABLE_KEY` - Required for authentication
- `CLERK_SECRET_KEY` - Required for authentication

### Vercel (Frontend)
- `VITE_API_URL` - Required (points to Railway backend)
- `VITE_CLERK_PUBLISHABLE_KEY` - Required for authentication

### Railway (Backend)
- `ANTHROPIC_API_KEY` - Required for AI features
- `CLAUDE_MODEL` - Optional
- `CLAUDE_TEMPERATURE` - Optional
- `PORT` - Optional (defaults to 5000)
- `CORS_ORIGIN` - Required (your frontend URLs)
- `NODE_ENV` - Optional (set to "production")
- `CLERK_SECRET_KEY` - Required for authentication

---

## Verification

### Check Local Setup
```bash
# View your local .env (DO NOT share this output publicly!)
cat .env

# Start local servers
npm run server  # Terminal 1
npm run dev     # Terminal 2
```

### Check Production Setup
```bash
# Test Railway backend
curl https://rapid-launch-agent-production.up.railway.app/api/health

# Test Vercel frontend
open https://rapidlaunchagent.com
```

---

## Security Best Practices

✅ **DO:**
- Keep .env in .gitignore
- Add secrets through platform dashboards (Vercel/Railway)
- Use different keys for test/development vs production
- Rotate keys if they're ever exposed

❌ **DON'T:**
- Commit .env files to Git
- Share API keys in public channels
- Hard-code secrets in source code
- Push keys to GitHub (even in comments)

---

## If Keys Are Exposed

If you accidentally commit keys to Git:

1. **Rotate the keys immediately:**
   - Anthropic: Generate new key at console.anthropic.com
   - Clerk: Generate new keys at dashboard.clerk.com

2. **Update everywhere:**
   - Local .env file
   - Vercel dashboard
   - Railway dashboard

3. **Revoke old keys** in the respective dashboards

---

## Need Help?

- Can't find where to add variables? See screenshots in DEPLOY_NOW.md
- Keys not working? Check for extra spaces or typos
- Still having issues? Check the logs in Vercel/Railway dashboards

