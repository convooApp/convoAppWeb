import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type SectionKey = 'hero' | 'how' | 'who';
type UseCaseType = 'community' | 'creator' | 'business' | null;
type RefMap = Record<SectionKey, HTMLDivElement | null>;

const Host: React.FC = () => {
  const [isVisible, setIsVisible] = useState<Record<SectionKey, boolean>>({
    hero: false,
    how: false,
    who: false,
  });

  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseType>('community');

  const sectionRefs = useRef<RefMap>({
    hero: null,
    how: null,
    who: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const nodes = Object.values(sectionRefs.current).filter(
      (el): el is HTMLDivElement => Boolean(el)
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const key = (entry.target as HTMLDivElement).dataset.observeKey as SectionKey | undefined;
          if (!key) return;
          setIsVisible((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSeMnGv9DEDomSQ6OnjNnBrszxmBjwPqefzgCx-zXqCR3i_2sw/viewform';

  const fade = (k: SectionKey) =>
    `transition-all duration-1000 ${isVisible[k] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;

  return (
    <div
      className="bg-[#07060a] text-[#f5f2f8] min-h-screen"
      style={{
        background:
          'radial-gradient(1200px 600px at 15% 10%, rgba(184,50,128,.18), transparent 60%), radial-gradient(900px 520px at 85% 15%, rgba(255,79,179,.10), transparent 60%), radial-gradient(900px 620px at 50% 90%, rgba(184,50,128,.14), transparent 62%), #07060a',
      }}
    >
      {/* Top */}
      <header
        data-observe-key="hero"
        ref={(el) => (sectionRefs.current.hero = el as HTMLDivElement | null)}
        className={`relative pt-20 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden ${fade('hero')}`}
      >
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link to="/" className="text-[rgba(245,242,248,.75)] hover:text-white no-underline">
              ← Back
            </Link>
          </div>

          <div className="text-center mt-10">
            <p className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[rgba(245,242,248,.65)]">
              <span className="w-2 h-2 rounded-full bg-[#B83280] shadow-[0_0_0_6px_rgba(184,50,128,.20)]" />
              Host a live event
            </p>

            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-5 leading-tight">
              Turn your community into a <span className="text-[#B83280]">live dating event</span>
            </h1>

            <p className="text-lg md:text-xl text-[rgba(245,242,248,.75)] max-w-3xl mx-auto">
              Create a private, code-based Convoo event for your campus, group, or audience.
              Everyone joins live — conversation first, profiles later.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap mt-8">
              <a
                href={FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[rgba(184,50,128,.6)] bg-gradient-to-br from-[#B83280] to-[#ff4fb3] text-white px-10 py-4 rounded-2xl no-underline font-bold text-base md:text-lg shadow-[0_10px_40px_rgba(184,50,128,.25)] transition-all hover:shadow-[0_15px_50px_rgba(184,50,128,.35)] hover:scale-[1.01]"
              >
                Apply to Host an Event
              </a>
            </div>

            <p className="text-sm text-[rgba(245,242,248,.55)] mt-4">
              Starting in Atlanta • Expanding city by city
            </p>
          </div>
        </div>
      </header>

      {/* How it works */}
      <section
        id="how"
        data-observe-key="how"
        ref={(el) => (sectionRefs.current.how = el as HTMLDivElement | null)}
        className={`py-16 px-4 sm:px-6 lg:px-8 ${fade('how')}`}
      >
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            How hosting works
          </h2>
          <p className="text-center text-[rgba(245,242,248,.7)] mb-10 max-w-2xl mx-auto">
            Simple setup. You bring the people. Convoo runs the live matchmaking.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Pick a time + share your code',
                desc: 'You get an event code for your community. Share it wherever your people already are.',
              },
              {
                step: '2',
                title: 'Everyone joins live',
                desc: 'At the event time, people enter the code and get matched in real time.',
              },
              {
                step: '3',
                title: 'Conversation first, profiles later',
                desc: 'The vibe stays intentional because connection starts with conversation — not scrolling.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-gradient-to-br from-[rgba(245,242,248,.06)] to-[rgba(245,242,248,.02)] hover:border-[rgba(184,50,128,.3)] transition-all"
              >
                <div className="w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br from-[rgba(184,50,128,.2)] to-[rgba(184,50,128,.1)] border border-[rgba(184,50,128,.3)] font-black text-lg mb-6">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-[rgba(245,242,248,.7)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section
        id="who"
        data-observe-key="who"
        ref={(el) => (sectionRefs.current.who = el as HTMLDivElement | null)}
        className={`py-16 px-4 sm:px-6 lg:px-8 ${fade('who')}`}
      >
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Who it’s for
          </h2>
          <p className="text-center text-[rgba(245,242,248,.7)] mb-10 max-w-2xl mx-auto">
            If you have a community, you can host a Convoo event.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { key: 'community' as const, label: '🏫 Campus & Communities' },
              { key: 'creator' as const, label: '🎥 Creators & Influencers' },
              { key: 'business' as const, label: '📍 Venues & Local Brands' },
            ].map((b) => {
              const active = selectedUseCase === b.key;
              return (
                <button
                  key={b.key}
                  onClick={() => setSelectedUseCase(active ? null : b.key)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-br from-[#B83280] to-[#ff4fb3] text-white shadow-[0_10px_40px_rgba(184,50,128,.25)]'
                      : 'border border-[rgba(245,242,248,.15)] bg-[rgba(245,242,248,.06)] text-white hover:bg-[rgba(245,242,248,.12)] hover:border-[rgba(245,242,248,.25)]'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>

          <div className="min-h-[260px]">
            {selectedUseCase === 'community' && (
              <div className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-[radial-gradient(800px_300px_at_30%_0%,rgba(184,50,128,.2),transparent_70%),rgba(245,242,248,.04)]">
                <h3 className="text-2xl font-bold text-[#B83280] mb-2">Campus & Communities</h3>
                <p className="text-[rgba(245,242,248,.75)] leading-relaxed">
                  Run a live event for your college group, club, alumni network, or friend circle.
                  You set the moment — Convoo creates the matching energy.
                </p>
                <p className="text-[rgba(245,242,248,.6)] mt-4 italic">
                  Example: “GSU Friday Night” - everyone joins with a code at 7 PM.
                </p>
              </div>
            )}

            {selectedUseCase === 'creator' && (
              <div className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-[radial-gradient(800px_300px_at_30%_0%,rgba(184,50,128,.2),transparent_70%),rgba(245,242,248,.04)]">
                <h3 className="text-2xl font-bold text-[#B83280] mb-2">Creators & Influencers</h3>
                <p className="text-[rgba(245,242,248,.75)] leading-relaxed">
                  Host a themed night for your audience. You bring people together — and the event becomes a
                  shared experience they remember.
                </p>
                <p className="text-[rgba(245,242,248,.6)] mt-4 italic">
                  Example: “Green Flag Night” hosted by you.
                </p>
              </div>
            )}

            {selectedUseCase === 'business' && (
              <div className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-[radial-gradient(800px_300px_at_30%_0%,rgba(184,50,128,.2),transparent_70%),rgba(245,242,248,.04)]">
                <h3 className="text-2xl font-bold text-[#B83280] mb-2">Venues & Local Brands</h3>
                <p className="text-[rgba(245,242,248,.75)] leading-relaxed">
                  Bring foot traffic and make your place part of the story. Host a Convoo event window — people show
                  up with intent, not just to browse.
                </p>
                <p className="text-[rgba(245,242,248,.6)] mt-4 italic">
                  Example: “Coffee Chats” at your café.
                </p>
              </div>
            )}

            {selectedUseCase === null && (
              <div className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-gradient-to-br from-[rgba(245,242,248,.06)] to-[rgba(245,242,248,.02)] text-[rgba(245,242,248,.75)]">
                Pick a category above to see examples.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <Link to="/" className="text-[#B83280] hover:text-[#9A2B6B] font-semibold no-underline">
            Convoo
          </Link>

          <div className="flex gap-6 flex-wrap">
            <Link to="/support" className="text-[rgba(245,242,248,.65)] no-underline hover:text-white transition-colors">
              Support
            </Link>
            <Link to="/privacy" className="text-[rgba(245,242,248,.65)] no-underline hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-[rgba(245,242,248,.65)] no-underline hover:text-white transition-colors">
              Terms
            </Link>
          </div>

          <p className="text-[rgba(245,242,248,.55)] text-sm">
            © {new Date().getFullYear()} Convoo
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Host;
