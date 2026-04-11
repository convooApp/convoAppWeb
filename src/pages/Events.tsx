import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type DeviceType = "ios" | "android" | "desktop";

const APP_STORE_URL =
  "https://apps.apple.com/app/apple-store/id6746660683?pt=127828181&ct=LiveOfflineEvent&mt=8";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.convooapp.convoo";

function detectDevice(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  if (/macintosh/.test(ua) && (navigator as any).maxTouchPoints > 1)
    return "ios";
  return "desktop";
}

function formatSeconds(ms: number) {
  return `${Math.ceil(ms / 1000)}s`;
}

const Events: React.FC = () => {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectMsLeft, setRedirectMsLeft] = useState<number>(2000);

  useEffect(() => {
    const d = detectDevice();
    setDevice(d);

    if (d === "ios") {
      const start = Date.now();
      const duration = 2000;

      const interval = window.setInterval(() => {
        setRedirectMsLeft(Math.max(0, duration - (Date.now() - start)));
      }, 100);

      const timer = window.setTimeout(() => {
        setIsRedirecting(true);
        window.location.assign(APP_STORE_URL);
      }, duration);

      return () => {
        window.clearTimeout(timer);
        window.clearInterval(interval);
      };
    }
  }, []);

  const goToIOS = () => {
    setIsRedirecting(true);
    window.location.assign(APP_STORE_URL);
  };

  const goToAndroid = () => {
    window.location.assign(PLAY_STORE_URL);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#B83280]/18 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-140px] h-[520px] w-[520px] rounded-full bg-[#B83280]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_480px_at_50%_0%,rgba(184,50,128,0.22),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <section className="relative px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mt-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-[0_14px_60px_-30px_rgba(184,50,128,0.9)]">
              <img
                src="assets/Convoo-logo-removebg-preview.png"
                alt="Convoo Logo"
                className="h-20 w-20 object-contain"
              />
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Let's <span className="text-[#B83280]">Convoo</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Live Dating Events, meet new people, and connect with others in
              real-time.
            </p>
          </div>

          {/* Content card */}
          <div className="mt-10">
            <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_30px_120px_-60px_rgba(184,50,128,0.65)] sm:p-8">
              {isRedirecting ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#B83280]" />
                  <p className="text-lg font-medium">
                    Redirecting to the App Store…
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    If nothing happens, use the button below.
                  </p>
                  <button
                    onClick={goToIOS}
                    className="mt-5 w-full rounded-xl bg-[#B83280] px-5 py-3.5 text-base font-semibold shadow-lg shadow-[#B83280]/25 transition hover:bg-[#9A2B6B] focus:outline-none focus:ring-2 focus:ring-[#B83280]/60"
                  >
                    Open App Store
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* iOS CTA */}
                  {(device === "ios" || device === "desktop") && (
                    <div>
                      <button
                        onClick={goToIOS}
                        className="group relative w-full overflow-hidden rounded-xl bg-[#B83280] px-5 py-4 text-base font-semibold shadow-lg shadow-[#B83280]/25 transition-transform duration-200 hover:scale-[1.01] hover:bg-[#9A2B6B] focus:outline-none focus:ring-2 focus:ring-[#B83280]/60"
                      >
                        <span className="relative z-10">Download for iOS</span>
                        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <span className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.0),rgba(255,255,255,0.18),rgba(255,255,255,0.0))]" />
                        </span>
                      </button>

                      {device === "ios" && (
                        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
                          Auto-opening the App Store in{" "}
                          <span className="font-semibold text-white">
                            {formatSeconds(redirectMsLeft)}
                          </span>
                          .
                        </div>
                      )}
                    </div>
                  )}

                  {/* Android CTA */}
                  {(device === "android" || device === "desktop") && (
                    <button
                      onClick={goToAndroid}
                      className="group relative w-full overflow-hidden rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-base font-semibold transition-transform duration-200 hover:scale-[1.01] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#B83280]/60"
                    >
                      <span className="relative z-10">Download for Android</span>
                    </button>
                  )}

                  {/* Value props */}
                  <div className="grid gap-3 sm:grid-cols-3 pt-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold">Chat First</div>
                      <div className="mt-1 text-sm text-white/60">
                        Real-time chat before profiles.
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold">Photos Later</div>
                      <div className="mt-1 text-sm text-white/60">
                        Photos reveal after chat.
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold">Mutual choice</div>
                      <div className="mt-1 text-sm text-white/60">
                        Continue only if both want to.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer links */}
            <div className="mt-10 text-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#B83280]/60"
              >
                Back to Home
              </Link>
              <p className="mt-4 text-xs text-white/45">
                © {new Date().getFullYear()} Convoo. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
