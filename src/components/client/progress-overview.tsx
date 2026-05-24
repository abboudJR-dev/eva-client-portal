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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-[#C8BFB2]/30 p-5 hover:shadow-md hover:border-[#C5A258]/30 transition-all">
        <p className="text-xs tracking-widest uppercase text-[#8A8279] font-semibold mb-2">Progress</p>
        <div className="flex items-end gap-2">
          <span className="font-[family-name:var(--font-display)] text-3xl text-[#C5A258]">{percentage}%</span>
        </div>
        <div className="mt-3 h-1.5 bg-[#F0EBE3] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C5A258] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="bg-white border border-[#C8BFB2]/30 p-5 hover:shadow-md hover:border-[#C5A258]/30 transition-all">
        <p className="text-xs tracking-widest uppercase text-[#8A8279] font-semibold mb-2">Steps Completed</p>
        <span className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A]">
          {completedSteps}<span className="text-lg text-[#C8BFB2]">/{totalSteps}</span>
        </span>
      </div>

      <div className="bg-white border border-[#C8BFB2]/30 p-5 hover:shadow-md hover:border-[#C5A258]/30 transition-all">
        <p className="text-xs tracking-widest uppercase text-[#8A8279] font-semibold mb-2">Pending Approvals</p>
        <span className="font-[family-name:var(--font-display)] text-3xl text-[#C5A258]">
          {pendingApprovals}
        </span>
      </div>

      <div className="bg-white border border-[#C8BFB2]/30 p-5 hover:shadow-md hover:border-[#C5A258]/30 transition-all">
        <p className="text-xs tracking-widest uppercase text-[#8A8279] font-semibold mb-2">Current Phase</p>
        <span className="font-[family-name:var(--font-display)] text-lg text-[#1A1A1A] leading-tight">
          {currentPhase}
        </span>
      </div>
    </div>
  );
}
