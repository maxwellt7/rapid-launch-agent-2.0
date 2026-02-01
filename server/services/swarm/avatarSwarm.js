import { SwarmOrchestrator } from './orchestrator.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { safeParseJSON } from '../../utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load prompt templates
const webAnalysisPrompt = readFileSync(
  join(__dirname, '../../prompts/avatar/web_analysis.txt'),
  'utf8'
);
const sixBeliefsPrompt = readFileSync(
  join(__dirname, '../../prompts/avatar/six_beliefs.txt'),
  'utf8'
);

/**
 * Analyze avatar using WEB Analysis + 6 Beliefs Framework with parallel swarm
 *
 * Nodes run in parallel:
 * 1. WEB Analysis (Wants, Emotions, Beliefs)
 * 2. 6 Beliefs Framework (outcome, identity, problem, solution, product, credibility)
 * 3. Psychographic Profiling
 * 4. Buying Triggers Analysis
 * 5. Messaging Recommendations
 *
 * Result: Complete avatar analysis in ~40-60 seconds vs 3-4 minutes sequential
 */
export async function analyzeAvatarSwarm(avatarData) {
  console.log('👤 Starting Avatar Analysis Swarm');

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
      id: 'web_analysis',
      priority: 1,
      systemPrompt: webAnalysisPrompt,
      userPrompt: (context) => buildWEBAnalysisPrompt(context.avatar),
      temperature: 0.7,
      maxTokens: 3500,
      postProcess: safeParseJSON,
    },
    {
      id: 'six_beliefs',
      priority: 1,
      systemPrompt: sixBeliefsPrompt,
      userPrompt: (context) => buildSixBeliefsPrompt(context.avatar),
      temperature: 0.7,
      maxTokens: 3500,
      postProcess: safeParseJSON,
    },
    {
      id: 'psychographics',
      priority: 2,
      systemPrompt: `You are an expert at deep psychographic profiling.
Based on demographics and behavioral data, identify detailed psychological characteristics, values, attitudes, interests, and lifestyle patterns.`,
      userPrompt: (context) => buildPsychographicsPrompt(context.avatar),
      temperature: 0.7,
      maxTokens: 2500,
      postProcess: safeParseJSON,
    },
    {
      id: 'buying_triggers',
      priority: 2,
      systemPrompt: `You are an expert at identifying buying triggers and conversion psychology.
Analyze what specific situations, emotions, and events trigger purchasing decisions for this avatar.`,
      userPrompt: (context) => {
        const webAnalysis = context.completedResults?.web_analysis;
        if (webAnalysis) {
          return buildBuyingTriggersPrompt(context.avatar, webAnalysis);
        }
        return buildBuyingTriggersPromptBasic(context.avatar);
      },
      temperature: 0.7,
      maxTokens: 2000,
      postProcess: safeParseJSON,
    },
    {
      id: 'messaging',
      priority: 3,
      systemPrompt: `You are an expert copywriter specializing in avatar-specific messaging.
Create compelling hooks, angles, and messaging strategies tailored to this specific avatar.`,
      userPrompt: (context) => {
        const webAnalysis = context.completedResults?.web_analysis;
        const beliefs = context.completedResults?.six_beliefs;
        if (webAnalysis && beliefs) {
          return buildMessagingPrompt(context.avatar, webAnalysis, beliefs);
        }
        return buildMessagingPromptBasic(context.avatar);
      },
      temperature: 0.8,
      maxTokens: 2500,
      postProcess: safeParseJSON,
    },
  ];

  // Run swarm
  const results = await orchestrator.runSwarm(nodes, { avatar: avatarData });

  // Combine results into final analysis
  const analysis = {
    webAnalysis: results.get('web_analysis'),
    sixBeliefs: results.get('six_beliefs'),
    psychographics: results.get('psychographics'),
    buyingTriggers: results.get('buying_triggers'),
    messaging: results.get('messaging'),

    // Extract key insights
    summary: generateSummary(
      results.get('web_analysis'),
      results.get('six_beliefs'),
      results.get('psychographics')
    ),
  };

  console.log(`✅ Avatar Analysis Complete`);

  return analysis;
}

/**
 * Build WEB Analysis prompt
 */
