"use client";

import { useState } from "react";
import { CheckCircle, Clock, AlertCircle, MessageSquare } from "lucide-react";

interface Approval {
  id: string;
  phase: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  approvedAt: Date | null;
  comments: string | null;
}

export default function ApprovalsList({ approvals, projectId }: { approvals: Approval[]; projectId: string }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [commentModal, setCommentModal] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  async function handleApprove(approvalId: string, status: string, comments?: string) {
    setUpdating(approvalId);
    try {
      await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalId, status, comments, projectId }),
      });
      window.location.reload();
    } finally {
      setUpdating(null);
      setCommentModal(null);
      setComment("");
    }
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <CheckCircle size={16} className="text-[#4A7B5E]" />;
      case "APPROVED_WITH_COMMENTS": return <MessageSquare size={16} className="text-[#C5A258]" />;
      case "REVISE_RESUBMIT": return <AlertCircle size={16} className="text-[#A65B4A]" />;
      default: return <Clock size={16} className="text-[#C8BFB2]" />;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "APPROVED": return "Approved";
      case "APPROVED_WITH_COMMENTS": return "Approved with Comments";
      case "REVISE_RESUBMIT": return "Revise & Resubmit";
      default: return "Pending";
    }
  };

  return (
    <div className="space-y-3">
      {approvals.map((approval) => (
        <div key={approval.id} className="bg-white border border-[#C8BFB2]/30 p-5 hover:shadow-sm transition-all">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[0.65rem] tracking-widest uppercase font-bold text-[#C5A258] bg-[#C5A258]/5 px-2 py-0.5">
                  {approval.phase}
                </span>
                <span className={`text-[0.65rem] tracking-wider uppercase font-bold px-2 py-0.5 ${
                  approval.priority === "critical"
                    ? "text-[#A65B4A] bg-[#A65B4A]/5"
                    : "text-[#C5A258] bg-[#C5A258]/5"
                }`}>
                  {approval.priority}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-base font-medium text-[#1A1A1A]">
                {approval.title}
              </h3>
              {approval.description && (
                <p className="text-sm text-[#8A8279] mt-1">{approval.description}</p>
              )}
              {approval.comments && (
                <p className="text-sm text-[#7B6B4A] mt-2 italic border-l-2 border-[#C5A258] pl-3">
                  &ldquo;{approval.comments}&rdquo;
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {approval.status === "PENDING" ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApprove(approval.id, "APPROVED")}
                    disabled={updating === approval.id}
                    className="px-3 py-1.5 text-xs tracking-wider uppercase font-semibold border border-[#4A7B5E] text-[#4A7B5E] hover:bg-[#4A7B5E] hover:text-white transition-all disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setCommentModal(approval.id)}
                    disabled={updating === approval.id}
                    className="px-3 py-1.5 text-xs tracking-wider uppercase font-semibold border border-[#C5A258] text-[#C5A258] hover:bg-[#C5A258] hover:text-[#2C2620] transition-all disabled:opacity-50"
                  >
                    With Comments
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {statusIcon(approval.status)}
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#8A8279]">
                    {statusLabel(approval.status)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {commentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6">
            <h3 className="font-[family-name:var(--font-display)] text-lg mb-4">Add Your Comments</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe any minor changes needed..."
              className="w-full h-32 px-4 py-3 border border-[#C8BFB2]/50 text-sm resize-none focus:outline-none focus:border-[#C5A258]"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleApprove(commentModal, "APPROVED_WITH_COMMENTS", comment)}
                className="flex-1 py-2.5 text-xs tracking-wider uppercase font-semibold bg-[#C5A258] text-white hover:bg-[#A68A3E] transition-colors"
              >
                Submit
              </button>
              <button
                onClick={() => { setCommentModal(null); setComment(""); }}
                className="px-4 py-2.5 text-xs tracking-wider uppercase font-semibold border border-[#C8BFB2] text-[#8A8279] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
