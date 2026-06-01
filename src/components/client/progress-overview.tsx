"use client";

interface ProgressOverviewProps {
  totalSteps: number;
  completedSteps: number;
  pendingApprovals: number;
  currentPhase: string;
}

export default function ProgressOverview({
  totalSteps,
  completedSteps,
  pendingApprovals,
  currentPhase,
}: ProgressOverviewProps) {
  const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Progress Ring */}
      <div className="col-span-2 sm:col-span-1 bg-white border border-[#E8E3DC] p-5 hover:shadow-lg hover:border-[#C5A258]/30 transition-all duration-300 group">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#8A8279] font-semibold mb-3">
          Overall Progress
        </p>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88" aria-label={`Progress: ${percentage}%`}>
              <circle cx="44" cy="44" r="40" fill="none" stroke="#F0EBE3" strokeWidth="4" />
              <circle
                cx="44"
                cy="44"
                r="40"
                fill="none"
                stroke="#C5A258"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-[family-name:var(--font-display)] text-xl text-[#C5A258] font-bold">
                {percentage}<span className="text-sm">%</span>
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1A1A1A]">
              {completedSteps} of {totalSteps}
            </p>
            <p className="text-xs text-[#8A8279]">steps completed</p>
          </div>
        </div>
      </div>

      {/* Current Phase */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2A26] border border-[#3A3632] p-5 text-white hover:shadow-lg transition-all duration-300">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#C5A258] font-semibold mb-3">
          Current Phase
        </p>
        <p className="font-[family-name:var(--font-display)] text-base sm:text-lg leading-tight text-white/95">
          {currentPhase}
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A258] animate-pulse" />
          <span className="text-[0.6rem] tracking-wider uppercase text-[#C5A258]/80">Active</span>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white border border-[#E8E3DC] p-5 hover:shadow-lg hover:border-[#C5A258]/30 transition-all duration-300">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#8A8279] font-semibold mb-3">
          Awaiting Your Approval
        </p>
        <div className="flex items-end gap-1">
          <span className="font-[family-name:var(--font-display)] text-3xl text-[#C5A258] leading-none">
            {pendingApprovals}
          </span>
          <span className="text-sm text-[#8A8279] mb-0.5">items</span>
        </div>
        {pendingApprovals > 0 && (
          <a
            href="/approvals"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#C5A258] hover:text-[#A68A3E] transition-colors uppercase tracking-wider"
          >
            Review Now →
          </a>
        )}
      </div>

      {/* Steps Completed */}
      <div className="bg-white border border-[#E8E3DC] p-5 hover:shadow-lg hover:border-[#C5A258]/30 transition-all duration-300">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#8A8279] font-semibold mb-3">
          Steps Completed
        </p>
        <div className="flex items-end gap-1">
          <span className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A] leading-none">
            {completedSteps}
          </span>
          <span className="text-lg text-[#C8BFB2] mb-0.5">/ {totalSteps}</span>
        </div>
        {/* Mini bar */}
        <div className="mt-3 h-1 bg-[#F0EBE3] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4A7B5E] to-[#C5A258] rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
