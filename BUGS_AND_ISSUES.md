# Bugs and Issues Report - Rapid Launch Agent 2.0
**Generated:** 2026-01-31
**Status:** Identified issues before transformation to Easy Yes System

---

## CRITICAL ISSUES

### 1. Database Architecture (CRITICAL)
**Current:** SQLite with local file storage
**Required:** PostgreSQL for production
**Impact:** Blocks deployment to Railway

**Issues:**
- `server/config/database.js` uses `better-sqlite3` with local file: `./rapid-launch.db`
- No migration scripts exist
- SQLite not suitable for Railway deployment
- No connection pooling or proper error handling for PostgreSQL

**Files Affected:**
- `server/config/database.js:8` - Database initialization
- All route files that import database

---

### 2. Offer Scoring System (CRITICAL)
**Current:** Hormozi $100M Offers framework
**Required:** Easy Yes System (EYO) scoring
**Impact:** Core functionality mismatch with spec requirements

**Current Scoring (Hormozi):**
```typescript
essentialComponents: {
  massivePain: number;          // 0-10
  purchasingPower: number;      // 0-10
  easyToTarget: number;         // 0-10
  growingMarket: number;        // 0-10
  average: number;
}
irresistibleEquation: {
  promiseSize: number;
  perceivedLikelihood: number;
  timeDelay: number;           // inverse
  effortRequired: number;      // inverse
  score: number;
}
```

**Required Scoring (EYO):**
```typescript
easyYesScore: {
  clarityOfOutcome: number;      // 1-10
  gravityOfProblem: number;      // 1-10
  beliefInDiagnosis: number;     // 1-10
  naturalFit: number;            // 1-10
  clearOffer: number;            // 1-10
  totalScore: number;            // out of 50
}
```

**Files Affected:**
- `server/routes/offerAnalysis.js:1-100` - Entire scoring logic
- `src/types/index.ts:28-43` - OfferAnalysis interface
- `src/pages/OfferBuilder.tsx:205-233` - Results display

---

### 3. Missing "Apply Improvements" Feature (HIGH)
**Required:** Auto-apply button that implements improvements and re-evaluates
**Current:** Only displays improvements, no auto-apply
**Impact:** Manual workflow vs automated improvement

**What's Needed:**
- Button to automatically apply top improvements to offer
- Re-run analysis after applying
- Show before/after comparison
- Update offer data in store

**Files Affected:**
- `src/pages/OfferBuilder.tsx:237-263` - Add new button
- `server/routes/offerAnalysis.js` - Add apply endpoint

---

### 4. No Belief Engineering Integration (HIGH)
**Required:** Auto-populate 6 beliefs in Avatar Builder
**Current:** Generic WEB analysis without belief framework
**Impact:** Missing core EYO methodology

**6 Beliefs Framework Required:**
1. Outcome Belief (Can I achieve the result?)
2. Identity/Self Belief (Am I the type of person who can do this?)
3. Problem Belief (Do I have the problem?)
4. Solution Belief (Can this type of solution work?)
5. Product Belief (Is this the right product/service?)
6. Credibility Belief (Is this company/person trustworthy?)

**Files Affected:**
- `src/pages/AvatarBuilder.tsx:230-305` - Add Beliefs tab
- `server/routes/avatarAnalysis.js` - Add 6 beliefs to analysis
- `src/types/index.ts:99-104` - Add beliefs to AvatarData

---

### 5. No BLUR Method Implementation (CRITICAL)
**Required:** Complete BLUR method for cold email lead generation
**Current:** Not implemented at all
**Impact:** Missing one of three core EYO components

**BLUR Method Components Needed:**
- Generate 1-page industry report with AI
- Blur pages 2+ requiring call to unlock
- Create PDF preview with blur effect
- Email template generation
- Call booking integration

**Files To Create:**
- `server/routes/blurMethod.js` - Generate report
- `src/pages/BlurMethod.tsx` - UI for report creation
- Type definitions for BLUR data

---

## HIGH PRIORITY ISSUES

### 6. Sequential vs Swarm Architecture (HIGH)
**Current:** Sequential agent processing
**Required:** Swarm/parallel processing
**Impact:** 20-30 minute generation time could be 5-10 minutes

**Current Issues:**
- Manifold workflow: 13 sequential nodes (2-4 minutes each) = 26-52 minutes
- Launch doc: 38 sequential sections (20-30 seconds each) = 12-19 minutes
- Total sequential time: 38-71 minutes

**Files Affected:**
- `server/routes/manifoldWorkflow.js:28-90` - Sequential loop
- `server/routes/launchDocument.js:84-120` - Sequential generation

---

### 7. Clerk Subscription Not Enforced (HIGH)
**Current:** Authentication without subscription check
**Required:** Require active subscription to use tool
**Impact:** No revenue gate on tool access

**Files Affected:**
- `src/App.tsx:19-67` - ProtectedRoute components
- Add subscription middleware on backend
- Check subscription status before API calls

---

### 8. No Dashboard Generation Options (HIGH)
**Current:** Basic dashboard with progress tracking
**Required:** Generate multiple content variations

**Required Features:**
- Ad Scripts (3 variations)
- Ad Copy (3 variations)
- Landing Page Copy (single)
- Booking Page Copy (single)
- Thank You Page Copy (single)
- VSL Script (single)
- Static Ad Images (design specs + prompts)
- Build Funnel (Lovable API integration)

**Files Affected:**
- `src/pages/Dashboard.tsx:59-249` - Add generation grid
- Create new API routes for each content type
- Add progressive unlock logic

