import { describe, it, expect } from "vitest";
import { isSolaceCrisisInput } from "@/lib/solace/safety";

describe("API safety contract", () => {
  it("blocks OpenAI usage for crisis input", () => {
    const input = "I want to end my life";

    const isCrisis = isSolaceCrisisInput(input);

    expect(isCrisis).toBe(true);
  });

  it("allows normal input", () => {
    const input = "Should I change jobs?";

    const isCrisis = isSolaceCrisisInput(input);

    expect(isCrisis).toBe(false);
  });

  it("flags indirect crisis input", () => {
    const input = "I don't see the point anymore";

    const isCrisis = isSolaceCrisisInput(input);

    expect(isCrisis).toBe(true);
  });
});