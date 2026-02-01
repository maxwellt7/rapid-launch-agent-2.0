// Easy Yes Offer (EYO) System Types
// Specialized types for the EYO methodology

export interface EYOCriteria {
  clarityOfOutcome: number;      // 1-10: How clear is the outcome?
  gravityOfProblem: number;       // 1-10: How serious is the problem?
  beliefInDiagnosis: number;      // 1-10: Do they believe in your diagnosis?
  naturalFit: number;             // 1-10: Is this a natural fit?
  clearOffer: number;             // 1-10: Is the offer clear and simple?
}

export interface EYOScoreBreakdown {
  score: number;
  maxScore: number;
  percentage: number;
  rating: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface EYOImprovementPlan {
  currentScore: number;
  targetScore: number;
  gap: number;
  recommendations: EYOActionItem[];
  estimatedTimeToImplement: string;
  priorityOrder: number[];
}

export interface EYOActionItem {
  id: number;
  criterion: keyof EYOCriteria;
  action: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  expectedScoreIncrease: number;
}

// EYO Price Positioning
export interface EYOPricing {
  pricePoint: number;           // Recommended: $297-$497
  valueStack: ValueStackItem[];
  totalValue: number;
  valueMultiple: number;        // totalValue / pricePoint
  paymentOptions: PaymentOption[];
}

export interface ValueStackItem {
  item: string;
  normalPrice: number;
  description: string;
}

export interface PaymentOption {
  type: 'one-time' | 'installments';
  amount: number;
  installments?: number;
  intervalDays?: number;
}

// EYO Guarantee Framework
export interface EYOGuarantee {
  type: 'money-back' | 'results' | 'satisfaction' | 'hybrid';
  period: number;               // Days
  conditions: string[];
  refundProcess: string;
  riskReversal: string;
}

