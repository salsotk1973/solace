export const SOLACE_SERVER_AI_TIMEOUT_MS = 8_000;
export const SOLACE_CLIENT_REQUEST_TIMEOUT_MS = 12_000;
export const SOLACE_MIN_PENDING_MS = 400;
export const SOLACE_AI_UNAVAILABLE_ERROR = "AI_UNAVAILABLE";
export const SOLACE_UNAVAILABLE_ERROR = "unavailable";
export const SOLACE_UNAVAILABLE_MESSAGE = "This tool is temporarily resting.";

export class SolaceClientTimeoutError extends Error {
  constructor(message = SOLACE_UNAVAILABLE_MESSAGE) {
    super(message);
    this.name = "SolaceClientTimeoutError";
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export function isSolaceClientTimeoutError(error: unknown): error is SolaceClientTimeoutError {
  return error instanceof SolaceClientTimeoutError;
}

export function isAiUnavailableError(error: unknown): boolean {
  return error instanceof Error && error.message === SOLACE_AI_UNAVAILABLE_ERROR;
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = SOLACE_AI_UNAVAILABLE_ERROR,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

export async function waitForMinimumPending(
  startedAt: number,
  minimumMs = SOLACE_MIN_PENDING_MS,
): Promise<void> {
  const elapsed = Date.now() - startedAt;
  const remaining = Math.max(0, minimumMs - elapsed);

  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
}
