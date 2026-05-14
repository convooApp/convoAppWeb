import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Lock } from 'lucide-react';
import { submitLead } from '../../lib/meterApi';

interface MeterPhoneGateProps {
  sessionId: string;
  onContinue: () => void;
  onSkip: () => void;
}

const COUNTRY_CODES: Array<{ code: string; label: string }> = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+971', label: '🇦🇪 +971' },
];

export const MeterPhoneGate: React.FC<MeterPhoneGateProps> = ({ sessionId, onContinue, onSkip }) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 6) {
      setError('Please enter a valid phone number.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitLead(sessionId, countryCode, digits);
      onContinue();
    } catch {
      setError('Could not save your number. You can still see your score.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#0e0e0e] px-5 py-10 text-white">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-full bg-pink-600/15 items-center justify-center mb-4">
            <Lock size={20} className="text-[#B83280]" />
          </div>
          <h2 className="font-poppins text-2xl font-bold mb-2">
            Your score is ready
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Drop your number and we'll send your score on WhatsApp — plus tips you'll actually use on real dates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#1a1a1a]">
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {error && <div className="text-sm text-red-400 text-center">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            className="w-full font-semibold"
          >
            {submitting ? 'Saving…' : 'See my score'}
          </Button>
        </form>

        <button
          type="button"
          onClick={onSkip}
          className="mt-4 w-full text-gray-400 hover:text-gray-200 text-sm py-2 transition-colors"
        >
          Skip and see my score
        </button>
      </div>
    </div>
  );
};
