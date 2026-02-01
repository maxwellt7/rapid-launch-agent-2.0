import { SwarmOrchestrator } from './orchestrator.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { safeParseJSON } from '../../utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load prompt templates
const blurPrompt = readFileSync(
  join(__dirname, '../../prompts/content/blur_method.txt'),
  'utf8'
);
const adScriptPrompt = readFileSync(
  join(__dirname, '../../prompts/content/ad_script.txt'),
  'utf8'
);
const vslPrompt = readFileSync(
  join(__dirname, '../../prompts/content/vsl_script.txt'),
  'utf8'
);
const landingPagePrompt = readFileSync(
  join(__dirname, '../../prompts/content/landing_page.txt'),
  'utf8'
);
const emailSequencePrompt = readFileSync(
  join(__dirname, '../../prompts/content/email_sequence.txt'),
  'utf8'
);

/**
 * Generate content using specialized prompts and swarm orchestration
 *
 * Content Types:
 * - blur: BLUR method cold email campaign
 * - ad_script: Video ad scripts (Facebook, YouTube, TikTok)
 * - vsl: Video Sales Letter script
 * - landing_page: Sales page copy
 * - email_sequence: Email nurture/sales sequences
 */
export async function generateContent(contentType, inputData) {
  console.log(`📝 Generating ${contentType} content...`);

  const orchestrator = new SwarmOrchestrator({
    maxParallel: 3,
    retryAttempts: 2,
    onProgress: (progress) => {
      console.log(`📊 Content Generation Progress: ${progress.completed}/${progress.total}`);
    },
  });

  let result;

  switch (contentType) {
    case 'blur':
      result = await generateBLURCampaign(orchestrator, inputData);
      break;
    case 'ad_script':
      result = await generateAdScript(orchestrator, inputData);
      break;
    case 'vsl':
      result = await generateVSL(orchestrator, inputData);
      break;
    case 'landing_page':
      result = await generateLandingPage(orchestrator, inputData);
      break;
    case 'email_sequence':
      result = await generateEmailSequence(orchestrator, inputData);
      break;
    default:
      throw new Error(`Unknown content type: ${contentType}`);
  }

  console.log(`✅ ${contentType} content generated`);
  return result;
}

/**
 * Generate BLUR Method Cold Email Campaign
 */
async function generateBLURCampaign(orchestrator, data) {
  const nodes = [
    {
      id: 'blur_analysis',
      priority: 1,
      systemPrompt: blurPrompt,
      userPrompt: () => buildBLURPrompt(data),
      temperature: 0.7,
      maxTokens: 4000,
      postProcess: (result) => result,
    },
  ];

  const results = await orchestrator.runSwarm(nodes, {});
  return {
    type: 'blur',
    content: results.get('blur_analysis'),
  };
}

/**
 * Generate Ad Scripts
 */
async function generateAdScript(orchestrator, data) {
  // Generate 3 platform variations in parallel
  const nodes = [
    {
      id: 'facebook_ad',
      priority: 1,
      systemPrompt: adScriptPrompt,
      userPrompt: () => buildAdScriptPrompt(data, 'facebook'),
      temperature: 0.8,
      maxTokens: 3000,
      postProcess: (result) => result,
    },
    {
      id: 'youtube_ad',
      priority: 1,
      systemPrompt: adScriptPrompt,
      userPrompt: () => buildAdScriptPrompt(data, 'youtube'),
      temperature: 0.8,
      maxTokens: 3000,
      postProcess: (result) => result,
    },
    {
      id: 'tiktok_ad',
      priority: 1,
      systemPrompt: adScriptPrompt,
      userPrompt: () => buildAdScriptPrompt(data, 'tiktok'),
      temperature: 0.8,
      maxTokens: 3000,
      postProcess: (result) => result,
    },
  ];

  const results = await orchestrator.runSwarm(nodes, {});
  return {
    type: 'ad_script',
    platforms: {
      facebook: results.get('facebook_ad'),
      youtube: results.get('youtube_ad'),
      tiktok: results.get('tiktok_ad'),
    },
  };
}

