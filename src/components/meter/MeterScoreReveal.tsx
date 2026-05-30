import React, { useMemo, useRef, useState } from "react";
import { ScoreResult, submitLead } from "../../lib/meterApi";
import { CHARACTERS } from "./characters";
import { getBollywoodCharacter, getBollywoodFilm } from "./bollywoodCharacters";
import "./meter-result.css";

interface MeterScoreRevealProps {
  result: ScoreResult;
  sessionId: string;
  onRestart: () => void;
}

type TemplateId = "zine" | "vintage";

const SHARE_URL = "https://convoo.app/in";
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

// "GEET" -> "Geet", "POO" -> "Poo". Names are single words.
function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const MeterScoreReveal: React.FC<MeterScoreRevealProps> = ({
  result,
  sessionId,
  onRestart,
}) => {
  const waCardRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Initial template can be forced via ?template= (used by the share-card
  // PNG generator to screenshot each design).
  const [template, setTemplate] = useState<TemplateId>(() => {
    if (typeof window === "undefined") return "zine";
    return new URLSearchParams(window.location.search).get("template") ===
      "vintage"
      ? "vintage"
      : "zine";
  });
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
  const film = useMemo(
    () => getBollywoodFilm(result.archetype, result.gender),
    [result.archetype, result.gender],
  );

  const name = titleCase(bolly.name);
  const zineNameClass =
    name.length >= 8
      ? "sc-name xlong"
      : name.length >= 6
        ? "sc-name long"
        : "sc-name";
  const quote = bolly.blurb;
  const year = new Date().getFullYear();

  const shareResult = async () => {
    const text = `I got ${name} (${film}) on the Convooersation Meter. find yours: ${SHARE_URL}/meter`;
    // Pre-rendered card PNG keyed by archetype × gender × template.
    const cardUrl = `/share-cards/${result.archetype}_${result.gender}_${template}.png`;
    try {
      const res = await fetch(cardUrl);
      if (!res.ok) throw new Error("card_not_found");
      const blob = await res.blob();
      const file = new File(
        [blob],
        `convoo-${result.archetype}-${result.gender}.png`,
        { type: "image/png" },
      );
      // Best path: hand the image file to the system share sheet → user
      // picks Instagram → Add to Story.
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "My Convoo result",
            text,
          });
        } catch {
          /* user cancelled the share sheet */
        }
        return;
      }
      // No file-share support (most desktops): download + show the hint.
      downloadBlob(blob, `convoo-${name.toLowerCase()}.png`);
      setScreenshotHint(true);
    } catch {
      // Card not generated yet / fetch failed — fall back to text+link share.
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: "My Convoo result",
            text,
            url: `${SHARE_URL}/meter`,
          });
          return;
        } catch {
          /* cancelled */
        }
      }
      setScreenshotHint(true);
    }
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
    requestAnimationFrame(() => {
      waCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      phoneInputRef.current?.focus();
    });
  };

  const renderCard = () => {
    if (template === "vintage") {
      return (
        <div className="share-card sc-vintage">
          <div className="sc-vin-content">
            <div className="sc-stars">★ ★ ★ ★ ★</div>
            <div className="sc-name">{name}</div>
            <div className="sc-vin-line" />
            <div className="sc-from">From · {film}</div>
            <div className="sc-quote">"{quote}"</div>
            <div className="sc-vin-foot">
              <div className="sc-who">— which one are you?</div>
              <div className="sc-url">convoo.app/meter</div>
            </div>
          </div>
        </div>
      );
    }

    // default: bold zine
    return (
      <div className="share-card sc-zine">
        <div className="sc-mid">
          <div className={zineNameClass}>{name}.</div>
          <div className="sc-from">From {film}</div>
          <div className="sc-quote">"{quote}"</div>
        </div>
        <div className="sc-foot">
          <div className="sc-foot-what">
            take the
            <br />
            <b>Convooersation Meter</b>
          </div>
          <div className="sc-foot-url">convoo.app/meter</div>
        </div>
      </div>
    );
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

        <div className="template-toggle">
          <button
            type="button"
            className={template === "zine" ? "active" : ""}
            onClick={() => setTemplate("zine")}
          >
            ZINE
          </button>
          <button
            type="button"
            className={template === "vintage" ? "active" : ""}
            onClick={() => setTemplate("vintage")}
          >
            VINTAGE
          </button>
        </div>

        <div className="share-card-stage">{renderCard()}</div>

        <span className="share-label">SCREENING ROOM</span>
        <div className="share-row">
          <button className="share-btn" onClick={shareResult}>
            ↗ SHARE TO STORY
          </button>
          <button className="share-btn" onClick={() => setScreenshotHint(true)}>
            📸 SCREENSHOT
          </button>
        </div>

        {screenshotHint ? (
          <div className="ig-hint">
            screenshot the card above and tag{" "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              @convooapp
            </a>{" "}
            on your story.
          </div>
        ) : null}

        <div className="ig-follow-row">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-follow-btn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            Follow @convooapp
          </a>
          <span className="ig-tag-hint">tag us in your story ↗</span>
        </div>

        <div className="cta-row">
          {waState === "success" || waState === "skipped" ? (
            <div className="cta-postsubmit">
              {waState === "success"
                ? "you're on the list. don't ghost us."
                : "your card is yours."}
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
              no thanks, just my card
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
