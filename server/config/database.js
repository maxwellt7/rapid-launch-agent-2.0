import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,                    // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,   // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return error after 10 seconds if connection not established
};

// Create connection pool
const pool = new Pool(poolConfig);

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL error:', err);
});

// Helper function to execute queries with error handling
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Query executed', { text: text.substring(0, 100), duration, rows: res.rowCount });
    }

    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

// Helper function to get a client from pool for transactions
export async function getClient() {
  return await pool.connect();
}

// =============================================================================
// PROJECT HELPERS
// =============================================================================

export const projectDB = {
  // Create new project
  async create(userId, name) {
    const id = `proj_${Date.now()}`;
    const result = await query(
      `INSERT INTO projects (id, user_id, name, current_step)
       VALUES ($1, $2, $3, 1)
       RETURNING *`,
      [id, userId, name]
    );
    return result.rows[0];
  },

  // Get project by ID
  async getById(projectId) {
    const result = await query(
      'SELECT * FROM projects WHERE id = $1',
      [projectId]
    );
    return result.rows[0];
  },

  // Get all projects for user
  async getByUser(userId) {
    const result = await query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    return result.rows;
  },

  // Update project
  async update(projectId, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

    const result = await query(
      `UPDATE projects SET ${setClause} WHERE id = $1 RETURNING *`,
      [projectId, ...values]
    );
    return result.rows[0];
  },

  // Delete project
  async delete(projectId) {
    await query('DELETE FROM projects WHERE id = $1', [projectId]);
  },

  // Get complete project data (with all related data)
  async getComplete(projectId) {
    const result = await query(
      'SELECT * FROM project_complete WHERE id = $1',
      [projectId]
    );
    return result.rows[0];
  },
};

// =============================================================================
// OFFER HELPERS
// =============================================================================

export const offerDB = {
  // Save or update offer
  async upsert(projectId, offerData) {
    const id = `offer_${Date.now()}`;
    const result = await query(
      `INSERT INTO offers (
        id, project_id, target_market, pressing_problem, desired_outcome,
        product_description, product_promise, proof_elements, pricing, guarantee,
        clarity_of_outcome, gravity_of_problem, belief_in_diagnosis, natural_fit, clear_offer,
        total_score, analysis_json
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (project_id) DO UPDATE SET
        target_market = EXCLUDED.target_market,
        pressing_problem = EXCLUDED.pressing_problem,
        desired_outcome = EXCLUDED.desired_outcome,
        product_description = EXCLUDED.product_description,
        product_promise = EXCLUDED.product_promise,
        proof_elements = EXCLUDED.proof_elements,
        pricing = EXCLUDED.pricing,
        guarantee = EXCLUDED.guarantee,
        clarity_of_outcome = EXCLUDED.clarity_of_outcome,
        gravity_of_problem = EXCLUDED.gravity_of_problem,
        belief_in_diagnosis = EXCLUDED.belief_in_diagnosis,
        natural_fit = EXCLUDED.natural_fit,
        clear_offer = EXCLUDED.clear_offer,
        total_score = EXCLUDED.total_score,
        analysis_json = EXCLUDED.analysis_json,
        updated_at = NOW()
      RETURNING *`,
      [
        id,
        projectId,
        offerData.targetMarket || null,
        offerData.pressingProblem || null,
        offerData.desiredOutcome || null,
        offerData.productDescription || null,
        offerData.productPromise || null,
        offerData.proofElements || null,
        offerData.pricing || null,
        offerData.guarantee || null,
        offerData.clarityOfOutcome || null,
        offerData.gravityOfProblem || null,
        offerData.beliefInDiagnosis || null,
        offerData.naturalFit || null,
        offerData.clearOffer || null,
        offerData.totalScore || null,
        JSON.stringify(offerData.analysisJson || {}),
      ]
    );
    return result.rows[0];
  },

  // Get offer by project ID
  async getByProject(projectId) {
    const result = await query(
      'SELECT * FROM offers WHERE project_id = $1',
      [projectId]
    );
    return result.rows[0];
  },
};

// =============================================================================
// AVATAR HELPERS
// =============================================================================

