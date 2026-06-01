"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

const RESOLVED = new Set([
  "APPROVED",
  "APPROVED_WITH_COMMENTS",
  "REVISE_RESUBMIT",
]);

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

function ReviseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function formatDate(d: Date | null): string | null {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return null;
  }
}

function priorityTag(priority: string): { cls: string; label: string } {
  if (priority?.toLowerCase() === "critical") {
    return { cls: "tag-critical", label: "Critical" };
  }
  const label = priority
    ? priority.charAt(0).toUpperCase() + priority.slice(1)
    : "Required";
  return { cls: "tag-required", label };
}

export default function ApprovalsList({
  approvals,
  projectId,
}: {
  approvals: Approval[];
  projectId: string;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [optimistic, setOptimistic] = useState<Record<string, string>>({});
  const [modalFor, setModalFor] = useState<Approval | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  const submit = useCallback(
    async (approval: Approval, status: string, comments?: string) => {
      setBusyId(approval.id);
      setOptimistic((o) => ({ ...o, [approval.id]: status }));
      setModalFor(null);
      try {
        const res = await fetch("/api/approvals", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            approvalId: approval.id,
            status,
            comments,
            projectId,
          }),
        });
        if (!res.ok) throw new Error("Request failed");
        showToast(
          status === "REVISE_RESUBMIT"
            ? `${approval.title} — revision requested`
            : `${approval.title} approved`,
        );
        router.refresh();
      } catch {
        setOptimistic((o) => {
          const next = { ...o };
          delete next[approval.id];
          return next;
        });
        showToast("Something went wrong. Please try again.");
      } finally {
        setBusyId(null);
      }
    },
    [projectId, router, showToast],
  );

  return (
    <>
      <div className="appr-list">
        {approvals.map((approval) => {
          const status = optimistic[approval.id] ?? approval.status;
          const resolved = RESOLVED.has(status);
          const isApprovedVariant =
            status === "APPROVED" || status === "APPROVED_WITH_COMMENTS";
          const prio = priorityTag(approval.priority);
          const ts = formatDate(approval.approvedAt);
          const busy = busyId === approval.id;

          return (
            <div
              key={approval.id}
              className="appr reveal"
              data-approved={isApprovedVariant ? "true" : undefined}
            >
              <div className="body">
                <div className="tags">
                  <span className="tag tag-neutral">{approval.phase}</span>
                  <span className={`tag ${prio.cls}`}>{prio.label}</span>
                </div>
                <h3>{approval.title}</h3>
                {approval.description && <p>{approval.description}</p>}
                {approval.comments && (
                  <p className="comment">&ldquo;{approval.comments}&rdquo;</p>
                )}
              </div>

              <div className="actions">
                {!resolved ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      disabled={busy}
                      onClick={() => setModalFor(approval)}
                    >
                      With comments
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary magnetic"
                      disabled={busy}
                      onClick={() => submit(approval, "APPROVED")}
                    >
                      {busy ? "Saving…" : "Approve"}
                    </button>
                  </>
                ) : status === "REVISE_RESUBMIT" ? (
                  <span className="done-chip revise">
                    <ReviseIcon /> Revise &amp; Resubmit{" "}
                    {ts && <span className="ts">· {ts}</span>}
                  </span>
                ) : (
                  <span
                    className={`done-chip${status === "APPROVED_WITH_COMMENTS" ? " commented" : ""}`}
                  >
                    <CheckCircleIcon />
                    {status === "APPROVED_WITH_COMMENTS"
                      ? "Approved with comments"
                      : "Approved"}
                    {ts && <span className="ts">· {ts}</span>}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalFor && (
        <CommentModal
          approval={modalFor}
          busy={busyId === modalFor.id}
          onCancel={() => setModalFor(null)}
          onSubmit={(comment) => submit(modalFor, "APPROVED_WITH_COMMENTS", comment)}
        />
      )}

      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        <CheckCircleIcon />
        <span>{toast}</span>
      </div>
    </>
  );
}

function CommentModal({
  approval,
  busy,
  onCancel,
  onSubmit,
}: {
  approval: Approval;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (comment: string) => void;
}) {
  const [comment, setComment] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;
  const titleId = "appr-modal-title";

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    textareaRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancelRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const box = boxRef.current;
      if (!box) return;
      const focusables = Array.from(
        box.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea, [href], input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div
      className="appr-modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="appr-modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={boxRef}
      >
        <h3 id={titleId}>Approve with comments</h3>
        <p className="sub">
          Add a note for your Relationship Manager about{" "}
          <b>{approval.title}</b>. Your approval is recorded with the comment
          attached.
        </p>
        <textarea
          ref={textareaRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe any minor changes or notes…"
          aria-label="Approval comments"
        />
        <div className="appr-modal-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onSubmit(comment)}
            disabled={busy || comment.trim().length === 0}
          >
            {busy ? "Saving…" : "Submit approval"}
          </button>
        </div>
      </div>
    </div>
  );
}
