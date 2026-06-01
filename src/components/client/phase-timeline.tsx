"use client";

import { useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Palette,
  Cuboid,
  Ruler,
  Handshake,
  FileSignature,
  ExternalLink,
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
  description: string | null;
  status: string;
  steps: Step[];
}

const phaseIcons: Record<number, React.ReactNode> = {
  1: <FileSignature size={22} />,
  2: <Sparkles size={22} />,
  3: <Palette size={22} />,
  4: <Cuboid size={22} />,
  5: <Ruler size={22} />,
  6: <Handshake size={22} />,
};

const phaseAccents: Record<number, string> = {
  1: "#8B7355",
  2: "#C5A258",
  3: "#9B6B4A",
  4: "#6B7B8D",
  5: "#7B6B5D",
  6: "#4A7B5E",
};

function getPhaseProgress(phase: Phase) {
  if (phase.steps.length === 0) return 0;
  return Math.round((phase.steps.filter((s) => s.isCompleted).length / phase.steps.length) * 100);
}

export default function PhaseTimeline({ phases }: { phases: Phase[] }) {
  const currentIdx = phases.findIndex((p) => p.status === "IN_PROGRESS");
  const [expandedPhase, setExpandedPhase] = useState<string | null>(
    currentIdx >= 0 ? phases[currentIdx].id : phases[0]?.id ?? null
  );

  const completedPhases = phases.filter((p) => p.status === "COMPLETED").length;
  const totalPhases = phases.length;

  return (
    <div className="space-y-6">
      {/* Journey Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs tracking-widest uppercase text-[#8A8279] font-semibold">
            Your Journey
          </p>
          <p className="text-xs text-[#8A8279]">
            <span className="font-semibold text-[#C5A258]">{completedPhases}</span> of {totalPhases} phases complete
          </p>
        </div>

        {/* Phase dots flow */}
        <div className="relative flex items-center gap-0">
          {/* Background track */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#E8E3DC]" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#4A7B5E] to-[#C5A258] transition-all duration-700"
            style={{ width: `${totalPhases > 1 ? (completedPhases / (totalPhases - 1)) * 100 : 0}%` }}
          />

          {phases.map((phase, idx) => {
            const isComplete = phase.status === "COMPLETED";
            const isCurrent = phase.status === "IN_PROGRESS";
            const isExpanded = expandedPhase === phase.id;

            return (
              <button
                key={phase.id}
                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                className="relative z-10 flex-1 flex flex-col items-center group"
                aria-expanded={isExpanded}
                aria-label={`Phase ${phase.number}: ${phase.name}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isComplete
                      ? "bg-[#4A7B5E] border-[#4A7B5E] text-white scale-100"
                      : isCurrent
                      ? "bg-[#C5A258] border-[#C5A258] text-white scale-110 shadow-lg shadow-[#C5A258]/30"
                      : "bg-white border-[#D4CFC7] text-[#C8BFB2] group-hover:border-[#C5A258]/50"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle size={18} />
                  ) : isCurrent ? (
                    <span className="relative flex items-center justify-center">
                      {phaseIcons[phase.number] || <Clock size={18} />}
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                    </span>
                  ) : (
                    <span className="text-xs font-bold">{String(phase.number).padStart(2, "0")}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-[0.65rem] leading-tight text-center max-w-[80px] transition-colors ${
                    isComplete
                      ? "text-[#4A7B5E] font-semibold"
                      : isCurrent
                      ? "text-[#C5A258] font-bold"
                      : "text-[#8A8279] group-hover:text-[#1A1A1A]"
                  }`}
                >
                  {phase.name.length > 20 ? phase.name.split(" ").slice(0, 2).join(" ") : phase.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Phase Detail */}
      {phases.map((phase) => {
        const isExpanded = expandedPhase === phase.id;
        if (!isExpanded) return null;

        const progress = getPhaseProgress(phase);
        const accent = phaseAccents[phase.number] || "#C5A258";
        const isComplete = phase.status === "COMPLETED";
        const isCurrent = phase.status === "IN_PROGRESS";

        return (
          <div
            key={`detail-${phase.id}`}
            className="bg-white border border-[#E8E3DC] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
            style={{ borderTopColor: accent, borderTopWidth: 3 }}
          >
            {/* Phase Header */}
            <div className="p-5 sm:p-6 pb-0">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${accent}15`, color: accent }}
                >
                  {phaseIcons[phase.number] || <Circle size={22} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[0.65rem] tracking-[0.2em] uppercase font-bold" style={{ color: accent }}>
                      Phase {String(phase.number).padStart(2, "0")}
                    </span>
                    {isComplete && (
                      <span className="text-[0.6rem] tracking-wider uppercase font-bold text-[#4A7B5E] bg-[#4A7B5E]/10 px-2 py-0.5 rounded-full">
                        Complete
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[0.6rem] tracking-wider uppercase font-bold text-[#C5A258] bg-[#C5A258]/10 px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg sm:text-xl text-[#1A1A1A]">
                    {phase.name}
                  </h3>
                  {phase.description && (
                    <p className="text-sm text-[#8A8279] mt-1 leading-relaxed">{phase.description}</p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#F0EBE3] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%`, backgroundColor: accent }}
                  />
                </div>
                <span className="text-xs font-bold tabular-nums" style={{ color: accent }}>
                  {progress}%
                </span>
              </div>
            </div>

            {/* Steps */}
            <div className="p-5 sm:p-6 pt-4">
              <div className="grid gap-2">
                {phase.steps.map((step, stepIdx) => (
                  <div
                    key={step.id}
                    className={`group relative flex items-start gap-3 p-3 sm:p-4 rounded-lg border transition-all ${
                      step.isCompleted
                        ? "border-[#4A7B5E]/15 bg-gradient-to-r from-[#4A7B5E]/[0.03] to-transparent"
                        : isCurrent && !step.isCompleted && stepIdx === phase.steps.findIndex((s) => !s.isCompleted)
                        ? "border-[#C5A258]/30 bg-gradient-to-r from-[#C5A258]/[0.04] to-transparent shadow-sm"
                        : "border-[#E8E3DC] hover:border-[#D4CFC7]"
                    }`}
                  >
                    {/* Step Number + Status */}
                    <div className="flex-shrink-0 mt-0.5">
                      {step.isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-[#4A7B5E] flex items-center justify-center">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      ) : isCurrent && stepIdx === phase.steps.findIndex((s) => !s.isCompleted) ? (
                        <div className="w-6 h-6 rounded-full border-2 border-[#C5A258] flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-[#C5A258]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-[#D4CFC7] flex items-center justify-center">
                          <span className="text-[0.55rem] font-bold text-[#C8BFB2]">{stepIdx + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium leading-snug ${
                          step.isCompleted
                            ? "text-[#4A7B5E]"
                            : isCurrent && stepIdx === phase.steps.findIndex((s) => !s.isCompleted)
                            ? "text-[#1A1A1A]"
                            : "text-[#5A534B]"
                        }`}
                      >
                        {step.title}
                      </p>
                      {step.description && (
                        <p className="text-xs text-[#8A8279] mt-0.5 leading-relaxed">{step.description}</p>
                      )}

                      {/* Sample Badge */}
                      {step.sampleUrl && (
                        <a
                          href={step.sampleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#C5A258]/8 to-[#C5A258]/4 border border-[#C5A258]/20 rounded text-xs text-[#C5A258] hover:border-[#C5A258]/40 hover:shadow-sm transition-all"
                        >
                          <Palette size={11} />
                          <span className="font-semibold uppercase tracking-wider">Sample</span>
                          <span className="text-[#C8BFB2]">·</span>
                          <span className="underline">{step.sampleLabel || "View Reference"}</span>
                          <ExternalLink size={9} className="opacity-50" />
                        </a>
                      )}
                    </div>

                    {/* Completed indicator */}
                    {step.isCompleted && (
                      <span className="text-[0.6rem] text-[#4A7B5E]/60 uppercase tracking-wider font-semibold flex-shrink-0 hidden sm:block">
                        Done
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
