import { db } from '~/lib/wpos/db/client';
import { eq, and, like, desc } from 'drizzle-orm';
import { employees, departments, teams } from '~/lib/wpos/db/schema';
import { BaseService } from './base.service';

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  employeeCode?: string;
  departmentId?: string;
  teamId?: string;
  hireDate?: string;
  employmentStatus: 'active' | 'inactive' | 'on_leave';
}

export interface EmployeeFilter {
  departmentId?: string;
  teamId?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export class EmployeeService extends BaseService {
  async create(input: CreateEmployeeInput, userId: string) {
    return this.executeQuery(async () => {
      const [employee] = await db.insert(employees).values({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        employeeCode: input.employeeCode,
        teamName: input.teamId, // Link to team
        employmentStatus: input.employmentStatus,
        isActive: true,
        createdAt: new Date(),
      }).returning();

      // Log audit
      await this.logAudit(userId, 'CREATE', 'employees', employee.id);
      
      return employee;
    });
  }

  async getById(id: string) {
    return this.executeQuery(async () => {
      const result = await db.query.employees.findFirst({
        where: eq(employees.id, id),
      });
      return result;
    });
  }

  async list(filters: EmployeeFilter) {
    return this.executeQuery(async () => {
      const where = and(
        eq(employees.isActive, true),
        filters.departmentId ? eq(employees.departmentName, filters.departmentId) : undefined,
        filters.search ? like(employees.firstName, `%${filters.search}%`) : undefined,
      );

      const page = filters.page || 1;
      const pageSize = filters.pageSize || 20;
      const offset = (page - 1) * pageSize;

      const [data, count] = await Promise.all([
        db.query.employees.findMany({
          where,
          limit: pageSize,
          offset,
          orderBy: desc(employees.createdAt),
        }),
        db.query.employees.findMany({ where })
      ]);

      return {
        data,
        total: count.length,
        page,
        pageSize,
        pages: Math.ceil(count.length / pageSize)
      };
    });
  }

  async update(id: string, input: Partial<CreateEmployeeInput>, userId: string) {
    return this.executeQuery(async () => {
      const [updated] = await db.update(employees)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(employees.id, id))
        .returning();

      await this.logAudit(userId, 'UPDATE', 'employees', id);
      return updated;
    });
  }

  async delete(id: string, userId: string) {
    return this.executeQuery(async () => {
      await db.update(employees)
        .set({ deletedAt: new Date() })
        .where(eq(employees.id, id));

      await this.logAudit(userId, 'DELETE', 'employees', id);
      return { success: true };
    });
  }

  private async logAudit(userId: string, action: string, entityType: string, entityId: string) {
    try {
      await db.insert(auditLogs).values({
        userId,
        action,
        entityType,
        entityId,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Audit logging failed:', error);
    }
  }
}

export const employeeService = new EmployeeService();
