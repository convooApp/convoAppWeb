import React, { useState } from "react";
import { submitLead } from "../../lib/meterApi";
import "./meter-phone-gate.css";

interface MeterPhoneGateProps {
  sessionId: string;
  onContinue: () => void;
  onSkip: () => void;
}

export const MeterPhoneGate: React.FC<MeterPhoneGateProps> = ({
  sessionId,
  onContinue,
  onSkip,
}) => {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10 || !/^[6-9]/.test(digits)) {
      setError("Enter a valid 10-digit WhatsApp number.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitLead(sessionId, "+91", digits);
      onContinue();
    } catch {
      setError("Couldn't save that — but your result is still waiting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mpg-wrap">
      <div className="mpg-card">
        {/* Double inner frame borders */}
        <div className="mpg-frame1" aria-hidden />
        <div className="mpg-frame2" aria-hidden />

        <div className="mpg-inner">
          {/* Nav */}
          <div className="mpg-nav">
            <span className="mpg-logo">CONVOO</span>
            <span className="mpg-nav-sub">the meter</span>
          </div>

          <div className="mpg-body">
            {/* Stars */}
            <div className="mpg-stars">★ ★ ★ ★ ★</div>

            {/* Eyebrow */}
            <p className="mpg-eyebrow">One last thing</p>

            {/* Headline */}
            <h1 className="mpg-headline">
              You talked.
              <br />
              Now meet
              <br />
              <span className="mpg-headline-accent">Convoo.</span>
            </h1>

            {/* Steps */}
            <div className="mpg-steps">
              <div className="mpg-row">
                <span className="mpg-num">1</span>
                <p className="mpg-step-text">
                  A good <span className="mpg-em">conversation</span> is the
                  most attractive thing about a person — you just felt it in 3
                  minutes.
                </p>
              </div>
              <div className="mpg-row">
                <span className="mpg-num">2</span>
                <p className="mpg-step-text">
                  That's Convoo — you fall for the{" "}
                  <span className="mpg-em">conversation first</span>, the face
                  comes later.
                </p>
              </div>
              <div className="mpg-row mpg-row--last">
                <span className="mpg-num">3</span>
                <p className="mpg-step-text">
                  Launching soon. Get on the list for{" "}
                  <span className="mpg-em">early access</span>.
                </p>
              </div>
            </div>

            {/* Locked chip */}
            <div className="mpg-locked-chip">
              <div className="mpg-lock-body">
                <div className="mpg-lock-shackle" />
              </div>
              <span className="mpg-locked-label">Your character:</span>
              <span className="mpg-locked-name">Tara.</span>
            </div>

            {/* CTA copy */}
            <p className="mpg-cta-copy">
              Drop your WhatsApp — that's how we unlock your result and nudge
              you the day Convoo goes live.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mpg-input-row">
                <div className="mpg-country-box">🇮🇳 +91</div>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="WhatsApp number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setError(null);
                  }}
                  className="mpg-field"
                />
              </div>

              {error && <p className="mpg-error">{error}</p>}

              <button type="submit" disabled={submitting} className="mpg-cta">
                {submitting ? "Saving…" : "Show my character"}
              </button>
            </form>

            {/* Fine print */}
            <p className="mpg-fine-print">
              WhatsApp only. No spam, ever.{" "}
              <strong className="mpg-fine-strong">Privacy respected.</strong>
            </p>

            {/* Skip */}
          </div>
        </div>
      </div>
    </div>
  );
};
