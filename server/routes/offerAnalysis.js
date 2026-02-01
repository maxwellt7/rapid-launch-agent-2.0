import { analyzeOfferSwarm } from '../services/swarm/offerSwarm.js';
import { offerDB } from '../config/database.js';
import { formatError, logAPICall } from '../utils/helpers.js';

/**
 * Analyze offer using EYO (Easy Yes Offer) methodology
 * Uses swarm orchestration for 4-5x faster analysis
 */
export async function analyzeOfferRoute(req, res) {
  const startTime = Date.now();

  try {
    const offerData = req.body;
    const projectId = req.body.projectId;

    // Validate required fields
    if (!offerData.targetMarket || !offerData.pressingProblem || !offerData.productDescription) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: targetMarket, pressingProblem, productDescription',
      });
    }

    console.log('🎯 Analyzing offer with EYO swarm...');

    // Run swarm analysis (5 nodes in parallel)
    const analysis = await analyzeOfferSwarm(offerData);

    // Save to database if projectId provided
    if (projectId) {
      const eyoScores = analysis.eyoScores;

      await offerDB.upsert(projectId, {
        ...offerData,
        clarityOfOutcome: eyoScores.clarityOfOutcome.score,
        gravityOfProblem: eyoScores.gravityOfProblem.score,
        beliefInDiagnosis: eyoScores.beliefInDiagnosis.score,
        naturalFit: eyoScores.naturalFit.score,
        clearOffer: eyoScores.clearOffer.score,
        totalScore: eyoScores.totalScore,
        analysisJson: analysis,
      });

      console.log(`✅ Offer saved to database for project ${projectId}`);
    }

    logAPICall('POST /api/analyze/offer', Date.now() - startTime);

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
    console.error('❌ Offer analysis error:', error);
    logAPICall('POST /api/analyze/offer', Date.now() - startTime, false);
    res.status(500).json(formatError(error));
  }
}

export default analyzeOfferRoute;