function buildWEBAnalysisPrompt(avatar) {
  return `Analyze this avatar using the WEB Analysis framework:

**DEMOGRAPHICS**:
- Age: ${avatar.demographics?.age || 'Not specified'}
- Gender: ${avatar.demographics?.gender || 'Not specified'}
- Location: ${avatar.demographics?.location || 'Not specified'}
- Income: ${avatar.demographics?.income || 'Not specified'}
- Education: ${avatar.demographics?.education || 'Not specified'}
- Occupation: ${avatar.demographics?.occupation || 'Not specified'}

**INITIAL WEB DATA** (if provided):
- Wants: ${avatar.webAnalysis?.wants?.filter(w => w).join(', ') || 'Not specified'}
- Emotions: ${avatar.webAnalysis?.emotions?.filter(e => e).join(', ') || 'Not specified'}
- Beliefs: ${avatar.webAnalysis?.beliefs?.filter(b => b).join(', ') || 'Not specified'}
- Dominant Emotion: ${avatar.webAnalysis?.dominantEmotion || 'Not specified'}

Provide a complete WEB analysis with all sections filled out. Be specific to this avatar's situation.`;
}

/**
 * Build 6 Beliefs prompt
 */
function buildSixBeliefsPrompt(avatar) {
  return `Analyze the 6 Beliefs Framework for this avatar:

**AVATAR PROFILE**:
- Demographics: ${formatDemographics(avatar.demographics)}
- Context: ${avatar.context || 'General analysis'}

**INITIAL BELIEFS** (if provided):
${avatar.webAnalysis?.beliefs?.filter(b => b).map((b, i) => `${i + 1}. ${b}`).join('\n') || 'None specified'}

For each of the 6 beliefs (outcome, identity, problem, solution, product, credibility), provide:
- Required belief
- Current state (0-10 score)
- Common objections
- Transition state
- Bridge strategy
- Messaging hooks

Be specific and tactical.`;
}

/**
 * Build psychographics prompt
 */
function buildPsychographicsPrompt(avatar) {
  return `Create a deep psychographic profile for this avatar:

Demographics: ${formatDemographics(avatar.demographics)}

Provide JSON format:
{
  "values": ["core value 1", "core value 2", "core value 3", "core value 4", "core value 5"],
  "attitudes": ["attitude 1", "attitude 2", "attitude 3", "attitude 4", "attitude 5"],
  "interests": ["interest 1", "interest 2", "interest 3", "interest 4", "interest 5"],
  "lifestyle": ["lifestyle trait 1", "lifestyle trait 2", "lifestyle trait 3", "lifestyle trait 4", "lifestyle trait 5"],
  "mediaConsumption": ["media source 1", "media source 2", "media source 3", "media source 4", "media source 5"],
  "personalityTraits": ["trait 1", "trait 2", "trait 3", "trait 4", "trait 5"],
  "socialStatus": "Description of perceived and desired social status",
  "tribalAffiliations": ["group 1", "group 2", "group 3"]
}`;
}

/**
 * Build buying triggers prompt (with WEB context)
 */
function buildBuyingTriggersPrompt(avatar, webAnalysis) {
  return `Based on this avatar's WEB analysis, identify specific buying triggers:

**DOMINANT EMOTION**: ${webAnalysis.dominantEmotion || 'Not specified'}
**PRIMARY WANTS**: ${webAnalysis.primaryWants?.join(', ') || 'Not specified'}
**LIMITING BELIEFS**: ${webAnalysis.limitingBeliefs?.join(', ') || 'Not specified'}

Provide JSON format:
{
  "situationalTriggers": ["situation 1", "situation 2", "situation 3", "situation 4", "situation 5"],
  "emotionalTriggers": ["emotion 1", "emotion 2", "emotion 3", "emotion 4", "emotion 5"],
  "temporalTriggers": ["time-based trigger 1", "time-based trigger 2", "time-based trigger 3"],
  "socialTriggers": ["social trigger 1", "social trigger 2", "social trigger 3"],
  "urgencyDrivers": ["urgency driver 1", "urgency driver 2", "urgency driver 3"],
  "decisionCriteria": ["criterion 1", "criterion 2", "criterion 3", "criterion 4", "criterion 5"]
}`;
}

