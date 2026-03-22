import { describe, it, expect } from "vitest";
import { isSolaceCrisisInput } from "@/lib/solace/safety";

describe("crisis detection", () => {
  it("detects direct suicidal language", () => {
    const result = isSolaceCrisisInput("I want to end my life");

    expect(result).toBe(true);
  });

  it("detects indirect distress language", () => {
    const result = isSolaceCrisisInput("I don't see the point anymore");

    expect(result).toBe(true);
  });

  it("detects emotional breakdown signals", () => {
    const result = isSolaceCrisisInput("Everything feels too much and I can't handle it");

    expect(result).toBe(true);
  });

  it("does NOT trigger on normal decision questions", () => {
    const result = isSolaceCrisisInput("Should I quit my job?");

    expect(result).toBe(false);
  });

  it("does NOT trigger on mild stress", () => {
    const result = isSolaceCrisisInput("I'm a bit stressed about work");

    expect(result).toBe(false);
  });
});