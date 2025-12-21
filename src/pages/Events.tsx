import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type DeviceType = 'ios' | 'android' | 'desktop';

const APP_STORE_URLS = {
  ios: 'https://apps.apple.com/app/apple-store/id6746660683?pt=127828181&ct=LiveOfflineEvent&mt=8',
} as const;

// Your Play Console “opt-in” link (Closed test). Put the real one here.
const PLAY_OPT_IN_URL = 'https://play.google.com/store/apps/details?id=com.convooapp.convoo';

// Your backend endpoint (recommended: Supabase Edge Function) that stores email in Supabase
// and (optionally) queues you to add them to the Google Group manually.
const ANDROID_SIGNUP_ENDPOINT = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/android_closed_test`;

function detectDevice(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  // iPadOS sometimes reports as Mac
  if (/macintosh/.test(ua) && (navigator as any).maxTouchPoints > 1) return 'ios';

  return 'desktop';
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
}

const Events: React.FC = () => {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Android closed test capture
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const emailOk = useMemo(() => isValidEmail(email), [email]);
  const isAndroidFlow = device === 'android' || device === 'desktop';

  useEffect(() => {
    const d = detectDevice();
    setDevice(d);

    // Auto-redirect only for iOS
    if (d === 'ios') {
      const timer = window.setTimeout(() => {
        setIsRedirecting(true);
        window.location.assign(APP_STORE_URLS.ios);
      }, 2000);

      return () => window.clearTimeout(timer);
    }
  }, []);

  const goToIOS = () => {
    setIsRedirecting(true);
    window.location.assign(APP_STORE_URLS.ios);
  };

  const goToPlayOptIn = () => {
    window.location.assign(PLAY_OPT_IN_URL);
  };

  const submitAndroid = async () => {
    setTouched(true);
    setErrorMsg('');
    if (!emailOk) return;
    try {
      setStatus('submitting');
      const { error } = await supabase.functions.invoke('android_closed_test', {
        body: {
          email: email.trim().toLowerCase(),
          source: 'events-page',
          device,
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString(),
        },
      });
      if (error) {
        throw new Error(error.message || 'Request failed');
      }
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Could not submit right now. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#121212] text-white min-h-screen">
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#B83280] via-[#B83280]/10 to-transparent opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B83280]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B83280]/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#B83280] rounded-2xl mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get the <span className="text-[#B83280]">Convoo</span> App
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join nightly events and meet people through real-time conversation — before profiles.
            </p>
          </div>

          {isRedirecting ? (
            <div className="py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#B83280] mx-auto mb-6" />
              <p className="text-xl text-gray-300">Redirecting you to the App Store...</p>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-6">
              {/* iOS CTA (iOS + desktop) */}
              {(device === 'ios' || device === 'desktop') && (
                <button
                  onClick={goToIOS}
                  className="w-full py-4 px-6 bg-[#B83280] text-white text-xl font-semibold rounded-lg hover:bg-[#9A2B6B] transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-[#B83280]/50"
                >
                  Download for iOS
                </button>
              )}

              {/* Android Closed Test Capture (Android + desktop) */}
              {isAndroidFlow && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur text-left">
                  <h2 className="text-lg font-semibold">Android closed testing</h2>
                  <p className="mt-1 text-sm text-gray-300">
                    Enter the email you use on the Play Store. We’ll add you to the tester list.
                  </p>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched(true)}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B83280]/60"
                    />
                    {touched && !emailOk && (
                      <p className="mt-2 text-sm text-red-300">Please enter a valid email.</p>
                    )}
                  </div>

                  {status === 'error' && <p className="mt-3 text-sm text-red-300">{errorMsg}</p>}

                  {status === 'success' ? (
                    <div className="mt-4 rounded-xl border border-[#B83280]/30 bg-[#B83280]/10 px-4 py-3">
                      <p className="font-semibold text-white">Submitted.</p>
                      <p className="mt-1 text-sm text-gray-200/80">
                        Closed test access may take a few minutes to activate after we add you.
                      </p>

                      <button
                        onClick={goToPlayOptIn}
                        className="mt-4 w-full py-3.5 px-6 rounded-xl bg-[#B83280] text-white font-semibold hover:bg-[#9A2B6B] transition"
                      >
                        Open Play test link
                      </button>

                      <p className="mt-3 text-xs text-gray-400">
                        If you see “not available”, try again in a few minutes using the same Play
                        Store account.
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={submitAndroid}
                        disabled={status === 'submitting'}
                        className="mt-4 w-full py-3.5 px-6 rounded-xl bg-[#B83280] text-white font-semibold hover:bg-[#9A2B6B] transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {status === 'submitting' ? 'Submitting...' : 'Join Android tester list'}
                      </button>

                      <div className="mt-3 text-xs text-gray-400 leading-relaxed">
                        By submitting, you agree to receive Android access updates from Convoo.
                      </div>
                    </>
                  )}
                </div>
              )}

              <p className="text-gray-400 text-sm text-center">
                {device === 'ios'
                  ? 'You may be redirected automatically.'
                  : 'Android access is via closed testing.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <Link to="/" className="text-[#B83280] hover:text-[#9A2B6B] font-semibold">
            ← Back to Home
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            © {new Date().getFullYear()} Convoo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Events;
