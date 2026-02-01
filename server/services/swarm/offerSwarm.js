import { SwarmOrchestrator } from './orchestrator.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { safeParseJSON } from '../../utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load prompt templates
const eyoScoringPrompt = readFileSync(
  join(__dirname, '../../prompts/offer/eyo_scoring.txt'),
  'utf8'
);
const improvementsPrompt = readFileSync(
  join(__dirname, '../../prompts/offer/improvements.txt'),
  'utf8'
);

/**
 * Analyze offer using EYO methodology with parallel swarm
 *
 * Nodes run in parallel:
 * 1. EYO Scoring (5 criteria)
 * 2. Improvements Generation
 * 3. Avatar Suggestions
 * 4. Belief Analysis
 * 5. Market Validation
 *
 * Result: Complete offer analysis in ~30-45 seconds vs 2-3 minutes sequential
 */
export async function analyzeOfferSwarm(offerData) {
  console.log('🎯 Starting EYO Offer Analysis Swarm');

  const orchestrator = new SwarmOrchestrator({
    maxParallel: 5,
    retryAttempts: 3,
    onProgress: (progress) => {
      console.log(`📊 Progress: ${progress.completed}/${progress.total}`);
    },
  });

  // Define swarm nodes
  const nodes = [
    {
      id: 'eyo_scoring',
      priority: 1,
      systemPrompt: eyoScoringPrompt,
      userPrompt: (context) => buildEYOScoringPrompt(context.offer),
      temperature: 0.5, // Lower temp for consistent scoring
      maxTokens: 3000,
      postProcess: (result) => {
        const parsed = safeParseJSON(result);
        // Calculate total score
        parsed.totalScore =
          parsed.clarityOfOutcome.score +
          parsed.gravityOfProblem.score +
          parsed.beliefInDiagnosis.score +
          parsed.naturalFit.score +
          parsed.clearOffer.score;
        return parsed;
      },
    },
    {
      id: 'improvements',
      priority: 1,
      systemPrompt: improvementsPrompt,
      userPrompt: (context) => {
        // This node needs the scoring results
        const scoring = context.completedResults?.eyo_scoring;
        if (scoring) {
          return buildImprovementsPrompt(context.offer, scoring);
        } else {
          // If scoring not yet available, use context only
          return buildImprovementsPromptBasic(context.offer);
        }
      },
      temperature: 0.7,
      maxTokens: 3500,
      postProcess: safeParseJSON,
    },
    {
      id: 'avatar_suggestions',
      priority: 2,
      systemPrompt: `You are an expert at identifying target avatars from offer descriptions.
Based on the offer details, suggest detailed demographics and psychographics for the ideal customer avatar.`,
      userPrompt: (context) => buildAvatarSuggestionsPrompt(context.offer),
      temperature: 0.7,
      maxTokens: 2000,
      postProcess: safeParseJSON,
    },
    {
      id: 'belief_analysis',
      priority: 2,
      systemPrompt: `You are an expert in the 6 Beliefs Framework for conversion optimization.
Analyze what beliefs prospects must hold to buy this offer.`,
      userPrompt: (context) => buildBeliefAnalysisPrompt(context.offer),
      temperature: 0.7,
      maxTokens: 2500,
      postProcess: safeParseJSON,
    },
    {
      id: 'market_validation',
      priority: 3,
      systemPrompt: `You are a market validation expert.
Assess market fit, competition, and positioning for this offer.`,
      userPrompt: (context) => buildMarketValidationPrompt(context.offer),
      temperature: 0.7,
      maxTokens: 2000,
      postProcess: safeParseJSON,
    },
  ];

  // Run swarm
  const results = await orchestrator.runSwarm(nodes, { offer: offerData });

  // Combine results into final analysis
  const analysis = {
    eyoScores: results.get('eyo_scoring'),
    improvements: results.get('improvements'),
    suggestedAvatar: results.get('avatar_suggestions'),
    requiredBeliefs: results.get('belief_analysis'),
    marketValidation: results.get('market_validation'),

    // Calculate projected improvement
    projectedImprovement: calculateProjectedImprovement(
      results.get('eyo_scoring'),
      results.get('improvements')
    ),
  };

  console.log(`✅ EYO Analysis Complete - Score: ${analysis.eyoScores.totalScore}/50`);

  return analysis;
}

/**
 * Build EYO scoring prompt
 */
function buildEYOScoringPrompt(offer) {
  return `Analyze this offer using the EYO methodology:

**TARGET MARKET**: ${offer.targetMarket || 'Not specified'}

**PROBLEM**: ${offer.pressingProblem || 'Not specified'}

**DESIRED OUTCOME**: ${offer.desiredOutcome || 'Not specified'}

**PRODUCT/SERVICE**: ${offer.productDescription || 'Not specified'}

**PROMISE**: ${offer.productPromise || 'Not specified'}

**PROOF**: ${offer.proofElements || 'Not specified'}

**PRICING**: ${offer.pricing || 'Not specified'}

**GUARANTEE**: ${offer.guarantee || 'Not specified'}

Provide detailed EYO scores in the following JSON format:

{
  "clarityOfOutcome": {
    "score": 1-10,
    "reasoning": "Detailed explanation",
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "howToImprove": "Specific recommendations"
  },
  "gravityOfProblem": { ... },
  "beliefInDiagnosis": { ... },
  "naturalFit": { ... },
  "clearOffer": { ... }
}

Be brutally honest. Low scores are okay if warranted.`;
}

