"use client";

import { useEffect, useRef } from "react";
import ThemeToggle from "@/components/theme-toggle";
import { countUp, fillBar, fillRing } from "@/lib/motion";

function StatusBar() {
  return (
    <div className="statusbar">
      <span className="clock" data-clock>
        9:41
      </span>
      <span className="icons">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M2 16h3v5H2zM7 12h3v9H7zM12 8h3v13h-3zM17 4h3v17h-3z" />
        </svg>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 4C7 4 3 7 1 11l11 9 11-9c-2-4-6-7-11-7z" opacity=".4" />
          <path d="M12 4C7 4 3 7 1 11l4 3c1.8-2.6 4.2-4 7-4s5.2 1.4 7 4l4-3c-2-4-6-7-11-7z" />
        </svg>
        <svg viewBox="0 0 26 24" fill="none" aria-hidden="true">
          <rect x="1" y="7" width="20" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" opacity=".5" />
          <rect x="3" y="9" width="15" height="7" rx="1.5" fill="currentColor" />
          <rect x="22" y="10.5" width="2" height="4" rx="1" fill="currentColor" opacity=".5" />
        </svg>
      </span>
    </div>
  );
}

function CheckIcon({ width = 3 }: { width?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export default function MobileShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const phonesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootEl = rootRef.current;
    const phones = phonesRef.current;
    if (!rootEl || !phones) return;

    const $ = <T extends Element = Element>(s: string, r: ParentNode = rootEl) =>
      r.querySelector<T>(s);
    const $$ = <T extends Element = Element>(s: string, r: ParentNode = rootEl) =>
      Array.from(r.querySelectorAll<T>(s));

    const cleanups: Array<() => void> = [];

    /* ---------- fit two phones to viewport ---------- */
    function fit() {
      if (!phones) return;
      phones.style.transform = "scale(1)";
      const r = phones.getBoundingClientRect();
      const availW = window.innerWidth - 48;
      const availH = window.innerHeight - 64 - 40; // topbar + margins
      const s = Math.min(1, availW / r.width, availH / r.height);
      phones.style.transform = "scale(" + s + ")";
    }
    window.addEventListener("resize", fit);
    cleanups.push(() => window.removeEventListener("resize", fit));
    fit();

    /* ---------- clock ---------- */
    function tickClock() {
      const d = new Date();
      const t =
        d.getHours().toString().padStart(2, "0") +
        ":" +
        d.getMinutes().toString().padStart(2, "0");
      $$<HTMLElement>("[data-clock]").forEach((e) => (e.textContent = t));
    }
    tickClock();
    const clockId = window.setInterval(tickClock, 30000);
    cleanups.push(() => window.clearInterval(clockId));

    /* ---------- count / ring / bar ---------- */
    function animateScreen(scr: ParentNode) {
      $$<HTMLElement>(".count", scr).forEach((el) => countUp(el));
      $$<SVGCircleElement>(".ring2 .prog", scr).forEach((el) => fillRing(el));
      $$<HTMLElement>(".bar-fill", scr).forEach((el) => fillBar(el));
    }
    // initial active screens
    $$(".appscreen.active").forEach((scr) => animateScreen(scr));

    function switchScreen(screenRoot: ParentNode, name: string) {
      $$<HTMLElement>(".appscreen", screenRoot).forEach((s) => {
        const on = s.dataset.screen === name;
        if (on && !s.classList.contains("active")) {
          s.classList.add("active");
          // replay counts / rings / bars
          $$<HTMLElement>(".count", s).forEach((e) => {
            delete e.dataset.done;
            e.textContent = "0" + (e.dataset.suffix || "");
          });
          $$<HTMLElement>(".bar-fill", s).forEach((e) => {
            e.style.width = "0%";
          });
          $$<SVGCircleElement>(".ring2 .prog", s).forEach((e) => {
            e.style.strokeDashoffset = "";
          });
          requestAnimationFrame(() => animateScreen(s));
        } else if (!on) {
          s.classList.remove("active");
        }
      });
    }

    /* ---------- tab switching (per phone) ---------- */
    $$<HTMLElement>(".tabbar").forEach((bar) => {
      const screenRoot = bar.closest(".screen");
      if (!screenRoot) return;
      bar.querySelectorAll<HTMLElement>(".tabbtn").forEach((btn) => {
        const handler = () => {
          const name = btn.dataset.screen;
          if (!name) return;
          bar
            .querySelectorAll<HTMLElement>(".tabbtn")
            .forEach((b) => b.classList.toggle("active", b === btn));
          switchScreen(screenRoot, name);
        };
        btn.addEventListener("click", handler);
        cleanups.push(() => btn.removeEventListener("click", handler));
      });
    });

    /* ---------- cross-links (home tiles -> approvals) ---------- */
    $$<HTMLElement>("[data-go]").forEach((el) => {
      const handler = () => {
        const screenRoot = el.closest(".screen");
        if (!screenRoot) return;
        const name = el.dataset.go;
        if (!name) return;
        screenRoot
          .querySelectorAll<HTMLElement>(".tabbtn")
          .forEach((b) => b.classList.toggle("active", b.dataset.screen === name));
        switchScreen(screenRoot, name);
      };
      el.addEventListener("click", handler);
      cleanups.push(() => el.removeEventListener("click", handler));
    });

    /* ---------- swipe-to-approve ---------- */
    function approveCard(card: HTMLElement | null) {
      if (!card || card.dataset.gone) return;
      card.dataset.gone = "1";
      card.classList.add("gone");
      const tid = window.setTimeout(() => {
        card.remove();
        const stack = $(".swipe-stack");
        if (!stack) return;
        const left = stack.querySelectorAll(".swipe-card:not([data-gone])").length;
        const badge = $<HTMLElement>('.tabbar[data-phone="client"] .tabbtn .badge');
        if (badge) {
          if (left > 0) badge.textContent = String(left);
          else badge.remove();
        }
        const sub = $<HTMLElement>('[data-screen="approvals"] .scr-sub');
        if (sub) {
          sub.textContent =
            left > 0
              ? left === 1
                ? "One decision is waiting on you."
                : left + " decisions are waiting on you."
              : "You’re all caught up.";
        }
      }, 480);
      cleanups.push(() => window.clearTimeout(tid));
    }

    $$<HTMLElement>(".swipe-fg").forEach((fg) => {
      let startX = 0;
      let dx = 0;
      let dragging = false;
      let w = 0;
      const card = fg.closest<HTMLElement>(".swipe-card");

      const down = (e: PointerEvent) => {
        if ((e.target as Element).closest(".btn")) return;
        dragging = true;
        startX = e.clientX;
        w = fg.offsetWidth;
        fg.style.transition = "none";
        if (e.pointerId != null && fg.setPointerCapture) {
          fg.setPointerCapture(e.pointerId);
        }
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        dx = Math.max(0, e.clientX - startX);
        fg.style.transform = "translateX(" + dx + "px)";
        fg.style.boxShadow = "0 8px 24px -8px rgba(40,33,22,.3)";
      };
      const up = () => {
        if (!dragging) return;
        dragging = false;
        fg.style.transition =
          "transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .3s";
        if (dx > w * 0.42) {
          fg.style.transform = "translateX(" + (w + 40) + "px)";
          approveCard(card);
        } else {
          fg.style.transform = "translateX(0)";
          fg.style.boxShadow = "";
        }
        dx = 0;
      };

      fg.addEventListener("pointerdown", down);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      cleanups.push(() => {
        fg.removeEventListener("pointerdown", down);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      });
    });

    /* ---------- tap approve button ---------- */
    $$<HTMLElement>(".tap-approve").forEach((b) => {
      const handler = (e: Event) => {
        e.stopPropagation();
        approveCard(b.closest<HTMLElement>(".swipe-card"));
      };
      b.addEventListener("click", handler);
      cleanups.push(() => b.removeEventListener("click", handler));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="eva-appshow" ref={rootRef}>
      <div className="topbar">
        <span className="brand-mark">EVA</span>
        <span className="div" aria-hidden="true" />
        <span className="lbl">Mobile</span>
        <div className="right">
          <ThemeToggle />
        </div>
      </div>

      <div className="stage">
        <div className="phones" ref={phonesRef}>
          {/* ============ CLIENT PHONE ============ */}
          <div className="device-wrap">
            <div className="device-cap">
              <span className="d" aria-hidden="true" /> Client App
            </div>
            <div className="phone">
              <div className="notch" aria-hidden="true" />
              <div className="screen">
                <StatusBar />
                <div className="sbody">
                  {/* HOME */}
                  <div className="appscreen active" data-screen="home" data-screen-label="Client · Home">
                    <div className="greet">
                      <span className="eyebrow">Your Design Journey</span>
                      <h1 className="display">Villa Palm</h1>
                      <div className="rm">
                        Relationship Manager · <b>EVA Sales Team</b>
                      </div>
                    </div>

                    <div className="hero-card">
                      <div className="lab">Current Phase</div>
                      <div className="pn">Project Kick-Off &amp; Planning</div>
                      <div className="sub">Aligning your brief, vision, and Program of Work.</div>
                      <div className="prog-row">
                        <svg className="ring2" viewBox="0 0 64 64" aria-hidden="true">
                          <circle className="track" cx="32" cy="32" r="26" />
                          <circle className="prog" cx="32" cy="32" r="26" data-pct="40" />
                          <text x="32" y="37" textAnchor="middle">
                            <tspan className="count" data-to="40" data-suffix="%">
                              0%
                            </tspan>
                          </text>
                        </svg>
                        <div className="pinfo">
                          <b>Phase 2 of 6</b>On track · est. 1 week
                        </div>
                      </div>
                    </div>

                    <div className="stat-row">
                      <div className="mini tap" data-go="approvals">
                        <div className="lab">Awaiting You</div>
                        <div className="v">
                          <span className="count" data-to="3">
                            0
                          </span>
                        </div>
                        <div className="go">Review now →</div>
                      </div>
                      <div className="mini">
                        <div className="lab">Steps Done</div>
                        <div className="v">
                          <span className="count" data-to="7">
                            0
                          </span>
                          <span className="u"> / 31</span>
                        </div>
                        <div className="bar-track" style={{ height: 5, marginTop: 10 }}>
                          <div className="bar-fill" data-w="22" />
                        </div>
                      </div>
                    </div>

                    <div className="sec-lab">Your Next Action</div>
                    <div className="action-card" data-go="approvals">
                      <div className="ic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
                        </svg>
                      </div>
                      <div>
                        <h4>Vision Alignment Checklist</h4>
                        <p>Confirm preferences to unlock moodboards</p>
                      </div>
                      <div className="chev">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    </div>

                    <div className="sec-lab">
                      Recent Activity <span className="more">All</span>
                    </div>
                    <div className="act">
                      <div className="dot">
                        <div className="c fill" />
                        <div className="ln" />
                      </div>
                      <div className="ac">
                        <h5>Client Brief approved</h5>
                        <p>Your style direction is locked in.</p>
                        <div className="t">2 days ago</div>
                      </div>
                    </div>
                    <div className="act">
                      <div className="dot">
                        <div className="c fill" />
                        <div className="ln" />
                      </div>
                      <div className="ac">
                        <h5>Program of Work delivered</h5>
                        <p>Phases, durations &amp; milestones mapped.</p>
                        <div className="t">3 days ago</div>
                      </div>
                    </div>
                    <div className="act">
                      <div className="dot">
                        <div className="c" />
                        <div className="ln" />
                      </div>
                      <div className="ac">
                        <h5>Kick-off meeting held</h5>
                        <p>With your Relationship Manager &amp; Head of Design.</p>
                        <div className="t">5 days ago</div>
                      </div>
                    </div>
                  </div>

                  {/* PHASES */}
                  <div className="appscreen" data-screen="phases" data-screen-label="Client · Phases">
                    <h2 className="scr-title">Project Phases</h2>
                    <p className="scr-sub">Your six-phase journey, end to end.</p>
                    <div className="ptrack">
                      <div className="pnode done">
                        <div className="rail">
                          <div className="circle">
                            <CheckIcon />
                          </div>
                          <div className="line2" />
                        </div>
                        <div className="pcard">
                          <div className="pno">Phase 01</div>
                          <h3>Contract Signing &amp; Handover</h3>
                          <span className="tag tag-neutral">Complete</span>
                        </div>
                      </div>
                      <div className="pnode active">
                        <div className="rail">
                          <div className="circle">02</div>
                          <div className="line2" />
                        </div>
                        <div className="pcard">
                          <div className="pno">Phase 02</div>
                          <h3>Project Kick-Off &amp; Planning</h3>
                          <span className="tag tag-required">In Progress · 40%</span>
                          <div className="steps">
                            <div className="pstep done">
                              <div className="m">
                                <CheckIcon />
                              </div>
                              <div className="txt">Relationship Manager assigned</div>
                            </div>
                            <div className="pstep done">
                              <div className="m">
                                <CheckIcon />
                              </div>
                              <div className="txt">Kick-off meeting held</div>
                            </div>
                            <div className="pstep doing">
                              <div className="m">3</div>
                              <div className="txt">Client brief &amp; stakeholder interview</div>
                            </div>
                            <div className="pstep pending">
                              <div className="m">4</div>
                              <div className="txt">Program of Work delivery</div>
                            </div>
                            <div className="pstep pending">
                              <div className="m">5</div>
                              <div className="txt">Vision alignment sign-off</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pnode">
                        <div className="rail">
                          <div className="circle">03</div>
                          <div className="line2" />
                        </div>
                        <div className="pcard">
                          <div className="pno">Phase 03</div>
                          <h3>Moodboard Development</h3>
                          <span className="tag tag-neutral">Upcoming</span>
                        </div>
                      </div>
                      <div className="pnode">
                        <div className="rail">
                          <div className="circle">04</div>
                          <div className="line2" />
                        </div>
                        <div className="pcard">
                          <div className="pno">Phase 04</div>
                          <h3>3D Visualization</h3>
                          <span className="tag tag-neutral">Upcoming</span>
                        </div>
                      </div>
                      <div className="pnode">
                        <div className="rail">
                          <div className="circle">05</div>
                          <div className="line2" />
                        </div>
                        <div className="pcard">
                          <div className="pno">Phase 05</div>
                          <h3>2D &amp; LOF Documentation</h3>
                          <span className="tag tag-neutral">Upcoming</span>
                        </div>
                      </div>
                      <div className="pnode">
                        <div className="rail">
                          <div className="circle">06</div>
                          <div className="line2" />
                        </div>
                        <div className="pcard">
                          <div className="pno">Phase 06</div>
                          <h3>Project Closure</h3>
                          <span className="tag tag-neutral">Upcoming</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* APPROVALS */}
                  <div className="appscreen" data-screen="approvals" data-screen-label="Client · Approvals">
                    <h2 className="scr-title">Approvals</h2>
                    <p className="scr-sub">Three decisions are waiting on you.</p>
                    <div className="swipe-hint">
                      <span>Swipe a card right to approve</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </div>
                    <div className="swipe-stack">
                      <div className="swipe-card">
                        <div className="swipe-bg">
                          <CheckIcon width={2.5} /> Approve
                        </div>
                        <div className="swipe-fg">
                          <div className="tags">
                            <span className="tag tag-neutral">Kick-Off</span>
                            <span className="tag tag-required">Required</span>
                          </div>
                          <h3>Vision Alignment Checklist</h3>
                          <p>Signed confirmation of preferences and exclusions.</p>
                          <div className="row">
                            <button className="btn btn-ghost" type="button">
                              Comment
                            </button>
                            <button className="btn btn-primary tap-approve" type="button">
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="swipe-card">
                        <div className="swipe-bg">
                          <CheckIcon width={2.5} /> Approve
                        </div>
                        <div className="swipe-fg">
                          <div className="tags">
                            <span className="tag tag-neutral">Kick-Off</span>
                            <span className="tag tag-required">Required</span>
                          </div>
                          <h3>Program of Work Acknowledgment</h3>
                          <p>Confirmation of your project schedule and milestones.</p>
                          <div className="row">
                            <button className="btn btn-ghost" type="button">
                              Comment
                            </button>
                            <button className="btn btn-primary tap-approve" type="button">
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="swipe-card">
                        <div className="swipe-bg">
                          <CheckIcon width={2.5} /> Approve
                        </div>
                        <div className="swipe-fg">
                          <div className="tags">
                            <span className="tag tag-neutral">Moodboard</span>
                            <span className="tag tag-critical">Critical</span>
                          </div>
                          <h3>Moodboard Approval (First 50%)</h3>
                          <p>Approval status per space — living, dining, primary suite.</p>
                          <div className="row">
                            <button className="btn btn-ghost" type="button">
                              Comment
                            </button>
                            <button className="btn btn-primary tap-approve" type="button">
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sec-lab" style={{ marginTop: 24 }}>
                      Approved
                    </div>
                    <div className="appr-done">
                      <div className="check">
                        <CheckIcon width={2.4} />
                      </div>
                      <div>
                        <h3>Client Brief &amp; Stakeholder Interview</h3>
                        <div className="ts">Approved · 19 May</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tabbar" data-phone="client">
                  <button className="tabbtn active" type="button" data-screen="home">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 11l9-8 9 8M5 9.5V21h14V9.5" />
                    </svg>
                    Home
                  </button>
                  <button className="tabbtn" type="button" data-screen="phases">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="6" cy="6" r="2.5" />
                      <circle cx="6" cy="18" r="2.5" />
                      <path d="M6 8.5v7M10 6h9M10 18h9" />
                    </svg>
                    Phases
                  </button>
                  <button className="tabbtn" type="button" data-screen="approvals">
                    <span className="badge">3</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
                    </svg>
                    Approvals
                  </button>
                  <button className="tabbtn" type="button" data-screen="home">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
                    </svg>
                    Account
                  </button>
                </div>
                <div className="home-ind" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* ============ DESIGNER PHONE ============ */}
          <div className="device-wrap">
            <div className="device-cap">
              <span className="d" aria-hidden="true" /> Designer Companion
            </div>
            <div className="phone">
              <div className="notch" aria-hidden="true" />
              <div className="screen">
                <StatusBar />
                <div className="sbody">
                  {/* PULSE */}
                  <div className="appscreen active" data-screen="pulse" data-screen-label="Designer · Pulse">
                    <div className="greet">
                      <span className="eyebrow">EVA Studio · Operations</span>
                      <h1 className="display">Good morning, Layla</h1>
                      <div className="rm">
                        Head of Design · <b>6 active projects</b>
                      </div>
                    </div>
                    <div className="pulse-num">
                      <div className="lab">Awaiting Client Approval</div>
                      <div className="big">
                        <span className="count" data-to="11">
                          0
                        </span>
                      </div>
                      <div className="sub">Across 6 projects · 3 are overdue</div>
                    </div>
                    <div className="pulse-grid">
                      <div className="mini">
                        <div className="lab">On Track</div>
                        <div className="v">
                          <span className="count" data-to="4">
                            0
                          </span>
                          <span className="u"> / 6</span>
                        </div>
                      </div>
                      <div className="mini">
                        <div className="lab">Due This Week</div>
                        <div className="v">
                          <span className="count" data-to="9">
                            0
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sec-lab">
                      Active Projects <span className="more">All</span>
                    </div>
                    <div className="proj">
                      <div className="ph">
                        <div>
                          <h4>Villa Palm</h4>
                          <div className="loc">Dubai · 620 m²</div>
                        </div>
                        <div className="pct">
                          <span className="count" data-to="22" data-suffix="%">
                            0%
                          </span>
                        </div>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" data-w="22" />
                      </div>
                      <div className="ft">
                        <div className="ava">
                          <span>M</span>
                          <span>LA</span>
                          <span>RM</span>
                        </div>
                        <div className="stat">Phase 2 · Kick-Off</div>
                      </div>
                    </div>
                    <div className="proj">
                      <div className="ph">
                        <div>
                          <h4>The Pearl Villa</h4>
                          <div className="loc">Dubai · 540 m²</div>
                        </div>
                        <div className="pct">
                          <span className="count" data-to="68" data-suffix="%">
                            0%
                          </span>
                        </div>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" data-w="68" />
                      </div>
                      <div className="ft">
                        <div className="ava">
                          <span>KH</span>
                          <span>LA</span>
                        </div>
                        <div className="stat warn">3D revision overdue</div>
                      </div>
                    </div>
                    <div className="proj">
                      <div className="ph">
                        <div>
                          <h4>Laysen House</h4>
                          <div className="loc">Riyadh · 180 m²</div>
                        </div>
                        <div className="pct">
                          <span className="count" data-to="91" data-suffix="%">
                            0%
                          </span>
                        </div>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" data-w="91" />
                      </div>
                      <div className="ft">
                        <div className="ava">
                          <span>SA</span>
                          <span>LA</span>
                        </div>
                        <div className="stat">Phase 6 · Closure</div>
                      </div>
                    </div>
                  </div>

                  {/* QUEUE */}
                  <div className="appscreen" data-screen="queue" data-screen-label="Designer · Approvals">
                    <h2 className="scr-title">Approval Queue</h2>
                    <p className="scr-sub">What clients are reviewing right now.</p>
                    <div className="queue">
                      <div className="av">M</div>
                      <div>
                        <h5>Mustafa · Villa Palm</h5>
                        <p>Vision Alignment Checklist</p>
                      </div>
                      <div className="when">
                        2h ago<span className="tag tag-required">Sent</span>
                      </div>
                    </div>
                    <div className="queue">
                      <div className="av">M</div>
                      <div>
                        <h5>Mustafa · Villa Palm</h5>
                        <p>Program of Work</p>
                      </div>
                      <div className="when">
                        2h ago<span className="tag tag-required">Sent</span>
                      </div>
                    </div>
                    <div className="queue">
                      <div className="av">KH</div>
                      <div>
                        <h5>Khalid · The Pearl</h5>
                        <p>3D — Primary Suite</p>
                      </div>
                      <div className="when">
                        1d ago<span className="tag tag-critical">Overdue</span>
                      </div>
                    </div>
                    <div className="queue">
                      <div className="av">SA</div>
                      <div>
                        <h5>Sara · Laysen House</h5>
                        <p>Closure &amp; NPS Survey</p>
                      </div>
                      <div className="when">
                        3h ago<span className="tag tag-neutral">Viewed</span>
                      </div>
                    </div>
                    <div className="sec-lab">Approved Today</div>
                    <div className="appr-done">
                      <div className="check">
                        <CheckIcon width={2.4} />
                      </div>
                      <div>
                        <h3>Moodboard — Zoo Majlis</h3>
                        <div className="ts">Approved by client · 1h ago</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tabbar" data-phone="designer">
                  <button className="tabbtn active" type="button" data-screen="pulse">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 12h4l3 8 4-16 3 8h4" />
                    </svg>
                    Pulse
                  </button>
                  <button className="tabbtn" type="button" data-screen="pulse">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <path d="M3 9h18M9 4v16" />
                    </svg>
                    Projects
                  </button>
                  <button className="tabbtn" type="button" data-screen="queue">
                    <span className="badge">4</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
                    </svg>
                    Queue
                  </button>
                  <button className="tabbtn" type="button" data-screen="pulse">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 5h16v12H7l-3 3z" />
                    </svg>
                    Inbox
                  </button>
                </div>
                <div className="home-ind" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
