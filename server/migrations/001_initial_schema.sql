-- Rapid Launch Agent 2.0 - PostgreSQL Schema
-- Easy Yes System Database
-- Version: 1.0.0
-- Date: 2026-01-31

-- Enable UUID extension (if needed for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USERS TABLE
-- =============================================================================
CREATE TABLE users (
  id TEXT PRIMARY KEY,                    -- Clerk user ID
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,

  -- Subscription
  subscription_tier TEXT DEFAULT 'none',  -- 'none', 'active'
  subscription_status TEXT DEFAULT 'none', -- 'active', 'canceled', 'expired', 'none'
  subscription_started_at TIMESTAMP,
  subscription_expires_at TIMESTAMP,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_status);

-- =============================================================================
-- PROJECTS TABLE
-- =============================================================================
CREATE TABLE projects (
  id TEXT PRIMARY KEY,                    -- proj_[timestamp]
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  current_step INTEGER DEFAULT 1,

  -- Branding (NEW for EYO)
  company_name TEXT,
  logo_url TEXT,
  brand_color_primary TEXT DEFAULT '#6366f1',
  brand_color_secondary TEXT DEFAULT '#8b5cf6',
  brand_voice TEXT DEFAULT 'professional', -- 'professional', 'casual', 'authoritative'

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_user_project_name UNIQUE(user_id, name)
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_updated ON projects(updated_at DESC);

-- =============================================================================
-- OFFERS TABLE (EYO Scoring)
-- =============================================================================
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

  -- EYO Scoring (NEW - replaces Hormozi)
  clarity_of_outcome INTEGER,            -- 1-10
  gravity_of_problem INTEGER,            -- 1-10
  belief_in_diagnosis INTEGER,           -- 1-10
  natural_fit INTEGER,                   -- 1-10
  clear_offer INTEGER,                   -- 1-10
  total_score INTEGER,                   -- out of 50

  -- AI Analysis (full JSON data)
  analysis_json JSONB,                   -- Recommendations, improvements, etc.

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_project_offer UNIQUE(project_id)
);

CREATE INDEX idx_offers_project ON offers(project_id);
CREATE INDEX idx_offers_score ON offers(total_score DESC);

-- =============================================================================
-- AVATARS TABLE (6 Beliefs Framework)
-- =============================================================================
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

  -- WEB Analysis (Wants, Emotions, Beliefs)
  wants JSONB DEFAULT '[]'::jsonb,
  emotions JSONB DEFAULT '[]'::jsonb,
  beliefs JSONB DEFAULT '[]'::jsonb,
  dominant_emotion TEXT,

  -- 6 Beliefs Framework (NEW for EYO)
  belief_outcome JSONB,                  -- {status: 'closed'|'receptive'|'transformed', notes: '...', strategy: '...'}
  belief_identity JSONB,
  belief_problem JSONB,
  belief_solution JSONB,
  belief_product JSONB,
  belief_credibility JSONB,

  -- Empathy Map
  seeing JSONB DEFAULT '[]'::jsonb,
  hearing JSONB DEFAULT '[]'::jsonb,
  saying JSONB DEFAULT '[]'::jsonb,
  thinking JSONB DEFAULT '[]'::jsonb,
  feeling JSONB DEFAULT '[]'::jsonb,
  doing JSONB DEFAULT '[]'::jsonb,
  pains JSONB DEFAULT '[]'::jsonb,
  gains JSONB DEFAULT '[]'::jsonb,

  -- Goals Grid
  pains_frustrations JSONB DEFAULT '[]'::jsonb,
  fears_implications JSONB DEFAULT '[]'::jsonb,
  goals_desires JSONB DEFAULT '[]'::jsonb,
  dreams_aspirations JSONB DEFAULT '[]'::jsonb,

  -- Synthesis
  primary_currency TEXT,                 -- Time, Money, Status, Health, Freedom, etc.
  million_dollar_message TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_project_avatar UNIQUE(project_id)
);

