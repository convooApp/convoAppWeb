import React, { useEffect, useRef, useState } from "react";
import {
  CHARACTERS,
  FEATURED_CHARACTER_IDS,
  CharacterCard,
  CharacterId,
} from "./characters";
import { HowItWorks } from "./HowItWorks";
import "./meter-poster.css";

interface MeterIntroProps {
  onPick: (id: CharacterId) => void;
  starting: boolean;
  startingId: CharacterId | null;
  error: string | null;
  onSkip?: () => void;
}

export const MeterIntro: React.FC<MeterIntroProps> = ({
  onPick,
  starting,
  startingId,
  error,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const [stickyOn, setStickyOn] = useState(false);

  // Ticker duplication + scroll reveal + sticky CTA
  useEffect(() => {
    const tick = document.getElementById("meter-tick");
    if (tick) tick.innerHTML += tick.innerHTML;

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("rv-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(".meter-root .rv")
      .forEach((el) => io.observe(el));

    const hero = heroRef.current;
    if (hero) {
      const stickyObs = new IntersectionObserver(
        ([e]) => setStickyOn(!e.isIntersecting),
        { threshold: 0 },
      );
      stickyObs.observe(hero);
      return () => {
        io.disconnect();
        stickyObs.disconnect();
      };
    }
    return () => io.disconnect();
  }, []);

  const scrollToCast = () =>
    document
      .getElementById("meter-cast")
      ?.scrollIntoView({ behavior: "smooth" });

  const featured = CHARACTERS.filter((c) =>
    FEATURED_CHARACTER_IDS.includes(c.id),
  );

  return (
    <div className="meter-root">
      {/* ── TICKER ───────────────────────────────────────────────── */}
      {/* <div className="meter-ticker" aria-hidden="true">
        <div className="meter-ticker__track" id="meter-tick">
          ★ FREE IN 3 MINUTES <span className="r">●</span> NO ACCOUNT NEEDED <span className="r">●</span> 2,000+ READINGS DONE <span className="r">●</span> YOUR OPENER REVEALS EVERYTHING <span className="r">●</span> FIND OUT IF YOU HAVE RIZZ <span className="r">●</span>&nbsp;
        </div>
      </div> */}

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <header className="meter-hero" ref={heroRef}>
        <p className="meter-hero__pres">
          Convoo Labs proudly <b>presents…</b>
        </p>
        <h1>
          <span className="meter-hero__title">
            CONV<span className="oo">OO</span>ERSATION
          </span>
          <span className="meter-hero__title2">METER.</span>
        </h1>
        <p className="meter-hero__tag">
          find out if you actually have rizz
          <b>3 MINUTES. FREE. NO SIGNUP.</b>
        </p>

        <button
          className="meter-cta"
          onClick={scrollToCast}
          disabled={starting}
        >
          TEST MY CONVERSATION GAME
        </button>

        <div className="meter-hero__proof">
          <span className="meter-hero__dots">
            <span style={{ background: "#a8123c" }}>K</span>
            <span style={{ background: "#8a6a1a" }}>A</span>
            <span style={{ background: "#c85a3a" }}>Z</span>
            <span style={{ background: "#2c6e6a" }}>V</span>
          </span>
          2,000+ PEOPLE ALREADY KNOW THEIR STYLE
        </div>

        <p className="meter-hero__makers">
          from the makers of <b>Convoo</b> — the app that prioritizes
          conversations.
        </p>

        <div className="meter-hero__cards" aria-label="Sample result cards">
          <div className="meter-rcard meter-rcard--l">
            <div className="meter-rcard__stars">★★★★★</div>
            <div className="meter-rcard__name">Geet</div>
            <div className="meter-rcard__from">FROM · JAB WE MET</div>
            <div className="meter-rcard__q">"you brought the whole vibe"</div>
          </div>
          <div className="meter-rcard meter-rcard--r">
            <div className="meter-rcard__stars">★★★★★</div>
            <div className="meter-rcard__name">Jordan</div>
            <div className="meter-rcard__from">FROM · ROCKSTAR</div>
            <div className="meter-rcard__q">"it chased you."</div>
          </div>
        </div>
        <span className="meter-hero__which">which one are you? ↓</span>
      </header>

      {/* ── CAST ─────────────────────────────────────────────────── */}
      <section className="meter-cast" id="meter-cast">
        <p className="meter-kick rv">★ SCENE ONE · THE CAST ★</p>
        <h2 className="meter-sechead rv">
          YOU HAVE <span className="em">4 UNREAD MESSAGES.</span>
        </h2>
        <p className="meter-secsub rv">
          pick one to reply. your first line starts the reading
        </p>

        <div className="meter-inbox rv">
          <div className="meter-inbox__header">
            <span>★ CONVOO METER · INBOX</span>
            <span className="meter-inbox__count">
              {featured.length} waiting
            </span>
          </div>
          <div className="meter-inbox__list">
            {featured.map((c, i) => (
              <InboxRow
                key={c.id}
                character={c}
                dimmed={starting && startingId !== c.id}
                loading={starting && startingId === c.id}
                disabled={starting}
                onClick={() => !starting && onPick(c.id)}
                isLast={i === featured.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="meter-testi">
        <p className="meter-kick rv">★ WHAT PEOPLE ARE SAYING ★</p>
        <h2 className="meter-sechead rv">
          REAL <span className="em">REACTIONS.</span>
        </h2>
        <div className="meter-testi__row rv">
          <div className="meter-testi__card">
            <p className="meter-testi__q">
              "sent it to my situationship and they said 'okay this is literally
              you 😭' — the accuracy was painful"
            </p>
            <p className="meter-testi__who">— @priyanka_reads · Mumbai</p>
          </div>
          <div className="meter-testi__card">
            <p className="meter-testi__q">
              "i got jordan and my friends lost their minds. screenshotted
              immediately and it's now my instagram story"
            </p>
            <p className="meter-testi__who">— @arjun.exe · Pune</p>
          </div>
          <div className="meter-testi__card">
            <p className="meter-testi__q">
              "did this at 1am, made my whole friend group do it. we now know
              exactly who has rizz and who does not"
            </p>
            <p className="meter-testi__who">— @neha_vibes ·Pune</p>
          </div>
        </div>
      </section>

      {/* ── BANNER ───────────────────────────────────────────────── */}
      <div className="meter-banner rv">
        ★ &nbsp;COMING SOON TO A <span className="h">HEART</span> NEAR YOU&nbsp;
        ★
      </div>

      {/* ── CLOSER ───────────────────────────────────────────────── */}
      <section className="meter-closer">
        <h2 className="meter-closer__big rv">
          THINK YOU{" "}
          <span className="em">
            HAVE
            <br />
            RIZZ?
          </span>
        </h2>
        <p className="meter-closer__sub rv">
          2,000+ people already know their style. yours takes 3 minutes —
          completely free.
        </p>
        <button
          className="meter-cta rv"
          onClick={scrollToCast}
          disabled={starting}
        >
          PROVE IT IN 3 MINUTES →
        </button>
      </section>

      {error && <div className="meter-error">{error}</div>}

      {/* ── STICKY MOBILE CTA ────────────────────────────────────── */}
      <div className={`meter-sticky${stickyOn ? " on" : ""}`}>
        <div className="meter-sticky__txt">
          DO YOU HAVE RIZZ?
          <br />3 MIN · FREE · NO SIGNUP ★
        </div>
        <button
          className="meter-sticky__btn"
          onClick={scrollToCast}
          disabled={starting}
        >
          FIND OUT NOW →
        </button>
      </div>
    </div>
  );
};

/* ── Inbox row ───────────────────────────────────────────────────── */

interface InboxRowProps {
  character: CharacterCard;
  dimmed: boolean;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  isLast: boolean;
}

const InboxRow: React.FC<InboxRowProps> = ({
  character,
  dimmed,
  loading,
  disabled,
  onClick,
  isLast,
}) => {
  const cls = [
    "meter-inbox__row",
    dimmed ? "is-dimmed" : "",
    loading ? "is-loading" : "",
    isLast ? "is-last" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={cls}
      data-color={character.color}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="meter-inbox__avatar">
        {loading ? (
          <span className="meter-inbox__avatar-initial">…</span>
        ) : (
          <img src={character.image} alt={character.name} loading="lazy" />
        )}
        {character.isNew && <span className="meter-inbox__new">NEW</span>}
      </div>

      <div className="meter-inbox__body">
        <div className="meter-inbox__name-row">
          <span className="meter-inbox__name">
            {character.name.toUpperCase()}
          </span>
          <span className="meter-inbox__meta">
            THE {character.number} · {character.age} ·{" "}
            {character.city.toUpperCase()}
          </span>
        </div>
        <p className="meter-inbox__quote">"{character.vibe}"</p>
      </div>

      <div className="meter-inbox__right">
        <span className="meter-inbox__time">now</span>
        <span className="meter-inbox__dot">1</span>
      </div>
    </button>
  );
};
