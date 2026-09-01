import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { track } from "../lib/analytics";
import { POSITIONS, REGIONS, positionBySlug } from "./openPositions";
import PositionModal from "./PositionModal";
import "./apply.css";

/* ------------------------------------------------------------------
   /apply — the singles recruitment drive, run as a careers page.

   Each card opens its own job description at /apply/<slug>, so a listing is
   shareable on its own rather than being a state the page happens to be in.

   The database still calls a position a `group_slug`. Renaming the concept in
   the copy does not justify a migration that would orphan every application
   already filed — the wire format and the wording are allowed to differ.
   ------------------------------------------------------------------ */

const TITLE = "We're Hiring — Convoo Singles Recruitment Drive";

/* Below this a count reads as "nobody is here" and argues against applying.
   Omitting is honest; inventing a number would not be. */
const SHOW_COUNT_FROM = 5;

/* What actually happens, in the two phases it actually has: getting hired,
   and then the interview itself. The joke was carrying the whole page and
   none of this was anywhere on it — a visitor could enjoy the bit and still
   not know what they were saying yes to. */
const TRACKS = [
  {
    heading: "hiring steps",
    steps: [
      "pick the position you actually want, then apply. two minutes, no resume.",
      "we read every application ourselves. a room only opens once both sides of it are full.",
      "if you're shortlisted, we email you an interview invite.",
    ],
  },
  {
    heading: "interview steps",
    steps: [
      "your invite has a date, a time, and a room code.",
      "download convoo if you haven't already, then enter the code to join.",
      "show up at your time. we pair you with one person, and you chat for 3 minutes.",
      "see where it goes. that's the whole interview.",
    ],
  },
];
export default function Join() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const open = positionBySlug(slug);

  const [word, setWord] = useState(0);
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  /* An unknown slug is a dead link, not a blank dialog — send it back to the
     board rather than rendering nothing over the top of it. */
  useEffect(() => {
    if (slug && !open) navigate("/apply", { replace: true });
  }, [slug, open, navigate]);

  /* Give the drive its own document title, and each listing its own — the
     analytics reports by page title, and a shared listing should say what it
     is in the tab. */
  useEffect(() => {
    const previous = document.title;
    document.title = open ? `${open.title} — Convoo is hiring` : TITLE;
    return () => {
      document.title = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) track("position_view", { position: open.slug });
  }, [open]);

  /* Real applicant numbers, from a view that exposes totals and nothing else.
     Never invented — a made-up headcount is a lie told to somebody deciding
     whether to walk into a room. */
  useEffect(() => {
    let live = true;
    supabase
      .from("group_counts")
      .select("group_slug, members")
      .then(({ data, error: err }) => {
        if (!live || err || !data) return;
        const next: Record<string, number> = {};
        for (const r of data as { group_slug: string; members: number }[])
          next[r.group_slug] = r.members;
        setCounts(next);
      });
    return () => {
      live = false;
    };
  }, []);

  /* Cycle the headline. Anyone who has asked for less motion gets the first
     word and no rotation. Frozen while a listing is open — nothing should be
     moving behind a dialog. */
  useEffect(() => {
    if (open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setWord((w) => (w + 1) % POSITIONS.length),
      2200,
    );
    return () => window.clearInterval(id);
  }, [open]);

  return (
    <div className="apply">
      <header className="apply-top">
        <Link className="apply-brand" to="/">
          convoo<span className="apply-dot">.</span>
        </Link>
        {/* Without this every visitor either applies or leaves. */}
        <Link
          className="apply-cta"
          to="/download-now"
          onClick={() =>
            track("cta_click", { cta: "get_app", placement: "apply_masthead" })
          }
        >
          get the app
        </Link>
      </header>

      <main className="apply-body">
        <section className="apply-hero">
          <span className="drive-badge">
            <span className="drive-live" aria-hidden="true" />
            now hiring
          </span>

          <h1>
            we're hiring singles for
            <br />
            <span className="cycle-slot">
              {/* keyed so the entrance animation restarts on every word */}
              <em className="apply-em cycle-word" key={word}>
                {POSITIONS[word].cycle}
              </em>{" "}
              positions<span className="apply-dot">.</span>
            </span>
          </h1>

          <p className="apply-lede">no CV, no cover letter.</p>
          <p className="apply-explainer">
            apply below. we&apos;ll place you in a room with people worth
            talking to, no swiping, no profile browsing, just a real
            conversation.
          </p>

          <dl className="drive-stats">
            <div>
              <dt>open positions</dt>
              <dd>{POSITIONS.length}</dd>
            </div>
            <div>
              <dt>locations</dt>
              {/* Read off the same list the form's region field uses, so the
                  two can never disagree about where convoo actually runs. */}
              <dd className="is-word">
                {REGIONS.map((r) => r.label).join(" · ")}
              </dd>
            </div>
          </dl>
        </section>

        <section className="how-block">
          <div className="how-tracks">
            {TRACKS.map((t) => (
              <div className="how-track" key={t.heading}>
                <h2 className="squad-head">
                  {t.heading}
                  <span className="apply-dot">.</span>
                </h2>
                <ol className="how-list">
                  {t.steps.map((body, i) => (
                    <li key={body}>
                      <span className="how-n">{`0${i + 1}`}</span>
                      <span className="how-body">{body}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <p className="how-trust">free &middot; verified &middot; 18+</p>
        </section>

        <section className="squad-block">
          <h2 className="squad-head">
            open positions
            <span className="apply-dot">.</span>
          </h2>

          <ul className="group-grid">
            {POSITIONS.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => navigate(`/apply/${p.slug}`)}
                  className={
                    "group-tile" + (p.tone === "gold" ? " is-gold" : "")
                  }
                >
                  <span className="post-head">
                    <span className="post-ref">{p.ref}</span>
                    <span className="post-open">open</span>
                  </span>

                  <span className="group-name">{p.title}</span>
                  <span className="post-terms">{p.terms}</span>
                  <span className="group-blurb">{p.summary}</span>

                  <span className="group-foot">
                    <span className="group-count">
                      {(counts?.[p.slug] ?? 0) >= SHOW_COUNT_FROM
                        ? `${counts?.[p.slug]} applied`
                        : ""}
                    </span>
                    <span className="group-pick">view &amp; apply &rarr;</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="apply-foot">
        <nav className="apply-links" aria-label="more from convoo">
          {[
            ["contact", "/contact"],
            ["support", "/support"],
            ["terms", "/terms"],
            ["privacy", "/privacy"],
          ].map(([label, to]) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>
        <span className="apply-note">
          convoo is an equal opportunity introducer
        </span>
      </footer>

      {open && (
        <PositionModal position={open} onClose={() => navigate("/apply")} />
      )}
    </div>
  );
}
