import React, { forwardRef } from 'react';
import { ScoreResult } from '../../lib/meterApi';

interface MeterShareCardProps {
  result: ScoreResult;
}

export const MeterShareCard = forwardRef<HTMLDivElement, MeterShareCardProps>(
  ({ result }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background:
            'linear-gradient(160deg, #1a0a14 0%, #2a0d1c 40%, #B83280 140%)',
        }}
      >
        <div className="p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="text-xs uppercase tracking-widest text-pink-200/80">
              Convooversation Meter
            </div>
            {result.character?.name && (
              <div className="text-xs text-pink-200/80 font-medium">
                with {result.character.name}
              </div>
            )}
          </div>

          <div className="text-center mb-6">
            <div
              className="font-poppins font-bold leading-none mb-1"
              style={{ fontSize: '5rem' }}
            >
              {result.score}
            </div>
            <div className="text-pink-200 text-sm font-medium tracking-wide">
              {result.style_label}
            </div>
          </div>

          {result.best_line && (
            <div className="bg-white/10 rounded-2xl p-4 mb-5 border border-white/10">
              <div className="text-pink-200/70 text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Best line
              </div>
              <div className="text-white text-sm leading-snug italic">
                &ldquo;{result.best_line}&rdquo;
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {result.feedback.map((f, i) => (
              <div key={i} className="flex gap-2.5 text-sm text-gray-100/90 leading-snug">
                <span className="text-[#B83280] flex-shrink-0">•</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/30 px-6 py-3 text-center text-xs text-pink-200/60 border-t border-white/5">
          Take it at <span className="text-white font-medium">convoo.app</span>
        </div>
      </div>
    );
  },
);

MeterShareCard.displayName = 'MeterShareCard';
