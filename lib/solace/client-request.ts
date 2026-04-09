import {
  SolaceClientTimeoutError,
  SOLACE_CLIENT_REQUEST_TIMEOUT_MS,
  isAbortError,
} from "@/lib/solace/runtime";

type JsonRequestOptions = {
  headers?: HeadersInit;
  timeoutMs?: number;
};

export async function postJsonWithTimeout<T>(
  url: string,
  body: unknown,
  options: JsonRequestOptions = {},
): Promise<{ response: Response; data: T | null }> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, options.timeoutMs ?? SOLACE_CLIENT_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => null)) as T | null;

    return { response, data };
  } catch (error) {
    if (isAbortError(error)) {
      throw new SolaceClientTimeoutError();
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
