import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { track } from "../lib/analytics";
import { POSITIONS, positionBySlug } from "./openPositions";
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

export default function Join() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const open = positionBySlug(slug);

  const [word, setWord] = useState(0);

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

          <dl className="drive-stats">
            <div>
              <dt>open positions</dt>
              <dd>{POSITIONS.length}</dd>
            </div>
          </dl>
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
