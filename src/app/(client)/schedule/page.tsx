import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Calendar, Clock } from "lucide-react";

export default async function SchedulePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const project = await prisma.project.findFirst({
    where: { clientId: session.user.id },
    include: { scheduleItems: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-[#8A8279]">No project found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-[#C5A258] font-semibold mb-1">Your Schedule</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A]">
          Project Timeline
        </h1>
        <p className="text-sm text-[#8A8279] mt-2">
          Key milestones and expected durations. Actual timelines are confirmed in your Program of Work.
        </p>
      </div>

      {project.scheduleItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#C8BFB2]/30">
          <Calendar size={32} className="mx-auto text-[#C8BFB2] mb-3" />
          <p className="text-[#8A8279]">Your schedule will appear once your Program of Work is confirmed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.scheduleItems.map((item) => (
            <div key={item.id} className="bg-white border border-[#C8BFB2]/30 p-5 hover:shadow-md hover:border-[#C5A258]/30 transition-all">
              <span className="text-[0.6rem] tracking-widest uppercase text-[#C5A258] font-bold">
                {item.phase}
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-base font-medium text-[#1A1A1A] mt-1 mb-2">
                {item.title}
              </h3>
              {item.duration && (
                <div className="flex items-center gap-1.5 text-sm text-[#8A8279] mb-3 pb-3 border-b border-[#F0EBE3]">
                  <Clock size={12} />
                  {item.duration}
                </div>
              )}
              {item.milestones && (
                <ul className="space-y-1.5">
                  {item.milestones.split(",").map((m, i) => (
                    <li key={i} className="text-xs text-[#8A8279] pl-4 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-1.5 before:border before:border-[#C5A258] before:rounded-full">
                      {m.trim()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
