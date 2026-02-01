# Google OAuth Scopes Justification - Rapid Launch Agent

## ⚠️ IMPORTANT RECOMMENDATION

**For Clerk SSO Authentication, you typically ONLY need these non-sensitive scopes:**
- `openid` - Authentication
- `auth/userinfo.email` - User email address
- `auth/userinfo.profile` - User name and profile picture

**You likely DO NOT need the sensitive scopes** (BigQuery, Drive, Cloud Storage, etc.) unless you have specific features that require them.

---

## Justification for Non-Sensitive Scopes (Required for SSO)

### 1. `openid`
**Scope**: `openid`  
**How it will be used**: Required for OAuth 2.0 authentication. This scope enables secure user authentication through Google Sign-In, allowing users to log into Rapid Launch Agent without creating a separate password.

### 2. `auth/userinfo.email`
**Scope**: `auth/userinfo.email`  
**How it will be used**: Used to retrieve the user's primary Google account email address for account creation, identification, and communication purposes. This email is stored in our database and used to:
- Create and identify user accounts
- Send project notifications and updates
- Provide customer support
- Enable account recovery

### 3. `auth/userinfo.profile`
**Scope**: `auth/userinfo.profile`  
**How it will be used**: Used to retrieve the user's basic profile information (name, profile picture) to personalize their experience within Rapid Launch Agent. This information is displayed in the user interface and helps identify the logged-in user.

---

## Justification for Sensitive Scopes (⚠️ Only if Actually Needed)

**WARNING**: These scopes should ONLY be requested if you have specific features that require them. Requesting unnecessary scopes will:
- Delay Google's verification process
- Reduce user trust
- Violate principle of least privilege
- May result in rejection

### If You Actually Need BigQuery Access:

