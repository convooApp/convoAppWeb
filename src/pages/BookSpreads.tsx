import { Link } from "react-router-dom";
import { GraduationCap, Instagram } from "lucide-react";

/* ------------------------------------------------------------------
   The right-hand pages.

   Kept addressable by number rather than inlined, because a page turn
   needs to draw two of them at once: the destination lying on the book,
   and the one you are leaving printed on the face of the sheet that is
   swinging away. Rendering the departing page on the sheet is what
   removes the swap — the reader never sees content change, only paper
   move off it.
   ------------------------------------------------------------------ */

const INSTAGRAM_URL = "https://www.instagram.com/convooindia/";
const AMBASSADOR_URL = "https://forms.gle/pwpZ5nQ8xFRs1qDf9";

type TeamPhotoProps = { name: string; src?: string };

/* Team headshots aren't shot yet — until they are, fall back to an initial
   in the same circle so the layout doesn't shift when they land. */
function TeamPhoto({ name, src }: TeamPhotoProps) {
  if (src) return <img className="team-photo" src={src} alt={name} />;
  return (
    <span className="team-photo" aria-hidden="true">
      {name.charAt(0)}
    </span>
  );
}

type StepProps = {
  n: number;
  title: string;
  desc: string;
  gold?: boolean;
  last?: boolean;
};

function Step({ n, title, desc, gold, last }: StepProps) {
  return (
    <div className={gold ? "step step--gold" : "step"}>
      <span className="step-rail">
        <span className="step-num">{n}</span>
        {!last && <span className="step-line" />}
      </span>
      <span className="step-body">
        <span className="step-title">{title}</span>
        <span className="step-desc">{desc}</span>
      </span>
    </div>
  );
}

/** The closing prologue. Drawn on the verso of the last spread, and inline on
    phones where there is no verso to draw it on. */
export function PrologueText() {
  return (
    <>
      <span className="kicker">chapter five &middot; prologue, at the end</span>
      <h2>
        because your story hasn't <em className="em">started yet.</em>
      </h2>
      <p className="prose prose--airy">
        a prologue belongs at the beginning, but you needed to read the rest
        first to believe this part. somewhere out there is a person who would
        pick you out of a hundred conversations, and keeps not finding you
        because your third photo isn't your best angle.
      </p>
      <p className="prose prose--airy">
        convoo is three minutes of talking to a stranger who signed up for the
        same leap. no swiping, no profiles, no audience. photos at the end, a
        match only if you both say yes, and nobody's night ruined if you don't.
      </p>
      <span className="aside">somewhere, someone is about to show up.</span>
    </>
  );
}

