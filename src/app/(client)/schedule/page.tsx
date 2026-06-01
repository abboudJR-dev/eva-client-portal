import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

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
      <div className="wrap">
        <section className="page">
          <div className="doc-empty" style={{ marginTop: 24 }}>
            <h3>No project found</h3>
            <p>
              Your project is being set up. Your schedule will appear here once
              your Program of Work is confirmed.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const items = project.scheduleItems;

  return (
    <div className="wrap">
      <section className="page">
        <div className="page-head reveal">
          <span className="eyebrow">Your Schedule</span>
          <h1>Project Timeline</h1>
          <p className="lede">
            Key milestones and expected durations. Actual timelines are
            confirmed in your Program of Work.
          </p>
        </div>

        {items.length > 0 ? (
          <div className="sched-grid">
            {items.map((item) => {
              const milestones = item.milestones
                ? item.milestones
                    .split(",")
                    .map((m) => m.trim())
                    .filter(Boolean)
                : [];
              return (
                <div key={item.id} className="sched-card reveal spotlight">
                  <div className="pno">{item.phase}</div>
                  <h3>{item.title}</h3>
                  {item.duration && (
                    <div className="dur">
                      <ClockIcon /> {item.duration}
                    </div>
                  )}
                  {milestones.length > 0 && (
                    <ul>
                      {milestones.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="doc-empty reveal" style={{ marginTop: 24 }}>
            <div className="ic">
              <ClockIcon />
            </div>
            <h3>Your timeline is being prepared</h3>
            <p>
              Key milestones and durations will appear here once your Program of
              Work is confirmed by your Relationship Manager.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
