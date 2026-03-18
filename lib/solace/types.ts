export type SolaceToolName = "choose" | "clear-your-mind" | "signal-vs-noise";

export type SolaceApiSuccess = {
  ok: true;
  message: string;
  nextTool?: SolaceToolName;
  isCrisisFallback?: boolean;
};

export type SolaceApiError = {
  ok: false;
  message: string;
};

export type SolaceApiResponse = SolaceApiSuccess | SolaceApiError;

export type ClearYourMindRequest = {
  input: string;
};

export type ChooseRequest = {
  decision: string;
};

export type SignalVsNoiseRequest = {
  items: string[];
};

export type OpenAIResponsesTextOutput = {
  type?: string;
  text?: string;
};

export type OpenAIResponsesOutputItem = {
  type?: string;
  content?: OpenAIResponsesTextOutput[];
};

export type OpenAIResponsesApiResult = {
  output?: OpenAIResponsesOutputItem[];
  output_text?: string;
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
};