/**
 * Generate VSL Script
 */
async function generateVSL(orchestrator, data) {
  const nodes = [
    {
      id: 'vsl_script',
      priority: 1,
      systemPrompt: vslPrompt,
      userPrompt: () => buildVSLPrompt(data),
      temperature: 0.75,
      maxTokens: 4000,
      postProcess: (result) => result,
    },
  ];

  const results = await orchestrator.runSwarm(nodes, {});
  return {
    type: 'vsl',
    content: results.get('vsl_script'),
  };
}

/**
 * Generate Landing Page Copy
 */
async function generateLandingPage(orchestrator, data) {
  const nodes = [
    {
      id: 'landing_page',
      priority: 1,
      systemPrompt: landingPagePrompt,
      userPrompt: () => buildLandingPagePrompt(data),
      temperature: 0.75,
      maxTokens: 4000,
      postProcess: (result) => result,
    },
  ];

  const results = await orchestrator.runSwarm(nodes, {});
  return {
    type: 'landing_page',
    content: results.get('landing_page'),
  };
}

/**
 * Generate Email Sequence
 */
async function generateEmailSequence(orchestrator, data) {
  const nodes = [
    {
      id: 'email_sequence',
      priority: 1,
      systemPrompt: emailSequencePrompt,
      userPrompt: () => buildEmailSequencePrompt(data),
      temperature: 0.75,
      maxTokens: 4000,
      postProcess: (result) => result,
    },
  ];

  const results = await orchestrator.runSwarm(nodes, {});
  return {
    type: 'email_sequence',
    content: results.get('email_sequence'),
  };
}

// ============================================
// PROMPT BUILDERS
// ============================================

function buildBLURPrompt(data) {
  return `Create a comprehensive BLUR Method cold email campaign:

**TARGET COMPANY/AVATAR**:
${formatAvatarContext(data.avatar)}

**OFFER/PRODUCT**:
${formatOfferContext(data.offer)}

**CAMPAIGN OBJECTIVE**: ${data.objective || 'Book qualified sales calls'}

**CONSTRAINTS/PREFERENCES**:
${data.constraints || 'None specified'}

Provide complete BLUR analysis with:
1. ICP Definition & Segmentation
2. Research Playbook
3. Top 10 Trigger Events
4. Personalization Frameworks (3)
5. Complete Email Sequences (5 emails × 3 segments)
6. Subject Line Variations
7. LinkedIn Outreach Scripts
8. Campaign Metrics & KPIs

Make it tactical and ready to implement.`;
}

function buildAdScriptPrompt(data, platform) {
  const platformSpecs = {
    facebook: '30-60 second ad for Facebook/Instagram feed',
    youtube: '15-30 second skippable ad for YouTube',
    tiktok: '15-30 second native-style ad for TikTok/Reels',
  };

  return `Create a ${platformSpecs[platform]} script:

**TARGET AVATAR**:
${formatAvatarContext(data.avatar)}

**OFFER/PRODUCT**:
${formatOfferContext(data.offer)}

**AD OBJECTIVE**: ${data.objective || 'Drive clicks to landing page'}

**BUDGET/PRODUCTION**: ${data.productionLevel || 'UGC-style (user-generated content feel)'}

**KEY MESSAGE**: ${data.keyMessage || 'Derived from offer'}

Provide complete ad script with:
- Platform-optimized hook (first 3 seconds)
- Visual + audio table (shot-by-shot)
- On-screen text overlays
- CTA strategy
- Production notes
- 3 hook variations
- A/B test recommendations

Ready for production.`;
}

