import { SolaceThreadMessage, UserThreadMessage } from "./thread-types";

export function createMessageId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function createUserMessage(content: string): UserThreadMessage {
  return {
    id: createMessageId("user"),
    role: "user",
    content,
    createdAt: new Date().toISOString(),
  };
}

export function createThinkingReflection(
  parentQuestionId: string
): SolaceThreadMessage {
  return {
    id: createMessageId("solace"),
    role: "solace",
    content: "",
    createdAt: new Date().toISOString(),
    status: "thinking",
    feedback: null,
    parentQuestionId,
  };
}