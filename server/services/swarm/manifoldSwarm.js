import { SwarmOrchestrator } from './orchestrator.js';
import { callClaude } from '../../config/anthropic.js';

/**
 * Manifold Workflow using Wave-Based Swarm Orchestration
 *
 * Organizes 14 nodes into 5 waves based on dependencies:
 *
 * Wave 1: buildABuyer, languagePatterns (2 parallel)
 * Wave 2: painMatrix, resonanceHierarchy, concentricCircles (3 parallel)
 * Wave 3: coreWound, benefitMatrix, rhConstraints (3 parallel)
 * Wave 4: desireDaisyChain, epiphanyThreshold, dissolution, storyPrompts, ejectionTriggers (5 parallel)
 * Wave 5: hooks (1 node)
 *
 * Performance: ~2-3 minutes vs 15-20 minutes sequential (5-7x faster)
 */
export async function runManifoldSwarm(offerData, avatarData, competitorData = null) {
  console.log('🧠 Starting Manifold Workflow Swarm');

  const orchestrator = new SwarmOrchestrator({
    maxParallel: 5,
    retryAttempts: 2,
    onProgress: (progress) => {
      console.log(`📊 Manifold Progress: ${progress.completed}/${progress.total} - Wave ${progress.wave || 'N/A'}`);
    },
  });

  const context = {
    offer: offerData,
    avatar: avatarData,
    competitors: competitorData,
  };

  // === WAVE 1 === (No internal dependencies)
  console.log('🌊 Wave 1: Foundation Analysis');
  const wave1Nodes = [
    createNode('buildABuyer', 1, buildABuyerPrompt),
    createNode('languagePatterns', 1, languagePatternsPrompt),
  ];

  let wave1Results = await orchestrator.runSwarm(wave1Nodes, context);
  Object.assign(context, Object.fromEntries(wave1Results));

  // === WAVE 2 === (Depend on buildABuyer)
  console.log('🌊 Wave 2: Pain & Resonance Analysis');
  const wave2Nodes = [
    createNode('painMatrix', 2, painMatrixPrompt),
    createNode('resonanceHierarchy', 2, resonanceHierarchyPrompt),
    createNode('concentricCircles', 2, concentricCirclesPrompt),
  ];

  let wave2Results = await orchestrator.runSwarm(wave2Nodes, context);
  Object.assign(context, Object.fromEntries(wave2Results));

  // === WAVE 3 === (Depend on Wave 2)
  console.log('🌊 Wave 3: Core Insights');
  const wave3Nodes = [
    createNode('coreWound', 3, coreWoundPrompt),
    createNode('benefitMatrix', 3, benefitMatrixPrompt),
    createNode('rhConstraints', 3, rhConstraintsPrompt),
  ];

  let wave3Results = await orchestrator.runSwarm(wave3Nodes, context);
  Object.assign(context, Object.fromEntries(wave3Results));

  // === WAVE 4 === (Depend on Wave 3)
  console.log('🌊 Wave 4: Strategy & Frameworks');
  const wave4Nodes = [
    createNode('desireDaisyChain', 4, desireDaisyChainPrompt),
    createNode('epiphanyThreshold', 4, epiphanyThresholdPrompt),
    createNode('dissolution', 4, dissolutionPrompt),
    createNode('storyPrompts', 4, storyPromptsPrompt),
    createNode('ejectionTriggers', 4, ejectionTriggersPrompt),
  ];

  let wave4Results = await orchestrator.runSwarm(wave4Nodes, context);
  Object.assign(context, Object.fromEntries(wave4Results));

  // === WAVE 5 === (Depend on Wave 4)
  console.log('🌊 Wave 5: Hooks & Messaging');
  const wave5Nodes = [
    createNode('hooks', 5, hooksPrompt),
  ];

  let wave5Results = await orchestrator.runSwarm(wave5Nodes, context);
  Object.assign(context, Object.fromEntries(wave5Results));

  console.log('✅ Manifold Workflow Complete - All Waves Processed');

  // Compile final results
  const results = {
    // Wave 1
    buildABuyer: context.buildABuyer,
    languagePatterns: context.languagePatterns,
    // Wave 2
    painMatrix: context.painMatrix,
    resonanceHierarchy: context.resonanceHierarchy,
    concentricCircles: context.concentricCircles,
    // Wave 3
    coreWound: context.coreWound,
    benefitMatrix: context.benefitMatrix,
    rhConstraints: context.rhConstraints,
    // Wave 4
    desireDaisyChain: context.desireDaisyChain,
    epiphanyThreshold: context.epiphanyThreshold,
    dissolution: context.dissolution,
    storyPrompts: context.storyPrompts,
    ejectionTriggers: context.ejectionTriggers,
    // Wave 5
    hooks: context.hooks,
  };

  return results;
}

