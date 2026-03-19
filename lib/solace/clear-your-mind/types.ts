export type SolaceCategory =
  | "Money / Stability"
  | "Relationships / Home Dynamics"
  | "Health / Body / Self"
  | "Environment / External Noise"
  | "Work / Performance"
  | "Internal Mental Loops"
  | "Logistics / Immediate Problems"
  | "Unclear";

export type ClearYourMindBubbleInput = {
  id?: string;
  text: string;
};

export type ClearYourMindImportanceBreakdown = {
  emotionalWeight: number;
  practicalConsequence: number;
  repetition: number;
  urgency: number;
  total: number;
};

export type ClearYourMindThoughtResult = {
  id: string;
  text: string;
  mainCategory: SolaceCategory;
  secondaryCategory?: SolaceCategory;
  importance: ClearYourMindImportanceBreakdown;
  isGibberish: boolean;
};

export type ClearYourMindClusterResult = {
  category: SolaceCategory;
  averageImportance: number;
  thoughtIds: string[];
};

export type ClearYourMindRequest = {
  thoughts: Array<string | ClearYourMindBubbleInput>;
};

export type ClearYourMindSuccessResponse = {
  ok: true;
  text: string;
  isCrisisFallback: boolean;
  clarityFallback: boolean;
  thoughts: ClearYourMindThoughtResult[];
  clusters: ClearYourMindClusterResult[];
};

export type ClearYourMindErrorResponse = {
  ok: false;
  error: string;
};

export type ClearYourMindResponse =
  | ClearYourMindSuccessResponse
  | ClearYourMindErrorResponse;