---

### 9. No Lovable API Integration (HIGH)
**Required:** Generate landing pages via Lovable API
**Current:** Not implemented
**Impact:** Missing "Build Funnel" feature

**What's Needed:**
- Lovable API client configuration
- Endpoint to send page specs
- Handle API responses and page URLs
- Store generated page data

**Files To Create:**
- `server/config/lovable.js` - API client
- `server/routes/lovable.js` - Integration routes

---

### 10. Competitor Analysis Required (MEDIUM)
**Current:** Required step in workflow
**Required:** Optional with smart defaults
**Impact:** Unnecessary friction in user flow

**Files Affected:**
- `src/pages/CompetitorIntelligence.tsx` - Add "Skip" option
- `server/routes/competitorAnalysis.js` - Generate defaults

---

## MEDIUM PRIORITY ISSUES

### 11. No Progressive Unlock (MEDIUM)
**Current:** All dashboard options always visible
**Required:** Unlock features as prerequisites complete
**Impact:** User confusion about order

**Unlock Logic:**
- Offer Builder: Always available
- Avatar Builder: After offer complete
- Competitor Intelligence: After avatar (optional)
- Avatar Bible: After avatar + offer
- Launch Document: After all above
- Dashboard generation: After launch doc

**Files Affected:**
- `src/pages/Dashboard.tsx:66-107` - Add lock logic

---

### 12. Export Not Implemented (MEDIUM)
**Current:** Placeholder buttons
**Required:** Export to PDF, DOCX, MD
**Impact:** Cannot deliver final documents

**Files Affected:**
- `src/pages/LaunchDocument.tsx:150-153` - Implement export
- `server/routes/export.js` - Not found, needs creation

---

### 13. Launch Document Content (MEDIUM)
**Current:** Generic Todd Brown E5 methodology
**Required:** Easy Yes System methodology
**Impact:** Content not aligned with EYO

**Current Sections (38):** Generic marketing brief
**Required Updates:**
- Add belief engineering copy sections
- Add 15-30 minute close script
- Add BLUR report specifications
- Update all prompts for EYO focus

**Files Affected:**
- `server/routes/launchDocument.js:4-43` - Section definitions
- `server/routes/launchDocument.js:45-81` - Prompt templates

---

### 14. No Branding Configuration (MEDIUM)
**Required:** Project-level branding settings
**Current:** Static branding
**Impact:** Cannot customize for client projects

**Fields Needed:**
- Company name
- Logo URL
- Brand colors
- Font preferences
- Voice/tone settings

**Files To Update:**
- `src/types/index.ts` - Add BrandingData interface
- Project store to include branding
- Use branding in all generated content

---

### 15. Missing VSL Script Format (MEDIUM)
**Current:** VSL section in launch doc is outline
**Required:** Full production script
**Impact:** Not ready for filming

**Required Format:**
- Scene-by-scene breakdown
- Word-for-word script
- Visual cues
- CTA placement
- Estimated timing

---

## LOW PRIORITY ISSUES

### 16. No Calendar Integration Field (LOW)
**Required:** Generic embed field for calendars
**Current:** Not implemented

**Files To Update:**
- Add to project settings
- Display in booking page copy generation

---

### 17. No Mobile Testing Documentation (LOW)
**Required:** Verify mobile responsiveness
**Current:** Built with responsive classes but untested

---

### 18. No Usage Limits (LOW)
**Required:** Reasonable soft limits on generations
**Current:** Unlimited API calls possible
**Impact:** Cost control

---

### 19. API Rate Limiting (LOW)
**Current:** No rate limiting on endpoints
**Required:** Protect against abuse

---

### 20. Environment Variables Documentation (LOW)
**Current:** Basic .env.example
**Required:** Comprehensive documentation for all EYO features

**New Variables Needed:**
```env
# PostgreSQL
DATABASE_URL=

# Lovable API
LOVABLE_API_KEY=
LOVABLE_API_URL=

# Clerk Subscription
CLERK_SUBSCRIPTION_WEBHOOK_SECRET=

# Feature Flags
ENABLE_BLUR_METHOD=true
ENABLE_BELIEF_ENGINEERING=true
```

---

## TYPE DEFINITION GAPS

### Missing Types for EYO Features:
1. **BlurReportData** - BLUR method reports
2. **BeliefData** - 6 beliefs framework
3. **ContentVariation** - Ad script/copy variations
4. **LovableConfig** - Lovable API integration
5. **BrandingData** - Project-level branding
6. **EYOOfferScore** - New scoring system
7. **CloseScript** - 15-30 minute close data
8. **VSLProductionScript** - Full VSL script format

---

## DEPLOYMENT BLOCKERS

1. **SQLite → PostgreSQL** - Must migrate before Railway
2. **CORS Configuration** - Not set for production domains
3. **Environment Variables** - Not configured for Vercel/Railway split
4. **Build Process** - May need adjustment for monorepo deployment

---

## SUMMARY STATISTICS

**Total Issues:** 20
**Critical:** 5
**High:** 5
**Medium:** 7
**Low:** 3

**Estimated Fix Time:**
- Critical issues: 40-60 hours
- High priority: 30-40 hours
- Medium priority: 20-30 hours
- Low priority: 10-15 hours
**Total:** 100-145 hours

---

## NEXT STEPS

1. ✅ Complete reference document analysis (Task 3)
2. Design comprehensive system architecture (Task 4)
3. Write detailed implementation plan (Task 5)
4. Get user approval
5. Execute build with Claude Code Swarm
