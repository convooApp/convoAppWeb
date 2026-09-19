import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AppStoreButtons } from "../components/AppStoreButtons";
import { track } from "../lib/analytics";
import "./plain-home.css";

/* ------------------------------------------------------------------
   The plain homepage.

   The storybook version is a better object than this one — but it asks for
   seven clicks before it says what Convoo is, and the numbers showed people
   leaving before the second page. This says it in the first sentence, in the
   order somebody unfamiliar actually asks: what is it, how does it work, why
   is it different, what do I do next.

   Nothing here is clever on purpose. The book still lives at /story.
   ------------------------------------------------------------------ */

const TITLE = "Convoo — Talk first. See photos after.";

const STEPS = [
  {
    n: "01",
    title: "Join a room",
    body: "Rooms open at a set time and everyone joins at once, so there is nobody to wait around for.",
  },
  {
    n: "02",
    title: "Talk for three minutes",
    body: "You are paired with one person and given something to start from. No photo, no profile, no bio to skim.",
  },
  {
    n: "03",
    title: "Decide together",
    body: "At zero you each say yes or no. Photos and answers arrive in the same moment — and it is only a match if you both said yes.",
  },
];

const REASONS = [
  {
    title: "No swiping",
    body: "You never scroll a grid of faces. One person at a time, and an actual conversation.",
  },
  {
    title: "Photos come last",
    body: "You decide on how it felt to talk to someone, not on whether their third photo caught them at a good angle.",
  },
  {
    title: "A no stays private",
    body: "A match takes two yeses. If it was not mutual, the other person is never told who passed.",
  },
];

const FAQ = [
  {
    q: "Is it free?",
    a: "Yes. Joining a room and having a conversation costs nothing.",
  },
  {
    q: "Do I need photos?",
    a: "You add one, and it stays hidden until you have both said yes. Nobody browses it beforehand.",
  },
  {
    q: "What if the conversation is awkward?",
    a: "It lasts three minutes and then it ends on its own. That is most of the point.",
  },
  {
    q: "Who can see that I am there?",
    a: "Only the person you are talking to, and only for those three minutes. Convoo is 18+ and face verified.",
  },
];

export default function PlainHome() {
  useEffect(() => {
    const previous = document.title;
    document.title = TITLE;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="ph">
      <header className="ph-top">
        <span className="ph-brand">
          convoo<span className="ph-dot">.</span>
        </span>
        <nav className="ph-nav">
          <a href="#how">How it works</a>
          <a href="#faq">FAQ</a>
          <Link
            className="ph-cta ph-cta--sm"
            to="/download-now"
            onClick={() =>
              track("cta_click", { cta: "get_app", placement: "home_masthead" })
            }
          >
            Get the app
          </Link>
        </nav>
      </header>

      <main>
        <section className="ph-hero">
          <h1>
            Talk first.
            <br />
            See photos <em>after</em>.
          </h1>
          <p className="ph-lede">
            Convoo is a dating app built around one three-minute conversation.
            No swiping and no profiles to browse — you meet someone by actually
            talking to them.
          </p>
          <div className="ph-actions">
            <Link
              className="ph-cta"
              to="/download-now"
              onClick={() =>
                track("cta_click", { cta: "get_app", placement: "home_hero" })
              }
            >
              Get the app
            </Link>
            <a className="ph-ghost" href="#how">
              See how it works
            </a>
          </div>
          <p className="ph-trust">Free · Face verified · 18+</p>
        </section>

        <section className="ph-section" id="how">
          <h2>How it works</h2>
          <ol className="ph-steps">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="ph-n">{s.n}</span>
                <span className="ph-step-title">{s.title}</span>
                <span className="ph-step-body">{s.body}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="ph-section">
          <h2>Why it is different</h2>
          <div className="ph-cards">
            {REASONS.map((r) => (
              <div className="ph-card" key={r.title}>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The drive is the one thing currently bringing people in, so the
            homepage should hand people to it rather than compete with it. */}
        <section className="ph-band">
          <div>
            <h2>Rooms are forming now</h2>
            <p>
              We are putting the next rooms together in India. Tell us who you
              are and we will send you a slot.
            </p>
          </div>
          <Link
            className="ph-cta"
            to="/apply"
            onClick={() =>
              track("cta_click", { cta: "apply", placement: "home_band" })
            }
          >
            Apply for a room
          </Link>
        </section>

        <section className="ph-section" id="faq">
          <h2>Questions</h2>
          <dl className="ph-faq">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ph-close">
          <h2>Ready when you are</h2>
          <p className="ph-lede">
            The next room does not need you to plan anything. Download the app
            and turn up.
          </p>
          <div className="ph-stores">
            <AppStoreButtons />
          </div>
        </section>
      </main>

      <footer className="ph-foot">
        <nav className="ph-links" aria-label="more from convoo">
          {[
            ["Contact", "/contact"],
            ["Support", "/support"],
            ["Terms", "/terms"],
            ["Privacy", "/privacy"],
            ["Child safety", "/child-safety"],
          ].map(([label, to]) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>
        <span className="ph-note">
          © {new Date().getFullYear()} Convoo · It starts with a conversation
        </span>
      </footer>
    </div>
  );
}