/**
 * Helper to create node configuration
 */
function createNode(id, wave, promptFn) {
  return {
    id,
    priority: wave,
    systemPrompt: `You are an expert copywriter and marketing psychologist specializing in deep avatar analysis
and persuasion frameworks. You understand Todd Brown's E5 methodology, Eugene Schwartz's levels of awareness,
and advanced psychological profiling.`,
    userPrompt: (context) => promptFn(context),
    temperature: 0.8,
    maxTokens: 2500,
    postProcess: (result) => result, // Return raw text
  };
}

// ============================================
// PROMPT FUNCTIONS
// ============================================

function buildABuyerPrompt(context) {
  return `Based on this offer and avatar data, create a comprehensive buyer psychology profile.

OFFER:
Target Market: ${context.offer.targetMarket}
Problem: ${context.offer.pressingProblem}
Product: ${context.offer.productDescription}

AVATAR:
Demographics: ${JSON.stringify(context.avatar.demographics)}
Wants: ${context.avatar.webAnalysis?.wants?.join(', ') || 'Not specified'}
Emotions: ${context.avatar.webAnalysis?.emotions?.join(', ') || 'Not specified'}
Beliefs: ${context.avatar.webAnalysis?.beliefs?.join(', ') || 'Not specified'}

Create a deep buyer psychology profile covering:
1. Who they are at their core
2. Their worldview and identity
3. What drives their decisions
4. Their relationship with the problem
5. Why they buy (or don't buy)

Provide a comprehensive analysis (500-800 words).`;
}

function painMatrixPrompt(context) {
  return `Create a comprehensive Pain Matrix analyzing 10 dimensions of pain for this avatar.

CONTEXT:
${context.buildABuyer}

Analyze pain across these 10 dimensions:
1. Financial pain
2. Time/productivity pain
3. Emotional/psychological pain
4. Social/status pain
5. Physical pain
6. Relationship pain
7. Identity/self-image pain
8. Security/safety pain
9. Growth/potential pain
10. Meaning/purpose pain

For each dimension, describe:
- The specific pain they experience
- How intense it is (1-10)
- How aware they are of it
- The triggers that activate it

Format as a detailed analysis (600-800 words).`;
}

function coreWoundPrompt(context) {
  return `Identify the Core Wound - the fundamental fear or pain at the root of all surface-level problems.

PAIN MATRIX:
${context.painMatrix}

The Core Wound is the deepest emotional/psychological pain that drives everything else. It's often:
- Rooted in identity or self-worth
- Connected to a fundamental fear
- Something they may not consciously recognize
- The "wound" that all surface pains stem from

Identify and explain:
1. What is their Core Wound?
2. How did it likely form?
3. How does it manifest in their daily life?
4. How does it drive their behavior and decisions?
5. Why addressing this is the key to transformation

Provide a deep, empathetic analysis (400-600 words).`;
}

function benefitMatrixPrompt(context) {
  return `Create a Benefit Matrix by reversing each pain into its corresponding benefit.

PAIN MATRIX:
${context.painMatrix}

For each of the 10 pain dimensions, identify:
- The inverse benefit (what they gain when pain is removed)
- The emotional payoff
- How their life transforms
- The specific outcome they experience

Also categorize benefits into:
- Features (what it is)
- Advantages (what it does)
- Benefits (what it means for them)
- Emotional benefits (how they feel)
- Identity benefits (who they become)

Provide comprehensive benefit analysis (600-800 words).`;
}

function desireDaisyChainPrompt(context) {
  return `Create 3 Desire Daisy Chains showing progression from surface desire to core wound resolution.

BENEFIT MATRIX:
${context.benefitMatrix}

CORE WOUND:
${context.coreWound}

A Desire Daisy Chain shows: "I want X, so that Y, so that Z, so that [Core Wound Resolution]"

Create 3 chains:
1. Starting from most obvious/surface-level desire
2. Starting from emotional benefit
3. Starting from identity transformation

For each chain, show:
- 5-7 steps of progression
- How each "so that" goes deeper
- How it ultimately resolves the core wound
- The logical flow of desires

Format as clear progressions with explanation (500-700 words).`;
}

