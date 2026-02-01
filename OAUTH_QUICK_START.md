# ⚠️ IMPORTANT: OAuth Scope Selection

## 🚨 Critical Warning

Looking at your screenshot, you have **many sensitive scopes checked** that you likely **DO NOT NEED** for Clerk SSO authentication.

### ❌ Remove These Sensitive Scopes (Unless You Actually Use Them):
- ❌ `/auth/bigquery` - BigQuery access
- ❌ `/auth/bigquery.readonly` - BigQuery read access
- ❌ `/auth/cloud-platform` - Full cloud platform access
- ❌ `/auth/devstorage.full_control` - Cloud Storage full control
- ❌ `/auth/devstorage.read_write` - Cloud Storage read/write
- ❌ `/auth/drive` - Full Google Drive access
- ❌ `/auth/drive.appdata` - Drive app data
- ❌ `/auth/drive.file` - Drive file access

### ✅ Keep Only These Non-Sensitive Scopes:
- ✅ `openid` - Required for authentication
- ✅ `/auth/userinfo.email` - User's email address
- ✅ `/auth/userinfo.profile` - User's name and profile picture

---

## Why This Matters

1. **Verification Delay**: Google will scrutinize sensitive scopes heavily, delaying approval by weeks or months
2. **User Trust**: Users see these extensive permissions and may refuse to sign in
3. **Security Risk**: Requesting more access than needed violates security best practices
4. **Rejection Risk**: Google may reject your application for requesting unnecessary scopes

---

## 📋 Quick Start Checklist

### Step 1: Fix Your Scope Selection
- [ ] Go back to Google Cloud Console OAuth consent screen
- [ ] Click "Edit App"
- [ ] Go to "Scopes" section
- [ ] **Remove all sensitive scopes**
- [ ] Keep only: `openid`, `userinfo.email`, `userinfo.profile`
- [ ] Save changes

### Step 2: Prepare Your Justification
- [ ] Open `GOOGLE_OAUTH_SUBMISSION_TEXT.txt` (I just created this)
- [ ] Copy the justification text
- [ ] Paste into Google's verification form
- [ ] Update YouTube video URL once created

### Step 3: Record Demo Video
- [ ] Follow the script in `GOOGLE_OAUTH_JUSTIFICATION.md`
- [ ] Record 4-5 minute demo showing:
  - Sign-in flow
  - What permissions are shown to users
  - How the data is used in your app
  - Privacy protections
- [ ] Upload to YouTube as "Unlisted"
- [ ] Add URL to verification form

### Step 4: Submit for Verification
- [ ] Ensure Privacy Policy is live at `/privacy`
- [ ] Ensure Terms of Service is live at `/terms`
- [ ] Deploy your app to production (Railway/Vercel)
- [ ] Test Google Sign-In works correctly
- [ ] Submit OAuth verification form
- [ ] Wait for Google's review (typically 2-7 days for basic scopes)

---

## 🎯 What You Should Have

**Current Setup (As Shown in Screenshot):**
- ❌ Too many sensitive scopes (BigQuery, Drive, Cloud Storage)
- ❌ Will cause verification delays
- ❌ Will scare users

**Recommended Setup (For Clerk SSO):**
- ✅ Only 3 basic scopes (openid, email, profile)
- ✅ Fast verification (2-7 days typically)
- ✅ Users trust the minimal permissions

---

## 📞 Need Help?

If you need those sensitive scopes for actual features (like "Save to Drive" button), let me know and I'll help justify them properly. But for basic Clerk authentication, you absolutely do not need them.

---

## Files Created for You

1. **`GOOGLE_OAUTH_JUSTIFICATION.md`** - Full documentation including:
   - Scope justifications for basic and sensitive scopes
   - Complete YouTube video script with timestamps
   - Video production notes
   - Submission checklist

2. **`GOOGLE_OAUTH_SUBMISSION_TEXT.txt`** - Ready to copy/paste:
   - Pre-written justification text
   - Formatted for Google's form
   - Covers all required information

3. **`OAUTH_QUICK_START.md`** - This file:
   - Quick warning about your scope selection
   - Step-by-step checklist
   - What to do next

---

## Next Action

**RIGHT NOW: Go back and uncheck all those sensitive scopes!**

You only need:
1. ✅ openid
2. ✅ /auth/userinfo.email  
3. ✅ /auth/userinfo.profile

Then follow the checklist above.

