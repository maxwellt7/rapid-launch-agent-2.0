// Core Project Types
export interface Project {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number;

  // Branding (NEW for EYO)
  companyName?: string;
  logoUrl?: string;
  brandColorPrimary?: string;
  brandColorSecondary?: string;
  brandVoice?: 'professional' | 'casual' | 'authoritative';

  // Related data
  offer: OfferData | null;
  avatar: AvatarData | null;
  competitors: CompetitorData | null;
  manifold: ManifoldData | null;
  launchDoc: LaunchDocData | null;
  blurReport: BlurReportData | null;
  contentGenerations: ContentGeneration[];
  lovableDeployments: LovableDeployment[];
}

// Offer Builder Types (EYO Scoring)
export interface OfferData {
  targetMarket: string;
  pressingProblem: string;
  desiredOutcome: string;
  productDescription: string;
  productPromise: string;
  proofElements: string;
  pricing: string;
  guarantee: string;

  // EYO Scoring (NEW - replaces Hormozi)
  clarityOfOutcome?: number;        // 1-10
  gravityOfProblem?: number;        // 1-10
  beliefInDiagnosis?: number;       // 1-10
  naturalFit?: number;              // 1-10
  clearOffer?: number;              // 1-10
  totalScore?: number;              // out of 50

  analysisJson?: EYOAnalysis;
}

export interface EYOAnalysis {
  // EYO Scoring breakdown
  eyoScores: {
    clarityOfOutcome: EYOScore;
    gravityOfProblem: EYOScore;
    beliefInDiagnosis: EYOScore;
    naturalFit: EYOScore;
    clearOffer: EYOScore;
    total: number;
    totalScore: number; // Alias for total
  };

  // Recommendations for improvement
  recommendations: EYORecommendation[];

  // Projected improvement after applying recommendations
  projectedImprovement?: {
    currentScore: number;
    projectedScore: number;
    improvement: number;
    improvementPercent: number;
  };

  // Suggested avatar (for pre-population)
  suggestedAvatar?: {
    demographics: Demographics;
    primaryWants: string[];
    primaryEmotions: string[];
    primaryBeliefs: string[];
    dominantEmotion: string;
    primaryCurrency: string;
    millionDollarMessage: string;
    beliefs?: BeliefAnalysis;
  };
}

export interface EYOScore {
  score: number;              // 1-10
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
}

export interface EYORecommendation {
  id: number;
  title: string;
  description: string;
  reasoning: string;
  criteriaImproved: 'clarityOfOutcome' | 'gravityOfProblem' | 'beliefInDiagnosis' | 'naturalFit' | 'clearOffer';
  scoreImpact: {
    before: number;
    after: number;
    change: number;
  };
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    timeRequired: string;
    priority: 'high' | 'medium' | 'low';
  };
  specificActions: string[];
}

// Backward compatibility export
export type OfferAnalysis = EYOAnalysis;

// Avatar Builder Types (with 6 Beliefs Framework)
export interface AvatarData {
  demographics: Demographics;
  webAnalysis: WEBAnalysis;
  empathyMap: EmpathyMap;
  goalsGrid: GoalsGrid;
  primaryCurrency: string;
  millionDollarMessage: string;

  // 6 Beliefs Framework (NEW for EYO)
  beliefs?: BeliefAnalysis;

  // Analysis JSON from swarm
  analysisJson?: {
    webAnalysis?: any;
    sixBeliefs?: BeliefAnalysis;
    psychographics?: any;
    buyingTriggers?: any;
    messaging?: any;
    summary?: any;
  };
}

export interface Demographics {
  ageRange: string;
  gender: string;
  location: string;
  incomeRange: string;
  education: string;
  occupation: string;

  // Backward compatibility
  age?: string;
  income?: string;
}

export interface WEBAnalysis {
  wants: string[];
  emotions: string[];
  beliefs: string[];
  dominantEmotion: string;
}

// 6 Beliefs Framework (NEW)
export interface BeliefAnalysis {
  outcome: BeliefState;
  identity: BeliefState;
  problem: BeliefState;
  solution: BeliefState;
  product: BeliefState;
  credibility: BeliefState;
}

export interface BeliefState {
  status?: 'closed' | 'receptive' | 'transformed';
  currentBelief?: string;
  targetBelief?: string;
  beliefGap?: string;
  bridgeStrategy?: string;
  copyRecommendations?: string[];

