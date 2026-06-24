import React, { useMemo, useState } from "react";
import { ScoreResult } from "../../lib/meterApi";
import { getBollywoodCharacter, getBollywoodFilm } from "./bollywoodCharacters";
import "./meter-score-reveal.css";

interface MeterScoreRevealProps {
  result: ScoreResult;
  sessionId: string;
  onRestart: () => void;
}

const SHARE_URL = "https://convoo.app/in";
const INSTAGRAM_URL = "https://www.instagram.com/convooindia/";

// "GEET" -> "Geet"
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
  onRestart,
}) => {
  const [screenshotHint, setScreenshotHint] = useState(false);

  const bolly = useMemo(
    () => getBollywoodCharacter(result.archetype, result.gender),
    [result.archetype, result.gender],
  );
  const film = useMemo(
    () => getBollywoodFilm(result.archetype, result.gender),
    [result.archetype, result.gender],
  );

  const name = titleCase(bolly.name);

  const shareResult = async () => {
    const text = `I got ${name} (${film}) on the Convooersation Meter. find yours: ${SHARE_URL}/meter`;
    const cardUrl = `/share-cards/${result.archetype}_${result.gender}_vintage.png`;
    try {
      const res = await fetch(cardUrl);
      if (!res.ok) throw new Error("card_not_found");
      const blob = await res.blob();
      const file = new File(
        [blob],
        `convoo-${result.archetype}-${result.gender}.png`,
        { type: "image/png" },
      );
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "My Convoo result", text });
        } catch {
          /* user cancelled */
        }
        return;
      }
      downloadBlob(blob, `convoo-${name.toLowerCase()}.png`);
      setScreenshotHint(true);
    } catch {
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({ title: "My Convoo result", text, url: `${SHARE_URL}/meter` });
          return;
        } catch {
          /* cancelled */
        }
      }
      setScreenshotHint(true);
    }
  };

  return (
    <div className="msr-wrap">
      {/* Eyebrow */}
      <div style={{ textAlign: "center" }}>
        <span className="msr-eyebrow">Your conversation style is in</span>
      </div>

      {/* Result card */}
      <div className="msr-card">
        <div className="msr-frame1" aria-hidden />
        <div className="msr-frame2" aria-hidden />

        <div className="msr-card-inner">
          <div className="msr-stars">★ ★ ★ ★ ★</div>
          <p className="msr-name">{name}</p>
          <hr className="msr-rule" />
          <p className="msr-tagline">From · {film}</p>
          <p className="msr-headline">{bolly.headline}</p>
          <p className="msr-blurb">{bolly.blurb}</p>
          <hr className="msr-divider" />
          <p className="msr-ask">— which one are you?</p>
          <div className="msr-url">CONVOO.APP/METER</div>
        </div>
      </div>

      {/* Actions */}
      <div className="msr-actions">
        <p className="msr-prompt">★&nbsp; DO YOUR FRIENDS MATCH YOUR VIBE? &nbsp;★</p>
        <p className="msr-sub">
          Share your card — see who gets the same character.
        </p>

        <button className="msr-btn-primary" onClick={shareResult}>
          ↗&nbsp; Share my card
        </button>

        {screenshotHint && (
          <div className="msr-ig-prompt">
            <p className="msr-ig-prompt-text">
              Send it on WhatsApp, post it on Instagram — just make sure they
              take the meter too.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="msr-ig-open-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              Tag @convooindia on Instagram
            </a>
          </div>
        )}

        <button className="msr-btn-secondary" onClick={onRestart}>
          ↻&nbsp; Play another scene
        </button>

        <p className="msr-footnote">
          You're on the list at{" "}
          <span className="msr-footnote-accent">convoo.app</span> — we'll see
          you at the premiere.
        </p>
      </div>
    </div>
  );
};
