"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Circle,
  FileText,
  Plus,
  ExternalLink,
  Trash2,
  Pencil,
  X,
  Save,
  GripVertical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

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
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", sampleUrl: "", sampleLabel: "" });
  const [addingToPhase, setAddingToPhase] = useState<string | null>(null);
  const [newStep, setNewStep] = useState({ title: "", description: "", sampleUrl: "", sampleLabel: "" });
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(project.phases.map((p) => p.id)));

  function togglePhaseExpand(phaseId: string) {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  }

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

  function startEditStep(step: Step) {
    setEditingStep(step.id);
    setEditForm({
      title: step.title,
      description: step.description || "",
      sampleUrl: step.sampleUrl || "",
      sampleLabel: step.sampleLabel || "",
    });
  }

  async function saveEditStep(stepId: string) {
    setLoading(stepId);
    await fetch("/api/projects/steps", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stepId,
        title: editForm.title,
        description: editForm.description || null,
        sampleUrl: editForm.sampleUrl || null,
        sampleLabel: editForm.sampleLabel || null,
      }),
    });
    setEditingStep(null);
    setLoading(null);
    router.refresh();
  }

  async function deleteStep(stepId: string) {
    if (!confirm("Delete this step? This cannot be undone.")) return;
    setLoading(stepId);
    await fetch("/api/projects/steps", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId }),
    });
    setLoading(null);
    router.refresh();
  }

  async function addStep(phaseId: string) {
    if (!newStep.title.trim()) return;
    setLoading("new-step");
    await fetch("/api/projects/steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phaseId,
        title: newStep.title,
        description: newStep.description || null,
        sampleUrl: newStep.sampleUrl || null,
        sampleLabel: newStep.sampleLabel || null,
      }),
    });
    setNewStep({ title: "", description: "", sampleUrl: "", sampleLabel: "" });
    setAddingToPhase(null);
    setLoading(null);
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
        <div className="space-y-4">
          {project.phases.map((phase) => {
            const isExpanded = expandedPhases.has(phase.id);
            const completedCount = phase.steps.filter((s) => s.isCompleted).length;

            return (
              <div key={phase.id} className="bg-white border border-[#C8BFB2]/30 overflow-hidden">
                {/* Phase Header */}
                <div className="p-4 flex items-center gap-3">
                  <button
                    onClick={() => togglePhaseExpand(phase.id)}
                    className="flex-shrink-0 text-[#8A8279] hover:text-[#1A1A1A]"
                    aria-label={isExpanded ? "Collapse phase" : "Expand phase"}
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs tracking-widest uppercase text-[#C5A258] font-bold">
                        Phase {String(phase.number).padStart(2, "0")}
                      </span>
                      <span className="text-xs text-[#8A8279]">
                        {completedCount}/{phase.steps.length} steps
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-base text-[#1A1A1A]">
                      {phase.name}
                    </h3>
                  </div>

                  <select
                    value={phase.status}
                    onChange={(e) => updatePhaseStatus(phase.id, e.target.value)}
                    className="text-xs border border-[#C8BFB2]/40 px-2 py-1.5 focus:outline-none focus:border-[#C5A258] flex-shrink-0"
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                {/* Steps (Collapsible) */}
                {isExpanded && (
                  <div className="border-t border-[#C8BFB2]/20 p-4 pt-3 space-y-2">
                    {phase.steps.map((step) => (
                      <div key={step.id}>
                        {editingStep === step.id ? (
                          /* Edit Mode */
                          <div className="border border-[#C5A258]/30 bg-[#C5A258]/[0.02] p-3 space-y-2">
                            <input
                              value={editForm.title}
                              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                              className="w-full px-3 py-1.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
                              placeholder="Step title"
                            />
                            <input
                              value={editForm.description}
                              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                              className="w-full px-3 py-1.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
                              placeholder="Description (optional)"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                value={editForm.sampleUrl}
                                onChange={(e) => setEditForm((f) => ({ ...f, sampleUrl: e.target.value }))}
                                className="px-3 py-1.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
                                placeholder="Sample URL"
                              />
                              <input
                                value={editForm.sampleLabel}
                                onChange={(e) => setEditForm((f) => ({ ...f, sampleLabel: e.target.value }))}
                                className="px-3 py-1.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
                                placeholder="Sample label"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setEditingStep(null)}
                                className="text-xs px-3 py-1.5 text-[#8A8279] hover:text-[#1A1A1A] border border-[#C8BFB2]/30"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveEditStep(step.id)}
                                disabled={loading === step.id}
                                className="text-xs px-3 py-1.5 bg-[#C5A258] text-white hover:bg-[#A68A3E] flex items-center gap-1"
                              >
                                <Save size={10} /> Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* View Mode */
                          <div
                            className={`flex items-center gap-2 p-2.5 border transition-all group ${
                              step.isCompleted ? "border-[#4A7B5E]/20 bg-[#4A7B5E]/[0.02]" : "border-[#C8BFB2]/20"
                            }`}
                          >
                            <button
                              onClick={() => toggleStep(step.id, !step.isCompleted)}
                              disabled={loading === step.id}
                              className="flex-shrink-0"
                              aria-label={step.isCompleted ? "Mark incomplete" : "Mark complete"}
                            >
                              {step.isCompleted ? (
                                <CheckCircle size={16} className="text-[#4A7B5E]" />
                              ) : (
                                <Circle size={16} className="text-[#C8BFB2] hover:text-[#C5A258]" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <span className={`text-sm ${step.isCompleted ? "text-[#4A7B5E] line-through" : "text-[#1A1A1A]"}`}>
                                {step.title}
                              </span>
                              {step.description && (
                                <p className="text-xs text-[#8A8279] mt-0.5">{step.description}</p>
                              )}
                            </div>

                            {step.sampleUrl && (
                              <a href={step.sampleUrl} target="_blank" rel="noopener noreferrer" className="text-[#C5A258] flex-shrink-0">
                                <ExternalLink size={12} />
                              </a>
                            )}

                            {/* Edit/Delete buttons */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={() => startEditStep(step)}
                                className="p-1 text-[#8A8279] hover:text-[#C5A258]"
                                aria-label="Edit step"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => deleteStep(step.id)}
                                className="p-1 text-[#8A8279] hover:text-[#A65B4A]"
                                aria-label="Delete step"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add Step */}
                    {addingToPhase === phase.id ? (
                      <div className="border border-dashed border-[#C5A258]/40 bg-[#C5A258]/[0.02] p-3 space-y-2">
                        <input
                          value={newStep.title}
                          onChange={(e) => setNewStep((s) => ({ ...s, title: e.target.value }))}
                          className="w-full px-3 py-1.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
                          placeholder="New step title *"
                          autoFocus
                        />
                        <input
                          value={newStep.description}
                          onChange={(e) => setNewStep((s) => ({ ...s, description: e.target.value }))}
                          className="w-full px-3 py-1.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
                          placeholder="Description (optional)"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={newStep.sampleUrl}
                            onChange={(e) => setNewStep((s) => ({ ...s, sampleUrl: e.target.value }))}
                            className="px-3 py-1.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
                            placeholder="Sample URL (optional)"
                          />
                          <input
                            value={newStep.sampleLabel}
                            onChange={(e) => setNewStep((s) => ({ ...s, sampleLabel: e.target.value }))}
                            className="px-3 py-1.5 border border-[#C8BFB2]/40 text-sm focus:outline-none focus:border-[#C5A258]"
                            placeholder="Sample label"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => { setAddingToPhase(null); setNewStep({ title: "", description: "", sampleUrl: "", sampleLabel: "" }); }}
                            className="text-xs px-3 py-1.5 text-[#8A8279] hover:text-[#1A1A1A] border border-[#C8BFB2]/30"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => addStep(phase.id)}
                            disabled={loading === "new-step" || !newStep.title.trim()}
                            className="text-xs px-3 py-1.5 bg-[#C5A258] text-white hover:bg-[#A68A3E] disabled:opacity-50 flex items-center gap-1"
                          >
                            <Plus size={10} /> Add Step
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingToPhase(phase.id)}
                        className="w-full border border-dashed border-[#C8BFB2]/40 hover:border-[#C5A258]/50 text-[#8A8279] hover:text-[#C5A258] text-xs py-2 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus size={12} /> Add Step
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
                <option value="REVISE_RESUBMIT">Revise &amp; Resubmit</option>
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
