import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

export interface PhaseData {
  id: string;
  number: number;
  name: string;
  description: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  startDate: string | null;
  endDate: string | null;
  steps: StepData[];
}

export interface StepData {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  sampleUrl: string | null;
  sampleLabel: string | null;
}

export interface ApprovalData {
  id: string;
  phase: string;
  title: string;
  description: string | null;
  status: "PENDING" | "APPROVED" | "APPROVED_WITH_COMMENTS" | "REVISE_RESUBMIT";
  priority: string;
  approvedAt: string | null;
  comments: string | null;
}

export interface DocumentData {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  phase: string | null;
  category: string | null;
  uploadedAt: string;
}

export interface ScheduleItemData {
  id: string;
  phase: string;
  title: string;
  duration: string | null;
  startDate: string | null;
  endDate: string | null;
  milestones: string | null;
}
