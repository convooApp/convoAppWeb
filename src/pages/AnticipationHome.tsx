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

        {/* SUBLINE — Voice first · Faces last */}
      </main>

      {/* FOOTER — pinned to the bottom of the viewport, tracked uppercase. */}
    </div>
  );
};

export default AnticipationHome;
