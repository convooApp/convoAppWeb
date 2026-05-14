import React from "react";
import { CHARACTERS, CharacterCard, CharacterId } from "./characters";
import "./meter-poster.css";

interface MeterIntroProps {
  onPick: (id: CharacterId) => void;
  starting: boolean;
  startingId: CharacterId | null;
  error: string | null;
  onSkip?: () => void;
}

// Maps a character's `as` ("the bandra baddie", etc.) — keeps the
// poster-style copy in one place instead of scattered across the JSX.
const CHARACTER_AS: Record<CharacterId, string> = {
  vedika: "the puneri",
  kaira: "the bandra baddie",
  ameya: "the founder type",
  aryan: "the gym romantic",
};

export const MeterIntro: React.FC<MeterIntroProps> = ({
  onPick,
  starting,
  startingId,
  error,
  onSkip,
}) => {
  const pickDefault = () => {
    if (!starting) onPick("vedika");
  };

  return (
    <div className="poster-root">
      <div className="poster-bg-warm" aria-hidden />
      <div className="poster-bg-noise" aria-hidden />

      <div className="poster-sunburst" aria-hidden>
        <svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg">
          <g
            stroke="#c41e3a"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.45"
          >
            <line x1="400" y1="380" x2="400" y2="20" />
            <line x1="400" y1="380" x2="320" y2="40" />
            <line x1="400" y1="380" x2="480" y2="40" />
            <line x1="400" y1="380" x2="240" y2="80" />
            <line x1="400" y1="380" x2="560" y2="80" />
            <line x1="400" y1="380" x2="160" y2="140" />
            <line x1="400" y1="380" x2="640" y2="140" />
            <line x1="400" y1="380" x2="80" y2="220" />
            <line x1="400" y1="380" x2="720" y2="220" />
            <line x1="400" y1="380" x2="20" y2="320" />
            <line x1="400" y1="380" x2="780" y2="320" />
          </g>
          <g
            stroke="#B83280"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.35"
          >
            <line x1="400" y1="380" x2="360" y2="20" />
            <line x1="400" y1="380" x2="440" y2="20" />
            <line x1="400" y1="380" x2="280" y2="60" />
            <line x1="400" y1="380" x2="520" y2="60" />
            <line x1="400" y1="380" x2="200" y2="100" />
            <line x1="400" y1="380" x2="600" y2="100" />
          </g>
        </svg>
      </div>

      {/* <nav className="poster-nav">
        <div className="poster-logo">
          CONV<span className="pink">OO</span>
        </div>
        <div className="poster-nav-meta">
          VOL. <span className="red">01</span> · ISSUE 04
        </div>
        {onSkip ? (
          <button type="button" className="poster-nav-cta" onClick={onSkip}>
            ★ SKIP
          </button>
        ) : (
          <a href="#take-the-meter" className="poster-nav-cta">
            ★ JOIN LIST
          </a>
        )}
      </nav> */}

      <main className="poster-main">
        <p className="poster-presents">
          Convoo Labs proudly <span className="pink">presents</span>...
        </p>

        <h1 className="poster-wordmark">
          <span className="row-1">
            CONV<span className="pink">OO</span>ERSATION
          </span>
          <span className="row-2">METER.</span>
        </h1>

        <p className="poster-subline">
          "get your <em>CONVERSATION STYLE</em> in just three minutes."
        </p>

        <div className="poster-tagline-line">
          <span className="star">★</span>TEXT FIRST
          <span className="star">★</span>
        </div>

        <div className="poster-starring-label">
          Choose Who Do You Wanna Date
        </div>
        <p className="poster-starring-sub">
          Pick someone to start the conversation
        </p>

        <div className="poster-cast-grid">
          {CHARACTERS.map((c) => (
            <CharacterCardButton
              key={c.id}
              character={c}
              dimmed={starting && startingId !== c.id}
              loading={starting && startingId === c.id}
              disabled={starting}
              onClick={() => !starting && onPick(c.id)}
            />
          ))}
        </div>

        {error ? <div className="poster-error">{error}</div> : null}

        <div className="poster-coming-soon">
          COMING SOON TO A <span className="gold">HEART</span> NEAR YOU
        </div>
      </main>
    </div>
  );
};

interface CharacterCardButtonProps {
  character: CharacterCard;
  dimmed: boolean;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

const CharacterCardButton: React.FC<CharacterCardButtonProps> = ({
  character,
  dimmed,
  loading,
  disabled,
  onClick,
}) => {
  const classes = [
    "poster-char",
    dimmed ? "is-dimmed" : "",
    loading ? "is-loading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      onClick={onClick}
      data-color={character.color}
      className={classes}
      disabled={disabled}
    >
      <div className="poster-char-num">{character.number}</div>
      <div className="poster-avatar">
        <span className="initial">{loading ? "…" : character.name[0]}</span>
      </div>
      <h3 className="poster-char-name">{character.name.toUpperCase()}</h3>

      <div className="poster-char-meta">
        {character.age}
        <span className="accent"> ★ </span>
        {character.city.toUpperCase()}
      </div>
      <p className="poster-char-quote">{character.vibe}</p>
    </button>
  );
};