/**
 * Build buying triggers prompt (basic)
 */
function buildBuyingTriggersPromptBasic(avatar) {
  return `Identify buying triggers for this avatar:

Demographics: ${formatDemographics(avatar.demographics)}

Provide situational, emotional, temporal, social triggers and urgency drivers in JSON format.`;
}

/**
 * Build messaging prompt (with full context)
 */
function buildMessagingPrompt(avatar, webAnalysis, beliefs) {
  return `Create messaging strategies for this avatar:

**DOMINANT EMOTION**: ${webAnalysis.dominantEmotion || 'Not specified'}
**EMOTIONAL CURRENCY**: ${webAnalysis.emotionalCurrency || 'Not specified'}
**WEAKEST BELIEFS**: ${identifyWeakestBeliefs(beliefs)}

Provide JSON format:
{
  "hooks": ["hook 1", "hook 2", "hook 3", "hook 4", "hook 5", "hook 6", "hook 7", "hook 8", "hook 9", "hook 10"],
  "angles": ["angle 1", "angle 2", "angle 3", "angle 4", "angle 5"],
  "framingStrategies": ["strategy 1", "strategy 2", "strategy 3"],
  "languagePatterns": ["pattern 1", "pattern 2", "pattern 3", "pattern 4", "pattern 5"],
  "proofElements": ["proof type 1", "proof type 2", "proof type 3"],
  "ctaStyles": ["cta approach 1", "cta approach 2", "cta approach 3"]
}`;
}

/**
 * Build messaging prompt (basic)
 */
function buildMessagingPromptBasic(avatar) {
  return `Create messaging strategies for this avatar:

Demographics: ${formatDemographics(avatar.demographics)}

Provide hooks, angles, framing strategies, language patterns, proof elements, and CTA styles in JSON format.`;
}

/**
 * Format demographics for prompts
 */
function formatDemographics(demographics) {
  if (!demographics) return 'Not specified';

  return `Age ${demographics.age || 'unknown'}, ${demographics.gender || 'unknown'} gender, ${demographics.location || 'unknown'} location, ${demographics.income || 'unknown'} income, ${demographics.occupation || 'unknown'}`;
}

/**
 * Identify weakest beliefs for targeted messaging
 */
function identifyWeakestBeliefs(beliefs) {
  if (!beliefs) return 'Not analyzed';

  const beliefScores = [
    { name: 'outcome', score: beliefs.outcome?.currentState || 0 },
    { name: 'identity', score: beliefs.identity?.currentState || 0 },
    { name: 'problem', score: beliefs.problem?.currentState || 0 },
    { name: 'solution', score: beliefs.solution?.currentState || 0 },
    { name: 'product', score: beliefs.product?.currentState || 0 },
    { name: 'credibility', score: beliefs.credibility?.currentState || 0 },
  ];

  const sorted = beliefScores.sort((a, b) => a.score - b.score);
  return sorted.slice(0, 3).map(b => b.name).join(', ');
}

/**
 * Generate summary insights
 */
function generateSummary(webAnalysis, beliefs, psychographics) {
  return {
    primaryCurrency: webAnalysis?.emotionalCurrency || 'Unknown',
    dominantEmotion: webAnalysis?.dominantEmotion || 'Unknown',
    millionDollarMessage: webAnalysis?.millionDollarMessage || 'Not generated',
    weakestBeliefs: identifyWeakestBeliefs(beliefs),
    coreValues: psychographics?.values?.slice(0, 3) || [],
    recommendedFocus: determineRecommendedFocus(webAnalysis, beliefs),
  };
}

/**
 * Determine recommended focus areas
 */
function determineRecommendedFocus(webAnalysis, beliefs) {
  const focus = [];

  if (beliefs?.identity?.currentState < 5) {
    focus.push('Identity transformation - they don\'t see themselves as capable');
  }
  if (beliefs?.outcome?.currentState < 5) {
    focus.push('Proof of outcome - they don\'t believe it\'s possible');
  }
  if (beliefs?.credibility?.currentState < 5) {
    focus.push('Authority building - they don\'t trust you yet');
  }

  if (focus.length === 0) {
    focus.push('General optimization - beliefs are relatively strong');
  }

  return focus;
}

export default analyzeAvatarSwarm;
