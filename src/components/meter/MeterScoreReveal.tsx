import React, { useMemo, useRef, useState } from "react";
import { ScoreResult, submitLead } from "../../lib/meterApi";
import { CHARACTERS } from "./characters";
import { getBollywoodCharacter } from "./bollywoodCharacters";
import "./meter-result.css";

interface MeterScoreRevealProps {
  result: ScoreResult;
  sessionId: string;
  onRestart: () => void;
}

const SHARE_URL = "https://convoo.app";
const INSTAGRAM_URL = "https://www.instagram.com/convooapp/";

const COUNTRY_CODES: Array<{ code: string; label: string }> = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+971", label: "🇦🇪 +971" },
];

function characterColor(characterId: string | undefined): string {
  const card = CHARACTERS.find((c) => c.id === characterId);
  return card?.color ?? "pink";
}

// "THE ROMANTIC" → ["THE", "ROMANTIC"]. The first word stays ink-colored,
// the rest goes pink. Works for "THE FREE SPIRIT" / "THE WISE ONE" too.
function splitArchetypeLabel(label: string): [string, string] {
  const idx = label.indexOf(" ");
  if (idx === -1) return [label, ""];
  return [label.slice(0, idx), label.slice(idx + 1)];
}

export const MeterScoreReveal: React.FC<MeterScoreRevealProps> = ({
  result,
  sessionId,
  onRestart,
}) => {
  const waCardRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [screenshotHint, setScreenshotHint] = useState(false);
  const [showWa, setShowWa] = useState(false);

  // Soft WhatsApp capture state — skippable, no dating-app reveal.
  const [waCountry, setWaCountry] = useState("+91");
  const [waNumber, setWaNumber] = useState("");
  const [waSubmitting, setWaSubmitting] = useState(false);
  const [waError, setWaError] = useState<string | null>(null);
  const [waState, setWaState] = useState<"form" | "success" | "skipped">(
    "form",
  );

  const bolly = useMemo(
    () => getBollywoodCharacter(result.archetype, result.gender),
    [result.archetype, result.gender],
  );

  const characterName = result.character?.name ?? "Vedika";
  const characterCity = result.character?.city ?? "Convoo";
  const year = new Date().getFullYear();

  const [archetypePrefix, archetypeRest] = splitArchetypeLabel(
    bolly.archetypeLabel,
  );

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  const promptScreenshot = () => {
    setScreenshotHint(true);
  };

  const submitWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = waNumber.replace(/\D/g, "");
    if (digits.length < 6) {
      setWaError("please enter a valid number.");
      return;
    }
    setWaSubmitting(true);
    setWaError(null);
    try {
      await submitLead(sessionId, waCountry, digits);
      setWaState("success");
    } catch {
      setWaError(
        "we couldn't save that. try again, or skip — your name is still in for a free pass.",
      );
    } finally {
      setWaSubmitting(false);
    }
  };

  const openWa = () => {
    setShowWa(true);
    // Scroll the form into view and focus the input on next frame.
    requestAnimationFrame(() => {
      waCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      phoneInputRef.current?.focus();
    });
  };

  return (
    <div
      className="result-root"
      data-color={characterColor(result.character?.id)}
    >
      <div className="result-bg-warm" aria-hidden />
      <div className="result-bg-noise" aria-hidden />

      <nav className="result-nav">
        <div className="logo">
          CONV<span className="pink">OO</span>
        </div>
        <div className="nav-meta" lang="hi">
          ★ आपकी फिल्म ★
        </div>
        <a href="/" className="nav-cta">
          ★ HOME
        </a>
      </nav>

      <main className="result-shell">
        <div className="header-pill">YOUR CONVERSATION STYLE IS IN</div>

        <div className="poster">
          <div className="card-inner">
            <p className="now-showing">now showing in your conversation</p>
            <div className="you-are">YOU ARE</div>

            <h1 className={`hero-name${bolly.name.length > 5 ? " long" : ""}`}>
              {bolly.name}
            </h1>
            <div className="hero-name-hindi" lang="hi">
              {bolly.nameHindi}
            </div>

            <p className="from-film">
              <span className="gold-stars">★</span> in the style of{" "}
              <span className="pink">{bolly.tagline}</span>{" "}
              <span className="gold-stars">★</span>
            </p>

            <div className="divider" aria-hidden>
              <span className="line" />
              <span className="star">★</span>
              <span className="star mid">✦</span>
              <span className="star">★</span>
              <span className="line" />
            </div>

            <h2 className="personality-label">
              {archetypePrefix}{" "}
              {archetypeRest ? (
                <span className="pink">{archetypeRest}</span>
              ) : null}
            </h2>

            <p className="celebration">{bolly.blurb}</p>

            {result.best_line ? (
              <div className="best-line">
                <span className="label">YOUR BEST LINE</span>
                <p className="best-line-text">{result.best_line}</p>
              </div>
            ) : null}

            <div className="credits">
              <div className="credit">
                <span className="label">WITH</span>
                <span className="val">{characterName.toUpperCase()}</span>
              </div>
              <div className="credit">
                <span className="label">RUN TIME</span>
                <span className="val">03:00</span>
              </div>
              <div className="credit">
                <span className="label">SCREEN</span>
                <span className="val">CONVOO</span>
              </div>
            </div>

            <div className="card-footer">
              <span className="convoo">CONVOO.APP</span> · {year}
            </div>
          </div>
        </div>

        <span className="share-label">SCREENING ROOM</span>
        <div className="share-row">
          <button className="share-btn" onClick={openInstagram}>
            ★ TAG US ON INSTAGRAM
          </button>
          <button className="share-btn" onClick={promptScreenshot}>
            📸 SCREENSHOT FOR US?
          </button>
        </div>

        {screenshotHint ? (
          <div className="ig-hint">
            screenshot the poster above and tag{" "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              @convooapp
            </a>{" "}
            on your story.
          </div>
        ) : null}

        <div className="cta-row">
          {waState === "success" || waState === "skipped" ? (
            <div className="cta-postsubmit">
              {waState === "success"
                ? "you're on the list. don't ghost us."
                : "your poster is yours."}
            </div>
          ) : (
            <button type="button" className="cta-primary" onClick={openWa}>
              ★ JOIN THE CONVOO LIST
            </button>
          )}
          <button type="button" className="cta-secondary" onClick={onRestart}>
            ↻ NEW SCENE
          </button>
        </div>

        {showWa && waState === "form" ? (
          <div className="wa-card" ref={waCardRef}>
            <p className="wa-heading">
              <strong>DROP YOUR WHATSAPP NUMBER</strong> — we'll send you a free
              pass when Convoo launches. founding members get in first.
            </p>
            <form className="wa-form" onSubmit={submitWhatsApp}>
              <select
                value={waCountry}
                onChange={(e) => setWaCountry(e.target.value)}
                aria-label="country code"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                ref={phoneInputRef}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="WhatsApp number"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                aria-label="WhatsApp number"
              />
              <button
                type="submit"
                className="wa-submit"
                disabled={waSubmitting}
              >
                {waSubmitting ? "SAVING…" : "COUNT ME IN"}
              </button>
            </form>
            {waError ? <div className="wa-error">{waError}</div> : null}
            <p className="wa-fineprint">
              we'll only message you on WhatsApp. no spam, ever.{" "}
              <a
                href="/meter/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy
              </a>
              .
            </p>
            <button
              type="button"
              className="wa-skip"
              onClick={() => setWaState("skipped")}
            >
              no thanks, just my poster
            </button>
          </div>
        ) : null}

        <p className="closing-line">
          your name is on the list at{" "}
          <a href={SHARE_URL} className="pink">
            convoo.app
          </a>{" "}
          — we'll see you at the premiere.
        </p>
      </main>

      <footer className="result-footer">
        <span>© CONVOO LABS · {year}</span>
        <span>
          <a href={SHARE_URL} className="pink">
            convoo.app
          </a>
        </span>
      </footer>
    </div>
  );
};
