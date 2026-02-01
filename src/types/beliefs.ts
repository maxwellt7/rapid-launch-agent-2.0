// 6 Beliefs Framework Types
// Based on Belief Engineering Masterclass

export type BeliefCategory =
  | 'outcome'       // Can I achieve this result?
  | 'identity'      // Am I the type of person who can do this?
  | 'problem'       // Do I have this problem?
  | 'solution'      // Can this type of solution work?
  | 'product'       // Is this the right product/service?
  | 'credibility';  // Can I trust this company/person?

export type BeliefTransitionState =
  | 'closed'        // Strongly disagree, resistant
  | 'receptive'     // Neutral/uncertain, open to information
  | 'transformed';  // Strongly agree, ready to act

export interface Belief {
  category: BeliefCategory;
  currentState: BeliefTransitionState;
  currentBelief: string;
  targetBelief: string;
  beliefGap: BeliefGap;
  transitionStrategy: TransitionStrategy;
}

export interface BeliefGap {
  description: string;
  severity: 'small' | 'moderate' | 'large';
  obstacles: string[];
  opportunities: string[];
}

export interface TransitionStrategy {
  approach: string;
  tactics: BeliefBridgeTactic[];
  copyPatterns: string[];
  proofPoints: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
}

export interface BeliefBridgeTactic {
  name: string;
  description: string;
  when: 'early' | 'middle' | 'late';
  example: string;
}

// Belief Bridge Patterns (for copy)
export interface BeliefBridgePattern {
  fromState: BeliefTransitionState;
  toState: BeliefTransitionState;
  category: BeliefCategory;
  copyApproaches: string[];
  doNots: string[];
  examples: string[];
}

// Complete Belief Map for Avatar
export interface BeliefMap {
  outcome: Belief;
  identity: Belief;
  problem: Belief;
  solution: Belief;
  product: Belief;
  credibility: Belief;

  // Overall assessment
  readinessScore: number;       // 0-100
  primaryBarrier: BeliefCategory;
  recommendedFocus: BeliefCategory[];
}

// Belief Transition Recommendations
export interface BeliefTransitionPlan {
  belief: BeliefCategory;
  currentState: BeliefTransitionState;
  targetState: BeliefTransitionState;
  steps: BeliefTransitionStep[];
  estimatedTimeframe: string;
}

export interface BeliefTransitionStep {
  step: number;
  action: string;
  copyElement: string;
  proofRequired: string[];
  successMetric: string;
}

export default {
  BeliefCategory,
  BeliefTransitionState,
  Belief,
  BeliefGap,
  TransitionStrategy,
  BeliefBridgeTactic,
  BeliefBridgePattern,
  BeliefMap,
  BeliefTransitionPlan,
  BeliefTransitionStep,
};
