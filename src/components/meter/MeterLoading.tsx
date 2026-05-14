import React, { useEffect, useState } from 'react';
import './meter-loading.css';

const MESSAGES = [
  'developing the film…',
  'reading the dialogue…',
  'checking the chemistry…',
  'finalising your reading…',
];

export const MeterLoading: React.FC = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="loading-root">
      <div className="loading-bg-warm" aria-hidden />
      <div className="loading-bg-noise" aria-hidden />

      <div className="loading-stage">
        <div className="loading-clap" aria-hidden>
          <div className="clap-top">
            <span className="stripe" />
            <span className="stripe" />
            <span className="stripe" />
            <span className="stripe" />
            <span className="stripe" />
            <span className="stripe" />
            <span className="stripe" />
          </div>
          <div className="clap-body">
            <div className="clap-row">SCENE</div>
            <div className="clap-row big">CONVOO</div>
            <div className="clap-row small">TAKE 01 · IN PROGRESS</div>
          </div>
        </div>

        <div className="loading-label">★ NOW DEVELOPING ★</div>
        <div className="loading-msg" key={idx}>
          {MESSAGES[idx]}
        </div>
      </div>
    </div>
  );
};
