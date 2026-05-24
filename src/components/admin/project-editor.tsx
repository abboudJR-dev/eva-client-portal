"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Circle, FileText, Plus, ExternalLink, Trash2 } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  sampleUrl: string | null;
  sampleLabel: string | null;
}

interface Phase {
  id: string;
  number: number;
  name: string;
  status: string;
  steps: Step[];
}

interface Approval {
  id: string;
  phase: string;
  title: string;
  status: string;
  priority: string;
  comments: string | null;
}

interface Document {
  id: string;
  name: string;
  url: string | null;
  phase: string | null;
  description: string | null;
}

interface Project {
  id: string;
  name: string;
  phases: Phase[];
  approvals: Approval[];
  documents: Document[];
}

export default function ProjectEditor({ project }: { project: Project }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"phases" | "approvals" | "documents">("phases");
  const [loading, setLoading] = useState<string | null>(null);

  async function toggleStep(stepId: string, completed: boolean) {
    setLoading(stepId);
    await fetch("/api/projects/steps", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId, isCompleted: completed }),
    });
    setLoading(null);
    router.refresh();
  }

  async function updatePhaseStatus(phaseId: string, status: string) {
    await fetch("/api/projects/phases", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phaseId, status }),
    });
    router.refresh();
  }

  async function updateApproval(approvalId: string, status: string) {
    await fetch("/api/approvals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalId, status, projectId: project.id }),
    });
    router.refresh();
  }

  async function addDocument(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch("/api/projects/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        name: formData.get("name"),
        url: formData.get("url"),
        phase: formData.get("phase"),
        description: formData.get("description"),
      }),
    });
    e.currentTarget.reset();
    router.refresh();
  }

  async function deleteDocument(docId: string) {
    await fetch("/api/projects/documents", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: docId }),
    });
    router.refresh();
  }

  const tabs = [
    { key: "phases", label: "Phases & Steps" },
    { key: "approvals", label: "Approvals" },
    { key: "documents", label: "Documents" },
  ] as const;

  return (
    <div>
      <div className="flex gap-1 border-b border-[#C8BFB2]/30 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-xs tracking-wider uppercase font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "text-[#C5A258] border-[#C5A258]"
                : "text-[#8A8279] border-transparent hover:text-[#1A1A1A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "phases" && (
        <div className="space-y-6">
          {project.phases.map((phase) => (
            <div key={phase.id} className="bg-white border border-[#C8BFB2]/30 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs tracking-widest uppercase text-[#C5A258] font-bold">
                    Phase {String(phase.number).padStart(2, "0")}
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-[#1A1A1A]">
                    {phase.name}
                  </h3>
                </div>
                <select
                  value={phase.status}
                  onChange={(e) => updatePhaseStatus(phase.id, e.target.value)}
                  className="text-xs border border-[#C8BFB2]/40 px-2 py-1.5 focus:outline-none focus:border-[#C5A258]"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="space-y-2">
                {phase.steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 border transition-all ${
                      step.isCompleted ? "border-[#4A7B5E]/20 bg-[#4A7B5E]/[0.02]" : "border-[#C8BFB2]/20"
                    }`}
                  >
                    <button
                      onClick={() => toggleStep(step.id, !step.isCompleted)}
                      disabled={loading === step.id}
                      className="flex-shrink-0"
                    >
                      {step.isCompleted ? (
                        <CheckCircle size={18} className="text-[#4A7B5E]" />
                      ) : (
                        <Circle size={18} className="text-[#C8BFB2] hover:text-[#C5A258]" />
                      )}
                    </button>
                    <span className={`text-sm ${step.isCompleted ? "text-[#4A7B5E] line-through" : "text-[#1A1A1A]"}`}>
                      {step.title}
                    </span>
                    {step.sampleUrl && (
                      <a href={step.sampleUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-[#C5A258]">
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "approvals" && (
        <div className="space-y-3">
          {project.approvals.map((approval) => (
            <div key={approval.id} className="bg-white border border-[#C8BFB2]/30 p-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[0.6rem] tracking-widest uppercase font-bold text-[#C5A258]">{approval.phase}</span>
                  <span className={`text-[0.6rem] tracking-wider uppercase font-bold ${
                    approval.priority === "critical" ? "text-[#A65B4A]" : "text-[#8A8279]"
                  }`}>
                    {approval.priority}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#1A1A1A]">{approval.title}</p>
                {approval.comments && <p className="text-xs text-[#8A8279] italic mt-1">{approval.comments}</p>}
              </div>
              <select
                value={approval.status}
                onChange={(e) => updateApproval(approval.id, e.target.value)}
                className="text-xs border border-[#C8BFB2]/40 px-2 py-1.5 focus:outline-none focus:border-[#C5A258] flex-shrink-0"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="APPROVED_WITH_COMMENTS">Approved w/ Comments</option>
                <option value="REVISE_RESUBMIT">Revise & Resubmit</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {activeTab === "documents" && (
        <div>
          <form onSubmit={addDocument} className="bg-[#F0EBE3] p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input name="name" required placeholder="Document name" className="px-3 py-2 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]" />
            <input name="url" placeholder="URL / link" className="px-3 py-2 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]" />
            <input name="phase" placeholder="Phase (e.g. Moodboard)" className="px-3 py-2 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]" />
            <button type="submit" className="flex items-center justify-center gap-1 bg-[#C5A258] text-white text-xs tracking-wider uppercase font-semibold hover:bg-[#A68A3E] transition-colors px-3 py-2">
              <Plus size={12} /> Add
            </button>
            <input name="description" placeholder="Description (optional)" className="sm:col-span-2 lg:col-span-4 px-3 py-2 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]" />
          </form>

          <div className="space-y-2">
            {project.documents.map((doc) => (
              <div key={doc.id} className="bg-white border border-[#C8BFB2]/30 p-3 flex items-center gap-3">
                <FileText size={16} className="text-[#C5A258] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">{doc.name}</p>
                  {doc.phase && <span className="text-[0.6rem] text-[#C5A258] uppercase tracking-wider">{doc.phase}</span>}
                </div>
                {doc.url && (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[#C5A258] hover:text-[#A68A3E]">
                    <ExternalLink size={14} />
                  </a>
                )}
                <button onClick={() => deleteDocument(doc.id)} className="text-[#A65B4A] hover:text-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {project.documents.length === 0 && (
              <p className="text-center text-sm text-[#8A8279] py-8">No documents yet. Add one above.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