  // From swarm analysis
  currentState?: number; // 0-10 score
  requiredBelief?: string;
  commonObjections?: string[];
  transitionState?: 'closed' | 'receptive' | 'transformed';
  messagingHooks?: string[];
}

export interface EmpathyMap {
  seeing: string[];
  hearing: string[];
  saying: string[];
  thinking: string[];
  feeling: string[];
  doing: string[];
  pains?: string[];
  gains?: string[];
}

export interface GoalsGrid {
  painsAndFrustrations: string[];
  fearsAndImplications: string[];
  goalsAndDesires: string[];
  dreamsAndAspirations: string[];
}

// Competitor Intelligence Types
export interface CompetitorData {
  industry: string;
  competitors: Competitor[];
  marketIntelligence: MarketIntelligence;
  positioningAngles: string[];
  marketGaps?: string[];
  mvpFeatures: string[];
  distributionStrategy: string;
}

export interface Competitor {
  name: string;
  url: string;
  revenueModel: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  funnelArchitecture: string;
}

export interface MarketIntelligence {
  marketSize: string;
  growthTrends: string[];
  opportunities: string[];
  threats: string[];
}

// Avatar Bible Types (Manifold)
export interface ManifoldData {
  buildABuyer: string;
  painMatrix: string;
  coreWound: string;
  benefitMatrix: string;
  desireDaisyChain: string;
  resonanceHierarchy: string;
  rhConstraints: string;
  dissolution: string;
  epiphanyThreshold: string;
  hooks: string;
  storyPrompts: string;
  languagePatterns: string;
  concentricCircles: string;
  ejectionTriggers: string;

  // Metadata
  generationTimeSeconds?: number;
  generationMethod?: 'sequential' | 'swarm';
}

// Launch Document Types
export interface LaunchDocData {
  generationId?: string;
  sections: LaunchDocSection[];
  generatedAt: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed';
  message?: string;
}

export interface LaunchDocSection {
  id: number;
  title: string;
  content: string;
}

// BLUR Method Types (NEW for EYO)
export interface BlurReportData {
  id?: string;
  projectId: string;
  reportTitle: string;
  industry: string;
  targetMarket: string;

  // Content
  page1Content: string;           // Visible preview page
  fullReportContent: string;      // Complete report (behind blur)
  emailSequence?: string;         // Email copy for BLUR method

  // Design
  designTemplate?: 'professional' | 'modern' | 'minimal';
  coverImageUrl?: string;

  // Generated PDF
  pdfUrl?: string;
  generatedAt?: string;
}

// Content Generation Types (NEW for Dashboard)
export interface ContentGeneration {
  id: string;
  projectId: string;
  contentType: ContentType;
  variationNumber: number;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  generatedAt: string;
}

export type ContentType =
  | 'ad_script'
  | 'ad_copy'
  | 'landing_page'
  | 'booking_page'
  | 'thank_you_page'
  | 'vsl_script'
  | 'email_sequence'
  | 'ad_image_specs';

export interface ContentGenerationRequest {
  projectId: string;
  contentType: ContentType;
  variations?: number;  // For ad_script and ad_copy (default 3)
}

// Lovable Integration Types (NEW)
export interface LovableDeployment {
  id: string;
  projectId: string;
  contentGenerationId?: string;
  pageType: 'landing' | 'booking' | 'thank_you';
  lovableProjectId?: string;
  deploymentUrl?: string;
  status: 'pending' | 'building' | 'deployed' | 'failed';
  errorMessage?: string;
  createdAt: string;
  deployedAt?: string;
}

export interface LovableDeploymentRequest {
  projectId: string;
  pageType: 'landing' | 'booking' | 'thank_you';
  contentGenerationId?: string;
}

// User & Subscription Types (NEW)
export interface User {
  id: string;
  email: string;
  fullName?: string;
  subscriptionTier?: string;
  subscriptionStatus: 'none' | 'active' | 'canceled' | 'expired';
  subscriptionStartedAt?: string;
  subscriptionExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  status: 'none' | 'active' | 'canceled' | 'expired';
  expiresAt?: string;
}

// Usage Tracking Types (NEW)
export interface UsageRecord {
  id: number;
  userId: string;
  projectId?: string;
  actionType: string;
  tokensUsed: number;
  costUsd: number;
  createdAt: string;
}

export interface UsageStats {
  actionType: string;
  count: number;
  totalTokens: number;
  totalCost: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AnalysisProgress {
  step: string;
  progress: number;
  message: string;
  currentNode?: string;
}

