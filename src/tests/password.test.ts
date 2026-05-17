import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../lib/password";

describe("Password Hashing (argon2 Wrapper)", () => {
  const plainPassword = "my-secure-password-123";

  it("should successfully hash a plain-text password", async () => {
    const hash = await hashPassword(plainPassword);
    expect(hash).toBeTypeOf("string");
    expect(hash.length).toBeGreaterThan(0);
    expect(hash).not.toBe(plainPassword);
  });

  it("should generate different hashes for the same password due to salting", async () => {
    const hash1 = await hashPassword(plainPassword);
    const hash2 = await hashPassword(plainPassword);
    expect(hash1).not.toBe(hash2);
  });

  it("should return true when verifying the correct password", async () => {
    const hash = await hashPassword(plainPassword);
    const isValid = await verifyPassword(hash, plainPassword);
    expect(isValid).toBe(true);
  });

  it("should return false when verifying an incorrect password", async () => {
    const hash = await hashPassword(plainPassword);
    const isValid = await verifyPassword(hash, "wrong-password");
    expect(isValid).toBe(false);
  });

  it("should handle error gracefully and return false when verifying with a malformed hash", async () => {
    const isValid = await verifyPassword("not-a-valid-argon2-hash", plainPassword);
    expect(isValid).toBe(false);
  });
});