CREATE INDEX idx_avatars_project ON avatars(project_id);

-- =============================================================================
-- COMPETITORS TABLE
-- =============================================================================
CREATE TABLE competitors (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  industry TEXT,
  competitors JSONB DEFAULT '[]'::jsonb,           -- Array of competitor objects
  market_intelligence JSONB,
  positioning_angles JSONB DEFAULT '[]'::jsonb,
  market_gaps JSONB DEFAULT '[]'::jsonb,
  mvp_features JSONB DEFAULT '[]'::jsonb,
  distribution_strategy TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_project_competitors UNIQUE(project_id)
);

CREATE INDEX idx_competitors_project ON competitors(project_id);

-- =============================================================================
-- MANIFOLD RESULTS TABLE (Avatar Bible)
-- =============================================================================
CREATE TABLE manifold_results (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- 14 Node Results (stored as TEXT for markdown content)
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

  -- Performance metadata
  generation_time_seconds INTEGER,
  generation_method TEXT DEFAULT 'swarm',  -- 'sequential' or 'swarm'

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_project_manifold UNIQUE(project_id)
);

CREATE INDEX idx_manifold_project ON manifold_results(project_id);

-- =============================================================================
-- LAUNCH DOC GENERATIONS TABLE
-- =============================================================================
CREATE TABLE launch_doc_generations (
  id TEXT PRIMARY KEY,                   -- gen_[timestamp]
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  total_sections INTEGER DEFAULT 38,
  completed_sections INTEGER DEFAULT 0,

  -- Timing
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,

  -- Error handling
  error_message TEXT
);

CREATE INDEX idx_launchdoc_project ON launch_doc_generations(project_id);
CREATE INDEX idx_launchdoc_status ON launch_doc_generations(status, started_at DESC);
CREATE INDEX idx_launchdoc_latest ON launch_doc_generations(project_id, started_at DESC);

-- =============================================================================
-- LAUNCH DOC SECTIONS TABLE
-- =============================================================================
CREATE TABLE launch_doc_sections (
  id SERIAL PRIMARY KEY,
  generation_id TEXT NOT NULL REFERENCES launch_doc_generations(id) ON DELETE CASCADE,

  section_number INTEGER NOT NULL,
  section_key TEXT NOT NULL,
  section_title TEXT NOT NULL,
  content TEXT NOT NULL,

  generated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_generation_section UNIQUE(generation_id, section_number)
);

CREATE INDEX idx_sections_generation ON launch_doc_sections(generation_id, section_number);

-- =============================================================================
-- BLUR REPORTS TABLE (NEW for EYO)
-- =============================================================================
CREATE TABLE blur_reports (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  report_title TEXT NOT NULL,
  industry TEXT NOT NULL,
  target_market TEXT NOT NULL,

  -- Content
  page_1_content TEXT,                   -- Visible preview page
  full_report_content TEXT,              -- Complete report (behind blur)
  email_sequence TEXT,                   -- Email copy for BLUR method

  -- Design
  design_template TEXT DEFAULT 'professional',
  cover_image_url TEXT,

  -- Generation metadata
  generated_at TIMESTAMP DEFAULT NOW(),
  pdf_url TEXT,                          -- Generated PDF location

  CONSTRAINT unique_project_blur UNIQUE(project_id)
);

CREATE INDEX idx_blur_project ON blur_reports(project_id);

-- =============================================================================
-- CONTENT GENERATIONS TABLE (NEW for Dashboard)
-- =============================================================================
CREATE TABLE content_generations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  content_type TEXT NOT NULL,            -- 'ad_script', 'ad_copy', 'landing_page', etc.
  variation_number INTEGER DEFAULT 1,    -- 1, 2, 3 for variations

  title TEXT,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,    -- Type-specific metadata

  generated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_project_content UNIQUE(project_id, content_type, variation_number)
);

CREATE INDEX idx_content_project ON content_generations(project_id);
CREATE INDEX idx_content_type ON content_generations(content_type);
CREATE INDEX idx_content_generated ON content_generations(generated_at DESC);