function buildVSLPrompt(data) {
  return `Create a complete VSL (Video Sales Letter) script:

**TARGET AVATAR**:
${formatAvatarContext(data.avatar)}

**OFFER/PRODUCT**:
${formatOfferContext(data.offer)}

**VSL LENGTH**: ${data.length || '20-30 minutes'}

**UNIQUE MECHANISM**: ${data.mechanism || 'To be developed from offer'}

**PROOF ELEMENTS**:
${data.proofElements?.join('\n') || 'Case studies to be provided'}

**YOUR STORY**: ${data.yourStory || 'Origin story to be included'}

Provide complete VSL script with:
- Full script with timestamps
- Hook strategy (first 2 minutes)
- Story arc (problem → discovery → transformation)
- Mechanism reveal
- Offer breakdown & value stack
- Social proof integration
- Guarantee structure
- FAQ section
- Multiple CTAs throughout
- Slide deck outline
- Visual elements needed

Ready for video production.`;
}

function buildLandingPagePrompt(data) {
  const pageType = data.pageType || 'long-form';

  return `Create ${pageType} landing page copy:

**TARGET AVATAR**:
${formatAvatarContext(data.avatar)}

**OFFER/PRODUCT**:
${formatOfferContext(data.offer)}

**PAGE TYPE**: ${pageType} (${
    pageType === 'long-form' ? '3,000-8,000 words' : '500-1,500 words'
  })

**TRAFFIC SOURCE**: ${data.trafficSource || 'Cold paid traffic'}

**PRIMARY GOAL**: ${data.goal || 'Direct sales'}

**PROOF ELEMENTS**:
${data.testimonials?.join('\n') || 'Testimonials to be added'}

Provide complete landing page copy with:
- Headline + subheadline (with 3 variations)
- Complete page sections (problem, story, solution, how it works, proof, offer, guarantee, FAQ, urgency)
- Bullet points and copy blocks
- Multiple CTAs throughout
- Visual hierarchy notes
- Design recommendations
- A/B test variations

Ready to design and deploy.`;
}

function buildEmailSequencePrompt(data) {
  const sequenceType = data.sequenceType || 'welcome';

  return `Create ${sequenceType} email sequence:

**TARGET AVATAR**:
${formatAvatarContext(data.avatar)}

**OFFER/PRODUCT** (if applicable):
${formatOfferContext(data.offer)}

**SEQUENCE TYPE**: ${sequenceType}

**SEQUENCE LENGTH**: ${data.emailCount || '5'} emails over ${data.timeframe || '7-10 days'}

**TONE**: ${data.tone || 'Conversational and friendly'}

**PRIMARY GOAL**: ${data.goal || 'Build trust and nurture relationship'}

Provide complete email sequence with:
- Sequence overview and flowchart
- Complete email scripts (subject lines, preview text, body, CTA, P.S.)
- 2-3 subject line variations per email
- Send timing and triggers
- A/B test recommendations
- Performance benchmarks
- Branching logic (if applicable)

Ready to load into ESP (email service provider).`;
}

/**
 * Format avatar context for prompts
 */
function formatAvatarContext(avatar) {
  if (!avatar) return 'Not provided';

  return `
Demographics: ${JSON.stringify(avatar.demographics || {})}
Primary Wants: ${avatar.primaryWants?.join(', ') || 'Not specified'}
Dominant Emotion: ${avatar.dominantEmotion || 'Not specified'}
Primary Beliefs: ${avatar.primaryBeliefs?.join(', ') || 'Not specified'}
Primary Currency: ${avatar.primaryCurrency || 'Not specified'}
`;
}

/**
 * Format offer context for prompts
 */
function formatOfferContext(offer) {
  if (!offer) return 'Not provided';

  return `
Product: ${offer.productDescription || 'Not specified'}
Target Market: ${offer.targetMarket || 'Not specified'}
Problem Solved: ${offer.pressingProblem || 'Not specified'}
Desired Outcome: ${offer.desiredOutcome || 'Not specified'}
Promise: ${offer.productPromise || 'Not specified'}
Pricing: ${offer.pricing || 'Not specified'}
Guarantee: ${offer.guarantee || 'Not specified'}
`;
}

export default generateContent;
