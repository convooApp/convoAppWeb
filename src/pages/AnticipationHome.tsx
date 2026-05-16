import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import "../landing.css"; // .animate-fade-in
import "./anticipation-home.css";

/**
 * AnticipationHome — pre-launch landing in the dark brand theme.
 *
 * Quiet, elegant, speakeasy-dark. The whole page is near-black with a
 * single pink dot as the only saturated accent — the brand promise of
 * "less is everything." The CTA is intentionally a muted burgundy
 * rather than a bright pink: this isn't a billboard, it's an invitation.
 *
 * Content beats:
 *   1. Convoo. (wordmark + pink dot)
 *   2. Date differently. (tagline)
 *   3. Join the waitlist → (CTA, expands inline phone form)
 *   4. Voice first · Faces last (positioning subline)
 *   5. MADE IN PUNE · COMING SOON (status footer)
 *
 * Submissions go to `public.waitlist_phones` (country_code + phone).
 * Same shape as meter_leads so a single nurture worker can drain both.
 */

const COUNTRY_CODES: Array<{ code: string; label: string }> = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+971", label: "🇦🇪 +971" },
];

const AnticipationHome: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Match iOS / Android system bars to the page bg.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#0B0709";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Focus the phone input as soon as the form expands.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => phoneInputRef.current?.focus());
    }
  }, [open]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 6) {
      setError("Please enter a valid WhatsApp number.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("waitlist_phones").insert([
        {
          country_code: countryCode,
          phone: digits,
        },
      ]);
      if (dbError) {
        if (dbError.code === "23505") {
          // Unique violation on (country_code, phone) — treat as "already in"
          // and show the success state. No reason to scold them.
          setSubmitted(true);
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ah-dark-root min-h-screen relative overflow-hidden bg-[#0B0709] text-white flex flex-col">
      {/* Soft plum bloom upper-left — single subtle light source. */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 900px 700px at 22% 18%, rgba(184,50,128,0.16), transparent 65%)",
        }}
        aria-hidden
      />
      {/* A faint counter-bloom lower-right keeps the canvas from feeling
          one-sided without raising the overall brightness. */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 700px 500px at 85% 90%, rgba(255,45,140,0.05), transparent 60%)",
        }}
        aria-hidden
      />
      {/* Film grain. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='3'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.8'/></svg>\")",
        }}
        aria-hidden
      />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* WORDMARK — single weight, ivory, with the pink dot as the only
            saturated mark on the page. */}
        <h1 className="font-bricolage font-bold tracking-tight leading-none text-[clamp(64px,12vw,128px)] mb-3 md:mb-4 flex items-end justify-center">
          <span className="text-white">Convoo</span>
          <span
            aria-hidden
            className="inline-block rounded-full bg-[#FF2D8C] shadow-[0_0_24px_0_rgba(255,45,140,0.55)]"
            style={{
              width: "0.18em",
              height: "0.18em",
              marginLeft: "0.04em",
              marginBottom: "0.06em",
            }}
          />
        </h1>

        {/* TAGLINE — clean lowercase, muted. */}
        <p className="font-bricolage text-[clamp(18px,3.4vw,24px)] text-neutral-400 mb-10 md:mb-14">
          Date differently.
        </p>

        {/* CTA / waitlist form */}
        <div className="w-full max-w-sm">
          {!open && !submitted ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="
                group w-full inline-flex items-center justify-center gap-3
                bg-[#3A1A28] hover:bg-[#4A2238] active:bg-[#2E1320]
                border border-[#5C2A3D]/60 hover:border-[#7A3A52]/80
                text-white/95 font-bricolage font-medium
                text-[clamp(15px,2.8vw,17px)] tracking-wide
                px-8 py-4 rounded-2xl
                shadow-[0_8px_28px_-12px_rgba(255,45,140,0.35)]
                hover:shadow-[0_14px_38px_-10px_rgba(255,45,140,0.45)]
                transition-all duration-200
                hover:-translate-y-0.5 active:translate-y-0
              "
            >
              Join the waitlist
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          ) : null}

          {open && !submitted ? (
            <form
              onSubmit={onSubmit}
              className="bg-[#150C11]/95 backdrop-blur-sm rounded-2xl border border-[#5C2A3D]/40 shadow-[0_24px_60px_-20px_rgba(255,45,140,0.25)] p-6 md:p-7 text-left animate-fade-in"
            >
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-bricolage font-medium text-white/90 tracking-tight">
                  Drop your WhatsApp number.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setError(null);
                  }}
                  className="text-neutral-500 hover:text-white text-sm px-2"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Single row: country code dropdown + phone input. */}
              <div className="flex gap-2 mb-4">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  aria-label="Country code"
                  className="px-3 py-3 rounded-xl border border-white/10 bg-[#221218] text-white text-base focus:outline-none focus:border-[#FF2D8C] focus:ring-2 focus:ring-[#FF2D8C]/20"
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-label="WhatsApp number"
                  className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-white/10 bg-[#221218] text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF2D8C] focus:ring-2 focus:ring-[#FF2D8C]/20"
                />
              </div>

              {error ? (
                <div className="text-sm text-[#FF6BB5] mb-3">{error}</div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#3A1A28] hover:bg-[#4A2238] disabled:opacity-60 disabled:cursor-not-allowed border border-[#5C2A3D]/60 hover:border-[#7A3A52]/80 text-white font-bricolage font-medium tracking-wide text-base py-3 rounded-xl transition-all duration-200"
              >
                {submitting ? "Adding you…" : "Count me in"}
              </button>

              <p className="text-xs text-neutral-500 mt-3 text-center">
                One WhatsApp message when we launch. No spam, ever.
              </p>
            </form>
          ) : null}

          {submitted ? (
            <div className="bg-[#150C11]/95 backdrop-blur-sm rounded-2xl border border-[#5C2A3D]/40 shadow-[0_24px_60px_-20px_rgba(255,45,140,0.25)] p-7 md:p-8 text-center animate-fade-in">
              <div className="font-bricolage font-semibold text-2xl md:text-3xl text-white mb-2 inline-flex items-end justify-center">
                You're in
                <span
                  aria-hidden
                  className="inline-block rounded-full bg-[#FF2D8C] ml-1.5 mb-1.5 shadow-[0_0_16px_0_rgba(255,45,140,0.55)]"
                  style={{ width: "0.32em", height: "0.32em" }}
                />
              </div>
              <p className="text-neutral-400">
                We'll WhatsApp you the moment Convoo opens its doors.
              </p>
            </div>
          ) : null}
        </div>

        {/* SUBLINE — Voice first · Faces last */}
      </main>

      {/* FOOTER — pinned to the bottom of the viewport, tracked uppercase. */}
      <footer className="relative z-10 px-6 pb-7 md:pb-9 text-center">
        <div className="font-bricolage text-neutral-500 text-[11px] md:text-xs tracking-[0.18em] uppercase flex items-center justify-center gap-3">
          <span>Coming soon</span>
        </div>
        <a
          href="/meter/privacy"
          className="block mt-3 text-[10px] tracking-wider uppercase text-neutral-600 hover:text-neutral-400"
        >
          privacy
        </a>
      </footer>
    </div>
  );
};

export default AnticipationHome;
