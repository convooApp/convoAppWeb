import { useEffect } from "react";
import { Link } from "react-router-dom";
import { StoreLinks } from "../components/StoreLinks";
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

/* The hero carries the feeling; the tab title carries the search terms, which
   is why this says "dating app" and the headline does not have to. */
const TITLE = "Convoo — The dating app where you talk first";

/* Two ways in, because the product has two of them. The single joins a room;
   the matchmaker opens one. Presenting only the first left the host side —
   and the /apply-to-host page behind it — invisible from the homepage. */
const TRACKS = [
  {
    heading: "Join an event or a room",
    note: "For anyone who wants to meet someone.",
    steps: [
      {
        title: "Turn up",
        body: "Open the app when tonight's event starts, or tap the invite to a friend's room.",
      },
      {
        title: "Talk for three minutes",
        body: "You are paired with one person and given something to start from. No photo, no profile, no bio to skim.",
      },
      {
        title: "Decide together",
        body: "Photos and answers arrive in the same moment, and it is only a match if you both said yes.",
      },
    ],
  },
  {
    heading: "Host your own room",
    note: "For anyone whose friends are the single ones.",
    steps: [
      {
        title: "Pick a night",
        body: "Tell us when you want it and we set the room up for you. Everyone joins at the same time.",
      },
      {
        title: "Invite whoever you want",
        body: "Your friends, your community, your run club. Distance does not matter inside a room.",
      },
      {
        title: "We do the pairing",
        body: "Convoo pairs people up inside your room, three minutes each. You just bring the people.",
      },
    ],
    cta: { label: "Apply to host", to: "/apply-to-host" },
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
          <StoreLinks variant="compact" placement="home_masthead" />
        </nav>
      </header>

      <main>
        <section className="ph-hero">
          {/* The book cover's line. It states the whole argument for the
              product in nine words, which no description of the mechanic
              managed to do. */}
          <h1>
            Photos are easy to fake.
            <br />
            Conversations <em>aren&apos;t</em>.
          </h1>
          <p className="ph-lede">
            Convoo is a dating app built on one three-minute conversation. No
            swiping, no profiles to scroll — you both decide after you have
            actually talked.
          </p>
          <div className="ph-actions">
            <StoreLinks placement="home_hero" />
            <a className="ph-ghost" href="#how">
              See how it works
            </a>
          </div>
          <p className="ph-trust">Free · Face verified · 18+</p>
        </section>

        <section className="ph-section" id="how">
          <h2>How it works</h2>
          <div className="ph-tracks">
            {TRACKS.map((t) => (
              <div className="ph-track" key={t.heading}>
                <h3>{t.heading}</h3>
                <p className="ph-track-note">{t.note}</p>
                <ol className="ph-steps">
                  {t.steps.map((s, i) => (
                    <li key={s.title}>
                      <span className="ph-n">{`0${i + 1}`}</span>
                      <span className="ph-step-title">{s.title}</span>
                      <span className="ph-step-body">{s.body}</span>
                    </li>
                  ))}
                </ol>
                {t.cta && (
                  <Link
                    className="ph-track-cta"
                    to={t.cta.to}
                    onClick={() =>
                      track("cta_click", {
                        cta: "apply_to_host",
                        placement: "home_how",
                      })
                    }
                  >
                    {t.cta.label} &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
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
            <StoreLinks placement="home_close" />
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
