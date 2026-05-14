import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./meter-privacy.css";

const MeterPrivacy: React.FC = () => {
  useEffect(() => {
    document.title = "Privacy — Convoo Meter";
    // Match the Meter page: never let this be indexed.
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive, nosnippet";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="mp-root">
      <div className="mp-bg-warm" aria-hidden />
      <div className="mp-bg-noise" aria-hidden />

      <nav className="mp-nav">
        <Link to="/" className="mp-logo">
          CONV<span className="pink">OO</span>
        </Link>
        <span className="mp-nav-meta" lang="hi">
          ★ आपकी निजता ★
        </span>
        <Link to="/" className="mp-nav-cta">
          ★ HOME
        </Link>
      </nav>

      <main className="mp-shell">
        <div className="mp-header">
          <span className="mp-pill">★ THE FINE PRINT ★</span>
          <h1 className="mp-title">PRIVACY</h1>
          <p className="mp-subtitle">
            short, plain-language, no dark patterns. this page covers the Convoo
            Meter campaign only.
          </p>
        </div>

        <article className="mp-paper">
          <section>
            <h2>WHO WE ARE</h2>
            <p>
              Convoo Labs runs the Convoo Meter — a free, 3-minute pre-launch
              experience that scores how you'd come across in a real dating
              conversation. We're building a dating app launching soon at{" "}
              <a href="https://convoo.app">convoo.app</a>.
            </p>
          </section>

          <section>
            <h2>WHAT WE COLLECT</h2>
            <ul>
              <li>
                <strong>Your chat messages</strong> during the 3-minute Meter
                session. We need them to generate your result.
              </li>
              <li>
                <strong>Your WhatsApp number</strong>, only if you choose to
                drop it on the result screen. This is optional. Skipping it is
                a real option and your poster is still yours.
              </li>
              <li>
                <strong>A hashed version of your IP address</strong> for
                rate-limiting. We don't store the raw IP.
              </li>
              <li>
                <strong>Your browser user agent</strong>, so we can debug
                rendering issues across phones.
              </li>
            </ul>
            <p className="mp-callout">
              We do <strong>not</strong> ask for your name, photo, email, or
              location. We do not run cookies for tracking or advertising on
              this campaign.
            </p>
          </section>

          <section>
            <h2>WHY WE COLLECT IT</h2>
            <ul>
              <li>
                <strong>Chat messages</strong> → fed to an AI model to compute
                your style and best line. Kept on our server so you can replay
                your result and we can improve the experience.
              </li>
              <li>
                <strong>WhatsApp number</strong> → so we can send you exactly
                one message when Convoo launches, plus a free founding-member
                pass. That's it.
              </li>
              <li>
                <strong>IP hash + user agent</strong> → to stop abuse and crash
                bugs. Never used to identify or profile you.
              </li>
            </ul>
          </section>

          <section>
            <h2>WHO SEES IT</h2>
            <p>
              No one outside Convoo Labs reads your chats. We send the
              transcript to Anthropic's Claude model to generate your result —
              Anthropic does not retain it for training. We use Supabase as
              our database provider. We do not sell, rent, or share your data
              with advertisers or data brokers. Ever.
            </p>
          </section>

          <section>
            <h2>HOW LONG WE KEEP IT</h2>
            <ul>
              <li>
                <strong>Chat transcripts</strong> — up to 90 days, then deleted.
              </li>
              <li>
                <strong>WhatsApp number</strong> — until launch + 30 days, then
                deleted unless you've signed up for the dating app.
              </li>
              <li>
                <strong>IP hash</strong> — 7 days for rate-limiting only.
              </li>
            </ul>
          </section>

          <section>
            <h2>YOUR RIGHTS (DPDPA)</h2>
            <p>
              Under India's Digital Personal Data Protection Act, you have the
              right to access your data, correct it, withdraw consent, and
              request deletion at any time. Email{" "}
              <a href="mailto:support@convoo.app">support@convoo.app</a> with
              the subject "DELETE MY METER DATA" and we'll wipe everything
              within 7 days.
            </p>
          </section>

          <section>
            <h2>CHILDREN</h2>
            <p>
              The Meter is intended for adults (18+). If we learn we've
              collected data from a minor, we delete it.
            </p>
          </section>

          <section>
            <h2>CONTACT</h2>
            <p>
              Questions? Reach out at{" "}
              <a href="mailto:support@convoo.app">support@convoo.app</a>.
            </p>
            <p className="mp-meta">
              Effective date: 13 May 2026. The full dating-app privacy policy
              lives at <Link to="/privacy">/privacy</Link>.
            </p>
          </section>
        </article>

        <div className="mp-bottom-cta">
          <Link to="/" className="mp-back">
            ↩ BACK TO THE METER
          </Link>
        </div>
      </main>

      <footer className="mp-footer">
        <span>© CONVOO LABS</span>
        <span>
          <a href="https://convoo.app">convoo.app</a>
        </span>
      </footer>
    </div>
  );
};

export default MeterPrivacy;