-- =============================================================================
-- LOVABLE DEPLOYMENTS TABLE (NEW for Page Builder)
-- =============================================================================
CREATE TABLE lovable_deployments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content_generation_id TEXT REFERENCES content_generations(id),

  page_type TEXT NOT NULL,               -- 'landing', 'booking', 'thank_you'
  lovable_project_id TEXT,
  deployment_url TEXT,

  status TEXT DEFAULT 'pending',         -- 'pending', 'building', 'deployed', 'failed'
  error_message TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  deployed_at TIMESTAMP
);

CREATE INDEX idx_lovable_project ON lovable_deployments(project_id);
CREATE INDEX idx_lovable_status ON lovable_deployments(status, created_at DESC);

-- =============================================================================
-- USAGE TRACKING TABLE (NEW for Analytics)
-- =============================================================================
CREATE TABLE usage_tracking (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,

  action_type TEXT NOT NULL,             -- 'offer_analysis', 'content_generation', 'manifold_workflow', etc.
  tokens_used INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 4) DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_user ON usage_tracking(user_id, created_at DESC);
CREATE INDEX idx_usage_month ON usage_tracking(DATE_TRUNC('month', created_at), user_id);
CREATE INDEX idx_usage_action ON usage_tracking(action_type, created_at DESC);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_avatars_updated_at BEFORE UPDATE ON avatars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitors_updated_at BEFORE UPDATE ON competitors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manifold_updated_at BEFORE UPDATE ON manifold_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VIEWS (Optional, for convenience)
-- =============================================================================

-- View for complete project data
CREATE VIEW project_complete AS
SELECT
  p.*,
  o.total_score as offer_score,
  (o.id IS NOT NULL) as has_offer,
  (a.id IS NOT NULL) as has_avatar,
  (c.id IS NOT NULL) as has_competitors,
  (m.id IS NOT NULL) as has_manifold,
  (EXISTS(SELECT 1 FROM launch_doc_generations ldg WHERE ldg.project_id = p.id AND ldg.status = 'completed')) as has_launch_doc,
  (b.id IS NOT NULL) as has_blur_report
FROM projects p
LEFT JOIN offers o ON o.project_id = p.id
LEFT JOIN avatars a ON a.project_id = p.id
LEFT JOIN competitors c ON c.project_id = p.id
LEFT JOIN manifold_results m ON m.project_id = p.id
LEFT JOIN blur_reports b ON b.project_id = p.id;

-- View for user statistics
CREATE VIEW user_statistics AS
SELECT
  u.id,
  u.email,
  u.subscription_status,
  COUNT(DISTINCT p.id) as total_projects,
  COUNT(DISTINCT CASE WHEN o.id IS NOT NULL THEN p.id END) as projects_with_offer,
  COUNT(DISTINCT CASE WHEN a.id IS NOT NULL THEN p.id END) as projects_with_avatar,
  SUM(ut.tokens_used) as total_tokens_used,
  SUM(ut.cost_usd) as total_cost_usd
FROM users u
LEFT JOIN projects p ON p.user_id = u.id
LEFT JOIN offers o ON o.project_id = p.id
LEFT JOIN avatars a ON a.project_id = p.id
LEFT JOIN usage_tracking ut ON ut.user_id = u.id
GROUP BY u.id, u.email, u.subscription_status;

-- =============================================================================
-- SEED DATA (Optional - for development)
-- =============================================================================

-- Insert a test user (only for development)
-- INSERT INTO users (id, email, full_name, subscription_status)
-- VALUES ('user_test123', 'test@example.com', 'Test User', 'active');

-- =============================================================================
-- GRANTS (if using specific database user)
-- =============================================================================

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rla_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rla_user;

-- =============================================================================
-- SCHEMA VERSION
-- =============================================================================

CREATE TABLE schema_version (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO schema_version (version) VALUES ('1.0.0');

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