export const avatarDB = {
  // Save or update avatar
  async upsert(projectId, avatarData) {
    const id = `avatar_${Date.now()}`;
    const result = await query(
      `INSERT INTO avatars (
        id, project_id, age_range, gender, location, income_range, education, occupation,
        wants, emotions, beliefs, dominant_emotion,
        belief_outcome, belief_identity, belief_problem, belief_solution, belief_product, belief_credibility,
        seeing, hearing, saying, thinking, feeling, doing, pains, gains,
        pains_frustrations, fears_implications, goals_desires, dreams_aspirations,
        primary_currency, million_dollar_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)
      ON CONFLICT (project_id) DO UPDATE SET
        age_range = EXCLUDED.age_range,
        gender = EXCLUDED.gender,
        location = EXCLUDED.location,
        income_range = EXCLUDED.income_range,
        education = EXCLUDED.education,
        occupation = EXCLUDED.occupation,
        wants = EXCLUDED.wants,
        emotions = EXCLUDED.emotions,
        beliefs = EXCLUDED.beliefs,
        dominant_emotion = EXCLUDED.dominant_emotion,
        belief_outcome = EXCLUDED.belief_outcome,
        belief_identity = EXCLUDED.belief_identity,
        belief_problem = EXCLUDED.belief_problem,
        belief_solution = EXCLUDED.belief_solution,
        belief_product = EXCLUDED.belief_product,
        belief_credibility = EXCLUDED.belief_credibility,
        seeing = EXCLUDED.seeing,
        hearing = EXCLUDED.hearing,
        saying = EXCLUDED.saying,
        thinking = EXCLUDED.thinking,
        feeling = EXCLUDED.feeling,
        doing = EXCLUDED.doing,
        pains = EXCLUDED.pains,
        gains = EXCLUDED.gains,
        pains_frustrations = EXCLUDED.pains_frustrations,
        fears_implications = EXCLUDED.fears_implications,
        goals_desires = EXCLUDED.goals_desires,
        dreams_aspirations = EXCLUDED.dreams_aspirations,
        primary_currency = EXCLUDED.primary_currency,
        million_dollar_message = EXCLUDED.million_dollar_message,
        updated_at = NOW()
      RETURNING *`,
      [
        id,
        projectId,
        avatarData.ageRange || null,
        avatarData.gender || null,
        avatarData.location || null,
        avatarData.incomeRange || null,
        avatarData.education || null,
        avatarData.occupation || null,
        JSON.stringify(avatarData.wants || []),
        JSON.stringify(avatarData.emotions || []),
        JSON.stringify(avatarData.beliefs || []),
        avatarData.dominantEmotion || null,
        JSON.stringify(avatarData.beliefOutcome || {}),
        JSON.stringify(avatarData.beliefIdentity || {}),
        JSON.stringify(avatarData.beliefProblem || {}),
        JSON.stringify(avatarData.beliefSolution || {}),
        JSON.stringify(avatarData.beliefProduct || {}),
        JSON.stringify(avatarData.beliefCredibility || {}),
        JSON.stringify(avatarData.seeing || []),
        JSON.stringify(avatarData.hearing || []),
        JSON.stringify(avatarData.saying || []),
        JSON.stringify(avatarData.thinking || []),
        JSON.stringify(avatarData.feeling || []),
        JSON.stringify(avatarData.doing || []),
        JSON.stringify(avatarData.pains || []),
        JSON.stringify(avatarData.gains || []),
        JSON.stringify(avatarData.painsFrustrations || []),
        JSON.stringify(avatarData.fearsImplications || []),
        JSON.stringify(avatarData.goalsDesires || []),
        JSON.stringify(avatarData.dreamsAspirations || []),
        avatarData.primaryCurrency || null,
        avatarData.millionDollarMessage || null,
      ]
    );
    return result.rows[0];
  },

  // Get avatar by project ID
  async getByProject(projectId) {
    const result = await query(
      'SELECT * FROM avatars WHERE project_id = $1',
      [projectId]
    );
    return result.rows[0];
  },
};

// =============================================================================
// COMPETITORS HELPERS
// =============================================================================

