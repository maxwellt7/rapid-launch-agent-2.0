-- Rapid Launch Agent 2.0 - PostgreSQL Database Schema
-- Easy Yes System with EYO Methodology and 6 Beliefs Framework

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'none',
  subscription_started_at TIMESTAMP,
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_status);

-- =============================================================================
-- PROJECTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  current_step INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_updated ON projects(updated_at DESC);

-- =============================================================================
-- OFFERS TABLE (EYO Scoring)
-- =============================================================================

CREATE TABLE IF NOT EXISTS offers (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  target_market TEXT,
  pressing_problem TEXT,
  desired_outcome TEXT,
  product_description TEXT,
  product_promise TEXT,
  proof_elements TEXT,
  pricing TEXT,
  guarantee TEXT,

  -- EYO Scores (0-10 each, total out of 50)
  clarity_of_outcome INTEGER,
  gravity_of_problem INTEGER,
  belief_in_diagnosis INTEGER,
  natural_fit INTEGER,
  clear_offer INTEGER,
  total_score INTEGER,

  -- Complete analysis JSON
  analysis_json JSONB,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_offers_project ON offers(project_id);
CREATE INDEX idx_offers_total_score ON offers(total_score DESC);

-- =============================================================================
-- AVATARS TABLE (6 Beliefs + Demographics + WEB + Empathy Map + Goals Grid)
-- =============================================================================

CREATE TABLE IF NOT EXISTS avatars (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) UNIQUE REFERENCES projects(id) ON DELETE CASCADE,

  -- Demographics
  age_range VARCHAR(100),
  gender VARCHAR(50),
  location VARCHAR(255),
  income_range VARCHAR(100),
  education VARCHAR(255),
  occupation VARCHAR(255),

  -- WEB Analysis (Wants, Emotions, Beliefs)
  wants JSONB,
  emotions JSONB,
  beliefs JSONB,
  dominant_emotion VARCHAR(255),

  -- 6 Beliefs Framework
  belief_outcome JSONB,
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

  -- Goals Grid (4 quadrants)
  pains_frustrations JSONB,
  fears_implications JSONB,
  goals_desires JSONB,
  dreams_aspirations JSONB,

  -- Primary Currency & Message
  primary_currency VARCHAR(255),
  million_dollar_message TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_avatars_project ON avatars(project_id);

-- =============================================================================
-- COMPETITORS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS competitors (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  industry VARCHAR(255),
  competitors JSONB,
  market_intelligence JSONB,
  positioning_angles JSONB,
  market_gaps JSONB,
  mvp_features JSONB,
  distribution_strategy TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_competitors_project ON competitors(project_id);

-- =============================================================================
-- MANIFOLD RESULTS TABLE (14-Node Workflow)
-- =============================================================================

CREATE TABLE IF NOT EXISTS manifold_results (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) UNIQUE REFERENCES projects(id) ON DELETE CASCADE,

  -- 14 Manifold Nodes
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
  generation_method VARCHAR(50) DEFAULT 'swarm',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_manifold_project ON manifold_results(project_id);

-- =============================================================================
-- LAUNCH DOCUMENT GENERATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS launch_doc_generations (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  total_sections INTEGER DEFAULT 38,
  completed_sections INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_launch_gens_project ON launch_doc_generations(project_id);
CREATE INDEX idx_launch_gens_status ON launch_doc_generations(status);

-- =============================================================================
-- LAUNCH DOCUMENT SECTIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS launch_doc_sections (
  id SERIAL PRIMARY KEY,
  generation_id VARCHAR(255) REFERENCES launch_doc_generations(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  section_key VARCHAR(255),
  section_title VARCHAR(255),
  content TEXT,
  generated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(generation_id, section_number)
);

CREATE INDEX idx_sections_generation ON launch_doc_sections(generation_id);
CREATE INDEX idx_sections_number ON launch_doc_sections(section_number);

-- =============================================================================
-- CONTENT GENERATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS content_generations (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_project ON content_generations(project_id);
CREATE INDEX idx_content_type ON content_generations(content_type);

-- =============================================================================
-- USAGE TRACKING TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS usage_tracking (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_user ON usage_tracking(user_id);
CREATE INDEX idx_usage_project ON usage_tracking(project_id);
CREATE INDEX idx_usage_created ON usage_tracking(created_at DESC);

-- =============================================================================
-- SUBSCRIPTIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- =============================================================================
-- API KEYS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- =============================================================================
-- GENERATION PROGRESS TABLE (for resumable generation tracking)
-- =============================================================================

CREATE TABLE IF NOT EXISTS generation_progress (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
  generation_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress',
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER,
  progress_data JSONB,
  error_message TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_gen_progress_project ON generation_progress(project_id);
CREATE INDEX idx_gen_progress_status ON generation_progress(status);

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Complete project view (joins all related data)
CREATE OR REPLACE VIEW project_complete AS
SELECT
  p.*,
  o.target_market,
  o.total_score as eyo_score,
  a.primary_currency,
  c.industry,
  m.generation_method as manifold_method,
  COUNT(DISTINCT cg.id) as content_count
FROM projects p
LEFT JOIN offers o ON p.id = o.project_id
LEFT JOIN avatars a ON p.id = a.project_id
LEFT JOIN competitors c ON p.id = c.project_id
LEFT JOIN manifold_results m ON p.id = m.project_id
LEFT JOIN content_generations cg ON p.id = cg.project_id
GROUP BY p.id, o.target_market, o.total_score, a.primary_currency, c.industry, m.generation_method;

-- =============================================================================
-- SEED DATA (Optional - Development Only)
-- =============================================================================

-- Insert system user for standalone generations
INSERT INTO users (id, email, full_name, subscription_tier, subscription_status)
VALUES ('system', 'system@rapidlaunch.app', 'System User', 'unlimited', 'active')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 14 tables created';
  RAISE NOTICE '🔍 Indexes optimized';
  RAISE NOTICE '👁️  Views configured';
  RAISE NOTICE '🚀 Ready for Rapid Launch Agent 2.0';
END $$;
