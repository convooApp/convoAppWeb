import React, { useEffect, useState } from 'react';

interface MeterTimerProps {
  startedAt: number;
  durationMs: number;
  onExpire: () => void;
  label?: string;
}

function fmt(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const MeterTimer: React.FC<MeterTimerProps> = ({ startedAt, durationMs, onExpire, label = 'Conversation' }) => {
  const [remaining, setRemaining] = useState(() => Math.max(0, durationMs - (Date.now() - startedAt)));

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, durationMs - (Date.now() - startedAt));
      setRemaining(left);
      if (left <= 0) onExpire();
    };
    const id = setInterval(tick, 250);
    tick();
    return () => clearInterval(id);
  }, [startedAt, durationMs, onExpire]);

  const pct = (remaining / durationMs) * 100;
  const warning = remaining < 30_000;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5 px-1">
        <span>{label}</span>
        <span className={`font-semibold tabular-nums ${warning ? 'text-red-400' : 'text-white'}`}>
          {fmt(remaining)}
        </span>
      </div>
      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-200 ${warning ? 'bg-red-500' : 'bg-[#B83280]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