export default function Spread({
  n,
  go,
}: {
  n: number;
  go: (page: number) => void;
}) {
  /* --- 0 · cover --- */
  if (n === 0)
    return (
      <div className="spread spread--cover">
        <div className="cover-scrim" />
        <div className="cover-inner">
          <div className="cover-head">
            <span className="cover-mark">
              convoo<span className="brand-dot">.</span>
            </span>
            <span className="cover-tagline">date differently.</span>
          </div>
          <div className="cover-foot">
            <h1 className="cover-title">
              stop judging
              <br />
              <em className="em em--pink">the cover.</em>
            </h1>
            <span className="cover-sub">
              photos are easy to fake. a real conversation isn't.
            </span>
            <span className="cover-next" aria-hidden="true">
              &rarr;
            </span>
          </div>
        </div>
      </div>
    );

  /* --- 1 · index --- */
  if (n === 1)
    return (
      <div className="spread spread--paper is-roomy">
        <span className="kicker">index</span>

        <button className="index-row" onClick={() => go(2)}>
          <span className="index-chapter">chapter one</span>
          <span className="index-title">how this works</span>
          <span className="index-dots" />
          <span className="index-folio">p. 2</span>
        </button>
        <button className="index-row" onClick={() => go(3)}>
          <span className="index-chapter">chapter two</span>
          <span className="index-title">if you're single</span>
          <span className="index-dots" />
          <span className="index-folio">p. 3</span>
        </button>
        <button className="index-row" onClick={() => go(4)}>
          <span className="index-chapter index-chapter--gold">
            chapter three
          </span>
          <span className="index-title">if you're hosting</span>
          <span className="index-dots" />
          <span className="index-folio">p. 4</span>
        </button>
        <button className="index-row" onClick={() => go(5)}>
          <span className="index-chapter">chapter four</span>
          <span className="index-title">who we are</span>
          <span className="index-dots" />
          <span className="index-folio">p. 5</span>
        </button>
        <button className="index-row" onClick={() => go(6)}>
          <span className="index-chapter">chapter five</span>
          <span className="index-title">prologue, at the end</span>
          <span className="index-dots" />
          <span className="index-folio">p. 6</span>
        </button>
      </div>
    );

  /* --- 2 · your roles --- */
  if (n === 2)
    return (
      <div className="spread spread--paper">
        <span className="kicker">chapter one &middot; your roles</span>
        <h1>
          everyone in this story plays one of two <em className="em">roles.</em>
        </h1>

        <button className="role-card" onClick={() => go(3)}>
          <span className="role-copy">
            <span className="role-name">
              the single<span className="role-dot">.</span>
            </span>
            <span className="role-desc">
              you're here to meet someone. events every night, rooms when you're
              invited.
            </span>
          </span>
          <span className="role-jump">p. 3 &rarr;</span>
        </button>

        <button className="role-card role-card--gold" onClick={() => go(4)}>
          <span className="role-copy">
            <span className="role-name">
              the matchmaker<span className="role-dot role-dot--gold">.</span>
            </span>
            <span className="role-desc">
              you're not single, your friends are. you open a room and bring
              them together.
            </span>
          </span>
          <span className="role-jump role-jump--gold">p. 4 &rarr;</span>
        </button>

        <p className="aside">
          both roles meet in the same place: a conversation.
        </p>
      </div>
    );

  /* --- 3 · the singles --- */
  if (n === 3)
    return (
      <div className="spread spread--paper">
        <span className="kicker">chapter two &middot; the singles</span>
        <h2 className="is-tight">
          meet the <em className="em">person</em> before the photo.
        </h2>
        <span className="lede">
          join tonight's event or a room you're invited to. either way, it goes
          like this:
        </span>

        <div className="steps">
          <Step
            n={1}
            title="walk in"
            desc="show up to the event, or tap your invite."
          />
          <Step
            n={2}
            title="you're paired"
            desc="one on one with a stranger. no profiles, no swiping."
          />
          <Step
            n={3}
            title="talk for three minutes"
            desc="a topic to start from. it stops being scary thirty seconds in."
          />
          <Step
            n={4}
            title="the reveal, at 0:00"
            desc="photos and your yes or no land at the same moment."
          />
          <Step
            n={5}
            gold
            last
            title="mutual only"
            desc="both said yes? it's a match. nobody ever finds out who passed."
          />
        </div>
      </div>
    );

  /* --- 4 · the matchmakers --- */
  if (n === 4)
    return (
      <div className="spread spread--paper">
        <span className="kicker kicker--gold">
          chapter three &middot; the rooms
        </span>
        <h2 className="is-tight">
          be the reason two people <em className="em em--gold">meet.</em>
        </h2>
        <span className="lede">
          a room is a night you open for the people you know. three easy steps:
        </span>

        <div className="steps">
          <Step
            n={1}
            gold
            title="pick a night"
            desc="everyone joins at the same time."
          />
          <Step
            n={2}
            gold
            title="invite your friends"
            desc="whoever you want. distance doesn't matter in a room."
          />
          <Step
            n={3}
            gold
            last
            title="they talk for three minutes"
            desc="profiles show only after the chat, and a match happens only on a mutual yes."
          />
        </div>

        <span className="lede lede--strong">
          convoo does the pairing inside your room. you just bring the people.
        </span>
      </div>
    );

  /* --- 5 · who are we --- */
  if (n === 5)
    return (
      <div className="spread spread--paper is-generous">
        <span className="kicker">chapter four &middot; who are we?</span>
        <h2>
          the friends who introduce <em className="em">everyone.</em>
        </h2>
        <p className="prose">
          we're a small team building convoo, tired of watching great people get
          skipped for their worst photo. so we built the app we wished existed:
          one where the conversation goes first.
        </p>

        <div className="team-grid">
          <div className="team-card">
            <TeamPhoto name="chinmay" />
            <span className="team-id">
              <span className="team-name">Chinmay</span>
              <span className="team-role">founder</span>
            </span>
            <span className="team-quote">
              &ldquo;i kept watching people getting judged by their
              photos.&rdquo;
            </span>
          </div>

          <div className="team-card team-card--gold">
            <TeamPhoto name="nivedita" />
            <span className="team-id">
              <span className="team-name">Nivedita</span>
              <span className="team-role team-role--gold">social media</span>
            </span>
            <span className="team-quote">
              &ldquo;when two strangers hit it off in a room, making sure the
              world hears about it is my whole job.&rdquo;
            </span>
          </div>
        </div>

        <p className="aside">
          every match we make is the introduction we wish someone had made for
          us.
        </p>
      </div>
    );

  /* --- 6 · prologue --- */
  if (n === 6)
    return (
      <div className="spread spread--paper is-prose is-closing">
        {/* The prologue lives on the verso, opposite this page. Phones never
            draw a verso, so it is repeated here for them and hidden on any
            screen wide enough to show the real one. */}
        <div className="only-narrow">
          <PrologueText />
        </div>

        <span className="kicker">the last page</span>
        <h2>See you tonight !</h2>
        <p className="prose prose--airy">
          someone in there is hoping you show up, and neither of you knows it
          yet.
        </p>

        <div className="closing-actions">
          <Link className="btn-primary" to="/download-now">
            get the app
          </Link>
          <a
            className="icon-link"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="convoo on instagram"
          >
            <Instagram size={19} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>

        <a
          className="link-feature"
          href={AMBASSADOR_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="link-feature-icon" aria-hidden="true">
            <GraduationCap size={19} strokeWidth={2.2} />
          </span>
          <span className="link-feature-copy">
            <span className="link-feature-name">be a campus ambassador</span>
            <span className="link-feature-note">
              run convoo at your college. applications are open.
            </span>
          </span>
          <span className="link-feature-go" aria-hidden="true">
            &#8599;
          </span>
        </a>

        <nav className="link-row" aria-label="more from convoo">
          <Link to="/contact">contact</Link>
          <Link to="/support">support</Link>
          <Link to="/terms">terms</Link>
          <Link to="/privacy">privacy</Link>
        </nav>

        <span className="closing-note">
          free to join &middot; face verified
        </span>
      </div>
    );
  return null;
}
