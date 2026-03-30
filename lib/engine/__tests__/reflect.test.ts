import { describe, it, expect } from "vitest";
import { reflect } from "@/lib/engine/reflect";

describe("reflect engine", () => {
  it("returns a structured reflection", async () => {
    const result = await reflect({
      toolSlug: "clarity",
      question: "I feel stuck between staying in my job or leaving",
    });

    expect(result.reflection).toBeTruthy();
    expect(typeof result.reflection).toBe("string");
    expect(result.reflection.length).toBeGreaterThan(20);
  });

  it("handles simple decision clearly", async () => {
    const result = await reflect({
      toolSlug: "clarity",
      question: "Should I move cities?",
    });

    expect(result.reflection.length).toBeGreaterThan(10);
  });

  // 🔥 REAL VALUE STARTS HERE

  it("does not break on very short input", async () => {
    const result = await reflect({
      toolSlug: "clarity",
      question: "Help",
    });

    expect(result.reflection).toBeTruthy();
  });

  it("handles emotional input without crashing", async () => {
    const result = await reflect({
      toolSlug: "clarity",
      question: "I feel overwhelmed and lost in life",
    });

    expect(result.reflection).toBeTruthy();
    expect(result.reflection.length).toBeGreaterThan(10);
  });

  it("handles messy / unclear input", async () => {
    const result = await reflect({
      toolSlug: "clarity",
      question: "I don't know what I'm doing anymore everything feels wrong",
    });

    expect(result.reflection).toBeTruthy();
  });

  it("always returns recovery options", async () => {
    const result = await reflect({
      toolSlug: "clarity",
      question: "Should I quit my job?",
    });

    expect(Array.isArray(result.recoveryOptions)).toBe(true);
    expect(result.recoveryOptions!.length).toBeGreaterThan(0);
  });
});