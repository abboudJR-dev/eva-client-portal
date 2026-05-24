"use client";

import { CheckCircle, Circle, Clock } from "lucide-react";

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

export default function PhaseTimeline({ phases }: { phases: Phase[] }) {
  return (
    <div className="space-y-8">
      {phases.map((phase, idx) => (
        <div key={phase.id} className="relative pl-8">
          {idx < phases.length - 1 && (
            <div className="absolute left-[11px] top-10 bottom-0 w-px bg-gradient-to-b from-[#C5A258] to-[#C8BFB2]/30" />
          )}

          <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-[#C5A258] bg-[#FAF8F5] flex items-center justify-center">
            {phase.status === "COMPLETED" ? (
              <CheckCircle size={14} className="text-[#4A7B5E]" />
            ) : phase.status === "IN_PROGRESS" ? (
              <Clock size={12} className="text-[#C5A258]" />
            ) : (
              <Circle size={8} className="text-[#C8BFB2]" />
            )}
          </div>

          <div className="mb-2">
            <span className="text-xs tracking-widest uppercase text-[#C5A258] font-semibold">
              Phase {String(phase.number).padStart(2, "0")}
            </span>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[#1A1A1A] mt-0.5">
              {phase.name}
            </h3>
            {phase.description && (
              <p className="text-sm text-[#8A8279] mt-1 max-w-2xl">{phase.description}</p>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {phase.steps.map((step) => (
              <div
                key={step.id}
                className={`bg-white border p-4 transition-all hover:shadow-sm ${
                  step.isCompleted
                    ? "border-[#4A7B5E]/20 bg-[#4A7B5E]/[0.02]"
                    : "border-[#C8BFB2]/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {step.isCompleted ? (
                      <CheckCircle size={16} className="text-[#4A7B5E]" />
                    ) : (
                      <Circle size={16} className="text-[#C8BFB2]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-[family-name:var(--font-display)] text-sm font-medium ${
                      step.isCompleted ? "text-[#4A7B5E]" : "text-[#1A1A1A]"
                    }`}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-[#8A8279] mt-1 leading-relaxed">{step.description}</p>
                    )}
                    {step.sampleUrl && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C5A258]/5 border border-[#C5A258]/20 text-xs text-[#C5A258]">
                        <span className="font-semibold uppercase tracking-wider">Sample</span>
                        <span className="text-[#8A8279]">—</span>
                        <a href={step.sampleUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#A68A3E]">
                          {step.sampleLabel || "View Sample"}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
