import React from "react";
import {
  CHARACTERS,
  FEATURED_CHARACTER_IDS,
  CharacterCard,
  CharacterId,
} from "./characters";
import { CityAtlas } from "./CityAtlas";
import { HowItWorks } from "./HowItWorks";
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
  zoya: "the adventurer",
  veer: "the charmer",
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

        {/* Social proof — directly above the grid where it matters */}
        <div className="poster-social">
          <div className="inner">
            <div className="dots">
              <span className="dot">V</span>
              <span className="dot">K</span>
              <span className="dot">A</span>
              <span className="dot">A</span>
            </div>
            <span>1,500+ in Pune &amp; Mumbai found their character</span>
          </div>
        </div>

        <HowItWorks />

        <div className="poster-starring-label">
          Pick One. Chat for 3 Minutes.
        </div>

        <div className="poster-cast-grid">
          {CHARACTERS.filter((c) => FEATURED_CHARACTER_IDS.includes(c.id)).map(
            (c) => (
              <CharacterCardButton
                key={c.id}
                character={c}
                dimmed={starting && startingId !== c.id}
                loading={starting && startingId === c.id}
                disabled={starting}
                onClick={() => !starting && onPick(c.id)}
              />
            ),
          )}
        </div>

        {error ? <div className="poster-error">{error}</div> : null}

        {/* City Atlas — live city × archetype data */}
        <CityAtlas />

        <div className="poster-coming-soon">
          COMING SOON TO A <span className="gold">HEART</span> NEAR YOU
        </div>
      </main>

    </div>
  );
};

interface CharacterCardButtonProps {
  character: CharacterCard;
  featured?: boolean;
  dimmed: boolean;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

const CharacterCardButton: React.FC<CharacterCardButtonProps> = ({
  character,
  featured,
  dimmed,
  loading,
  disabled,
  onClick,
}) => {
  const classes = [
    "poster-char",
    featured ? "featured" : "",
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
      {character.isNew && <div className="poster-char-new-badge">★ NEW</div>}
      {featured ? (
        <div className="poster-char-badge">★ Founder Pick</div>
      ) : null}
      <div className="poster-char-num">{character.number}</div>
      <div className="poster-avatar">
        {loading ? (
          <span className="initial">…</span>
        ) : (
          <img
            src={character.image}
            alt={character.name}
            className="poster-avatar-img"
          />
        )}
      </div>
      <h3 className="poster-char-name">{character.name.toUpperCase()}</h3>

      <div className="poster-char-meta">
        {character.age}
        <span className="accent"> ★ </span>
        {character.city.toUpperCase()}
      </div>
      <p className="poster-char-quote">{character.vibe}</p>
      <div className="poster-char-cta">CHAT →</div>
    </button>
  );
};
