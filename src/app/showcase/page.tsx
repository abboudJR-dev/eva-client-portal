import Link from "next/link";
import type { Metadata } from "next";
import ThemeToggle from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "EVA — Product Design",
  description:
    "Two connected surfaces for EVA's luxury interiors clients — a desktop portal and a mobile app.",
};

export default function ShowcaseHubPage() {
  return (
    <div className="eva-hub">
      <header className="top">
        <span className="brand-mark">EVA</span>
        <span className="div" aria-hidden="true" />
        <span className="sub">Product Design</span>
        <div className="right">
          <ThemeToggle />
        </div>
      </header>

      <section className="hero reveal">
        <span className="eyebrow">Villa Palm · Client Experience</span>
        <h1 className="display">
          A design journey, <em>made visible.</em>
        </h1>
        <p>
          Two connected surfaces for EVA&rsquo;s luxury interiors clients — a
          desktop portal and a mobile app — that turn a six-phase project into
          something clients can see, follow, and approve with confidence.
        </p>
      </section>

      <div className="cards">
        <Link className="pcard reveal" href="/dashboard">
          <div className="vis" aria-hidden="true">
            <div className="mini-portal">
              <div className="bar">
                <i />
                <i />
                <i />
              </div>
              <div className="grid">
                <div className="g" />
                <div className="g" />
                <div className="g" />
                <div className="g" />
              </div>
              <div className="rows">
                <div className="r" style={{ width: "60%" }} />
                <div className="r" style={{ width: "85%" }} />
                <div className="r" style={{ width: "45%" }} />
              </div>
            </div>
          </div>
          <div className="body">
            <div className="kicker">Client Portal · Web</div>
            <h2>The Project Dashboard</h2>
            <div className="desc">
              Journey, phases, approvals, documents, and schedule — the full
              picture, with a live progress ring and a six-phase tracker.
            </div>
            <div className="meta">
              <span className="tag tag-neutral">5 areas</span>
              <span className="tag tag-neutral">Light + Dark</span>
              <span className="tag tag-neutral">Interactive</span>
            </div>
            <div className="open">
              Open portal{" "}
              <span className="arr" aria-hidden="true">
                →
              </span>
            </div>
          </div>
        </Link>

        <Link className="pcard reveal" href="/showcase/app">
          <div className="vis" aria-hidden="true">
            <div className="mini-phones">
              <div className="mini-ph">
                <div className="scr">
                  <div className="hc" />
                  <div className="rr" style={{ width: "70%" }} />
                  <div className="rr" style={{ width: "50%" }} />
                  <div className="rr" style={{ width: "60%" }} />
                </div>
              </div>
              <div className="mini-ph">
                <div className="scr">
                  <div className="hc" />
                  <div className="rr" style={{ width: "60%" }} />
                  <div className="rr" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="body">
            <div className="kicker">Mobile · Client + Designer</div>
            <h2>On-the-Go &amp; In-Studio</h2>
            <div className="desc">
              A client app to track progress and swipe-to-approve, paired with a
              designer companion that shows the studio&rsquo;s live operations
              pulse.
            </div>
            <div className="meta">
              <span className="tag tag-neutral">2 devices</span>
              <span className="tag tag-neutral">Swipe to approve</span>
              <span className="tag tag-neutral">Light + Dark</span>
            </div>
            <div className="open">
              Open app{" "}
              <span className="arr" aria-hidden="true">
                →
              </span>
            </div>
          </div>
        </Link>
      </div>

      <footer className="foot">
        <span>
          <b>EVA Interiors</b> — luxury interiors, intelligently
        </span>
        <span>Cormorant Garamond + Inter</span>
        <span>Motion: count-up · progress rings · spotlight · spring swipe</span>
      </footer>
    </div>
  );
}
