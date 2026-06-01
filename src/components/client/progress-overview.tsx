import Link from "next/link";

interface ProgressOverviewProps {
  totalSteps: number;
  completedSteps: number;
  pendingApprovals: number;
  currentPhase: string;
}

/**
 * The four headline stat cards on the Journey page. Server-rendered markup
 * carrying the `data-*` motion hooks (count-up, progress ring, bar fill) that
 * RevealManager animates on view. No client JS of its own.
 */
export default function ProgressOverview({
  totalSteps,
  completedSteps,
  pendingApprovals,
  currentPhase,
}: ProgressOverviewProps) {
  const percentage =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="stats">
      {/* Overall progress ring */}
      <div className="stat-card reveal spotlight">
        <span className="lab">Overall Progress</span>
        <div className="ring-row">
          <svg className="ring" viewBox="0 0 80 80" aria-hidden="true">
            <circle className="track" cx="40" cy="40" r="33" />
            <circle className="prog" cx="40" cy="40" r="33" data-pct={percentage} />
            <text className="ring-pct" x="40" y="46" textAnchor="middle">
              <tspan className="count" data-to={percentage} data-suffix="%">
                0%
              </tspan>
            </text>
          </svg>
          <div className="sub">
            <b>
              <span className="count" data-to={completedSteps}>
                0
              </span>{" "}
              of {totalSteps}
            </b>
            steps completed
          </div>
        </div>
      </div>

      {/* Current phase (feature card) */}
      <div className="stat-card feature reveal">
        <span className="lab">Current Phase</span>
        <div className="ph">{currentPhase}</div>
        <div className="status">
          <span className="live-dot" /> Active
        </div>
      </div>

      {/* Awaiting approval */}
      <div className="stat-card reveal spotlight">
        <span className="lab">Awaiting Your Approval</span>
        <div className="big">
          <span className="count" data-to={pendingApprovals}>
            0
          </span>{" "}
          <span className="unit">items</span>
        </div>
        <Link className="cta" href="/approvals">
          Review now <span className="arr">→</span>
        </Link>
      </div>

      {/* Steps completed */}
      <div className="stat-card reveal spotlight">
        <span className="lab">Steps Completed</span>
        <div className="big">
          <span className="count" data-to={completedSteps}>
            0
          </span>{" "}
          <span className="unit">/ {totalSteps}</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill" data-w={percentage} />
        </div>
      </div>
    </div>
  );
}