**Scope**: `auth/bigquery` & `auth/bigquery.readonly`  
**How it will be used**: *(Only if you're actually using BigQuery)*
- To analyze aggregated user behavior patterns for AI model improvements
- To generate marketing insights from anonymized campaign data
- To provide advanced analytics features for enterprise customers

### If You Actually Need Drive Access:

**Scope**: `auth/drive.file`  
**How it will be used**: *(Only if you're actually using Drive)*
- To allow users to export their launch documents directly to Google Drive
- To save marketing assets and campaign materials to user's preferred Drive location
- User explicitly initiates these actions through "Save to Drive" functionality

**Scope**: `auth/drive.appdata`  
**How it will be used**: *(Only if you're actually using Drive)*
- To store application configuration and user preferences in a hidden application folder
- To enable cross-device synchronization of project settings

### If You Actually Need Cloud Storage Access:

**Scope**: `auth/devstorage.full_control` / `auth/devstorage.read_write`  
**How it will be used**: *(Only if you're actually using Cloud Storage)*
- To store and manage user-uploaded marketing assets (images, videos, documents)
- To enable backup and restore functionality for user projects
- To facilitate file sharing between team members on the same project

---

## ✅ Recommended Approach for Clerk SSO

**For standard Clerk authentication, submit your app with ONLY these scopes:**

```
Requested Scopes:
1. openid
2. https://www.googleapis.com/auth/userinfo.email
3. https://www.googleapis.com/auth/userinfo.profile
```

**Justification Text for Google OAuth Verification Form:**

```
APPLICATION: Rapid Launch Agent (rapidlaunchagent.com)
PURPOSE: User authentication and account management

SCOPE JUSTIFICATIONS:

1. openid
   - Required for secure OAuth 2.0 authentication
   - Enables users to sign in with their Google account
   - Core functionality for user authentication

2. auth/userinfo.email
   - Retrieve user's email address for account creation and identification
   - Used for account recovery and user communications
   - Stored securely in our database for account management

3. auth/userinfo.profile
   - Retrieve user's name and profile picture for UI personalization
   - Displayed in application header and user settings
   - Enhances user experience by showing recognizable identity

DATA HANDLING:
- All user data is stored securely with encryption
- We do not share user data with third parties for advertising
- Users can delete their data at any time through account settings
- Full details in our Privacy Policy: https://rapidlaunchagent.com/privacy

CLERK INTEGRATION:
- Authentication is handled by Clerk (clerk.com), a certified authentication provider
- Clerk manages OAuth flows and token security
- We only receive and store necessary user identification data
```

---

## YouTube Demo Video Script

### Video Title
"Google Sign-In Integration for Rapid Launch Agent - OAuth Scopes Demonstration"

### Video Description
```
This video demonstrates how Rapid Launch Agent uses Google OAuth scopes for secure user authentication. We show exactly what permissions are requested and how they're used to protect user privacy while providing a seamless sign-in experience.

Timestamps:
0:00 - Introduction
0:30 - Google Sign-In Flow
1:15 - Scope Permissions Explained
2:30 - Data Privacy & Security
3:45 - User Profile Display
4:30 - Conclusion

Privacy Policy: https://rapidlaunchagent.com/privacy
Terms of Service: https://rapidlaunchagent.com/terms
```

### 🎬 VIDEO SCRIPT

---

**[SCENE 1: INTRODUCTION - 0:00]**

**[Screen: Rapid Launch Agent homepage]**

**Narrator:**
"Hello! I'm Max from Rapid Launch Agent. Today, I'm going to show you exactly how we use Google Sign-In and what data permissions we request. Transparency is important to us, so let's walk through this together."

---

**[SCENE 2: GOOGLE SIGN-IN FLOW - 0:30]**

**[Screen: Navigate to Rapid Launch Agent landing page]**

**Narrator:**
"When you visit Rapid Launch Agent and click 'Sign In,' you'll see the option to sign in with Google. Let's click that now."

**[Action: Click "Sign In" button]**
**[Action: Click "Sign in with Google" option]**

**[Screen: Google OAuth consent screen appears]**

**Narrator:**
"Here's the Google sign-in screen. Notice it's asking for permission to access three things: your email address, your basic profile information, and to know who you are on Google. Let's break down why we need each of these."

---

**[SCENE 3: SCOPE PERMISSIONS EXPLAINED - 1:15]**

**[Screen: Highlight each permission on the consent screen]**

**Narrator:**
"First, **OpenID Authentication** - this is the foundation of secure sign-in. It verifies your identity without us ever seeing your Google password.

Second, **your email address** - we use this to create your account and send you important updates about your projects. We never sell your email to advertisers or third parties.

Third, **your basic profile info** - that's your name and profile picture. We display this in the app so you can see you're logged into the right account. It makes the experience more personal.

And that's it! Notice what we DON'T ask for: we don't request access to your Google Drive files, your Gmail, your calendar, or anything else. We only ask for what we absolutely need."

**[Screen: Circle/highlight the limited permissions]**

---

**[SCENE 4: DATA PRIVACY & SECURITY - 2:30]**

**[Screen: After clicking "Continue" and being logged in]**

**Narrator:**
"Once you're signed in, you'll see your name and profile picture here in the top right. This comes from that profile information we requested.

Your data is stored securely with Clerk, a certified authentication provider trusted by thousands of companies. We encrypt all data at rest and in transit. 

And if you ever want to delete your account and all your data, you can do that anytime in your account settings."

**[Screen: Show account settings menu]**

---

**[SCENE 5: USER PROFILE DISPLAY - 3:45]**

**[Screen: Demonstrate the app with user logged in]**

**Narrator:**
"Now that you're authenticated, you can access all of Rapid Launch Agent's features. Your email is tied to your account, your projects are saved under your profile, and everything works seamlessly.

When you work with our AI to build marketing strategies, that data belongs to you. We use it to generate your content, but we never train our public models on your private business information."

**[Screen: Show creating a project and using features]**

---

**[SCENE 6: CONCLUSION - 4:30]**

**[Screen: Back to homepage with Privacy Policy link visible]**

**Narrator:**
"That's how Rapid Launch Agent uses Google Sign-In. We believe in requesting only the permissions we need, being transparent about how we use your data, and giving you control.

For complete details, check out our Privacy Policy and Terms of Service - links are in the footer of our website and in the video description.

If you have any questions about data privacy or security, feel free to reach out to us at max@growthgod.io.

Thanks for watching, and happy launching!"

**[Screen: Fade to Rapid Launch Agent logo with website URL]**

**[Text overlay: rapidlaunchagent.com]**

---

### 🎥 Video Production Notes

**Recording Setup:**
1. Use screen recording software (OBS Studio, Loom, or ScreenFlow)
2. Clear browser cache before recording for clean demo
3. Use 1920x1080 resolution for best quality
4. Enable cursor highlighting for clarity

**Demo Account:**
- Create a fresh Google account for demo purposes
- Use a professional name and profile picture
- Pre-stage the app for smooth flow

**Visual Enhancements:**
- Add arrows or highlights to emphasize key points
- Use zoom-in effects when showing specific permissions
- Add text overlays for technical terms
- Include background music (low volume, non-distracting)

**Length:**
- Target: 4-5 minutes total
- Keep pace brisk but clear
- Pause slightly after each key point

**Call to Action:**
- End screen with website URL
- Links to Privacy Policy and Terms in description
- Encourage questions in comments

---

## 📝 Submission Checklist

Before submitting to Google:

- [ ] Only request scopes you actually use
- [ ] Remove all unused sensitive scopes
- [ ] Prepare justification text for each scope
- [ ] Record and upload demo video to YouTube
- [ ] Set video to "Unlisted" initially
- [ ] Test the OAuth flow thoroughly
- [ ] Review Privacy Policy is accurate and linked
- [ ] Ensure Terms of Service is accessible
- [ ] Verify contact email is correct
- [ ] Have legal review if needed

---

## Contact

For questions about OAuth implementation:
- Email: max@growthgod.io
- Privacy Policy: https://rapidlaunchagent.com/privacy
- Terms of Service: https://rapidlaunchagent.com/terms