export const competitorsDB = {
  // Save or update competitors
  async upsert(projectId, competitorData) {
    const id = `comp_${Date.now()}`;
    const result = await query(
      `INSERT INTO competitors (
        id, project_id, industry, competitors, market_intelligence,
        positioning_angles, market_gaps, mvp_features, distribution_strategy
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (project_id) DO UPDATE SET
        industry = EXCLUDED.industry,
        competitors = EXCLUDED.competitors,
        market_intelligence = EXCLUDED.market_intelligence,
        positioning_angles = EXCLUDED.positioning_angles,
        market_gaps = EXCLUDED.market_gaps,
        mvp_features = EXCLUDED.mvp_features,
        distribution_strategy = EXCLUDED.distribution_strategy,
        updated_at = NOW()
      RETURNING *`,
      [
        id,
        projectId,
        competitorData.industry || null,
        JSON.stringify(competitorData.competitors || []),
        JSON.stringify(competitorData.marketIntelligence || {}),
        JSON.stringify(competitorData.positioningAngles || []),
        JSON.stringify(competitorData.marketGaps || []),
        JSON.stringify(competitorData.mvpFeatures || []),
        competitorData.distributionStrategy || null,
      ]
    );
    return result.rows[0];
  },

  // Get competitors by project ID
  async getByProject(projectId) {
    const result = await query(
      'SELECT * FROM competitors WHERE project_id = $1',
      [projectId]
    );
    return result.rows[0];
  },
};

// =============================================================================
// MANIFOLD HELPERS
// =============================================================================

export const manifoldDB = {
  // Save or update manifold results
  async upsert(projectId, manifoldData, generationTimeSeconds = 0) {
    const id = `manifold_${Date.now()}`;
    const result = await query(
      `INSERT INTO manifold_results (
        id, project_id, build_a_buyer, pain_matrix, core_wound, benefit_matrix,
        desire_daisy_chain, resonance_hierarchy, rh_constraints, dissolution,
        epiphany_threshold, hooks, story_prompts, language_patterns,
        concentric_circles, ejection_triggers, generation_time_seconds, generation_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (project_id) DO UPDATE SET
        build_a_buyer = EXCLUDED.build_a_buyer,
        pain_matrix = EXCLUDED.pain_matrix,
        core_wound = EXCLUDED.core_wound,
        benefit_matrix = EXCLUDED.benefit_matrix,
        desire_daisy_chain = EXCLUDED.desire_daisy_chain,
        resonance_hierarchy = EXCLUDED.resonance_hierarchy,
        rh_constraints = EXCLUDED.rh_constraints,
        dissolution = EXCLUDED.dissolution,
        epiphany_threshold = EXCLUDED.epiphany_threshold,
        hooks = EXCLUDED.hooks,
        story_prompts = EXCLUDED.story_prompts,
        language_patterns = EXCLUDED.language_patterns,
        concentric_circles = EXCLUDED.concentric_circles,
        ejection_triggers = EXCLUDED.ejection_triggers,
        generation_time_seconds = EXCLUDED.generation_time_seconds,
        generation_method = EXCLUDED.generation_method,
        updated_at = NOW()
      RETURNING *`,
      [
        id,
        projectId,
        manifoldData.buildABuyer || null,
        manifoldData.painMatrix || null,
        manifoldData.coreWound || null,
        manifoldData.benefitMatrix || null,
        manifoldData.desireDaisyChain || null,
        manifoldData.resonanceHierarchy || null,
        manifoldData.rhConstraints || null,
        manifoldData.dissolution || null,
        manifoldData.epiphanyThreshold || null,
        manifoldData.hooks || null,
        manifoldData.storyPrompts || null,
        manifoldData.languagePatterns || null,
        manifoldData.concentricCircles || null,
        manifoldData.ejectionTriggers || null,
        generationTimeSeconds,
        'swarm',
      ]
    );
    return result.rows[0];
  },

  // Get manifold by project ID
  async getByProject(projectId) {
    const result = await query(
      'SELECT * FROM manifold_results WHERE project_id = $1',
      [projectId]
    );
    return result.rows[0];
  },
};

// =============================================================================
// LAUNCH DOC HELPERS
// =============================================================================

