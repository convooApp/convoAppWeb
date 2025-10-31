import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Helper types
type SectionKey = 'benefits' | 'how' | 'usecases' | 'req' | 'ex' | 'contact';
type UseCaseType = 'local' | 'influencer' | 'brand' | null;

type RefMap = Record<SectionKey, HTMLDivElement | null>;

const Business: React.FC = () => {
  const [isVisible, setIsVisible] = useState<Record<SectionKey, boolean>>({
    benefits: false,
    how: false,
    usecases: false,
    req: false,
    ex: false,
    contact: false,
  });

  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseType>('local');

  const sectionRefs = useRef<RefMap>({
    benefits: null,
    how: null,
    usecases: null,
    req: null,
    ex: null,
    contact: null,
  });

  // Observe each section once and mark it visible when intersecting
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const nodes = Object.values(sectionRefs.current).filter(
      (el): el is HTMLDivElement => Boolean(el)
    );

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = (entry.target as HTMLDivElement).dataset.observeKey as SectionKey | undefined;
            if (key && !isVisible[key]) {
              setIsVisible((prev) => ({ ...prev, [key]: true }));
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
    // We intentionally exclude isVisible from deps to avoid re-observing after updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#B83280] via-[#B83280]/20 to-transparent opacity-20" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Be a Matchmaker with </span>
            <span className="text-[#B83280]">Convoo</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Be memorable with matches
          </p>
        </div>
      </section>

      <div className="text-center mt-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScmznqroaEvGlfo-gGfDS1XBuuE8lpiZqFEDu04Stp3-HJBVA/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-12 py-5 bg-[#B83280] text-white text-lg font-semibold rounded-lg hover:bg-[#9A2B6B] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#B83280]/50"
            >
              Apply to Become a Matchmaker
            </a>
          </div>

      {/* Benefits Section */}
      <section
        data-observe-key="benefits"
        ref={(el) => (sectionRefs.current.benefits = el as HTMLDivElement | null)}
        className={`pt-12 pb-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          isVisible.benefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Why Be a <span className="text-[#B83280]">Matchmaker</span> on Convoo?
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Connect with an audience that values authentic experiences and meaningful interactions
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: '💞',
                title: 'Be Memorable with Matches',
                desc:
                  'Every match on Convoo begins with a themed event. When two people connect, they\'ll see which event brought them together - imagine that being your brand or your theme.',
              },
              {
                emoji: '💸',
                title: 'Free to Partner',
                desc:
                  'Partnerships are completely free while we grow. It\'s the easiest way to get visibility with young, social, and local users - no budget needed.',
              },
              {
                emoji: '🎁',
                title: 'Run Giveaways',
                desc:
                  'Offer small perks like coffee vouchers, class passes, or exclusive discounts. Giveaways make your brand feel approachable and drive real-world visits.',
              },
              {
                emoji: '⚙️',
                title: 'Effortless Setup',
                desc:
                  'No complicated steps or ad platforms - just share your image or creative, and we\'ll handle the rest. Your brand can go live inside Convoo events within days.',
              },
              {
                emoji: '📍',
                title: 'Get Local Exposure',
                desc:
                  'Your brand is featured in daily themed chats that attract users in your area - helping you reach people nearby who are open to discovering new places.',
              },
              {
                emoji: '🔗',
                title: 'Gain Organic Mentions',
                desc:
                  'When users share their matches or event screens, your brand gets free exposure through word-of-mouth and social stories - without paid promotion.',
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-[#1A1A1A] p-8 rounded-lg transform transition-all duration-300 border border-transparent hover:-translate-y-2 hover:border-[#B83280]"
              >
                <div className="text-5xl mb-6">{benefit.emoji}</div>
                <h3 className="text-2xl font-bold text-[#B83280] mb-4">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Ads Work Section */}
      <section
        data-observe-key="how"
        ref={(el) => (sectionRefs.current.how = el as HTMLDivElement | null)}
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A] transition-all duration-1000 ${
          isVisible.how ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            How <span className="text-[#B83280]">Matchmakers</span> Work on Convoo
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Your brand or event appears naturally inside Convoo — reaching users during real conversations and daily themed events, not through pop-ups or intrusive banners.
          </p>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-[#1A1A1A] p-8 rounded-lg border border-[#B83280]/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#B83280] rounded-full flex items-center justify-center text-white font-bold text-xl mr-6">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#B83280] mb-3">Submit Your Creative</h3>
                  <p className="text-gray-300 mb-4">Provide us with:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-[#B83280] mr-2">•</span>
                      <span><strong>Image</strong> (your creative or promotional visual)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#B83280] mr-2">•</span>
                      <span><strong>Name</strong> (brand name or event title)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#B83280] mr-2">•</span>
                      <span><strong>Description</strong> (short caption or event details)</span>
                    </li>
                  </ul>
                  <p className="text-gray-400 mt-4 italic">We'll review and approve it before it goes live.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1A1A1A] p-8 rounded-lg border border-[#B83280]/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#B83280] rounded-full flex items-center justify-center text-white font-bold text-xl mr-6">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#B83280] mb-3">Approval & Scheduling</h3>
                  <p className="text-gray-300 mb-2">Approved creative appear as upcoming special events inside Convoo.</p>
                  <p className="text-gray-300">
                    We recommend submitting your creative <strong className="text-[#B83280]">at least 10 days before</strong> your desired event date so it can be properly scheduled and highlighted.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1A1A1A] p-8 rounded-lg border border-[#B83280]/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#B83280] rounded-full flex items-center justify-center text-white font-bold text-xl mr-6">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#B83280] mb-3">In-App Display</h3>
                  <div className="space-y-4">
                    <div className="bg-[#121212] p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">📅 10+ Days Before the Event:</h4>
                      <p className="text-gray-300">
                        Your creative is shown as a <strong>Special Event</strong> in the text feed — helping users discover it early.
                      </p>
                    </div>
                    <div className="bg-[#121212] p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">⏰ 24 Hours Before the Event:</h4>
                      <p className="text-gray-300">
                        Your creative's image and full description are displayed in-app to all users preparing for that day's event.
                      </p>
                    </div>
                    <p className="text-gray-400 italic mt-4">
                      This gives your brand both early visibility and peak-time exposure right before people join.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#1A1A1A] p-8 rounded-lg border border-[#B83280]/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#B83280] rounded-full flex items-center justify-center text-white font-bold text-xl mr-6">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#B83280] mb-3">During the Event</h3>
                  <p className="text-gray-300">
                    When the event goes live, users see your event title in the matchmaking screen - making your brand part of their shared experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-[#1A1A1A] p-8 rounded-lg border border-[#B83280]/30">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#B83280] rounded-full flex items-center justify-center text-white font-bold text-xl mr-6">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#B83280] mb-3">After the Event</h3>
                  <p className="text-gray-300">
                    Matched users will remember which event (and brand) brought them together - extending your brand's presence beyond the chat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section
        data-observe-key="usecases"
        ref={(el) => (sectionRefs.current.usecases = el as HTMLDivElement | null)}
        className={`py-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          isVisible.usecases ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="text-[#B83280]">Use Cases</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Here's how businesses, creators, and brands can use Convoo's in-app event feature to reach real people authentically
          </p>

          {/* Button Group */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedUseCase(selectedUseCase === 'local' ? null : 'local')}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                selectedUseCase === 'local'
                  ? 'bg-[#B83280] text-white shadow-lg shadow-[#B83280]/50'
                  : 'bg-[#1A1A1A] text-white border-2 border-[#B83280] hover:bg-[#B83280]/10'
              }`}
            >
              🏪 Local Businesses
            </button>
            <button
              onClick={() => setSelectedUseCase(selectedUseCase === 'influencer' ? null : 'influencer')}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                selectedUseCase === 'influencer'
                  ? 'bg-[#B83280] text-white shadow-lg shadow-[#B83280]/50'
                  : 'bg-[#1A1A1A] text-white border-2 border-[#B83280] hover:bg-[#B83280]/10'
              }`}
            >
              💫 Influencers & Creators
            </button>
            <button
              onClick={() => setSelectedUseCase(selectedUseCase === 'brand' ? null : 'brand')}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                selectedUseCase === 'brand'
                  ? 'bg-[#B83280] text-white shadow-lg shadow-[#B83280]/50'
                  : 'bg-[#1A1A1A] text-white border-2 border-[#B83280] hover:bg-[#B83280]/10'
              }`}
            >
              🛍️ Brands & Startups
            </button>
          </div>

          {/* Use Case Content */}
          <div className="min-h-[400px]">
            {selectedUseCase === 'local' && (
              <div className="bg-[#1A1A1A] p-8 rounded-lg border-2 border-[#B83280] animate-fadeIn">
                <div className="flex items-center mb-6">
                  <span className="text-5xl mr-4">🏪</span>
                  <h3 className="text-3xl font-bold text-[#B83280]">Local Businesses</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Goal:</h4>
                    <p className="text-gray-300">Get discovered by nearby users and bring them in.</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">Use it to:</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-[#B83280] mr-3 mt-1">•</span>
                        <span>Promote your café, gym, or local venue as a Special Event theme.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#B83280] mr-3 mt-1">•</span>
                        <span>Offer a giveaway or discount to participants.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#B83280] mr-3 mt-1">•</span>
                        <span>Display your image, name, and clickable website link 24 hours before the event — driving real traffic to your page.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#121212] p-6 rounded-lg border-l-4 border-[#B83280]">
                    <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                      <span className="mr-2">🪄</span> Example:
                    </h4>
                    <p className="text-gray-300 italic">
                      "Coffee Chats ☕" powered by your café appears as a daily event; users can tap your link the day before to learn more or visit your site.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedUseCase === 'influencer' && (
              <div className="bg-[#1A1A1A] p-8 rounded-lg border-2 border-[#B83280] animate-fadeIn">
                <div className="flex items-center mb-6">
                  <span className="text-5xl mr-4">💫</span>
                  <h3 className="text-3xl font-bold text-[#B83280]">Influencers & Creators</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Goal:</h4>
                    <p className="text-gray-300">Build community and expand your audience.</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">Use it to:</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-[#B83280] mr-3 mt-1">•</span>
                        <span>Host your own themed chat (like "Say It Without Saying It" or "Movie Scene Night").</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#B83280] mr-3 mt-1">•</span>
                        <span>Feature your image and a short bio in-app 24 hours before the event.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#B83280] mr-3 mt-1">•</span>
                        <span>Add a clickable link to your social or personal site for more reach.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#121212] p-6 rounded-lg border-l-4 border-[#B83280]">
                    <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                      <span className="mr-2">🪄</span> Example:
                    </h4>
                    <p className="text-gray-300 italic">
                      An influencer hosts "Talk Like a Creator" — their event appears with a link to their IG or website before going live.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedUseCase === 'brand' && (
              <div className="bg-[#1A1A1A] p-8 rounded-lg border-2 border-[#B83280] animate-fadeIn">
                <div className="flex items-center mb-6">
                  <span className="text-5xl mr-4">🛍️</span>
                  <h3 className="text-3xl font-bold text-[#B83280]">Brands & Startups</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Goal:</h4>
                    <p className="text-gray-300">Build awareness and brand recall through real interactions.</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">Use it to:</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-[#B83280] mr-3 mt-1">•</span>
                        <span>Sponsor themed events that align with your niche (fitness, lifestyle, dating, etc.).</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#B83280] mr-3 mt-1">•</span>
                        <span>Show your creative, description, and direct website link in-app before the event.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#B83280] mr-3 mt-1">•</span>
                        <span>Be remembered as the brand that started a connection.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#121212] p-6 rounded-lg border-l-4 border-[#B83280]">
                    <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                      <span className="mr-2">🪄</span> Example:
                    </h4>
                    <p className="text-gray-300 italic">
                      A fitness brand sponsors "Sweat & Connect" week — their image and link go live 24 hours before each event.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section
        data-observe-key="req"
        ref={(el) => (sectionRefs.current.req = el as HTMLDivElement | null)}
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A] transition-all duration-1000 ${
          isVisible.req ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Matchmaker <span className="text-[#B83280]">Requirements</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Simple requirements to get your brand featured in Convoo events
          </p>

          {/* What You Need */}
          <div className="bg-[#121212] p-8 rounded-lg border-2 border-[#B83280] mb-8">
            <h3 className="text-2xl font-bold text-[#B83280] mb-6 text-center">What You Need to Submit</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-white mb-2 text-lg">Your Creative</h4>
                <p className="text-sm text-gray-400">Square format (1080x1080px min)</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP • Max 5MB</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h4 className="font-bold text-white mb-2 text-lg">Event Name</h4>
                <p className="text-sm text-gray-400">Your brand or event title</p>
                <p className="text-xs text-gray-500 mt-1">Keep it short and memorable</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#B83280] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#B83280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-white mb-2 text-lg">Description</h4>
                <p className="text-sm text-gray-400">Brief caption or event details</p>
                <p className="text-xs text-gray-500 mt-1">Max 150 characters</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Content Standards */}
            <div className="bg-[#121212] p-8 rounded-lg border border-[#B83280]/30">
              <h3 className="text-2xl font-bold text-[#B83280] mb-6">Content Standards</h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  'Family-friendly and appropriate for 18+',
                  'Honest and clear messaging',
                  'Positive and welcoming tone',
                  'Accurate event details (date, time)',
                  'Compliant with local laws',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-[#B83280] mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Allowed */}
            <div className="bg-[#121212] p-8 rounded-lg border border-red-500/30">
              <h3 className="text-2xl font-bold text-red-500 mb-6">Not Allowed</h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  'Adult or explicit content',
                  'Misleading or false claims',
                  'Discriminatory content',
                  'Illegal products or services',
                  'Violence or disturbing imagery',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Note */}
          <div className="mt-8 bg-[#B83280]/10 border-l-4 border-[#B83280] p-6 rounded-lg">
            <p className="text-gray-300">
              <span className="font-bold text-[#B83280]">Pro Tip:</span> Submit your event at least <strong>10 days in advance</strong> for maximum visibility. We'll review and approve within 48 hours, then schedule it to appear in-app before your event date.
            </p>
          </div>
        </div>
      </section>

      {/* Example Screenshots Section */}
      <section
        id="examples"
        data-observe-key="ex"
        ref={(el) => (sectionRefs.current.ex = el as HTMLDivElement | null)}
        className={`py-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          isVisible.ex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Your event will look like this in the <span className="text-[#B83280]">Convoo</span> app
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            See how your hosted event appears to users at different stages
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Before Events */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#B83280] mb-6">Before Events</h3>
              <p className="text-gray-400 mb-6">Your event appears in the Special Events section, building anticipation</p>
              <div className="bg-[#121212] rounded-lg p-4 border-2 border-[#B83280] inline-block">
                <img
                  src="/assets/8850749F-B8DB-4789-805F-19F596C1BE22_1_201_a.jpeg"
                  alt="Event listing before the event"
                  className="rounded-lg max-w-full h-auto"
                  style={{ maxHeight: '600px' }}
                />
              </div>
            </div>

            {/* 24 Hours Before Event */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#B83280] mb-6">24 Hours Before Event</h3>
              <p className="text-gray-400 mb-6">Full hosted card with your image, description, and link appears prominently</p>
              <div className="bg-[#121212] rounded-lg p-4 border-2 border-[#B83280] inline-block">
                <img
                  src="/assets/43227C6A-8B4B-44B4-A386-E8CDB160CC9A_1_201_a.jpeg"
                  alt="Full event card 24 hours before"
                  className="rounded-lg max-w-full h-auto"
                  style={{ maxHeight: '600px' }}
                />
              </div>
            </div>

            {/* Event Live */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#B83280] mb-6">Event Live</h3>
              <p className="text-gray-400 mb-6">Users can join your hosted event and engage with your brand in real-time</p>
              <div className="bg-[#121212] rounded-lg p-4 border-2 border-[#B83280] inline-block">
                <img
                  src="/assets/96B26D96-3629-46AB-8933-B00D37B19CCF_1_201_a.jpeg"
                  alt="Event live with join button"
                  className="rounded-lg max-w-full h-auto"
                  style={{ maxHeight: '600px' }}
                />
              </div>
            </div>
         
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section
        id="contact"
        data-observe-key="contact"
        ref={(el) => (sectionRefs.current.contact = el as HTMLDivElement | null)}
        className={`py-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Become a <span className="text-[#B83280]">Matchmaker</span>
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Fill out the form below to start creating events on Convoo
          </p>
          <div className="text-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScmznqroaEvGlfo-gGfDS1XBuuE8lpiZqFEDu04Stp3-HJBVA/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-12 py-5 bg-[#B83280] text-white text-lg font-semibold rounded-lg hover:bg-[#9A2B6B] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#B83280]/50"
            >
              Apply to Become a Matchmaker
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <Link to="/" className="text-[#B83280] hover:text-[#9A2B6B] font-semibold">
            ← Back to Home
          </Link>
          <p className="text-gray-500 text-sm mt-4">© {new Date().getFullYear()} Convoo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Business;
