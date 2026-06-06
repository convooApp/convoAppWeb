import React from "react";
import "./how-it-works.css";

// ── Step illustrations ────────────────────────────────────────────────────────

const IllustrationPick: React.FC = () => (
  <div className="hiw-illo hiw-illo-pick">
    {["V", "K", "A", "Z"].map((initial, i) => (
      <div key={i} className={`hiw-char-card${i === 2 ? " selected" : ""}`}>
        <div className="hiw-char-avatar">{initial}</div>
        <div className="hiw-char-lines"><span /><span /></div>
      </div>
    ))}
    <div className="hiw-pick-dot" />
  </div>
);

const IllustrationChat: React.FC = () => (
  <div className="hiw-illo hiw-illo-chat">
    <div className="hiw-chat-box">
      <div className="hiw-chat-bubble them"><span /><span /></div>
      <div className="hiw-chat-bubble you"><span /></div>
      <div className="hiw-chat-bubble them"><span /><span /><span /></div>
    </div>
    <div className="hiw-chat-clock">
      <div className="hiw-clock-face"><div className="hiw-clock-hand" /></div>
      <div className="hiw-clock-label">3 MIN</div>
    </div>
  </div>
);

const IllustrationReading: React.FC = () => (
  <div className="hiw-illo hiw-illo-reading">
    <div className="hiw-result-card">
      <div className="hiw-result-char-big">Geet.</div>
      <div className="hiw-result-rule" />
      <div className="hiw-result-film">FROM JAB WE MET</div>
    </div>
    <div className="hiw-result-star hiw-result-star--tl">+</div>
    <div className="hiw-result-star hiw-result-star--tr">+</div>
    <div className="hiw-result-star hiw-result-star--bl">+</div>
  </div>
);

const IllustrationShare: React.FC = () => (
  <div className="hiw-illo hiw-illo-share">
    <div className="hiw-share-card hiw-share-card--main">
      <div className="hiw-share-arch">ROMANTIC</div>
      <div className="hiw-share-char">Geet.</div>
      <div className="hiw-share-url">CONVOO.APP</div>
    </div>
    <div className="hiw-share-card hiw-share-card--ghost" />
    <div className="hiw-share-dots">
      <span className="hiw-share-dot" />
      <span className="hiw-share-dot" />
      <span className="hiw-share-dot" />
    </div>
  </div>
);

const STEPS = [
  {
    num: "01",
    title: "PICK YOUR CHARACTER",
    desc: "Four characters, rotated every week. Each one's a real conversation — different vibe, different energy.",
    illo: <IllustrationPick />,
  },
  {
    num: "02",
    title: "CHAT FOR 3 MINUTES",
    desc: "The clock starts the moment you pick. Say what you'd actually say.",
    illo: <IllustrationChat />,
  },
  {
    num: "03",
    title: "GET YOUR READING",
    desc: "An archetype, a Bollywood character, and the line you said best.",
    illo: <IllustrationReading />,
  },
  {
    num: "04",
    title: "SHARE THE CARD",
    desc: "Drop it in a Story. See if your friends got the same.",
    illo: <IllustrationShare />,
  },
];

export const HowItWorks: React.FC = () => (
  <section className="hiw-root">
    <div className="hiw-eyebrow">★ SCENE ONE ★</div>
    <h2 className="hiw-title">How it works.</h2>
    <div className="hiw-meta">FOUR ACTS · NO ACCOUNT · THREE MINUTES TOTAL</div>

    <div className="hiw-grid">
      {STEPS.map((step) => (
        <div key={step.num} className="hiw-step-card">
          <span className="hiw-step-num">{step.num}</span>
          <div className="hiw-step-illo">{step.illo}</div>
          <div className="hiw-step-title">{step.title}</div>
          <p className="hiw-step-desc">{step.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
