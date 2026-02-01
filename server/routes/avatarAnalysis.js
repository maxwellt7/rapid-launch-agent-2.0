import { analyzeAvatarSwarm } from '../services/swarm/avatarSwarm.js';
import { avatarDB } from '../config/database.js';
import { formatError, logAPICall } from '../utils/helpers.js';

/**
 * Analyze avatar using WEB Analysis + 6 Beliefs Framework
 * Uses swarm orchestration for 4-5x faster analysis
 */
export async function analyzeAvatarRoute(req, res) {
  const startTime = Date.now();

  try {
    const avatarData = req.body;
    const projectId = req.body.projectId;

    // Validate required fields
    if (!avatarData.demographics) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: demographics',
      });
    }

    console.log('👤 Analyzing avatar with WEB + 6 Beliefs swarm...');

    // Run swarm analysis (5 nodes in parallel)
    const analysis = await analyzeAvatarSwarm(avatarData);

    // Save to database if projectId provided
    if (projectId) {
      const webAnalysis = analysis.webAnalysis;
      const beliefs = analysis.sixBeliefs;

      await avatarDB.upsert(projectId, {
        demographics: avatarData.demographics,
        webAnalysis: avatarData.webAnalysis || {},
        primaryCurrency: analysis.summary?.primaryCurrency,
        dominantEmotion: analysis.summary?.dominantEmotion,
        millionDollarMessage: analysis.summary?.millionDollarMessage,
        outcomeBeliefScore: beliefs?.outcome?.currentState || 0,
        identityBeliefScore: beliefs?.identity?.currentState || 0,
        problemBeliefScore: beliefs?.problem?.currentState || 0,
        solutionBeliefScore: beliefs?.solution?.currentState || 0,
        productBeliefScore: beliefs?.product?.currentState || 0,
        credibilityBeliefScore: beliefs?.credibility?.currentState || 0,
        analysisJson: analysis,
      });

      console.log(`✅ Avatar saved to database for project ${projectId}`);
    }

    logAPICall('POST /api/analyze/avatar', Date.now() - startTime);

    res.json({
      success: true,
      data: analysis,
      meta: {
        generationTime: Date.now() - startTime,
        method: 'swarm',
        nodesExecuted: 5,
      },
    });
  } catch (error) {
    console.error('❌ Avatar analysis error:', error);
    logAPICall('POST /api/analyze/avatar', Date.now() - startTime, false);
    res.status(500).json(formatError(error));
  }
}

export default analyzeAvatarRoute;
