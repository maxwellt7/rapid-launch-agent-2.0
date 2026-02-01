import { analyzeOfferSwarm } from '../services/swarm/offerSwarm.js';
import { offerDB } from '../config/database.js';
import { callClaude } from '../config/anthropic.js';
import { safeParseJSON, formatError } from '../utils/helpers.js';

/**
 * Apply improvements to offer and re-analyze
 * Automatically applies top improvements and shows before/after comparison
 */
export async function applyImprovementsRoute(req, res) {
  const startTime = Date.now();

  try {
    const { projectId, improvementIds } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'projectId is required',
      });
    }

    console.log('✨ Applying improvements to offer...');

    // Get current offer from database
    const currentOffer = await offerDB.getByProject(projectId);

    if (!currentOffer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found for this project',
      });
    }

    // Get current analysis
    const currentAnalysis = currentOffer.analysis_json;
    if (!currentAnalysis || !currentAnalysis.improvements) {
      return res.status(400).json({
        success: false,
        error: 'No improvements available. Please analyze the offer first.',
      });
    }

    // Determine which improvements to apply
    const improvementsToApply = improvementIds
      ? currentAnalysis.improvements.filter((imp) => improvementIds.includes(imp.id))
      : currentAnalysis.improvements.slice(0, 5); // Apply top 5 by default

    console.log(`📝 Applying ${improvementsToApply.length} improvements...`);

    // Use Claude to apply improvements
    const updatedOffer = await applyImprovementsWithAI(
      currentOffer,
      improvementsToApply
    );

    console.log('🔄 Re-analyzing updated offer...');

    // Re-analyze with EYO swarm
    const newAnalysis = await analyzeOfferSwarm(updatedOffer);

    // Save updated offer
    await offerDB.upsert(projectId, {
      ...updatedOffer,
      clarityOfOutcome: newAnalysis.eyoScores.clarityOfOutcome.score,
      gravityOfProblem: newAnalysis.eyoScores.gravityOfProblem.score,
      beliefInDiagnosis: newAnalysis.eyoScores.beliefInDiagnosis.score,
      naturalFit: newAnalysis.eyoScores.naturalFit.score,
      clearOffer: newAnalysis.eyoScores.clearOffer.score,
      totalScore: newAnalysis.eyoScores.totalScore,
      analysisJson: newAnalysis,
    });

    // Create comparison
    const comparison = {
      before: {
        offer: {
          targetMarket: currentOffer.target_market,
          pressingProblem: currentOffer.pressing_problem,
          desiredOutcome: currentOffer.desired_outcome,
          productDescription: currentOffer.product_description,
          productPromise: currentOffer.product_promise,
          proofElements: currentOffer.proof_elements,
          pricing: currentOffer.pricing,
          guarantee: currentOffer.guarantee,
        },
        totalScore: currentOffer.total_score,
        eyoScores: {
          clarityOfOutcome: currentOffer.clarity_of_outcome,
          gravityOfProblem: currentOffer.gravity_of_problem,
          beliefInDiagnosis: currentOffer.belief_in_diagnosis,
          naturalFit: currentOffer.natural_fit,
          clearOffer: currentOffer.clear_offer,
        },
      },
      after: {
        offer: updatedOffer,
        totalScore: newAnalysis.eyoScores.totalScore,
        eyoScores: {
          clarityOfOutcome: newAnalysis.eyoScores.clarityOfOutcome.score,
          gravityOfProblem: newAnalysis.eyoScores.gravityOfProblem.score,
          beliefInDiagnosis: newAnalysis.eyoScores.beliefInDiagnosis.score,
          naturalFit: newAnalysis.eyoScores.naturalFit.score,
          clearOffer: newAnalysis.eyoScores.clearOffer.score,
        },
      },
      improvements: {
        applied: improvementsToApply.length,
        totalScoreChange: newAnalysis.eyoScores.totalScore - currentOffer.total_score,
        percentageImprovement: (
          ((newAnalysis.eyoScores.totalScore - currentOffer.total_score) /
            currentOffer.total_score) *
          100
        ).toFixed(1),
      },
      appliedImprovements: improvementsToApply.map((imp) => ({
        id: imp.id,
        title: imp.title,
        criterion: imp.criteriaImproved,
      })),
    };

    console.log(`✅ Improvements applied! Score: ${comparison.before.totalScore} → ${comparison.after.totalScore} (+${comparison.improvements.totalScoreChange})`);

    res.json({
      success: true,
      data: {
        comparison,
        newAnalysis,
      },
      meta: {
        generationTime: Date.now() - startTime,
        improvementsApplied: improvementsToApply.length,
      },
    });
  } catch (error) {
    console.error('❌ Apply improvements error:', error);
    res.status(500).json(formatError(error));
  }
}

/**
 * Apply improvements using AI
 */
async function applyImprovementsWithAI(currentOffer, improvements) {
  const systemPrompt = `You are an expert copywriter and offer optimizer.
Apply the specified improvements to the offer, rewriting sections as needed.
Maintain the overall structure but implement the changes precisely.`;

  const userPrompt = `Apply these improvements to the offer:

**CURRENT OFFER**:
Target Market: ${currentOffer.target_market}
Problem: ${currentOffer.pressing_problem}
Desired Outcome: ${currentOffer.desired_outcome}
Product: ${currentOffer.product_description}
Promise: ${currentOffer.product_promise}
Proof: ${currentOffer.proof_elements}
Pricing: ${currentOffer.pricing}
Guarantee: ${currentOffer.guarantee}

**IMPROVEMENTS TO APPLY**:
${improvements
  .map(
    (imp, i) => `
${i + 1}. ${imp.title}
   - Description: ${imp.description}
   - Specific Actions: ${imp.specificActions?.join('; ') || 'Apply as described'}
`
  )
  .join('\n')}

Return the updated offer in JSON format:
{
  "targetMarket": "updated text",
  "pressingProblem": "updated text",
  "desiredOutcome": "updated text",
  "productDescription": "updated text",
  "productPromise": "updated text",
  "proofElements": "updated text",
  "pricing": "updated text",
  "guarantee": "updated text"
}

IMPORTANT:
- Only modify sections affected by the improvements
- Keep unchanged sections identical to the original
- Ensure all changes align with EYO principles
- Maintain clarity and simplicity`;

  const response = await callClaude(systemPrompt, userPrompt, {
    temperature: 0.7,
    maxTokens: 3000,
  });

  return safeParseJSON(response);
}

export default applyImprovementsRoute;
