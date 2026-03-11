export type ToolSlug =
  | "clarity"
  | "overthinking-reset"
  | "decision-filter";

export type ThreadFeedback = "helpful" | "not_quite" | null;

export type UserThreadMessage = {
  id: string;
  role: "user";
  content: string;
  createdAt: string;
};

export type SolaceThreadMessage = {
  id: string;
  role: "solace";
  content: string;
  createdAt: string;
  status: "thinking" | "done" | "recovery";
  feedback: ThreadFeedback;
  parentQuestionId: string;
};

export type ThreadMessage = UserThreadMessage | SolaceThreadMessage;

export type ThreadState = {
  toolSlug: ToolSlug;
  messages: ThreadMessage[];
  isSubmitting: boolean;
  activeQuestionId: string | null;
};

export type ReflectionResponse = {
  reflection: string;
  relatedToolSuggestion?: ToolSlug | null;
  recoveryOptions?: string[];
};