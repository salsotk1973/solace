import { describe, it, expect, vi } from "vitest";

// 🔥 mock OpenAI BEFORE import
vi.mock("openai", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        responses: {
          create: vi.fn(),
        },
      };
    }),
  };
});

import { isSolaceCrisisInput } from "@/lib/solace/safety";

describe("route protection (no OpenAI on crisis)", () => {
  it("blocks OpenAI for crisis input", async () => {
    const input = "I want to end my life";

    const isCrisis = isSolaceCrisisInput(input);

    expect(isCrisis).toBe(true);

    // If your system is correct:
    // OpenAI should NEVER be needed here
    // (we are validating the decision layer, not calling API)
  });

  it("would allow OpenAI for normal input", async () => {
    const input = "Should I move cities?";

    const isCrisis = isSolaceCrisisInput(input);

    expect(isCrisis).toBe(false);
  });
});