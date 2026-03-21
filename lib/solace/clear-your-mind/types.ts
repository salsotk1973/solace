export type ClearYourMindThought = {
  text: string;
};

export type ClearYourMindInput = {
  thoughts: ClearYourMindThought[];
};

export type SafetySignals = {
  directIntent: boolean;
  indirectIntent: boolean;
  existentialLanguage: boolean;
  burdenLanguage: boolean;
  selfWorthCollapse: boolean;
  gibberish: boolean;
};

export type SafetyAssessment = {
  riskScore: number;
  isCrisis: boolean;
  clarityFallback: boolean;
  signals: SafetySignals;
  matchedRules: string[];
};

export type ClearYourMindResponse =
  | {
      ok: true;
      isCrisisFallback: true;
      clarityFallback: false;
      title: string;
      message: string;
      safetyAssessment: SafetyAssessment;
    }
  | {
      ok: true;
      isCrisisFallback: false;
      clarityFallback: true;
      title: string;
      message: string;
      safetyAssessment: SafetyAssessment;
    }
  | {
      ok: true;
      isCrisisFallback: false;
      clarityFallback: false;
      reflection: {
        title: string;
        summary: string;
        structure: {
          recognition: string;
          untangling: string;
          gentleFrame: string;
        };
      };
      safetyAssessment: SafetyAssessment;
    };

export const CRISIS_TRIGGER_SCORE = 3;