/**
 * Build improvements prompt (with scoring context)
 */
function buildImprovementsPrompt(offer, scoring) {
  return `Generate 10 specific improvements for this offer:

**CURRENT EYO SCORES**:
- Clarity of Outcome: ${scoring.clarityOfOutcome.score}/10
- Gravity of Problem: ${scoring.gravityOfProblem.score}/10
- Belief in Diagnosis: ${scoring.beliefInDiagnosis.score}/10
- Natural Fit: ${scoring.naturalFit.score}/10
- Clear Offer: ${scoring.clearOffer.score}/10
**Total: ${scoring.totalScore}/50**

**OFFER DETAILS**:
Target Market: ${offer.targetMarket}
Problem: ${offer.pressingProblem}
Product: ${offer.productDescription}
Promise: ${offer.productPromise}
Pricing: ${offer.pricing}

Focus on improvements that:
1. Address the LOWEST scoring criteria first
2. Are specific and actionable
3. Have high impact potential
4. Are feasible to implement

Return array of 10 improvements in JSON format.`;
}

/**
 * Build basic improvements prompt (without scoring)
 */
function buildImprovementsPromptBasic(offer) {
  return `Generate 10 improvements for this offer using EYO methodology:

${buildEYOScoringPrompt(offer)}

Focus on making the offer more clear, urgent, believable, fitting, and simple.`;
}

/**
 * Build avatar suggestions prompt
 */
function buildAvatarSuggestionsPrompt(offer) {
  return `Based on this offer, suggest the ideal customer avatar:

Target Market: ${offer.targetMarket}
Problem: ${offer.pressingProblem}
Product: ${offer.productDescription}
Pricing: ${offer.pricing}

Provide JSON format:
{
  "demographics": {
    "ageRange": "e.g., 35-50",
    "gender": "Male/Female/All",
    "location": "Geographic focus",
    "incomeRange": "e.g., $75K-$150K",
    "education": "e.g., College degree",
    "occupation": "e.g., Business owners"
  },
  "primaryWants": ["want 1", "want 2", "want 3"],
  "primaryEmotions": ["emotion 1", "emotion 2", "emotion 3"],
  "primaryBeliefs": ["belief 1", "belief 2", "belief 3"],
  "dominantEmotion": "Primary driving emotion",
  "primaryCurrency": "Time/Money/Status/Health/Freedom",
  "millionDollarMessage": "I help [AVATAR] achieve [GOAL], so they can [DREAM] without [PAIN]"
}`;
}

/**
 * Build belief analysis prompt
 */
function buildBeliefAnalysisPrompt(offer) {
  return `Analyze required beliefs for this offer using the 6 Beliefs Framework:

Offer: ${offer.productDescription}
Promise: ${offer.productPromise}
Problem: ${offer.pressingProblem}

For each of the 6 beliefs, identify:
1. What the prospect must believe to buy
2. Common objections/doubts
3. How to bridge the belief gap

Return JSON:
{
  "outcome": { "requiredBelief": "...", "commonObjections": [], "bridgeStrategy": "..." },
  "identity": { ... },
  "problem": { ... },
  "solution": { ... },
  "product": { ... },
  "credibility": { ... }
}`;
}

/**
 * Build market validation prompt
 */
function buildMarketValidationPrompt(offer) {
  return `Validate market fit for this offer:

Target Market: ${offer.targetMarket}
Product: ${offer.productDescription}
Pricing: ${offer.pricing}

Assess:
1. Market size and accessibility
2. Competition level
3. Price positioning
4. Market timing
5. Unique positioning opportunities

Return JSON with assessment and recommendations.`;
}

/**
 * Calculate projected improvement
 */
function calculateProjectedImprovement(scoring, improvements) {
  if (!scoring || !improvements || !Array.isArray(improvements)) {
    return null;
  }

  const currentScore = scoring.totalScore;

  // Sum up expected improvements (take top 5 to be realistic)
  const topImprovements = improvements.slice(0, 5);
  const totalIncrease = topImprovements.reduce((sum, imp) => {
    return sum + (imp.scoreImpact?.change || 0);
  }, 0);

  const projectedScore = Math.min(50, currentScore + totalIncrease);

  return {
    currentScore,
    projectedScore,
    improvement: projectedScore - currentScore,
    improvementPercent: ((projectedScore - currentScore) / currentScore * 100).toFixed(1),
  };
}

export default analyzeOfferSwarm;
