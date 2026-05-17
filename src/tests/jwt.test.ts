import { describe, it, expect } from "vitest";
import jsonwebtoken from "jsonwebtoken";
import { signToken, verifyToken } from "../lib/jwt";

describe("JWT Utilities", () => {
  const mockPayload = { userId: "test-user-id-123" };

  it("should successfully sign a token and return a string", () => {
    const token = signToken(mockPayload);
    expect(token).toBeTypeOf("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should successfully verify a signed token and decode the exact payload", () => {
    const token = signToken(mockPayload);
    const decoded = verifyToken(token) as {
      userId: string;
      iat: number;
      exp: number;
    };

    expect(decoded).toBeTypeOf("object");
    expect(decoded.userId).toBe(mockPayload.userId);
    expect(decoded.iat).toBeTypeOf("number");
    expect(decoded.exp).toBeTypeOf("number");
  });

  it("should throw an error when verifying an invalid or malformed token", () => {
    const malformedToken = "invalid.token.payload";
    expect(() => verifyToken(malformedToken)).toThrow();
  });

  it("should throw an error when verifying an expired token or a signature signed with a different key", () => {
    const foreignToken = jsonwebtoken.sign(mockPayload, "different-secret-key");
    expect(() => verifyToken(foreignToken)).toThrow();
  });
});
