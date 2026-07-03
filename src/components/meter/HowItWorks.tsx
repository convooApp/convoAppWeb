import React from "react";
import "./how-it-works.css";

const STEPS = [
  {
    num: "1",
    title: "PICK YOUR CO-STAR",
    desc: "Four characters, each a whole mood.",
  },
  {
    num: "2",
    title: "DROP YOUR OPENER",
    desc: "Your first line drives everything. Make it count.",
  },
  {
    num: "3",
    title: "CHAT 3 MINUTES",
    desc: "No account, no setup. Just talk.",
  },
  {
    num: "4",
    title: "GET YOUR READING",
    desc: "A Bollywood persona card — screenshot & post.",
  },
];

export const HowItWorks: React.FC = () => (
  <section className="hiw-root">
    <p className="meter-kick rv">SCENE TWO · THE PLOT</p>
    <h2 className="hiw-title rv">How it works.</h2>
    <div className="hiw-strip rv">
      {STEPS.map((step) => (
        <div key={step.num} className="hiw-frame">
          <span className="hiw-frame__num">{step.num}</span>
          <h3 className="hiw-frame__title">{step.title}</h3>
          <p className="hiw-frame__desc">{step.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
