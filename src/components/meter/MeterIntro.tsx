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

        <p className="poster-frame-line">
          Pick a character. Chat for 3 minutes.{" "}
          <b>Find out who you'd actually click with</b> — and get a share card
          you'll want to show off.
        </p>

        <div className="poster-tagline-line">
          <span className="star">★</span>CONVERSATION FIRST
          <span className="star">★</span>
        </div>

        <div className="poster-social">
          <div className="inner">
            <div className="dots">
              <span className="dot">V</span>
              <span className="dot">K</span>
              <span className="dot">A</span>
              <span className="dot">A</span>
            </div>
            <span>2,300+ in Pune &amp; Mumbai found their character</span>
          </div>
        </div>

        <div className="poster-starring-label">Pick Who You Wanna Date</div>
        <p className="poster-starring-sub">
          Each one's a real conversation. You'll know in three minutes.
        </p>

        <div className="poster-cast-grid">
          {CHARACTERS.map((c) => (
            <CharacterCardButton
              key={c.id}
              character={c}
              // featured={c.id === "kaira" || c.id === "ameya"}
              dimmed={starting && startingId !== c.id}
              loading={starting && startingId === c.id}
              disabled={starting}
              onClick={() => !starting && onPick(c.id)}
            />
          ))}
        </div>

        {error ? <div className="poster-error">{error}</div> : null}

        <section className="poster-share-section">
          <div className="poster-starring-label">
            Your Result, Ready To Share
          </div>
          <p className="poster-share-sub">
            A share card drops at the end.{" "}
            <b>Post it. See who else got the same energy.</b>
          </p>

          <div className="poster-share-grid">
            <div className="ig-phone">
              <div className="ig-screen">
                <div className="ig-top">
                  <div className="ig-progress">
                    <span className="active" />
                    <span />
                    <span />
                  </div>
                  <div className="ig-header">
                    <div className="ig-avatar">
                      <div className="ig-avatar-inner">A</div>
                    </div>
                    <div className="ig-user">
                      maya.r <span className="time">2h</span>
                    </div>
                    <div className="ig-actions">⋯</div>
                  </div>
                </div>
                <div className="ig-content">
                  <div className="ig-card">
                    <div className="ig-card-top">
                      <div></div>
                      <div className="ig-pg">no. 04</div>
                    </div>
                    <div className="ig-mid">
                      <div className="ig-name">Geet.</div>
                      <div className="ig-from">From Jab We Met</div>
                      <div className="ig-quote">
                        "Apni favourite ho tum. Talkative, fearless, impossible
                        to fake. You brought the whole vibe and no one was going
                        to slow you down."
                      </div>
                    </div>
                    <div className="ig-foot">
                      <div className="ig-foot-what">
                        take the
                        <br />
                        <b>Convooersation Meter</b>
                      </div>
                      <div className="ig-foot-url">convoo.app</div>
                    </div>
                  </div>
                </div>
                <div className="ig-bottom">
                  <div className="ig-message">Send message</div>
                  <div className="ig-share-ic">♡</div>
                  <div className="ig-share-ic">↗</div>
                </div>
              </div>
            </div>

            <div className="ig-phone">
              <div className="ig-screen">
                <div className="ig-top">
                  <div className="ig-progress">
                    <span />
                    <span className="active" />
                    <span />
                  </div>
                  <div className="ig-header">
                    <div className="ig-avatar">
                      <div className="ig-avatar-inner">R</div>
                    </div>
                    <div className="ig-user">
                      rohan.dx <span className="time">5h</span>
                    </div>
                    <div className="ig-actions">⋯</div>
                  </div>
                </div>
                <div className="ig-content">
                  <div className="ig-card aryan-variant">
                    <div className="ig-card-top">
                      <div></div>
                      <div className="ig-pg">no. 09</div>
                    </div>
                    <div className="ig-mid">
                      <div className="ig-name">Bunny.</div>
                      <div className="ig-from">From The Family Man</div>
                      <div className="ig-quote">
                        "Curious, restless, full of plans. You made the
                        conversation feel like an adventure already in motion.
                        Hard to keep up with, in the best way."
                      </div>
                    </div>
                    <div className="ig-foot">
                      <div className="ig-foot-what">
                        take the
                        <br />
                        <b>Convooersation Meter</b>
                      </div>
                      <div className="ig-foot-url">convoo.app</div>
                    </div>
                  </div>
                </div>
                <div className="ig-bottom">
                  <div className="ig-message">Send message</div>
                  <div className="ig-share-ic">♡</div>
                  <div className="ig-share-ic">↗</div>
                </div>
              </div>
            </div>
          </div>

          <div className="poster-share-hint">tap a character to find yours</div>
        </section>

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
      {character.isNew && (
        <div className="poster-char-new-badge">★ NEW</div>
      )}
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
    </button>
  );
};
