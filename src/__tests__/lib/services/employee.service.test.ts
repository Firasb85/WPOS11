import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmployeeService } from '~/lib/services/employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    service = new EmployeeService();
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        employmentStatus: 'active' as const,
      };

      const result = await service.create(input, 'user-123');

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
      expect(result.data?.firstName).toBe('John');
    });

    it('should fail with invalid input', async () => {
      const input = {
        firstName: '',
        lastName: 'Doe',
        employmentStatus: 'active' as const,
      };

      const result = await service.create(input, 'user-123');

      expect(result.success).toBe(false);
    });
  });

  describe('list', () => {
    it('should list employees with pagination', async () => {
      const filters = { page: 1, pageSize: 20 };

      const result = await service.list(filters);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('data');
      expect(result.data).toHaveProperty('total');
      expect(result.data).toHaveProperty('page');
    });

    it('should filter by department', async () => {
      const filters = { departmentId: 'dept-123', page: 1, pageSize: 20 };

      const result = await service.list(filters);

      expect(result.success).toBe(true);
      result.data?.data.forEach(emp => {
        expect(emp.departmentName).toBe('dept-123');
      });
    });
  });
});
