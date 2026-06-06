import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { submitWaitlistLead } from "../lib/meterApi";
import "./in.css";

/**
 * /in — "Pehli Mulaqaat" pre-launch campaign page for Pune & Mumbai.
 *
 * The Convooersation Meter is the hero: a free thing to do right now, with
 * the waitlist underneath and a short story for the curious. Targets an
 * Indian audience, so the WhatsApp field defaults to +91 and the number is
 * saved to the shared `meter_leads` table (source = "in").
 */

const COUNTRY_CODE = "+91";

const In: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Match the iOS / Android system bars to the page bg.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#0c0608";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

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
      await submitWaitlistLead(COUNTRY_CODE, digits, "in");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="in-page">
      <div className="ambient" aria-hidden />

      <div className="wrap">
        {/* top bar */}
        <div className="topbar">
          <span className="brand">Convoo</span>
        </div>

        {/* HERO: Pehli Mulaqaat */}
        <section className="hero">
          <h1 className="hero-title">Pehli Mulaqaat</h1>
          <div className="hero-en">2026</div>
          <p className="hero-line">aa rahe ho na?</p>
        </section>

        {/* METER: the hero zone */}
        <section className="meter-block">
          <div className="m-eyebrow">
            <span className="ic">✦</span> Free · Live now
          </div>
          <h2 className="m-title">
            What's your <span className="italic">conversation style?</span>
          </h2>
          <p className="m-sub">
            A 3-minute chat that figures it out.{" "}
            <b>You'll get a Bollywood character at the end</b> — share it, send
            it, see who you'd actually click with.
          </p>

          <div className="m-tease">
            <span className="tease-names">VEDIKA · KAIRA · AMEYA · ARYAN</span>
            <span className="tease-line">
              find out which one you'd actually click with
            </span>
          </div>

          <Link to="/meter" className="m-btn">
            Take the meter <span className="arrow">→</span>
          </Link>
          <div className="m-trust">
            Already taken by 1,500+ people in Pune &amp; Mumbai
          </div>
        </section>

        {/* One bridging line, italic, sets up waitlist */}
        <div className="divider-line">
          <p>And when we launch — we'll let you know first.</p>
        </div>

        {/* WAITLIST */}
        <section className="waitlist">
          <div className="w-cap">Save your spot</div>
          <div className="w-title">Be there when it opens.</div>
          {submitted ? (
            <div className="w-success">You're in. See you soon. ♡</div>
          ) : (
            <>
              <div className="w-sub">
                One message on WhatsApp. That's it. Promise.
              </div>
              {error && <div className="w-error">{error}</div>}
              <form className="w-form" onSubmit={onSubmit}>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="WhatsApp number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                />
                <button type="submit" disabled={submitting}>
                  {submitting ? "…" : "I'm in →"}
                </button>
              </form>
              <div className="w-trust">No spam. One message. Promise.</div>
            </>
          )}
        </section>

        {/* Scroll cue — separates layer 2 from layer 3 */}
        <div className="scroll-cue">More on what this is</div>

        {/* STORY: for the curious scrollers */}
        <section className="story">
          <p className="lead">We're building something different.</p>
          <p>
            Dating apps gave us infinite faces and almost no connection.{" "}
            <b>So we built a place where conversation matters</b>
          </p>
          <p>
            Pune and Mumbai first. The rest, you'll see when we open the door.
          </p>
          <p className="sig">— Convoo, with love</p>
        </section>

        {/* footer */}
        <footer>
          <span>Convoo · Date differently</span>
          <div className="links">
            <a
              href="https://www.instagram.com/convooapp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow us on Instagram
            </a>
            <Link to="/privacy">Privacy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default In;
