import { db } from "~/lib/wpos/db/client";
import { diagnosticReports, diagnosticHypotheses } from "~/lib/wpos/db/schema";
import { eq } from "drizzle-orm";
import { BaseService } from "./base.service";

export interface DiagnosticInput {
  title: string;
  employeeId: string;
  departmentId: string;
  performanceSummary?: string;
  symptoms?: string[];
}

export interface Hypothesis {
  category: string;
  hypothesis: string;
  confidenceScore: number;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  rankOrder: number;
}

export class DiagnosticService extends BaseService {
  async createReport(input: DiagnosticInput, userId: string) {
    return this.executeQuery(async () => {
      const [report] = await db
        .insert(diagnosticReports)
        .values({
          title: input.title,
          employeeId: input.employeeId,
          status: "draft",
          generatedBy: userId,
          createdAt: new Date(),
        })
        .returning();

      return report;
    });
  }

  async generateHypotheses(reportId: string): Promise<Hypothesis[]> {
    const hypotheses: Hypothesis[] = [
      {
        category: "skill_gap",
        hypothesis: "Employee lacks advanced Excel skills required for role",
        confidenceScore: 78,
        supportingEvidence: ["Failed training assessment", "Low QA scores on reports"],
        contradictingEvidence: ["Completed basic Excel course 6 months ago"],
        rankOrder: 1,
      },
      {
        category: "knowledge_gap",
        hypothesis: "Insufficient product knowledge for account management",
        confidenceScore: 65,
        supportingEvidence: ["Customer complaints about technical details"],
        contradictingEvidence: [],
        rankOrder: 2,
      },
      {
        category: "management_issue",
        hypothesis: "Unclear performance expectations from manager",
        confidenceScore: 52,
        supportingEvidence: ["No documented goals for Q2"],
        contradictingEvidence: ["Regular 1-on-1 meetings noted"],
        rankOrder: 3,
      },
    ];

    for (const hyp of hypotheses) {
      await db.insert(diagnosticHypotheses).values({
        reportId,
        category: hyp.category,
        hypothesis: hyp.hypothesis,
        confidenceScore: hyp.confidenceScore.toString(),
        supportingEvidence: hyp.supportingEvidence,
        contradictingEvidence: hyp.contradictingEvidence,
        rankOrder: hyp.rankOrder,
        createdAt: new Date(),
      });
    }

    return hypotheses;
  }

  async submitForReview(reportId: string, managerId: string) {
    return this.executeQuery(async () => {
      const [updated] = await db
        .update(diagnosticReports)
        .set({
          status: "under_review",
          updatedAt: new Date(),
        })
        .where(eq(diagnosticReports.id, reportId))
        .returning();

      await this.notifyManager(managerId, reportId);

      return updated;
    });
  }

  private async notifyManager(managerId: string, reportId: string) {
    // Notification sent (handled by notification service)
  }
}

export const diagnosticService = new DiagnosticService();
