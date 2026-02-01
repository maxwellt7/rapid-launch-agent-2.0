// Content Generation Types
// For Dashboard content generation features

// Ad Script Types
export interface AdScript {
  id: string;
  variation: 1 | 2 | 3;
  style: 'problem-focused' | 'benefit-focused' | 'story-based';

  hook: string;
  problemAgitation: string;
  solutionIntro: string;
  mechanism: string;
  social_proof: string;
  cta: string;

  estimatedLength: string;      // "30 seconds", "60 seconds", etc.
  targetPlatform: string[];     // ["Facebook", "Instagram", "YouTube"]

  fullScript: string;
}

// Ad Copy Types
export interface AdCopy {
  id: string;
  variation: 1 | 2 | 3;
  style: 'direct-response' | 'storytelling' | 'curiosity-gap';

  headline: string;
  subheadline?: string;
  bodyPrimary: string;
  bodySecondary?: string;
  cta: string;

  characterCount: number;
  targetPlatform: string[];

  fullCopy: string;
}

// Landing Page Types
export interface LandingPageCopy {
  id: string;

  sections: {
    hero: LandingPageSection;
    problemAgitation: LandingPageSection;
    solutionIntro: LandingPageSection;
    howItWorks: LandingPageSection;
    benefits: LandingPageSection;
    socialProof: LandingPageSection;
    offer: LandingPageSection;
    faq: LandingPageSection;
    cta: LandingPageSection;
  };

  fullPageCopy: string;
}

export interface LandingPageSection {
  title: string;
  content: string;
  designNotes?: string;
}

// VSL Script Types
export interface VSLScript {
  id: string;

  acts: {
    hookPatternInterrupt: VSLAct;
    storySetup: VSLAct;
    problemAmplification: VSLAct;
    discoveryMoment: VSLAct;
    mechanismExplanation: VSLAct;
    proofSection: VSLAct;
    offerReveal: VSLAct;
    close: VSLAct;
  };

  estimatedDuration: string;    // "12-15 minutes"
  wordCount: number;
  fullScript: string;
}

export interface VSLAct {
  name: string;
  duration: string;             // "2 minutes"
  content: string;
  visualCues?: string[];
  musicCues?: string[];
}

// Email Sequence Types
export interface EmailSequence {
  id: string;
  sequenceType: 'nurture' | 'sales' | 'onboarding';

  emails: Email[];
  totalSequenceLength: number;  // Number of emails
}

export interface Email {
  sequenceNumber: number;
  daysSinceFirst: number;
  subject: string;
  preheader?: string;
  body: string;
  cta: string;
  goal: string;
}

// Ad Image Specs Types
export interface AdImageSpecs {
  id: string;

  specs: AdImageSpec[];
  generalGuidelines: string;
}

export interface AdImageSpec {
  id: number;
  platform: 'Facebook' | 'Instagram' | 'LinkedIn' | 'Twitter' | 'YouTube';
  format: string;               // "Feed", "Story", "Carousel", etc.
  dimensions: string;           // "1080x1080", "1920x1080", etc.
  aspectRatio: string;          // "1:1", "16:9", etc.

  aiPrompt: string;             // Midjourney/DALL-E prompt
  designNotes: string;
  textOverlayRecommendations?: string;
  colorScheme?: string;
}

// Booking Page Types
export interface BookingPageCopy {
  id: string;

  headline: string;
  subheadline: string;
  benefitsList: string[];
  processExplanation: string;
  trustSignals: string[];
  calendar_integrationNotes: string;

  fullPageCopy: string;
}

// Thank You Page Types
export interface ThankYouPageCopy {
  id: string;

  headline: string;
  confirmationMessage: string;
  nextSteps: string[];
  additionalResources?: string[];
  socialSharePrompt?: string;

  fullPageCopy: string;
}

// BLUR Report Types
export interface BLURReport {
  id: string;

  title: string;
  industry: string;
  targetMarket: string;

  coverPage: BLURCoverPage;
  page1: BLURPage;              // Visible preview
  pages2Plus: BLURPage[];       // Blurred pages

  emailCopy: BLUREmailCopy;

  pdfUrl?: string;
}

export interface BLURCoverPage {
  title: string;
  subtitle: string;
  authorName: string;
  companyName: string;
  year: string;
  coverImagePrompt?: string;
}

export interface BLURPage {
  pageNumber: number;
  title: string;
  content: string;
  charts?: ChartSpec[];
  images?: ImageSpec[];
}

export interface ChartSpec {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  title: string;
  description: string;
  dataPoints: string[];
}

export interface ImageSpec {
  description: string;
  aiPrompt?: string;
  placement: string;
}

export interface BLUREmailCopy {
  subject: string;
  preheader: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
}

// Content Generation Metadata
export interface ContentMetadata {
  generatedAt: string;
  model: string;
  tokensUsed: number;
  generationTime: number;       // milliseconds
  quality_score?: number;       // 0-100
  userRating?: number;          // 1-5 stars
  userNotes?: string;
}

export default {
  AdScript,
  AdCopy,
  LandingPageCopy,
  LandingPageSection,
  VSLScript,
  VSLAct,
  EmailSequence,
  Email,
  AdImageSpecs,
  AdImageSpec,
  BookingPageCopy,
  ThankYouPageCopy,
  BLURReport,
  BLURCoverPage,
  BLURPage,
  ChartSpec,
  ImageSpec,
  BLUREmailCopy,
  ContentMetadata,
};
