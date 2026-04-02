import { ThreadMessage, ThreadState, ToolSlug } from "./thread-types";

export type ThreadAction =
  | {
      type: "INITIALIZE_THREAD";
      payload: {
        toolSlug: ToolSlug;
      };
    }
  | {
      type: "ADD_USER_MESSAGE";
      payload: {
        message: ThreadMessage;
      };
    }
  | {
      type: "START_THINKING";
      payload: {
        message: ThreadMessage;
        activeQuestionId: string;
      };
    }
  | {
      type: "COMPLETE_REFLECTION";
      payload: {
        reflectionId: string;
        content: string;
      };
    }
  | {
      type: "SET_FEEDBACK";
      payload: {
        reflectionId: string;
        feedback: "helpful" | "not_quite";
      };
    }
  | {
      type: "RESET_THREAD";
    };

export function createInitialThreadState(toolSlug: ToolSlug): ThreadState {
  return {
    toolSlug,
    messages: [],
    isSubmitting: false,
    activeQuestionId: null,
  };
}

export function threadReducer(
  state: ThreadState,
  action: ThreadAction
): ThreadState {
  switch (action.type) {
    case "INITIALIZE_THREAD":
      return createInitialThreadState(action.payload.toolSlug);

    case "ADD_USER_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };

    case "START_THINKING":
      return {
        ...state,
        isSubmitting: true,
        activeQuestionId: action.payload.activeQuestionId,
        messages: [...state.messages, action.payload.message],
      };

    case "COMPLETE_REFLECTION":
      return {
        ...state,
        isSubmitting: false,
        activeQuestionId: null,
        messages: state.messages.map((message) => {
          if (
            message.role === "solace" &&
            message.id === action.payload.reflectionId
          ) {
            return {
              ...message,
              status: "done" as const,
              content: action.payload.content,
            };
          }

          return message;
        }),
      };

    case "SET_FEEDBACK":
      return {
        ...state,
        messages: state.messages.map((message) => {
          if (
            message.role === "solace" &&
            message.id === action.payload.reflectionId
          ) {
            return {
              ...message,
              feedback: action.payload.feedback,
            };
          }

          return message;
        }),
      };

    case "RESET_THREAD":
      return createInitialThreadState(state.toolSlug);

    default:
      return state;
  }
}