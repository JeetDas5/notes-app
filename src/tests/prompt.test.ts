import { describe, it, expect } from "vitest";
import { buildPrompt } from "../lib/prompt";

describe("AI Prompt Generation", () => {
  it("should return a string containing the exact note content", () => {
    const testContent = "This is a note about a software engineering meeting on Sunday.";
    const prompt = buildPrompt(testContent);

    expect(prompt).toBeTypeOf("string");
    expect(prompt).toContain(testContent);
  });

  it("should contain the required JSON structure instructions", () => {
    const prompt = buildPrompt("Some content");

    expect(prompt).toContain('"summary":');
    expect(prompt).toContain('"action_items":');
    expect(prompt).toContain('"suggested_title":');
  });

  it("should contain the structural prompt rules and instructions", () => {
    const prompt = buildPrompt("Some content");

    expect(prompt).toContain("You are an AI assistant helping summarize notes.");
    expect(prompt).toContain("Return valid JSON only");
    expect(prompt).toContain("No explanation text");
  });

  it("should handle empty note content correctly", () => {
    const prompt = buildPrompt("");

    expect(prompt).toBeTypeOf("string");
    expect(prompt).toContain("NOTE CONTENT:\n\n");
  });
});
