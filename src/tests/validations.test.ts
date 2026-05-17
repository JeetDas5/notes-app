import { describe, it, expect } from "vitest";
import { signupSchema, loginSchema, createNoteSchema, updateNoteSchema } from "../validations";

describe("Validation Schemas", () => {
  describe("signupSchema", () => {
    it("should validate a valid signup payload successfully", () => {
      const payload = {
        name: "John Doe",
        email: "john@example.com",
        password: "securepassword",
      };
      const result = signupSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    it("should fail validation if name is too short", () => {
      const payload = {
        name: "J",
        email: "john@example.com",
        password: "securepassword",
      };
      const result = signupSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues[0].message).toBe("Name must be at least 2 characters long");
      }
    });

    it("should fail validation if email is invalid", () => {
      const payload = {
        name: "John Doe",
        email: "not-an-email",
        password: "securepassword",
      };
      const result = signupSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues[0].message).toBe("Please provide a valid email address");
      }
    });

    it("should fail validation if password is too short", () => {
      const payload = {
        name: "John Doe",
        email: "john@example.com",
        password: "12345",
      };
      const result = signupSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues[0].message).toBe("Password must be at least 6 characters long");
      }
    });
  });

  describe("loginSchema", () => {
    it("should validate a valid login payload successfully", () => {
      const payload = {
        email: "john@example.com",
        password: "securepassword",
      };
      const result = loginSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    it("should fail validation if email is invalid", () => {
      const payload = {
        email: "not-an-email",
        password: "securepassword",
      };
      const result = loginSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Please provide a valid email address");
      }
    });

    it("should fail validation if password is too short", () => {
      const payload = {
        email: "john@example.com",
        password: "12345",
      };
      const result = loginSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password must be at least 6 characters long");
      }
    });
  });

  describe("createNoteSchema", () => {
    it("should validate empty/optional fields successfully", () => {
      const payload = {};
      const result = createNoteSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should validate a completely filled note correctly", () => {
      const payload = {
        title: "My Awesome Note",
        content: "This is some note content.",
        tags: ["personal", "work"],
      };
      const result = createNoteSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    it("should fail if tags is not an array of strings", () => {
      const payload = {
        tags: "not-an-array",
      };
      const result = createNoteSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("updateNoteSchema", () => {
    it("should validate partial updates successfully", () => {
      const payload = {
        isArchived: true,
        tags: ["archived-tag"],
      };
      const result = updateNoteSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isArchived).toBe(true);
        expect(result.data.tags).toEqual(["archived-tag"]);
      }
    });

    it("should fail if boolean fields are not boolean", () => {
      const payload = {
        isPublic: "yes",
      };
      const result = updateNoteSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
