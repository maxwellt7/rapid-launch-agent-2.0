import { runManifoldSwarm } from '../services/swarm/manifoldSwarm.js';
import { manifoldDB } from '../config/database.js';
import { formatError, logAPICall } from '../utils/helpers.js';

/**
 * Run Manifold Workflow using Wave-Based Swarm Orchestration
 *
 * Executes 14 nodes in 5 optimized waves based on dependencies:
 * - Wave 1: Foundation (buildABuyer, languagePatterns)
 * - Wave 2: Pain & Resonance (painMatrix, resonanceHierarchy, concentricCircles)
 * - Wave 3: Core Insights (coreWound, benefitMatrix, rhConstraints)
 * - Wave 4: Strategy (desireDaisyChain, epiphanyThreshold, dissolution, storyPrompts, ejectionTriggers)
 * - Wave 5: Hooks & Messaging (hooks)
 *
 * Performance: ~2-3 minutes vs 15-20 minutes sequential (5-7x faster)
 */
export async function runManifoldRoute(req, res) {
  const startTime = Date.now();

  try {
    const { offer, avatar, competitors, projectId } = req.body;

    // Validate required fields
    if (!offer || !avatar) {
      return res.status(400).json({
        success: false,
        error: 'Offer and avatar data are required',
      });
    }

    console.log('🧠 Starting Manifold Workflow with wave-based swarm...');

    // Run swarm analysis (14 nodes across 5 waves)
    const results = await runManifoldSwarm(offer, avatar, competitors);

    // Save to database if projectId provided
    if (projectId) {
      await manifoldDB.upsert(projectId, {
        resultsJson: results,
        status: 'completed',
      });

      console.log(`✅ Manifold results saved to database for project ${projectId}`);
    }

    logAPICall('POST /api/analyze/manifold', Date.now() - startTime);

    res.json({
      success: true,
      data: results,
      meta: {
        generationTime: Date.now() - startTime,
        method: 'wave-swarm',
        waves: 5,
        totalNodes: 14,
        speedup: '5-7x faster than sequential',
      },
    });
  } catch (error) {
    console.error('❌ Manifold workflow error:', error);
    logAPICall('POST /api/analyze/manifold', Date.now() - startTime, false);
    res.status(500).json(formatError(error));
  }
}

export default runManifoldRoute;
