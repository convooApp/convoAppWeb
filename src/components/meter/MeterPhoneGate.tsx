import React, { useState } from "react";
import { submitLead } from "../../lib/meterApi";
import "./meter-result.css";

interface MeterPhoneGateProps {
  sessionId: string;
  onContinue: () => void;
  onSkip: () => void;
}

const COUNTRY_CODES: Array<{ code: string; label: string }> = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+971", label: "🇦🇪 +971" },
];

export const MeterPhoneGate: React.FC<MeterPhoneGateProps> = ({
  sessionId,
  onContinue,
  onSkip,
}) => {
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");

    if (countryCode === "+91") {
      if (digits.length !== 10) {
        setError("Enter a valid mobile number.");
        return;
      }
      if (!/^[6-9]/.test(digits)) {
        setError("Enter a valid mobile number.");
        return;
      }
    } else {
      if (digits.length < 6 || digits.length > 15) {
        setError("Please enter a valid phone number.");
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    try {
      await submitLead(sessionId, countryCode, digits);
      onContinue();
    } catch {
      setError("Couldn't save that — but your result is still waiting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="result-root" data-color="pink">
      <div className="result-bg-warm" aria-hidden />
      <div className="result-bg-noise" aria-hidden />

      <nav className="result-nav">
        <div className="logo">
          CONV<span className="pink">OO</span>
        </div>
        <div className="nav-meta" lang="hi">
          ★ आपकी फिल्म ★
        </div>
        <span className="nav-cta" style={{ opacity: 0, pointerEvents: "none" }}>
          ★ HOME
        </span>
      </nav>

      <main className="result-shell" style={{ paddingTop: "40px" }}>
        {/* Ready pill */}
        <div className="header-pill" style={{ marginBottom: "28px" }}>
          ★ YOUR RESULT IS READY ★
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 8vw, 3rem)",
            letterSpacing: "2px",
            color: "var(--red-deep)",
            lineHeight: 1.1,
            margin: "0 0 14px",
          }}
        >
          One last thing
          <br />
          <span style={{ color: "var(--pink)" }}>before the big reveal.</span>
        </h2>

        {/* Blurb */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "var(--ink-soft)",
            lineHeight: 1.7,
            maxWidth: "340px",
            margin: "0 auto 32px",
          }}
        >
          Drop your WhatsApp number and we'll send you a nudge when convoo goes
          live
        </p>

        {/* Divider */}
        <div
          style={{
            width: "60px",
            height: "3px",
            background: "var(--pink)",
            margin: "0 auto 32px",
          }}
        />

        {/* Phone form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "14px",
            }}
          >
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              style={{
                background: "var(--cream)",
                border: "2px solid var(--ink)",
                padding: "10px 8px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "var(--ink)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder={
                countryCode === "+91"
                  ? "10-digit mobile number"
                  : "Phone number"
              }
              maxLength={countryCode === "+91" ? 10 : 15}
              value={phone}
              onChange={(e) => {
                // Strip non-digits as they type
                const val = e.target.value.replace(/\D/g, "");
                setPhone(val);
                setError(null);
              }}
              style={{
                flex: 1,
                background: "var(--cream)",
                border: "2px solid var(--ink)",
                padding: "10px 14px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "var(--ink)",
                outline: "none",
                minWidth: 0,
              }}
            />
          </div>

          {error && (
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "13px",
                color: "var(--red)",
                marginBottom: "12px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              background: "var(--pink)",
              color: "var(--paper)",
              border: "3px solid var(--ink)",
              boxShadow: "5px 5px 0 var(--ink)",
              padding: "14px 24px",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "16px",
              letterSpacing: "2px",
              whiteSpace: "nowrap",
              cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.7 : 1,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                (e.currentTarget as HTMLElement).style.transform =
                  "translate(-2px,-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "7px 7px 0 var(--ink)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "5px 5px 0 var(--ink)";
            }}
          >
            {submitting ? "SAVING…" : "★ SEE MY RESULT"}
          </button>
        </form>

        {/* Fine print */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "11px",
            color: "var(--ink-soft)",
            marginBottom: "20px",
            opacity: 0.7,
          }}
        >
          WhatsApp only. No spam, ever.{" "}
          <a
            href="/meter/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--pink)" }}
          >
            privacy
          </a>
          .
        </p>

        {/* Skip */}
        <button
          type="button"
          onClick={onSkip}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: "1.5px solid var(--ink-soft)",
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: "var(--ink-soft)",
            cursor: "pointer",
            padding: "2px 0",
          }}
        >
          skip, just show me my result →
        </button>
      </main>
    </div>
  );
};
