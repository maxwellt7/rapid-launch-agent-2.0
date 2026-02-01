# System Architecture - Rapid Launch Agent 2.0 (Easy Yes System)
**Version:** 2.0
**Date:** 2026-01-31
**Status:** Design Phase

---

## TABLE OF CONTENTS

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Database Architecture](#3-database-architecture)
4. [Backend API Architecture](#4-backend-api-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [AI Generation System](#6-ai-generation-system)
7. [Integration Architecture](#7-integration-architecture)
8. [Feature Specifications](#8-feature-specifications)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Data Flow Diagrams](#10-data-flow-diagrams)
11. [Security & Performance](#11-security--performance)

---

## 1. SYSTEM OVERVIEW

### 1.1 Purpose
Transform Rapid Launch Agent into Easy Yes System (EYO) - a tool for marketing agencies to create $297-$497 offers that generate $5-10k/month.

### 1.2 Core Components
1. **Easy Yes Offer Builder** - Evaluate and optimize offers using EYO criteria
2. **Avatar Builder with Belief Engineering** - 6 beliefs framework integration
3. **Avatar Bible (Manifold)** - Deep psychological profiling
4. **BLUR Method Generator** - Industry report for cold email lead gen
5. **Launch Document** - 38-section marketing brief adapted for EYO
6. **Dashboard Generation Hub** - Multi-format content generation
7. **Lovable Integration** - AI-powered landing page builder

### 1.3 User Flow
```
Sign Up (Clerk) → Subscribe → Create Project →
Offer Builder → Avatar Builder → [Optional: Competitor] →
Manifold Workflow → Launch Document →
Dashboard (Generate Content) → Export/Deploy
```

---

## 2. TECHNOLOGY STACK

### 2.1 Frontend
```json
{
  "framework": "React 18.2.0",
  "language": "TypeScript 5.x",
  "build": "Vite 5.x",
  "routing": "React Router DOM 6.x",
  "state": "Zustand 4.x (with persist)",
  "styling": "Tailwind CSS 3.x",
  "ui": "Headless UI + Lucide Icons",
  "markdown": "react-markdown",
  "deployment": "Vercel"
}
```

### 2.2 Backend
```json
{
  "runtime": "Node.js 20.x",
  "framework": "Express 4.x",
  "language": "JavaScript (ES Modules)",
  "database": "PostgreSQL 15+ (Railway managed)",
  "orm": "pg + manual queries",
  "ai": "@anthropic-ai/sdk 0.27.0",
  "auth": "@clerk/clerk-sdk-node",
  "deployment": "Railway"
}
```

### 2.3 External Services
```json
{
  "ai": "Anthropic Claude Sonnet 4.5",
  "auth": "Clerk (with subscriptions)",
  "pageBuilder": "Lovable API",
  "database": "Railway PostgreSQL",
  "hosting": "Vercel (frontend) + Railway (backend)",
  "storage": "Railway Volumes (temp files)"
}
```

---

## 3. DATABASE ARCHITECTURE

### 3.1 PostgreSQL Schema

#### **Table: users**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- Clerk user ID
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  subscription_tier TEXT,           -- 'none', 'active'
  subscription_status TEXT,         -- 'active', 'canceled', 'expired'
  subscription_started_at TIMESTAMP,
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_status);
```

#### **Table: projects**
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,              -- proj_[timestamp]
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  current_step INTEGER DEFAULT 1,

  -- Branding
  company_name TEXT,
  logo_url TEXT,
  brand_color_primary TEXT,
  brand_color_secondary TEXT,
  brand_voice TEXT,                 -- 'professional', 'casual', 'authoritative'

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, name)
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_updated ON projects(updated_at DESC);
```

#### **Table: offers**
```sql
CREATE TABLE offers (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Offer Details
  target_market TEXT NOT NULL,
  pressing_problem TEXT NOT NULL,
  desired_outcome TEXT,
  product_description TEXT NOT NULL,
  product_promise TEXT,
  proof_elements TEXT,
  pricing TEXT,
  guarantee TEXT,

  -- EYO Scoring (replaces Hormozi)
  clarity_of_outcome INTEGER,       -- 1-10
  gravity_of_problem INTEGER,       -- 1-10
  belief_in_diagnosis INTEGER,      -- 1-10
  natural_fit INTEGER,              -- 1-10
  clear_offer INTEGER,              -- 1-10
  total_score INTEGER,              -- out of 50

  -- AI Analysis
  analysis_json JSONB,              -- Full analysis including recommendations

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(project_id)
);

CREATE INDEX idx_offers_project ON offers(project_id);
```

#### **Table: avatars**
```sql
CREATE TABLE avatars (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Demographics
  age_range TEXT,
  gender TEXT,
  location TEXT,
  income_range TEXT,
  education TEXT,
  occupation TEXT,

  -- WEB Analysis
  wants JSONB,                      -- Array of wants
  emotions JSONB,                   -- Array of emotions
  beliefs JSONB,                    -- Array of beliefs
  dominant_emotion TEXT,

  -- 6 Beliefs Framework (NEW)
  belief_outcome JSONB,             -- {status: 'closed'|'receptive'|'transformed', notes: '...'}
  belief_identity JSONB,
  belief_problem JSONB,
  belief_solution JSONB,
  belief_product JSONB,
  belief_credibility JSONB,

  -- Empathy Map
  seeing JSONB,
  hearing JSONB,
  saying JSONB,
  thinking JSONB,
  feeling JSONB,
  doing JSONB,
  pains JSONB,
  gains JSONB,

  -- Goals Grid
  pains_frustrations JSONB,
  fears_implications JSONB,
  goals_desires JSONB,
  dreams_aspirations JSONB,

  -- Synthesis
  primary_currency TEXT,            -- Time, Money, Status, etc.
  million_dollar_message TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(project_id)
);

CREATE INDEX idx_avatars_project ON avatars(project_id);
```

#### **Table: competitors**
```sql
CREATE TABLE competitors (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  industry TEXT,
  competitors JSONB,                -- Array of competitor objects
  market_intelligence JSONB,
  positioning_angles JSONB,
  market_gaps JSONB,
  mvp_features JSONB,
  distribution_strategy TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(project_id)
);

CREATE INDEX idx_competitors_project ON competitors(project_id);
```

#### **Table: manifold_results**
```sql
CREATE TABLE manifold_results (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- 14 Node Results (stored as text for flexibility)
  build_a_buyer TEXT,
  pain_matrix TEXT,
  core_wound TEXT,
  benefit_matrix TEXT,
  desire_daisy_chain TEXT,
  resonance_hierarchy TEXT,
  rh_constraints TEXT,
  dissolution TEXT,
  epiphany_threshold TEXT,
  hooks TEXT,
  story_prompts TEXT,
  language_patterns TEXT,
  concentric_circles TEXT,
  ejection_triggers TEXT,

  -- Metadata
  generation_time_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(project_id)
);

CREATE INDEX idx_manifold_project ON manifold_results(project_id);
```

#### **Table: launch_doc_generations**
```sql
CREATE TABLE launch_doc_generations (
  id TEXT PRIMARY KEY,              -- gen_[timestamp]
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  status TEXT NOT NULL,             -- 'pending', 'in_progress', 'completed', 'failed'
  total_sections INTEGER DEFAULT 38,
  completed_sections INTEGER DEFAULT 0,

  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  error_message TEXT,

  UNIQUE(project_id, started_at)
);

CREATE INDEX idx_launchdoc_project ON launch_doc_generations(project_id);
CREATE INDEX idx_launchdoc_status ON launch_doc_generations(status, started_at DESC);
```

#### **Table: launch_doc_sections**
```sql
CREATE TABLE launch_doc_sections (
  id SERIAL PRIMARY KEY,
  generation_id TEXT NOT NULL REFERENCES launch_doc_generations(id) ON DELETE CASCADE,

  section_number INTEGER NOT NULL,
  section_key TEXT NOT NULL,
  section_title TEXT NOT NULL,
  content TEXT NOT NULL,

  generated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(generation_id, section_number)
);

CREATE INDEX idx_sections_generation ON launch_doc_sections(generation_id, section_number);
```

#### **Table: blur_reports** (NEW)
```sql
CREATE TABLE blur_reports (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  report_title TEXT NOT NULL,
  industry TEXT NOT NULL,
  target_market TEXT NOT NULL,

  -- Content
  page_1_content TEXT,              -- Visible preview page
  full_report_content TEXT,         -- Complete report (behind blur)

  -- Design
  design_template TEXT DEFAULT 'professional',
  cover_image_url TEXT,

  -- Generation metadata
  generated_at TIMESTAMP DEFAULT NOW(),
  pdf_url TEXT,                     -- Generated PDF location

  UNIQUE(project_id)
);

CREATE INDEX idx_blur_project ON blur_reports(project_id);
```

#### **Table: content_generations** (NEW)
```sql
CREATE TABLE content_generations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  content_type TEXT NOT NULL,       -- 'ad_script', 'ad_copy', 'landing_page', etc.
  variation_number INTEGER,         -- 1, 2, 3 for variations

  title TEXT,
  content TEXT NOT NULL,
  metadata JSONB,                   -- Type-specific metadata

  generated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(project_id, content_type, variation_number)
);

CREATE INDEX idx_content_project ON content_generations(project_id);
CREATE INDEX idx_content_type ON content_generations(content_type);
```

#### **Table: lovable_deployments** (NEW)
```sql
CREATE TABLE lovable_deployments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content_generation_id TEXT REFERENCES content_generations(id),

  page_type TEXT NOT NULL,          -- 'landing', 'booking', 'thank_you'
  lovable_project_id TEXT,
  deployment_url TEXT,

  status TEXT DEFAULT 'pending',    -- 'pending', 'building', 'deployed', 'failed'
  error_message TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  deployed_at TIMESTAMP
);

CREATE INDEX idx_lovable_project ON lovable_deployments(project_id);
```

#### **Table: usage_tracking** (NEW)
```sql
CREATE TABLE usage_tracking (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,

  action_type TEXT NOT NULL,        -- 'offer_analysis', 'content_generation', etc.
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 4),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_user ON usage_tracking(user_id, created_at DESC);
CREATE INDEX idx_usage_month ON usage_tracking(created_at);
```

### 3.2 Migration Strategy

**From SQLite to PostgreSQL:**

1. **Export existing data** (if any test data exists)
2. **Run PostgreSQL schema creation**
3. **Transform data format** (JSON to JSONB, etc.)
4. **Import to PostgreSQL**
5. **Verify data integrity**
6. **Update connection strings**

**Migration Script Location:**
`server/migrations/001_initial_schema.sql`

---

## 4. BACKEND API ARCHITECTURE

### 4.1 API Structure

```
server/
├── index.js                    # Express app initialization
├── config/
│   ├── database.js             # PostgreSQL connection & helpers
│   ├── anthropic.js            # Claude API client
│   ├── lovable.js              # Lovable API client (NEW)
│   └── clerk.js                # Clerk webhook handler (NEW)
├── middleware/
│   ├── auth.js                 # Clerk JWT verification
│   ├── subscription.js         # Subscription gating (NEW)
│   ├── rateLimit.js            # Rate limiting (NEW)
│   └── errorHandler.js         # Centralized error handling
├── routes/
│   ├── auth.js                 # Auth/subscription endpoints (NEW)
│   ├── projects.js             # Project CRUD (NEW)
│   ├── offerAnalysis.js        # EYO offer scoring (UPDATED)
│   ├── offerImprovement.js     # Apply improvements (NEW)
│   ├── avatarAnalysis.js       # Avatar + 6 beliefs (UPDATED)
│   ├── competitorAnalysis.js   # Optional competitor (UPDATED)
│   ├── manifoldWorkflow.js     # Swarm orchestration (UPDATED)
│   ├── launchDocument.js       # EYO launch doc (UPDATED)
│   ├── blurMethod.js           # BLUR report generation (NEW)
│   ├── contentGeneration.js    # Dashboard generations (NEW)
│   ├── lovableIntegration.js   # Page builder (NEW)
│   ├── export.js               # PDF/DOCX/MD export (UPDATED)
│   └── query.js                # AI query interface (existing)
├── services/
│   ├── swarm/
│   │   ├── orchestrator.js     # Parallel agent coordinator (NEW)
│   │   ├── offerSwarm.js       # Offer analysis swarm (NEW)
│   │   ├── avatarSwarm.js      # Avatar analysis swarm (NEW)
│   │   ├── manifoldSwarm.js    # Manifold parallel nodes (NEW)
│   │   └── launchDocSwarm.js   # Launch doc parallel sections (NEW)
│   ├── copywriting/
│   │   ├── beliefEngine.js     # 6 beliefs prompts (NEW)
│   │   ├── adGenerator.js      # Ad scripts/copy (NEW)
│   │   ├── vslGenerator.js     # VSL scripts (NEW)
│   │   └── emailGenerator.js   # Email sequences (NEW)
│   ├── pdf/
│   │   ├── blurPDF.js          # BLUR report PDF (NEW)
│   │   └── exportPDF.js        # Launch doc export (NEW)
│   └── utils/
│       ├── helpers.js          # Shared utilities
│       ├── validators.js       # Input validation (NEW)
│       └── logger.js           # Logging (NEW)
└── prompts/
    ├── offer/
    │   ├── eyo_scoring.txt     # EYO scoring prompt (NEW)
    │   └── improvements.txt    # Improvement suggestions
    ├── avatar/
    │   ├── beliefs.txt         # 6 beliefs analysis (NEW)
    │   ├── web_analysis.txt    # WEB analysis
    │   └── synthesis.txt       # Avatar synthesis
    ├── manifold/
    │   └── [14 node prompts]   # One per node
    ├── content/
    │   ├── ad_script.txt       # Ad script generation (NEW)
    │   ├── ad_copy.txt         # Ad copy generation (NEW)
    │   ├── landing_page.txt    # Landing page copy (NEW)
    │   ├── vsl_script.txt      # VSL script (NEW)
    │   └── email_sequence.txt  # Email sequence (NEW)
    └── launch_doc/
        └── [38 section prompts] # EYO-adapted sections
```

### 4.2 API Endpoints

#### **Authentication & Subscription**
```
POST   /api/auth/webhook          # Clerk webhook for user sync
GET    /api/auth/subscription     # Get subscription status
POST   /api/auth/verify           # Verify JWT token
```

#### **Projects**
```
GET    /api/projects              # List user projects
POST   /api/projects              # Create new project
GET    /api/projects/:id          # Get project details
PUT    /api/projects/:id          # Update project
DELETE /api/projects/:id          # Delete project
```

#### **Offer Analysis (EYO)**
```
POST   /api/analyze/offer         # Analyze offer with EYO scoring
POST   /api/offer/apply-improvements  # Auto-apply improvements
GET    /api/offer/:projectId      # Get offer data
```

#### **Avatar Analysis (Beliefs)**
```
POST   /api/analyze/avatar        # Analyze avatar with 6 beliefs
GET    /api/avatar/:projectId     # Get avatar data
```

#### **Competitors (Optional)**
```
POST   /api/analyze/competitors   # Analyze competitors
POST   /api/competitors/skip      # Skip with defaults
GET    /api/competitors/:projectId  # Get competitor data
```

#### **Manifold Workflow (Swarm)**
```
POST   /api/analyze/manifold      # Run manifold swarm
GET    /api/manifold/progress/:id # Get progress
GET    /api/manifold/:projectId   # Get results
```

#### **Launch Document (EYO)**
```
POST   /api/generate/launch-document  # Generate EYO launch doc
GET    /api/generation/progress/:generationId  # Poll progress
GET    /api/generation/latest/:projectId  # Get latest generation
GET    /api/launch-doc/:projectId  # Get launch doc data
```

#### **BLUR Method (NEW)**
```
POST   /api/blur/generate         # Generate BLUR report
GET    /api/blur/:projectId       # Get BLUR report
GET    /api/blur/:projectId/pdf   # Download PDF
POST   /api/blur/email-preview    # Generate email copy
```

#### **Content Generation (NEW)**
```
POST   /api/content/ad-scripts    # Generate 3 ad script variations
POST   /api/content/ad-copy       # Generate 3 ad copy variations
POST   /api/content/landing-page  # Generate landing page copy
POST   /api/content/booking-page  # Generate booking page copy
POST   /api/content/thank-you-page  # Generate thank you page copy
POST   /api/content/vsl-script    # Generate VSL script
POST   /api/content/ad-images     # Generate image prompts + specs
GET    /api/content/:projectId/:type  # Get generated content
```

#### **Lovable Integration (NEW)**
```
POST   /api/lovable/deploy        # Deploy page to Lovable
GET    /api/lovable/status/:deploymentId  # Check deployment status
GET    /api/lovable/:projectId    # Get all deployments
```

#### **Export**
```
POST   /api/export/pdf            # Export launch doc as PDF
POST   /api/export/docx           # Export launch doc as DOCX
POST   /api/export/md             # Export launch doc as Markdown
POST   /api/export/project        # Export entire project (JSON)
```

#### **Query Interface**
```
POST   /api/query                 # Ask AI questions about project
```

### 4.3 Middleware Stack

**Request Pipeline:**
```javascript
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Authentication (all routes except webhooks)
app.use('/api/*', authMiddleware);

// Subscription gating (all routes except auth)
app.use('/api/projects', subscriptionMiddleware);
app.use('/api/analyze/*', subscriptionMiddleware);
app.use('/api/generate/*', subscriptionMiddleware);
app.use('/api/content/*', subscriptionMiddleware);

// Rate limiting (per user)
app.use('/api/analyze/*', rateLimitMiddleware);
app.use('/api/generate/*', rateLimitMiddleware);

// Error handling (last)
app.use(errorHandler);
```

---

## 5. FRONTEND ARCHITECTURE

### 5.1 Component Structure

```
src/
├── pages/
│   ├── Landing.tsx             # Public landing page
│   ├── Pricing.tsx             # Pricing page
│   ├── Home.tsx                # Project selection
│   ├── Projects.tsx            # Project management
│   ├── OfferBuilder.tsx        # EYO offer analysis (UPDATED)
│   ├── AvatarBuilder.tsx       # Avatar + 6 beliefs (UPDATED)
│   ├── CompetitorIntelligence.tsx  # Optional competitor
│   ├── Manifold.tsx            # Manifold workflow
│   ├── LaunchDocument.tsx      # Launch doc generation
│   ├── Dashboard.tsx           # Generation hub (UPDATED)
│   ├── BlurMethod.tsx          # BLUR report generator (NEW)
│   ├── ProjectSummary.tsx      # Project overview
│   ├── PrivacyPolicy.tsx       # Privacy policy
│   └── TermsOfService.tsx      # Terms of service
├── components/
│   ├── Layout.tsx              # Main layout wrapper
│   ├── Navigation.tsx          # Top nav with user menu
│   ├── Sidebar.tsx             # Project sidebar
│   ├── ProgressBar.tsx         # Step progress indicator
│   ├── LoadingState.tsx        # Loading spinner/skeleton
│   ├── ErrorBoundary.tsx       # Error boundaries
│   ├── SubscriptionGate.tsx    # Subscription check (NEW)
│   ├── ProgressiveLock.tsx     # Feature unlock indicator (NEW)
│   ├── offer/
│   │   ├── OfferForm.tsx       # Offer input form
│   │   ├── EOYScoreCard.tsx    # EYO score display (NEW)
│   │   ├── ImprovementsPanel.tsx  # Improvements list (NEW)
│   │   └── ApplyButton.tsx     # Apply improvements (NEW)
│   ├── avatar/
│   │   ├── DemographicsTab.tsx
│   │   ├── WEBTab.tsx
│   │   ├── BeliefsTab.tsx      # 6 beliefs interface (NEW)
│   │   ├── EmpathyMapTab.tsx
│   │   └── GoalsGridTab.tsx
│   ├── manifold/
│   │   ├── NodeList.tsx
│   │   ├── NodeProgress.tsx    # Swarm progress (UPDATED)
│   │   └── NodeResults.tsx
│   ├── launch-doc/
│   │   ├── TableOfContents.tsx
│   │   ├── SectionViewer.tsx
│   │   ├── GenerationProgress.tsx  # Real-time progress
│   │   └── ExportButtons.tsx
│   ├── dashboard/
│   │   ├── GenerationGrid.tsx  # Content generation options (NEW)
│   │   ├── VariationCard.tsx   # Display variations (NEW)
│   │   ├── ProgressiveUnlock.tsx  # Lock/unlock UI (NEW)
│   │   └── QueryInterface.tsx
│   ├── blur/
│   │   ├── ReportPreview.tsx   # BLUR report preview (NEW)
│   │   ├── EmailGenerator.tsx  # Email copy generator (NEW)
│   │   └── PDFDownload.tsx     # Download button (NEW)
│   └── lovable/
│       ├── PageBuilder.tsx     # Lovable integration (NEW)
│       ├── DeployStatus.tsx    # Deployment status (NEW)
│       └── PreviewFrame.tsx    # Page preview (NEW)
├── services/
│   ├── api.ts                  # API client (UPDATED)
│   ├── auth.ts                 # Clerk integration
│   └── websocket.ts            # Real-time updates (NEW)
├── store/
│   ├── useProjectStore.ts      # Project state (UPDATED)
│   ├── useAuthStore.ts         # Auth state (NEW)
│   └── useUIStore.ts           # UI state (NEW)
├── types/
│   ├── index.ts                # All TypeScript types (UPDATED)
│   ├── eyo.ts                  # EYO-specific types (NEW)
│   ├── beliefs.ts              # Belief system types (NEW)
│   └── content.ts              # Content generation types (NEW)
├── hooks/
│   ├── useSubscription.ts      # Subscription check (NEW)
│   ├── useProgressiveLock.ts   # Feature lock logic (NEW)
│   ├── usePolling.ts           # Progress polling (NEW)
│   └── useDebounce.ts          # Debounce hook
└── utils/
    ├── formatting.ts           # Text formatting
    ├── validation.ts           # Form validation
    └── export.ts               # Export helpers

```

### 5.2 State Management

**Zustand Store Structure:**

```typescript
// Project Store
interface ProjectStore {
  currentProject: Project | null;
  projects: Project[];
  createProject: (name: string) => void;
  loadProject: (id: string) => void;
  updateOffer: (data: OfferData) => void;
  updateAvatar: (data: AvatarData) => void;
  updateCompetitors: (data: CompetitorData) => void;
  updateManifold: (data: ManifoldData) => void;
  updateLaunchDoc: (data: LaunchDocData) => void;
  updateBlur: (data: BlurData) => void;        // NEW
  updateContent: (data: ContentData) => void;  // NEW
  setCurrentStep: (step: number) => void;
  deleteProject: (id: string) => void;
}

// Auth Store (NEW)
interface AuthStore {
  user: User | null;
  subscription: Subscription | null;
  isSubscribed: boolean;
  checkSubscription: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
}

// UI Store (NEW)
interface UIStore {
  sidebarOpen: boolean;
  loadingStates: Map<string, boolean>;
  progressStates: Map<string, number>;
  toggleSidebar: () => void;
  setLoading: (key: string, loading: boolean) => void;
  setProgress: (key: string, progress: number) => void;
}
```

### 5.3 Routing

```typescript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Landing />} />
  <Route path="/privacy" element={<PrivacyPolicy />} />
  <Route path="/terms" element={<TermsOfService />} />

  {/* Protected - No Subscription Check */}
  <Route path="/pricing" element={
    <ProtectedRoute><Pricing /></ProtectedRoute>
  } />

  {/* Protected + Subscription Required */}
  <Route element={<ProtectedRoute requireSubscription />}>
    <Route path="/home" element={<Home />} />
    <Route path="/projects" element={<Projects />} />

    {/* Project Routes (require active project) */}
    <Route path="/project" element={<ProjectLayout />}>
      <Route path="offer" element={<OfferBuilder />} />
      <Route path="avatar" element={<AvatarBuilder />} />
      <Route path="competitors" element={<CompetitorIntelligence />} />
      <Route path="manifold" element={<Manifold />} />
      <Route path="launch-doc" element={<LaunchDocument />} />
      <Route path="blur" element={<BlurMethod />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="summary" element={<ProjectSummary />} />
    </Route>
  </Route>
</Routes>
```

---

## 6. AI GENERATION SYSTEM

### 6.1 Swarm Orchestration Architecture

**Concept:** Replace sequential agent calls with parallel swarm execution.

**Benefits:**
- **Performance:** 5-10 minutes vs 20-30 minutes
- **Resilience:** Failed nodes don't block others
- **Scalability:** Easy to add more nodes

#### **Swarm Orchestrator**

```javascript
// services/swarm/orchestrator.js

class SwarmOrchestrator {
  constructor() {
    this.maxParallel = 5;  // Process 5 nodes at once
    this.retryAttempts = 3;
  }

  async runSwarm(nodes, context) {
    const results = new Map();
    const queue = [...nodes];
    const inProgress = new Set();

    while (queue.length > 0 || inProgress.size > 0) {
      // Start new nodes up to maxParallel
      while (queue.length > 0 && inProgress.size < this.maxParallel) {
        const node = queue.shift();
        inProgress.add(node.id);

        this.executeNode(node, context)
          .then(result => {
            results.set(node.id, result);
            inProgress.delete(node.id);
            this.onProgress(results.size, nodes.length);
          })
          .catch(error => {
            this.onError(node.id, error);
            if (this.shouldRetry(node)) {
              queue.push(node);  // Retry
            }
            inProgress.delete(node.id);
          });
      }

      // Wait a bit before checking again
      await this.sleep(1000);
    }

    return results;
  }

  async executeNode(node, context) {
    const prompt = this.buildPrompt(node, context);
    return await callClaude(node.systemPrompt, prompt, node.options);
  }
}
```

### 6.2 Offer Analysis Swarm (NEW)

**Nodes:** Run in parallel
1. **EYO Scoring** - Calculate 5 EYO scores
2. **Improvement Generation** - Generate 10 improvements
3. **Avatar Suggestions** - Suggest avatar demographics
4. **Belief Analysis** - Analyze required beliefs
5. **Market Validation** - Validate market fit

**Result:** Complete offer analysis in ~30-45 seconds vs 2-3 minutes

```javascript
// services/swarm/offerSwarm.js

export async function analyzeOfferSwarm(offerData) {
  const nodes = [
    { id: 'eyo_scoring', priority: 1 },
    { id: 'improvements', priority: 1 },
    { id: 'avatar_suggest', priority: 2 },
    { id: 'beliefs', priority: 2 },
    { id: 'market_validation', priority: 3 },
  ];

  const swarm = new SwarmOrchestrator();
  const results = await swarm.runSwarm(nodes, { offer: offerData });

  return {
    eyoScore: results.get('eyo_scoring'),
    improvements: results.get('improvements'),
    suggestedAvatar: results.get('avatar_suggest'),
    requiredBeliefs: results.get('beliefs'),
    marketValidation: results.get('market_validation'),
  };
}
```

### 6.3 Manifold Swarm (UPDATED)

**Current:** 14 sequential nodes = 26-52 minutes
**New:** 3 waves of parallel execution = 6-12 minutes

**Wave 1 (Parallel):**
- Build A Buyer
- Pain Matrix
- Core Wound

**Wave 2 (Parallel, depends on Wave 1):**
- Benefit Matrix
- Desire Daisy Chain
- Resonance Hierarchy
- RH Constraints

**Wave 3 (Parallel, depends on Wave 2):**
- Dissolution
- Epiphany Threshold
- Hooks
- Story Prompts
- Language Patterns
- Concentric Circles
- Ejection Triggers

```javascript
// services/swarm/manifoldSwarm.js

export async function runManifoldSwarm(context) {
  const swarm = new SwarmOrchestrator();

  // Wave 1
  const wave1Results = await swarm.runSwarm(WAVE_1_NODES, context);

  // Wave 2 (pass Wave 1 results as additional context)
  const wave2Context = { ...context, ...wave1Results };
  const wave2Results = await swarm.runSwarm(WAVE_2_NODES, wave2Context);

  // Wave 3
  const wave3Context = { ...wave2Context, ...wave2Results };
  const wave3Results = await swarm.runSwarm(WAVE_3_NODES, wave3Context);

  return {
    ...wave1Results,
    ...wave2Results,
    ...wave3Results,
  };
}
```

### 6.4 Launch Document Swarm (NEW)

**Current:** 38 sequential sections = 12-19 minutes
**New:** Batch processing = 4-6 minutes

**Batching Strategy:**
- Process 8 sections at a time
- 5 batches total
- Each batch takes ~60-90 seconds

```javascript
// services/swarm/launchDocSwarm.js

export async function generateLaunchDocSwarm(context, generationId) {
  const BATCH_SIZE = 8;
  const sections = LAUNCH_DOC_SECTIONS;

  for (let i = 0; i < sections.length; i += BATCH_SIZE) {
    const batch = sections.slice(i, i + BATCH_SIZE);
    const swarm = new SwarmOrchestrator();

    const results = await swarm.runSwarm(
      batch.map(s => ({
        id: s.key,
        systemPrompt: SECTION_SYSTEM_PROMPT,
        userPrompt: buildSectionPrompt(s, context),
      })),
      context
    );

    // Save batch results immediately
    for (const [key, content] of results.entries()) {
      const section = batch.find(s => s.key === key);
      launchDocDB.saveSection(
        generationId,
        section.id,
        section.title,
        key,
        content
      );
    }
  }

  launchDocDB.updateGenerationStatus(generationId, 'completed');
}
```

### 6.5 Content Generation (NEW)

**Dashboard Generation Options:**

#### **Ad Scripts (3 variations)**
```javascript
// services/copywriting/adGenerator.js

export async function generateAdScripts(projectData) {
  const swarm = new SwarmOrchestrator();

  const nodes = [
    { id: 'script_1', variation: 'problem_focused' },
    { id: 'script_2', variation: 'benefit_focused' },
    { id: 'script_3', variation: 'story_based' },
  ];

  return await swarm.runSwarm(nodes, projectData);
}
```

#### **Ad Copy (3 variations)**
```javascript
export async function generateAdCopy(projectData) {
  const swarm = new SwarmOrchestrator();

  const nodes = [
    { id: 'copy_1', style: 'direct_response' },
    { id: 'copy_2', style: 'storytelling' },
    { id: 'copy_3', style: 'curiosity_gap' },
  ];

  return await swarm.runSwarm(nodes, projectData);
}
```

#### **Landing Page Copy**
```javascript
export async function generateLandingPage(projectData) {
  const sections = [
    'hero',
    'problem_agitation',
    'solution_intro',
    'how_it_works',
    'benefits',
    'social_proof',
    'offer',
    'faq',
    'cta',
  ];

  const swarm = new SwarmOrchestrator();
  return await swarm.runSwarm(
    sections.map(s => ({ id: s, type: 'landing_section' })),
    projectData
  );
}
```

#### **VSL Script**
```javascript
export async function generateVSLScript(projectData) {
  const acts = [
    'hook_pattern_interrupt',
    'story_setup',
    'problem_amplification',
    'discovery_moment',
    'mechanism_explanation',
    'proof_section',
    'offer_reveal',
    'close',
  ];

  const swarm = new SwarmOrchestrator();
  return await swarm.runSwarm(
    acts.map(a => ({ id: a, type: 'vsl_act' })),
    projectData
  );
}
```

### 6.6 BLUR Report Generation (NEW)

```javascript
// services/copywriting/blurGenerator.js

export async function generateBlurReport(projectData) {
  const swarm = new SwarmOrchestrator();

  const nodes = [
    { id: 'report_title', type: 'title' },
    { id: 'page_1_content', type: 'preview_page' },
    { id: 'full_report', type: 'complete_report' },
    { id: 'email_copy', type: 'email_sequence' },
  ];

  const results = await swarm.runSwarm(nodes, projectData);

  // Generate PDF with blur effect
  const pdfUrl = await generateBlurPDF({
    title: results.get('report_title'),
    previewPage: results.get('page_1_content'),
    fullContent: results.get('full_report'),
  });

  return {
    ...results,
    pdfUrl,
  };
}
```

---

## 7. INTEGRATION ARCHITECTURE

### 7.1 Clerk Integration (Enhanced)

**Current:** Basic authentication
**New:** Subscription management

```javascript
// server/config/clerk.js

import { Clerk } from '@clerk/clerk-sdk-node';

const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// Webhook handler for subscription events
export async function handleClerkWebhook(req, res) {
  const event = req.body;

  switch (event.type) {
    case 'user.created':
      await createUser(event.data);
      break;

    case 'user.updated':
      await updateUser(event.data);
      break;

    case 'subscription.created':
      await activateSubscription(event.data);
      break;

    case 'subscription.updated':
      await updateSubscription(event.data);
      break;

    case 'subscription.deleted':
      await cancelSubscription(event.data);
      break;
  }

  res.json({ success: true });
}

// Subscription check middleware
export async function checkSubscription(req, res, next) {
  const userId = req.auth.userId;

  const user = await db.query(
    'SELECT subscription_status, subscription_expires_at FROM users WHERE id = $1',
    [userId]
  );

  if (!user || user.subscription_status !== 'active') {
    return res.status(403).json({
      success: false,
      error: 'Active subscription required',
      subscriptionUrl: '/pricing',
    });
  }

  // Check expiration
  if (new Date(user.subscription_expires_at) < new Date()) {
    return res.status(403).json({
      success: false,
      error: 'Subscription expired',
      subscriptionUrl: '/pricing',
    });
  }

  next();
}
```

**Frontend Hook:**
```typescript
// hooks/useSubscription.ts

export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const response = await api.get('/auth/subscription');
        setSubscription(response.data);
      } catch (error) {
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, []);

  return {
    isSubscribed: subscription?.status === 'active',
    subscription,
    loading,
  };
}
```

### 7.2 Lovable API Integration (NEW)

**Purpose:** Generate and deploy landing pages

```javascript
// server/config/lovable.js

import axios from 'axios';

const lovable = axios.create({
  baseURL: process.env.LOVABLE_API_URL || 'https://api.lovable.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.LOVABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function createLovablePage(spec) {
  try {
    // Create project
    const project = await lovable.post('/projects', {
      name: spec.pageName,
      description: spec.description,
    });

    // Generate page with AI
    const generation = await lovable.post(`/projects/${project.data.id}/generate`, {
      prompt: spec.prompt,
      components: spec.components,
      styling: spec.styling,
    });

    // Deploy
    const deployment = await lovable.post(`/projects/${project.data.id}/deploy`, {
      environment: 'production',
    });

    return {
      projectId: project.data.id,
      url: deployment.data.url,
      status: 'deployed',
    };
  } catch (error) {
    console.error('Lovable API error:', error);
    throw new Error(`Failed to create Lovable page: ${error.message}`);
  }
}

export async function getDeploymentStatus(projectId) {
  const response = await lovable.get(`/projects/${projectId}/status`);
  return response.data;
}
```

**Usage:**
```javascript
// server/routes/lovableIntegration.js

export async function deployToLovable(req, res) {
  const { projectId, pageType, content } = req.body;

  const spec = {
    pageName: `${projectId}-${pageType}`,
    description: `${pageType} page for ${projectId}`,
    prompt: buildLovablePrompt(content, pageType),
    components: extractComponents(content),
    styling: getBrandingStyling(projectId),
  };

  const deployment = await createLovablePage(spec);

  // Save to database
  await db.query(
    `INSERT INTO lovable_deployments (id, project_id, page_type, lovable_project_id, deployment_url, status)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      `deploy_${Date.now()}`,
      projectId,
      pageType,
      deployment.projectId,
      deployment.url,
      'deployed',
    ]
  );

  res.json({
    success: true,
    data: deployment,
  });
}
```

---

## 8. FEATURE SPECIFICATIONS

### 8.1 Progressive Unlock System

**Logic:**
```typescript
const unlockMap = {
  offer: { requires: [], step: 1 },
  avatar: { requires: ['offer'], step: 2 },
  competitors: { requires: ['avatar'], step: 3, optional: true },
  manifold: { requires: ['avatar', 'offer'], step: 4 },
  launchDoc: { requires: ['manifold'], step: 5 },
  dashboard: { requires: ['launchDoc'], step: 6 },
};

function isFeatureUnlocked(feature: string, project: Project): boolean {
  const requirements = unlockMap[feature].requires;

  for (const req of requirements) {
    if (!project[req]) {
      return false;
    }
  }

  return true;
}
```

**UI Component:**
```tsx
// components/ProgressiveLock.tsx

export function ProgressiveLock({ feature, children }) {
  const project = useProjectStore(s => s.currentProject);
  const unlocked = isFeatureUnlocked(feature, project);

  if (!unlocked) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="font-semibold">Feature Locked</p>
            <p className="text-sm text-gray-600 mt-2">
              Complete {getMissingRequirements(feature, project).join(', ')} first
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
```

### 8.2 Export System

**PDF Generation:**
```javascript
// services/pdf/exportPDF.js

import PDFDocument from 'pdfkit';

export async function exportLaunchDocPDF(projectId) {
  const project = await getFullProject(projectId);
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Cover page
  doc.fontSize(24).text(project.name, { align: 'center' });
  doc.fontSize(12).text('Launch Document', { align: 'center' });
  doc.moveDown(2);

  // Table of contents
  doc.fontSize(16).text('Table of Contents');
  doc.moveDown();

  project.launchDoc.sections.forEach((section, i) => {
    doc.fontSize(10)
       .text(`${section.id}. ${section.title}`, {
         link: `#section-${section.id}`,
       });
  });

  doc.addPage();

  // Sections
  project.launchDoc.sections.forEach((section) => {
    doc.fontSize(16)
       .text(section.title, { id: `section-${section.id}` });
    doc.moveDown();

    doc.fontSize(10)
       .text(section.content, { align: 'justify' });

    doc.addPage();
  });

  return doc;
}
```

---

## 9. DEPLOYMENT ARCHITECTURE

### 9.1 Infrastructure

```
┌─────────────────────────────────────────────────────┐
│                    USERS                            │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │   Vercel Edge Network  │
          │   (CDN + Frontend)     │
          └────────┬───────────────┘
                   │
                   ▼
          ┌────────────────────────┐
          │  Railway API Server    │
          │  (Express Backend)     │
          └────┬──────────┬────────┘
               │          │
       ┌───────┘          └────────┐
       ▼                           ▼
┌──────────────┐          ┌─────────────────┐
│ Railway      │          │  External APIs  │
│ PostgreSQL   │          │  - Anthropic    │
│              │          │  - Lovable      │
│              │          │  - Clerk        │
└──────────────┘          └─────────────────┘
```

### 9.2 Environment Variables

**Vercel (Frontend):**
```bash
VITE_API_URL=https://api.rapidlaunchagent.com
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxx
```

**Railway (Backend):**
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx
CLAUDE_MODEL=claude-sonnet-4-5-20250929
CLAUDE_TEMPERATURE=0.7

# Clerk
CLERK_SECRET_KEY=sk_live_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx

# Lovable
LOVABLE_API_KEY=lovable_xxx
LOVABLE_API_URL=https://api.lovable.com/v1

# CORS
CORS_ORIGIN=https://rapidlaunchagent.com,https://www.rapidlaunchagent.com

# Features
ENABLE_BLUR_METHOD=true
ENABLE_SWARM=true
MAX_PARALLEL_NODES=5

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Node
NODE_ENV=production
PORT=5000
```

### 9.3 Deployment Process

**Frontend (Vercel):**
1. Push to GitHub
2. Vercel auto-deploys from `main` branch
3. Environment variables configured in Vercel dashboard
4. Preview deployments for PRs

**Backend (Railway):**
1. Connect Railway to GitHub repo
2. Configure build command: `npm install`
3. Configure start command: `npm start`
4. Set environment variables in Railway dashboard
5. Enable PostgreSQL plugin
6. Auto-deploy on push to `main`

**Database Migrations:**
```bash
# Run migrations on Railway
railway run node server/migrations/run.js
```

---

## 10. DATA FLOW DIAGRAMS

### 10.1 Offer Analysis Flow

```
User Input (Offer Data)
    │
    ▼
Frontend Validation
    │
    ▼
POST /api/analyze/offer
    │
    ▼
Subscription Check Middleware
    │
    ▼
Offer Swarm Orchestrator
    │
    ├──► EYO Scoring Node
    ├──► Improvements Node
    ├──► Avatar Suggestions Node
    ├──► Beliefs Analysis Node
    └──► Market Validation Node
         │
         ▼
    Combine Results
         │
         ▼
    Save to PostgreSQL (offers table)
         │
         ▼
    Return Analysis to Frontend
         │
         ▼
    Display in OfferBuilder
```

### 10.2 Manifold Workflow (Swarm)

```
User Clicks "Run Workflow"
    │
    ▼
POST /api/analyze/manifold
    │
    ▼
Manifold Swarm Orchestrator
    │
    ├──► Wave 1 (Parallel)
    │    ├─ Build A Buyer
    │    ├─ Pain Matrix
    │    └─ Core Wound
    │         │
    ├──► Wave 2 (Parallel, with Wave 1 context)
    │    ├─ Benefit Matrix
    │    ├─ Desire Daisy Chain
    │    ├─ Resonance Hierarchy
    │    └─ RH Constraints
    │         │
    └──► Wave 3 (Parallel, with Wave 1+2 context)
         ├─ Dissolution
         ├─ Epiphany Threshold
         ├─ Hooks
         ├─ Story Prompts
         ├─ Language Patterns
         ├─ Concentric Circles
         └─ Ejection Triggers
              │
              ▼
         Save to PostgreSQL (manifold_results)
              │
              ▼
         Return Results
              │
              ▼
         Display in Manifold UI
```

### 10.3 Launch Document Generation

```
User Clicks "Generate Launch Document"
    │
    ▼
POST /api/generate/launch-document
    │
    ▼
Create Generation Record (launch_doc_generations)
    │
    ▼
Start Background Swarm Process
    │
    ├──► Batch 1 (8 sections in parallel)
    │    Save each section as completed
    │
    ├──► Batch 2 (8 sections in parallel)
    │    Save each section as completed
    │
    ├──► Batch 3 (8 sections in parallel)
    │    Save each section as completed
    │
    ├──► Batch 4 (8 sections in parallel)
    │    Save each section as completed
    │
    └──► Batch 5 (6 sections in parallel)
         Save each section as completed
              │
              ▼
         Mark Generation Complete
              │
         ┌────┴────┐
         ▼         ▼
    Frontend      Database
    Polls         (launch_doc_sections)
    Progress
         │
         ▼
    Display Sections
```

### 10.4 Dashboard Content Generation

```
User Selects "Ad Scripts (3 variations)"
    │
    ▼
Check Progressive Unlock (requires launch doc)
    │
    ▼
POST /api/content/ad-scripts
    │
    ▼
Ad Generator Swarm
    │
    ├──► Variation 1 (Problem-Focused)
    ├──► Variation 2 (Benefit-Focused)
    └──► Variation 3 (Story-Based)
         │
         ▼
    Save to PostgreSQL (content_generations)
         │
         ▼
    Return Variations
         │
         ▼
    Display in Dashboard with Toggle
```

### 10.5 BLUR Method Flow

```
User Clicks "Generate BLUR Report"
    │
    ▼
POST /api/blur/generate
    │
    ▼
BLUR Generator Swarm
    │
    ├──► Report Title
    ├──► Page 1 (Preview)
    ├──► Full Report
    └──► Email Copy
         │
         ▼
    Generate PDF with Blur Effect
         │
         ▼
    Save to PostgreSQL (blur_reports)
         │
         ▼
    Return Report + PDF URL
         │
         ▼
    Display Preview + Download Button
```

### 10.6 Lovable Integration Flow

```
User Clicks "Build Funnel" (Landing Page)
    │
    ▼
POST /api/lovable/deploy
    │
    ▼
Build Lovable Spec from Content
    │
    ├─ Hero Section (from content generation)
    ├─ Problem Agitation (from manifold)
    ├─ Solution (from offer)
    ├─ Social Proof (from project data)
    └─ CTA (from close script)
         │
         ▼
    POST to Lovable API
         │
         ├──► Create Project
         ├──► Generate with AI
         └──► Deploy
              │
              ▼
         Save to PostgreSQL (lovable_deployments)
              │
              ▼
         Return Deployment URL
              │
              ▼
         Display Preview Frame + Live Link
```

---

## 11. SECURITY & PERFORMANCE

### 11.1 Security Measures

**Authentication:**
- Clerk JWT verification on all protected routes
- HTTPS only (enforced by Vercel/Railway)
- Secure cookies for session management

**Authorization:**
- Row-level security (user can only access their projects)
- Subscription gating middleware
- API key validation for external services

**Data Protection:**
- PostgreSQL with encrypted connections
- Environment variables never exposed to frontend
- Sensitive data (API keys) stored in Railway secrets
- Input validation on all endpoints

**Rate Limiting:**
```javascript
// middleware/rateLimit.js

import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,              // 100 requests per minute per user
  keyGenerator: (req) => req.auth.userId,
  message: 'Too many requests, please try again later.',
});

export const generationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 10,                    // 10 generations per hour
  keyGenerator: (req) => req.auth.userId,
  message: 'Generation limit reached. Please wait before generating more content.',
});
```

### 11.2 Performance Optimizations

**Frontend:**
- Code splitting by route
- Lazy loading for heavy components
- Image optimization (Vercel automatic)
- React.memo for expensive re-renders
- Debounced API calls
- Optimistic UI updates
- Service worker for offline support

**Backend:**
- Connection pooling for PostgreSQL
- Caching for repeated queries
- Streaming responses for large content
- Compression middleware
- CDN for static assets

**Database:**
- Indexed columns for fast queries
- JSONB for flexible data storage
- Batch inserts for sections
- Materialized views for analytics

### 11.3 Monitoring

**Metrics to Track:**
- API response times
- Generation success rates
- User subscription status
- AI token usage per user
- Error rates by endpoint
- Database query performance

**Tools:**
- Railway logs and metrics
- Vercel analytics
- Sentry for error tracking
- Custom usage dashboard

---

## SUMMARY

This architecture transforms the Rapid Launch Agent into a comprehensive Easy Yes System by:

1. **Migrating to PostgreSQL** for production scalability
2. **Implementing EYO scoring** to replace Hormozi framework
3. **Integrating 6 beliefs framework** for avatar analysis
4. **Adding BLUR method** for cold email lead generation
5. **Building swarm orchestration** for 5-10x faster generation
6. **Creating dashboard hub** with multi-format content generation
7. **Integrating Lovable API** for landing page deployment
8. **Enforcing subscription gating** via Clerk
9. **Implementing progressive unlock** for better UX
10. **Deploying on Railway + Vercel** for production

**Timeline Estimate:** 100-145 hours
**Priority:** Critical features first, then high, then medium/low

---

**END OF ARCHITECTURE DOCUMENT**
