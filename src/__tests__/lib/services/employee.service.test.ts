import { describe, it, expect } from "vitest";
import { employeeService } from "~/lib/services/employee.service";

describe("employeeService", () => {
  describe("create", () => {
    it("should create a new employee and return an id", async () => {
      const input = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };

      const result = await employeeService.create(input, "user-123");

      expect(result).toHaveProperty("id");
      expect(result.firstName).toBe("John");
      expect(result.lastName).toBe("Doe");
    });
  });

  describe("list", () => {
    it("should list employees with pagination defaults", async () => {
      const result = await employeeService.list({ page: 1, pageSize: 20 });

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe("get", () => {
    it("should return null for non-existent employee", async () => {
      const result = await employeeService.get("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update and return modified employee", async () => {
      const result = await employeeService.update("test-id", { firstName: "Updated" }, "system");

      expect(result.id).toBe("test-id");
      expect(result.firstName).toBe("Updated");
    });
  });
});
