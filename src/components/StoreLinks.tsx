import { APP_STORE_URL, PLAY_STORE_URL } from "../lib/appStores";
import { track } from "../lib/analytics";
import "./store-links.css";

/* ------------------------------------------------------------------
   App Store and Play Store links.

   Two sizes of the same thing: `full` is the badge people expect on a
   landing page, `compact` is the mark alone for a masthead where a pair of
   full badges would outweigh everything else on the row.
   ------------------------------------------------------------------ */

type Props = {
  variant?: "full" | "compact";
  /** Passed straight to analytics so hero and masthead can be told apart. */
  placement: string;
};

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayMark() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <path d="M48 432 L48 80 L304 256 Z" fill="#34A853" />
      <path d="M48 80 L304 256 L384 176 L96 16 Q64 0 48 80Z" fill="#4285F4" />
      <path d="M48 432 L304 256 L384 336 L96 496 Q64 512 48 432Z" fill="#EA4335" />
      <path
        d="M304 256 L384 176 L448 216 Q480 240 448 296 L384 336 Z"
        fill="#FBBC05"
      />
    </svg>
  );
}

export function StoreLinks({ variant = "full", placement }: Props) {
  const compact = variant === "compact";

  return (
    <div className={"store-links" + (compact ? " is-compact" : "")}>
      <a
        className="store-link"
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Convoo on the App Store"
        onClick={() => track("cta_click", { cta: "app_store", placement })}
      >
        <span className="store-mark">
          <AppleMark />
        </span>
        {!compact && (
          <span className="store-copy">
            <span className="store-pre">Download on the</span>
            <span className="store-name">App Store</span>
          </span>
        )}
      </a>

      <a
        className="store-link"
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Convoo on Google Play"
        onClick={() => track("cta_click", { cta: "play_store", placement })}
      >
        <span className="store-mark">
          <PlayMark />
        </span>
        {!compact && (
          <span className="store-copy">
            <span className="store-pre">Get it on</span>
            <span className="store-name">Google Play</span>
          </span>
        )}
      </a>
    </div>
  );
}