function resonanceHierarchyPrompt(context) {
  return `Create the Resonance Hierarchy: Experiences → Beliefs → Values → Identity

CONTEXT:
${context.buildABuyer}

Map the hierarchy:

1. EXPERIENCES (What happened to them)
   - Past experiences that shaped them
   - Failures and frustrations
   - Attempts to solve the problem

2. BELIEFS (What they concluded)
   - Beliefs about themselves
   - Beliefs about the problem
   - Beliefs about solutions
   - Limiting beliefs

3. VALUES (What matters to them)
   - Core values driving decisions
   - What they prioritize
   - What they're unwilling to compromise

4. IDENTITY (Who they see themselves as)
   - Current identity
   - Desired identity
   - Identity conflicts
   - Identity transformation needed

Provide detailed analysis of each level (700-900 words).`;
}

function rhConstraintsPrompt(context) {
  return `Identify the Resonance Hierarchy Constraints - perceived limitations at each level.

RESONANCE HIERARCHY:
${context.resonanceHierarchy}

For each level, identify constraints:

1. EXPERIENCE CONSTRAINTS
   - Past failures that limit them
   - Bad experiences creating fear
   - "Proof" that change is impossible

2. BELIEF CONSTRAINTS
   - Limiting beliefs blocking action
   - False narratives they tell themselves
   - Beliefs about what's possible

3. VALUE CONSTRAINTS
   - Value conflicts preventing action
   - What they think they must sacrifice
   - Values misalignment

4. IDENTITY CONSTRAINTS
   - Who they think they are (limiting)
   - Who they think they can't be
   - Identity misalignment with desired outcome

For each constraint, explain:
- What it is
- How it limits them
- Where it came from
- Why it feels true to them

Provide comprehensive analysis (600-800 words).`;
}

function dissolutionPrompt(context) {
  return `Create Dissolution Frameworks to dissolve each constraint identified.

CONSTRAINTS:
${context.rhConstraints}

For each major constraint, provide:

1. REFRAME
   - New perspective on the constraint
   - Different way to interpret their experience
   - Truth that contradicts the limiting belief

2. EVIDENCE
   - Proof the constraint isn't absolute
   - Examples of others who overcame it
   - Logic that dissolves the limitation

3. NEW STORY
   - Empowering narrative to replace limiting one
   - How their past can empower vs limit
   - Bridge from current to desired identity

4. EPIPHANY SEED
   - The "aha moment" that shifts everything
   - The question that makes them reconsider
   - The insight that creates breakthrough

Provide dissolution strategies for top 5-7 constraints (700-900 words).`;
}

function epiphanyThresholdPrompt(context) {
  return `Analyze the Epiphany Threshold - the scale of believability from 1-10.

CONTEXT:
Build A Buyer: ${context.buildABuyer.substring(0, 300)}...
Core Wound: ${context.coreWound.substring(0, 200)}...

The Epiphany Threshold is about what they can believe right now:

1 = Completely unbelievable, triggering, rejected immediately
10 = Completely obvious, already believe it, no epiphany needed

The sweet spot is typically 6-8: Surprising but believable.

Analyze:

1. CURRENT BELIEFS (What they believe now = 10 on their scale)
2. ADJACENT POSSIBLE (What they could believe = 6-8)
3. TOO FAR (What they can't believe yet = 1-5)
4. BRIDGE BELIEFS (Stepping stones from current to desired)

Map the journey:
- Where they are now
- Where they need to be
- The believability steps to get there
- How to meet them where they are

Provide strategic analysis (500-700 words).`;
}

function hooksPrompt(context) {
  return `Generate powerful hooks using Maze Theory.

CONTEXT:
Core Wound: ${context.coreWound.substring(0, 200)}...
Epiphany Threshold: ${context.epiphanyThreshold.substring(0, 200)}...

Create 10 hooks that:
- Promise revelation/epiphany
- Create curiosity gap
- Challenge existing beliefs
- Hint at new mechanism
- Speak to identity transformation

For each hook, provide:
1. The hook itself
2. Why it works psychologically
3. What epiphany it promises
4. What maze it creates

Examples of hook patterns:
- "The real reason why [problem] isn't [what they think]..."
- "Why [surprising thing] is actually [unexpected insight]..."
- "What [authority/group] doesn't want you to know about [topic]..."
- "The [number] [thing] that [outcome] without [effort]..."

Provide 10 hooks with analysis (600-800 words).`;
}

