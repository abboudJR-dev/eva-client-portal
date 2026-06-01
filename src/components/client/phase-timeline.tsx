"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Sparkles,
  Palette,
  Cuboid,
  Ruler,
  Handshake,
  FileSignature,
} from "lucide-react";
import { countUp, fillBar } from "@/lib/motion";

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
  description: string | null;
  status: string;
  steps: Step[];
}

const phaseIcons: Record<number, ReactNode> = {
  1: <FileSignature size={26} />,
  2: <Sparkles size={26} />,
  3: <Palette size={26} />,
  4: <Cuboid size={26} />,
  5: <Ruler size={26} />,
  6: <Handshake size={26} />,
};

function Check({ width = 3 }: { width?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function phaseProgress(phase: Phase): number {
  if (phase.steps.length === 0) return phase.status === "COMPLETED" ? 100 : 0;
  return Math.round(
    (phase.steps.filter((s) => s.isCompleted).length / phase.steps.length) * 100,
  );
}

function statusTag(status: string): { cls: string; label: string } {
  if (status === "COMPLETED") return { cls: "tag-neutral", label: "Complete" };
  if (status === "IN_PROGRESS") return { cls: "tag-required", label: "In Progress" };
  return { cls: "tag-neutral", label: "Upcoming" };
}

export default function PhaseTimeline({ phases }: { phases: Phase[] }) {
  const currentIdx = phases.findIndex((p) => p.status === "IN_PROGRESS");
  const completedPhases = phases.filter((p) => p.status === "COMPLETED").length;
  const totalPhases = phases.length;

  const defaultId = currentIdx >= 0 ? phases[currentIdx].id : phases[0]?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(defaultId);

  const detailRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  // Replay count-up + bar-fill when a different phase is selected. The initial
  // load is animated by RevealManager, so skip the first run to avoid doubling.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const root = detailRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(".count").forEach((el) => countUp(el, true));
    root.querySelectorAll<HTMLElement>(".bar-fill").forEach((el) => fillBar(el));
  }, [selectedId]);

  // The gold "done" line fills toward the active phase.
  const activeIndex = currentIdx >= 0 ? currentIdx : completedPhases;
  const lineWidth =
    totalPhases > 1
      ? Math.max(0, Math.min(100, Math.round((activeIndex / (totalPhases - 1)) * 100)))
      : 0;

  const selected = phases.find((p) => p.id === selectedId) ?? phases[0];
  if (!selected) return null;

  const selProgress = phaseProgress(selected);
  const tag = statusTag(selected.status);
  const firstIncompleteIdx =
    selected.status === "IN_PROGRESS"
      ? selected.steps.findIndex((s) => !s.isCompleted)
      : -1;

  return (
    <>
      <div className="journey-bar reveal">
        <span className="lab">Your Journey</span>
        <span>
          <span className="count" data-to={completedPhases}>
            0
          </span>{" "}
          of {totalPhases} phases complete
        </span>
      </div>

      <div className="stepper reveal">
        <div className="line">
          <div className="done" data-w={lineWidth} />
        </div>
        {phases.map((phase) => {
          const isDone = phase.status === "COMPLETED";
          const isActive = phase.status === "IN_PROGRESS";
          const isSel = phase.id === selected.id;
          const cls = ["step", isDone && "done", isActive && "active", isSel && "sel"]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={phase.id}
              type="button"
              className={cls}
              aria-pressed={isSel}
              aria-label={`Phase ${String(phase.number).padStart(2, "0")}: ${phase.name}`}
              onClick={() => setSelectedId(phase.id)}
            >
              <span className="node">
                {isDone ? <Check width={2.4} /> : String(phase.number).padStart(2, "0")}
              </span>
              <span className="nm">{phase.name}</span>
            </button>
          );
        })}
      </div>

      <div className="phase-detail reveal" ref={detailRef}>
        <div key={selected.id}>
          <div className="phase-head">
            <div className="glyph">
              {phaseIcons[selected.number] ?? <FileSignature size={26} />}
            </div>
            <div>
              <div className="tags">
                <span className="pno">
                  Phase {String(selected.number).padStart(2, "0")}
                </span>
                <span className={`tag ${tag.cls}`}>{tag.label}</span>
              </div>
              <h3>{selected.name}</h3>
              {selected.description && <p>{selected.description}</p>}
            </div>
            <div className="pct">
              <div className="v">
                <span className="count" data-to={selProgress} data-suffix="%">
                  0%
                </span>
              </div>
            </div>
          </div>

          <div className="phase-progress">
            <div className="bar-track">
              <div className="bar-fill" data-w={selProgress} />
            </div>
          </div>

          <div className="steps-list">
            {selected.steps.map((step, i) => {
              const isStepDone = step.isCompleted;
              const isDoing = i === firstIncompleteIdx;
              const rowCls = ["step-row", isStepDone && "done", isDoing && "doing"]
                .filter(Boolean)
                .join(" ");
              return (
                <div key={step.id} className={rowCls}>
                  <div className="marker">
                    {isStepDone ? <Check width={3} /> : i + 1}
                  </div>
                  <div className="sc">
                    <h4>
                      {step.title}
                      {isStepDone && <span className="st">Done</span>}
                      {isDoing && <span className="st">In Progress</span>}
                    </h4>
                    {step.description && <p>{step.description}</p>}
                    {step.sampleUrl && (
                      <a
                        className="sample"
                        href={step.sampleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {step.sampleLabel || "View reference"}
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
