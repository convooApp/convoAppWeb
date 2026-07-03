import React, { useEffect, useRef, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { CharacterId, getCharacterCard } from "./characters";
import { containsProfanity } from "./profanityFilter";
import "./meter-chat.css";
import "./meter-opener.css";

const CHARACTER_AS: Record<CharacterId, string> = {
  vedika: "the puneri",
  kaira: "the bandra baddie",
  ameya: "the founder type",
  aryan: "the gym romantic",
  zoya: "the adventurer",
  veer: "the charmer",
};

const CHARACTER_TRAITS: Record<CharacterId, string> = {
  vedika: "dry wit · soft but sharp · pune energy",
  kaira: "roaster · quick · zero patience for boring",
  ameya: "no-nonsense · direct · gym brain, sharp wit",
  aryan: "curious · nerdy · reads between every line",
  zoya: "high energy · spontaneous · bored by safe",
  veer: "smooth · self-aware · secretly tests you",
};

const CHARACTER_VIBE: Record<
  CharacterId,
  { dos: string[][]; donts: string[][] }
> = {
  vedika: {
    dos: [
      ["banter.", "she'll give it back double."],
      ["be specific.", "generic openers bore her instantly."],
      ["self-aware humour.", "don't take yourself too seriously."],
    ],
    donts: [
      ['"hey"', "— she'll reply with a period."],
      ["over-explaining.", "she finishes your sentences before you do."],
      ["trying to impress.", "she can smell it."],
    ],
  },
  kaira: {
    dos: [
      ["banter.", "roast her back, she's in."],
      ["weird specific takes.", "hills you'd die on."],
      ["self-aware humour.", "don't take yourself seriously."],
    ],
    donts: [
      ['"hey"', "— she'll reply with a period."],
      ["recycled pickup lines.", "she'll quote them back."],
      ["flirting before you've earned it.", ""],
    ],
  },
  ameya: {
    dos: [
      ["be direct.", "skip the warmup, get to the point."],
      ["gym takes.", "done right — not try-hard."],
      ["genuine curiosity.", "ask something real."],
    ],
    donts: [
      ["small talk.", "he's already zoned out."],
      ['"how\'s your day"', "— instant skip."],
      ["being soft.", "he respects people who show up."],
    ],
  },
  aryan: {
    dos: [
      ["ask something unusual.", "he lights up for it."],
      ["show you actually think.", "depth gets his attention."],
      ["light sarcasm.", "he catches everything."],
    ],
    donts: [
      ["surface-level openers.", "he's already three steps ahead."],
      ["one-word replies.", "he'll stop trying."],
      ["faking interest.", "he'll notice immediately."],
    ],
  },
  zoya: {
    dos: [
      ["spontaneous energy.", "match her pace."],
      ["travel or food takes.", "she has opinions."],
      ["say yes to something.", "literally anything."],
    ],
    donts: [
      ['"netflix and chill"', "— she's already in Goa."],
      ["playing it too safe.", "she gets bored fast."],
      ["overthinking your opener.", "she can tell."],
    ],
  },
  veer: {
    dos: [
      ["playful confidence.", "not arrogance — there's a difference."],
      ["an unexpected take.", "he respects originality."],
      ["match his energy.", "he notices when you do."],
    ],
    donts: [
      ["being boring.", "he'll charm his way out of the chat."],
      ["one-word answers.", "he needs someone to talk to, not at."],
      ["trying to out-charm him.", "you won't. work with it."],
    ],
  },
};

// Openers list — add entries here
const BORROWED_OPENERS: string[] = [
  "So… are we telling people we met here, or making up a cooler story?",
  "On a scale from 1 to America, how free are you this weekend?",
  "Quick, no thinking: two truths and a lie. Go!",
  "Warning: I’m bad at small talk. So… aliens: real or not?",
  "I’d say you’re out of my league, but I’m a good negotiator.",
  "You seem like someone who’d be worth breaking my bedtime for. True?",
  "If I dared you to plan our first date, what would it be?",
  "What’s one destination still on your bucket list?",
];

interface MeterOpenerBarrierProps {
  characterId: CharacterId;
  onRoll: (opener: string) => void;
  onBack: () => void;
  starting: boolean;
}

export const MeterOpenerBarrier: React.FC<MeterOpenerBarrierProps> = ({
  characterId,
  onRoll,
  onBack,
  starting,
}) => {
  const card = getCharacterCard(characterId);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [borrowOpen, setBorrowOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Same iOS visual-viewport lock as MeterChat
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("meter-chat-active");
    const setAppVh = () => {
      const vv = window.visualViewport;
      const h = vv?.height ?? window.innerHeight;
      const t = vv?.offsetTop ?? 0;
      root.style.setProperty("--app-vh", `${h}px`);
      root.style.setProperty("--app-vt", `${t}px`);
    };
    const resetScroll = () => {
      if (window.scrollX !== 0 || window.scrollY !== 0) window.scrollTo(0, 0);
    };
    setAppVh();
    resetScroll();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", setAppVh);
    vv?.addEventListener("scroll", setAppVh);
    window.addEventListener("orientationchange", setAppVh);
    window.addEventListener("scroll", resetScroll, { passive: true });
    return () => {
      root.classList.remove("meter-chat-active");
      root.style.removeProperty("--app-vh");
      root.style.removeProperty("--app-vt");
      vv?.removeEventListener("resize", setAppVh);
      vv?.removeEventListener("scroll", setAppVh);
      window.removeEventListener("orientationchange", setAppVh);
      window.removeEventListener("scroll", resetScroll);
    };
  }, []);

  const submit = () => {
    const text = draft.trim();
    if (!text || starting) return;
    if (containsProfanity(text)) {
      setError("let's keep it clean — pick different words and try again.");
      return;
    }
    setError(null);
    onRoll(text);
  };

  return (
    <RemoveScroll>
      <div className="chat-root" data-color={card.color}>
        <div className="chat-bg-warm" aria-hidden />
        <div className="chat-bg-noise" aria-hidden />

        <div className="scene-strip">
          <div className="scene-strip-left">
            <button
              type="button"
              className="pill pill--back"
              onClick={onBack}
              disabled={starting}
            >
              ← BACK
            </button>
            <span>TAKE 01 / DIALOGUE</span>
          </div>
          <div className="scene-strip-right">
            <span className="opener-waiting-label">starts on your opener</span>
            <span className="timer-display">3:00</span>
          </div>
        </div>

        <div className="char-billing">
          <div className="char-avatar">
            <img
              src={card.image}
              alt={card.name}
              className="char-avatar__img"
            />
          </div>
          <div className="char-info">
            <div className="starring">STARRING</div>
            <div className="name">
              {card.name.toUpperCase()}
              <span className="accent"> · </span>
              {card.age}
              <span className="accent"> · </span>
              {card.city.toUpperCase()}
            </div>
            <div className="meta">
              <span className="red">{CHARACTER_AS[card.id]}</span>
            </div>
          </div>
        </div>

        <main className="opener-main">
          <div className="briefing-card">
            <div className="briefing-label">★ &nbsp;THE BRIEFING&nbsp; ★</div>

            <p className="briefing-headline">
              you're about to slide into{" "}
              <span className="briefing-name">{card.name}'s</span> chat.
              <br />
            </p>

            {/* 3 horizontal steps */}
            <div className="briefing-steps">
              {[
                {
                  n: "1",
                  title: "DROP YOUR OPENER",
                  sub: "starts the 3-min clock",
                },
                {
                  n: "2",
                  title: "HOLD THE VIBE",
                  sub: "your opener sets the tone",
                },
                {
                  n: "3",
                  title: "GET READ",
                  sub: "persona card at the buzzer",
                },
              ].map((s) => (
                <div key={s.n} className="briefing-step">
                  <span className="briefing-step-num">{s.n}</span>
                  <div className="briefing-step-title">{s.title}</div>
                  <div className="briefing-step-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="briefing-footer">
              your opener matters most.{" "}
              <em className="briefing-footer-accent">
                It drives the whole reading.
              </em>
            </div>
          </div>
        </main>

        <div className="opener-bottom">
          <button
            type="button"
            className="borrow-trigger"
            onClick={() => setBorrowOpen(true)}
          >
            can't think of one? don't worry —
            <span className="borrow-cta"> ★ CLICK HERE BORROW AN OPENER →</span>
          </button>

          <form
            className="input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            {error ? <div className="chat-error">{error}</div> : null}
            <div
              className="input-wrap"
              data-empty={draft.trim() === "" ? "" : undefined}
            >
              <textarea
                ref={inputRef}
                className="chat-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value.slice(0, 1000))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="enter your opener here..."
                rows={1}
                disabled={starting}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="send-btn"
              disabled={!draft.trim() || starting}
            >
              {starting ? (
                "STARTING…"
              ) : (
                <>
                  ROLL<span className="arrow">→</span>
                </>
              )}
            </button>
          </form>
        </div>

        {borrowOpen && (
          <BorrowSheet
            onSelect={(opener) => {
              setDraft(opener);
              setBorrowOpen(false);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            onClose={() => setBorrowOpen(false)}
          />
        )}
      </div>
    </RemoveScroll>
  );
};

const BorrowSheet: React.FC<{
  onSelect: (opener: string) => void;
  onClose: () => void;
}> = ({ onSelect, onClose }) => (
  <div className="borrow-overlay" onClick={onClose}>
    <div className="borrow-sheet" onClick={(e) => e.stopPropagation()}>
      <div className="borrow-sheet-header">
        <div>
          <div className="borrow-sheet-title">BORROW AN OPENER</div>
          <div className="borrow-sheet-sub">
            tap one — it drops into your line. tweak it, then roll.
          </div>
        </div>
        <button type="button" className="borrow-close" onClick={onClose}>
          ✕ or write your own
        </button>
      </div>

      <div className="borrow-list">
        {BORROWED_OPENERS.length === 0 ? (
          <div className="borrow-empty">
            openers coming soon — write your own for now.
          </div>
        ) : (
          BORROWED_OPENERS.map((opener, i) => (
            <button
              key={i}
              type="button"
              className="borrow-item"
              onClick={() => onSelect(opener)}
            >
              <span className="borrow-item-text">"{opener}"</span>
              <span className="borrow-use">↩</span>
            </button>
          ))
        )}
      </div>
    </div>
  </div>
);