export const launchDocDB = {
  // Ensure project exists (for standalone generation)
  async ensureProjectExists(projectId, projectName = 'Unnamed Project') {
    await query(
      `INSERT INTO projects (id, user_id, name)
       VALUES ($1, 'system', $2)
       ON CONFLICT (id) DO NOTHING`,
      [projectId, projectName]
    );
  },

  // Create new generation
  createGeneration(projectId) {
    const id = `gen_${Date.now()}`;
    query(
      `INSERT INTO launch_doc_generations (id, project_id, status, total_sections, completed_sections)
       VALUES ($1, $2, 'pending', 38, 0)`,
      [id, projectId]
    );
    return id;
  },

  // Update generation status
  updateGenerationStatus(generationId, status, errorMessage = null) {
    query(
      `UPDATE launch_doc_generations
       SET status = $1, error_message = $2, completed_at = CASE WHEN $1 IN ('completed', 'failed') THEN NOW() ELSE NULL END
       WHERE id = $3`,
      [status, errorMessage, generationId]
    );
  },

  // Save section
  async saveSection(generationId, sectionNumber, sectionTitle, sectionKey, content) {
    await query(
      `INSERT INTO launch_doc_sections (generation_id, section_number, section_key, section_title, content)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (generation_id, section_number) DO UPDATE SET
         content = EXCLUDED.content,
         generated_at = NOW()`,
      [generationId, sectionNumber, sectionKey, sectionTitle, content]
    );

    // Update completed sections count
    await query(
      `UPDATE launch_doc_generations
       SET completed_sections = (
         SELECT COUNT(*) FROM launch_doc_sections WHERE generation_id = $1
       )
       WHERE id = $1`,
      [generationId]
    );
  },

  // Get generation progress
  async getGenerationProgress(generationId) {
    const result = await query(
      'SELECT * FROM launch_doc_generations WHERE id = $1',
      [generationId]
    );
    return result.rows[0];
  },

  // Get sections for generation
  async getSections(generationId) {
    const result = await query(
      'SELECT * FROM launch_doc_sections WHERE generation_id = $1 ORDER BY section_number',
      [generationId]
    );
    return result.rows;
  },

  // Get latest generation for project
  async getLatestGeneration(projectId) {
    const result = await query(
      'SELECT * FROM launch_doc_generations WHERE project_id = $1 ORDER BY started_at DESC LIMIT 1',
      [projectId]
    );
    return result.rows[0];
  },

  // Get completed section numbers
  async getCompletedSectionNumbers(generationId) {
    const result = await query(
      'SELECT section_number FROM launch_doc_sections WHERE generation_id = $1',
      [generationId]
    );
    return result.rows.map(row => row.section_number);
  },
};

// =============================================================================
// USER HELPERS
// =============================================================================

export const userDB = {
  // Create or update user (from Clerk webhook)
  async upsert(userData) {
    const result = await query(
      `INSERT INTO users (id, email, full_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         full_name = EXCLUDED.full_name,
         updated_at = NOW()
       RETURNING *`,
      [userData.id, userData.email, userData.fullName || null]
    );
    return result.rows[0];
  },

  // Update subscription
  async updateSubscription(userId, subscriptionData) {
    await query(
      `UPDATE users SET
         subscription_tier = $1,
         subscription_status = $2,
         subscription_started_at = $3,
         subscription_expires_at = $4,
         updated_at = NOW()
       WHERE id = $5`,
      [
        subscriptionData.tier || 'active',
        subscriptionData.status,
        subscriptionData.startedAt,
        subscriptionData.expiresAt,
        userId,
      ]
    );
  },

  // Get user by ID
  async getById(userId) {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0];
  },

  // Check subscription status
  async checkSubscription(userId) {
    const result = await query(
      `SELECT subscription_status, subscription_expires_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (!result.rows[0]) {
      return { isActive: false, status: 'none' };
    }

    const { subscription_status, subscription_expires_at } = result.rows[0];

    const isActive =
      subscription_status === 'active' &&
      (!subscription_expires_at || new Date(subscription_expires_at) > new Date());

    return {
      isActive,
      status: subscription_status,
      expiresAt: subscription_expires_at,
    };
  },
};

// =============================================================================
// USAGE TRACKING HELPERS
// =============================================================================

export const usageDB = {
  // Track API usage
  async track(userId, projectId, actionType, tokensUsed = 0, costUsd = 0) {
    await query(
      `INSERT INTO usage_tracking (user_id, project_id, action_type, tokens_used, cost_usd)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, projectId, actionType, tokensUsed, costUsd]
    );
  },

  // Get user usage statistics
  async getUserStats(userId, startDate = null, endDate = null) {
    let queryText = `
      SELECT
        action_type,
        COUNT(*) as count,
        SUM(tokens_used) as total_tokens,
        SUM(cost_usd) as total_cost
      FROM usage_tracking
      WHERE user_id = $1
    `;

    const params = [userId];

    if (startDate) {
      params.push(startDate);
      queryText += ` AND created_at >= $${params.length}`;
    }

    if (endDate) {
      params.push(endDate);
      queryText += ` AND created_at <= $${params.length}`;
    }

    queryText += ' GROUP BY action_type';

    const result = await query(queryText, params);
    return result.rows;
  },
};

// Export pool for direct access if needed
export default pool;