function storyPromptsPrompt(context) {
  return `Create story prompts using Garden of Eden, Problem-Identification-Gap (PIG), and Dark Night frameworks.

CONTEXT:
Core Wound: ${context.coreWound.substring(0, 200)}...
Benefit Matrix: ${context.benefitMatrix.substring(0, 300)}...

Create 3 story frameworks:

1. GARDEN OF EDEN STORY
   - The ideal state (before the fall)
   - What was possible/easy/natural
   - Then something changed...
   - How to return to that state

2. PIG STORY (Problem-Identification-Gap)
   - PROBLEM: The surface problem they know
   - IDENTIFICATION: Helping them identify with it deeply
   - GAP: Revealing the gap between where they are and want to be
   - Bridge: How to cross that gap

3. DARK NIGHT STORY
   - Rock bottom moment
   - The crisis that forced change
   - The revelation that emerged
   - The transformation that followed
   - Why sharing this helps them

For each framework, provide:
- The story structure
- Key emotional beats
- Specific prompts/elements to include
- How it connects to their journey

Provide detailed story frameworks (700-900 words).`;
}

function languagePatternsPrompt(context) {
  return `Identify the specific language patterns and phrases this avatar uses and responds to.

AVATAR DATA:
WEB Analysis: ${JSON.stringify(context.avatar.webAnalysis)}

Create a language pattern library:

1. PHRASES THEY USE
   - Exact words/phrases they say
   - Slang or industry jargon
   - How they describe their problem
   - Metaphors they use

2. EMOTIONAL LANGUAGE
   - Words that trigger emotional response
   - Pain language
   - Desire language
   - Transformation language

3. IDENTITY LANGUAGE
   - How they describe themselves
   - Labels they use/avoid
   - Group identifiers
   - Aspiration language

4. OBJECTION LANGUAGE
   - How they voice doubts
   - Phrases that signal resistance
   - Their specific concerns

5. RESONANCE PHRASES
   - Phrases that make them feel understood
   - Language that builds trust
   - Words that inspire action

Provide 20-30 specific phrases with context (600-800 words).`;
}

function concentricCirclesPrompt(context) {
  return `Map the Concentric Circles of Concern - from self to world.

AVATAR: ${context.buildABuyer.substring(0, 300)}...

Map concerns from innermost to outermost circle:

1. SELF (Innermost)
   - Personal survival/safety
   - Self-image/identity
   - Personal comfort/pleasure
   - Immediate self-interests

2. CLOSE RELATIONSHIPS
   - Family concerns
   - Close friends
   - Intimate relationships
   - People who matter most

3. COMMUNITY/TRIBE
   - Professional community
   - Social circles
   - Cultural group
   - Shared identity groups

4. SOCIETY/WORLD (Outermost)
   - Broader social impact
   - Legacy concerns
   - World-level implications
   - Greater good

Analyze:
- Which circle dominates their thinking?
- What concerns at each level?
- How to ethically appeal to each?
- How your offer addresses each level?
- The hierarchy of their concerns?

Provide strategic analysis (500-700 words).`;
}

function ejectionTriggersPrompt(context) {
  return `Identify Ejection Triggers - messaging landmines that cause immediate rejection.

AVATAR CONTEXT:
${context.buildABuyer.substring(0, 300)}...
Beliefs: ${context.avatar.webAnalysis?.beliefs?.join(', ') || 'Not specified'}
Constraints: ${context.rhConstraints.substring(0, 300)}...

Identify 10-15 ejection triggers:

For each trigger, document:

1. THE TRIGGER
   - What you should NEVER say/imply
   - Why it causes instant rejection
   - The belief it violates

2. WHY IT EJECTS THEM
   - The psychological reason
   - Past experiences it recalls
   - Identity conflict it creates

3. WHAT TO DO INSTEAD
   - How to navigate around it
   - Reframe or alternative approach
   - The safe/effective alternative

Categories of triggers:
- Identity triggers (threatens self-image)
- Belief triggers (contradicts core belief)
- Value triggers (violates principles)
- Pain triggers (activates defense mechanisms)
- Trust triggers (raises suspicion)

Provide comprehensive trigger analysis (700-900 words).`;
}

export default runManifoldSwarm;
