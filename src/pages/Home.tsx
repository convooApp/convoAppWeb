import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  MessageCircle,
  UserCheck,
  Instagram,
  X,
  Facebook,
  Linkedin,
  Heart,
  Zap,
  Users,
  Menu,
} from "lucide-react";
import "../landing.css";

const HERO_TRUST = ["Free to join", "Face verified", "Talk before you see"];

const NAV_DOTS = [
  { id: "top", label: "Home" },
  { id: "ways", label: "Two ways" },
  { id: "how", label: "How it works" },
  { id: "pov", label: "Vision" },
  { id: "rooms", label: "Rooms" },
  { id: "events", label: "Intros" },
  { id: "about", label: "Our Story" },
];

const NAV_LINKS = [
  { id: "ways", label: "Two ways" },
  { id: "how", label: "How it works" },
  { id: "pov", label: "Why Convoo" },
  { id: "rooms", label: "Rooms" },
  { id: "events", label: "Intros" },
  { id: "about", label: "Our Story" },
];

/* The two ways to meet on Convoo — equal weight, different doors. */
const PATHS = [
  {
    key: "event",
    kicker: "Open to your city",
    title: "Join a live event",
    blurb:
      "A live event opens inside the app every night. Show up while it's on and we pair you with people near you — nothing to plan, nobody to invite.",
    points: [
      "Matched with people in your city",
      "One tap to join — no code needed",
      "30 minutes of back-to-back conversations",
      "Come alone. Everyone else did too.",
    ],
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 6.5 12 12 15.5 14" />
      </svg>
    ),
  },
  {
    key: "room",
    kicker: "Invite only",
    title: "Host a room",
    blurb:
      "You're the matchmaker. Pick a night, share a code with your single friends, and everyone meets each other one-on-one while you host.",
    points: [
      "Share a 6-character code or an invite link",
      "Up to 20 people — distance doesn't matter",
      "You decide who's in the room",
      "You see every match your room makes",
    ],
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
        <circle cx="9.5" cy="7" r="3.2" />
        <path d="M22 20v-1.5a4 4 0 0 0-3-3.87" />
        <path d="M16.5 4.1a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const HOW_STEPS = [
  {
    title: "Get in",
    subtitle:
      "Join the live event in your city, or drop into a private room with the code your host shared.",
    pinkBg: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    ),
  },
  {
    title: "Talk first",
    subtitle:
      "You're paired one-on-one for three minutes. No photos, no profile to skim — just a real conversation.",
    pinkBg: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        stroke="#B83280"
        strokeWidth="1.5"
        fill="none"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Then decide",
    subtitle:
      "Photos unlock when the timer ends. You match only if you both say yes — and nobody is ever told who passed.",
    pinkBg: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        stroke="#B83280"
        strokeWidth="1.5"
        fill="none"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

const PILLARS = [
  {
    num: "01",
    title: "Talk first",
    sub: "Real conversations before photos. Build a connection on what actually matters.",
  },
  {
    num: "02",
    title: "No swiping",
    sub: "Intentional matching. Every interaction is deliberate, not accidental.",
  },
  {
    num: "03",
    title: "Your city or your circle",
    sub: "Live events match you locally. Rooms ignore distance entirely — your host decides who belongs.",
  },
];

const USE_CASES = [
  {
    who: "Creators & influencers",
    desc: "Drop a code to your followers and host a live dating room for your audience.",
  },
  {
    who: "College organizations",
    desc: "Run a speed-dating night for your campus club or Greek chapter.",
  },
  {
    who: "Run clubs & fitness crews",
    desc: "Turn your weekly group into a mixer — same energy, new connections.",
  },
  {
    who: "Friend groups & social hosts",
    desc: "Curate a blind date night for your circle without a venue or app fees.",
  },
  {
    who: "Local event organizers",
    desc: "Pair a Convoo room with your IRL event so guests connect before they arrive.",
  },
  {
    who: "Speed dating organizers",
    desc: "Replace your existing event infrastructure with one code. We handle the matching.",
  },
];

const EARN_ROWS = [
  { action: "Sign up", reward: "+5 Intros" },
  { action: "Join a live event or room", reward: "+3 Intros daily" },
  { action: "Invite a friend", reward: "+3 Intros each" },
  { action: "Rate on the App Store", reward: "+2 Intros" },
];

/* ═══════════════════════════════════════════════════════ */

const Home = () => {
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const spyRef = useRef<IntersectionObserver | null>(null);

  /* escape key for modal */
  useEffect(() => {
    if (!showEventDetails) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowEventDetails(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showEventDetails]);

  /* scroll spy */
  useEffect(() => {
    spyRef.current?.disconnect();
    spyRef.current = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }),
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    NAV_DOTS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) spyRef.current!.observe(el);
    });
    return () => spyRef.current?.disconnect();
  }, []);

  /* scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("lp-visible");
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight =
      document.querySelector<HTMLElement>("nav[data-site-nav]")?.offsetHeight ??
      0;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  /* ── render ─────────────────────────────────────────── */
  return (
    <>
      <div className="bg-[#0a0a0a] text-white">
        {/* ── Nav ─────────────────────────────────────────── */}
        <nav
          data-site-nav
          className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(10,10,10,.8)] border-b border-white/[0.06]"
        >
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-6 px-8 py-4">
            <a
              className="flex items-center gap-3 no-underline font-bold tracking-wide text-white"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("top");
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}assets/Convoo-logo-removebg-preview.png`}
                alt="Convoo"
                className="w-9 h-9 rounded-xl object-contain shadow-[0_10px_30px_rgba(184,50,128,.3)]"
              />
              <span className="text-lg">Convoo</span>
            </a>

            <div className="hidden md:flex gap-1 items-center">
              {NAV_LINKS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(id);
                  }}
                  className="no-underline text-[rgba(245,242,248,.7)] font-medium text-sm px-4 py-2 rounded-xl hover:bg-white/[0.08] hover:text-white transition-all"
                >
                  {label}
                </a>
              ))}
            </div>

            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-white/80 hover:bg-white/[0.08] hover:text-white transition-all"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div
            className={`md:hidden absolute left-0 right-0 top-full overflow-hidden border-b border-white/[0.06] bg-[rgba(10,10,10,.92)] backdrop-blur-xl shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] transition-[max-height,opacity] duration-300 ease-out ${
              mobileMenuOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="max-w-[1200px] mx-auto px-6 py-3 flex flex-col">
              {NAV_LINKS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    scrollTo(id);
                  }}
                  className="no-underline text-[rgba(245,242,248,.85)] font-medium text-base px-3 py-3 rounded-xl hover:bg-white/[0.08] hover:text-white transition-all"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </nav>
        {/* ── Right dot nav ───────────────────────────────── */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center">
          <div className="w-px h-5 bg-gradient-to-b from-transparent to-white/[0.08]" />
          {NAV_DOTS.map(({ id, label }, i) => {
            const active = activeSection === id;
            return (
              <div key={id} className="flex flex-col items-center">
                {i > 0 && (
                  <div
                    className="w-px transition-all duration-500"
                    style={{
                      height: "26px",
                      background: active
                        ? "linear-gradient(to bottom, rgba(184,50,128,.5), rgba(184,50,128,.15))"
                        : "rgba(255,255,255,.08)",
                    }}
                  />
                )}
                <button
                  onClick={() => scrollTo(id)}
                  aria-label={label}
                  className="group relative flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer"
                >
                  <span className="absolute right-full mr-4 px-3 py-1.5 rounded-xl bg-[#0f0f1e] border border-white/10 text-xs font-semibold text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                    {label}
                  </span>
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={
                      active
                        ? {
                            width: "10px",
                            height: "10px",
                            background: "#ff4fb3",
                            boxShadow:
                              "0 0 0 3px rgba(184,50,128,.2), 0 0 12px rgba(255,79,179,.5)",
                          }
                        : {
                            width: "5px",
                            height: "5px",
                            background: "rgba(255,255,255,.22)",
                          }
                    }
                  />
                </button>
              </div>
            );
          })}
          <div className="w-px h-5 bg-gradient-to-b from-white/[0.08] to-transparent" />
        </div>
        {/* ══════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════ */}
        <section
          id="top"
          style={{
            position: "relative",
            minHeight: "calc(100vh - 73px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Radial glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 60% 55% at 50% 42%, rgba(184,50,128,0.20) 0%, transparent 65%)",
            }}
          />

          {/* Concentric rings — centered behind the headline */}
          <div
            className="lp-ring lp-ring-1"
            style={{ left: "50%", top: "46%" }}
          />
          <div
            className="lp-ring lp-ring-2"
            style={{ left: "50%", top: "46%" }}
          />
          <div
            className="lp-ring lp-ring-3"
            style={{ left: "50%", top: "46%" }}
          />

          {/* Fine grid + top/bottom fade for depth */}
          <div className="lp-hero-grid" />
          <div className="lp-hero-fade" />

          {/* Main content — vertically centered */}
          <div
            style={{
              flex: 1,
              position: "relative",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="max-w-[1040px] mx-auto w-full px-6 text-center">
              <div>
                {/* Eyebrow — the two-ways promise */}

                {/* Headline */}
                <h1
                  data-reveal=""
                  style={{
                    margin: 0,
                    marginTop: "1.5rem",
                    marginBottom: "1.25rem",
                    fontSize: "clamp(2.4rem, 5.2vw, 4.25rem)",
                    lineHeight: 1.05,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    transitionDelay: "0.12s",
                  }}
                >
                  Stop <span className="lp-gradient-text">swiping.</span>
                  <br />
                  Start a real conversation.
                </h1>

                {/* Subtext */}
                <p
                  data-reveal=""
                  style={{
                    margin: "0 auto",
                    marginBottom: "2.25rem",
                    color: "rgba(255,255,255,0.62)",
                    fontSize: "1.0625rem",
                    lineHeight: 1.75,
                    maxWidth: "560px",
                    transitionDelay: "0.2s",
                  }}
                >
                  No swiping. No algorithms. Join a live event in your city, or
                  host a private room for your own people — either way you talk
                  first and see photos later.
                </p>

                {/* CTAs — App Store + Play Store */}
                <div
                  data-reveal=""
                  className="lp-store-row"
                  style={{ transitionDelay: "0.28s" }}
                >
                  {/* App Store */}
                  <a
                    href="https://apps.apple.com/us/app/convoo/id6746660683"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-store-btn lp-store-btn--primary"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          color: "rgba(255,255,255,0.65)",
                          lineHeight: 1,
                        }}
                      >
                        Available on the
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          lineHeight: 1.3,
                        }}
                      >
                        App Store
                      </div>
                    </div>
                  </a>

                  {/* Play Store */}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.convooapp.convoo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-store-btn"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 512 512"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M48 432 L48 80 L304 256 Z" fill="#34A853" />
                      <path
                        d="M48 80 L304 256 L384 176 L96 16 Q64 0 48 80Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M48 432 L304 256 L384 336 L96 496 Q64 512 48 432Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M304 256 L384 176 L448 216 Q480 240 448 296 L384 336 Z"
                        fill="#FBBC05"
                      />
                    </svg>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          color: "rgba(255,255,255,0.65)",
                          lineHeight: 1,
                        }}
                      >
                        Get it on
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          lineHeight: 1.3,
                        }}
                      >
                        Google Play
                      </div>
                    </div>
                  </a>
                </div>

                {/* Trust row */}
                <ul
                  data-reveal=""
                  className="lp-trust"
                  style={{ transitionDelay: "0.36s" }}
                >
                  {HERO_TRUST.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <button
            type="button"
            onClick={() => scrollTo("ways")}
            className="lp-scroll-cue"
            aria-label="Scroll to the two ways to meet"
          >
            <span>Pick your way in</span>
            <span className="lp-scroll-cue__line" />
          </button>
        </section>
        {/* ══════════════════════════════════════════════════
            SECTION 2 — TWO WAYS TO MEET
        ══════════════════════════════════════════════════ */}
        <section id="ways" className="py-24 px-8">
          <div className="max-w-[1100px] mx-auto">
            <div data-reveal="" className="text-center mb-14">
              <h2
                style={{
                  margin: 0,
                  marginBottom: "1rem",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Two ways to meet
              </h2>
              <p
                style={{
                  margin: "0 auto",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  maxWidth: "560px",
                }}
              >
                Walk into an open event with your city, or put your own people
                in a room. Same conversations, same reveal — you just choose
                who's on the other side.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {PATHS.map((path, i) => (
                <div
                  key={path.key}
                  data-reveal=""
                  className="lp-path-card"
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <div className="lp-path-card__head">
                    <span className="lp-path-card__icon">{path.icon}</span>
                    <span className="lp-path-card__kicker">{path.kicker}</span>
                  </div>

                  <h3 className="lp-path-card__title">{path.title}</h3>
                  <p className="lp-path-card__blurb">{path.blurb}</p>

                  <ul className="lp-path-card__list">
                    {path.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  <div className="lp-path-card__foot">
                    {path.key === "room" ? (
                      <button
                        type="button"
                        onClick={() => scrollTo("rooms")}
                        className="lp-path-card__link"
                      >
                        How rooms work →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => scrollTo("how")}
                        className="lp-path-card__link"
                      >
                        What a conversation looks like →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p
              data-reveal=""
              className="text-center mt-10 text-sm text-[rgba(255,255,255,0.4)]"
              style={{ transitionDelay: "0.24s" }}
            >
              Both live inside the same app. Nothing to set up, nothing to pay
              for.
            </p>
          </div>
        </section>
        {/* ══════════════════════════════════════════════════
            SECTION 3 — HOW IT WORKS
        ══════════════════════════════════════════════════ */}
        <section
          id="how"
          className="py-24 px-8"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          <div className="max-w-[1100px] mx-auto">
            <div data-reveal="" className="text-center mb-14">
              <h2
                style={{
                  margin: 0,
                  marginBottom: "1rem",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Same flow, either way
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  maxWidth: "520px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Event or room, the conversation works exactly the same. Thirty
                minutes live, three minutes per person, photos last.
              </p>

              {/* Spec strip */}
              <div className="lp-spec-strip">
                {[
                  { value: "30 min", label: "Live window" },
                  { value: "3 min", label: "Per conversation" },
                  { value: "30 sec", label: "To decide" },
                ].map((spec) => (
                  <div key={spec.label}>
                    <span className="lp-spec-strip__value">{spec.value}</span>
                    <span className="lp-spec-strip__label">{spec.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-step flow */}
            {/* Mobile: vertical list. Desktop: horizontal row */}
            <div className="relative flex flex-col gap-8 md:flex-row md:gap-0 md:max-w-[860px] md:mx-auto">
              {/* Connecting line (desktop only) */}
              <div
                className="hidden md:block absolute pointer-events-none"
                style={{
                  top: "36px",
                  left: "8%",
                  right: "8%",
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, rgba(184,50,128,0.2) 15%, rgba(184,50,128,0.2) 85%, transparent)",
                }}
              />

              {HOW_STEPS.map((step, i) => (
                <div
                  key={i}
                  data-reveal=""
                  className="flex flex-row items-start gap-5 md:flex-col md:items-center md:text-center md:flex-1 md:px-8"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  {/* Orb */}
                  <div
                    className="shrink-0"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      border: step.pinkBg
                        ? "1px solid #B83280"
                        : "1px solid rgba(255,255,255,0.08)",
                      background: step.pinkBg ? "#B83280" : "#15152a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: step.pinkBg
                        ? "0 0 32px rgba(184,50,128,0.4)"
                        : "none",
                      transition: "border-color 0.35s, box-shadow 0.35s",
                      animation: !step.pinkBg
                        ? "orb-pulse 2s ease-in-out infinite"
                        : undefined,
                      animationDelay: !step.pinkBg ? `${i * 0.4}s` : undefined,
                    }}
                    onMouseEnter={(e) => {
                      if (!step.pinkBg) {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "#B83280";
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "0 0 24px rgba(184,50,128,0.25)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!step.pinkBg) {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(255,255,255,0.08)";
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "none";
                      }
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col md:items-center md:mt-6">
                    <div
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.18em",
                        color: "#B83280",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        marginBottom: "0.3rem",
                      }}
                    >
                      Step {i + 1}
                    </div>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "white",
                        marginBottom: "0.3rem",
                        lineHeight: 1.25,
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.7,
                        marginTop: "0.2rem",
                      }}
                    >
                      {step.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ══════════════════════════════════════════════════
            SECTION 3 — VISION (why convoo)
        ══════════════════════════════════════════════════ */}
        <section id="pov" className="py-24 px-8">
          <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-20 items-start">
            {/* Left */}
            <div data-reveal="">
              <div style={{ position: "relative", paddingTop: "2rem" }}>
                {/* Decorative quote mark */}
                <div
                  style={{
                    position: "absolute",
                    top: "-1.5rem",
                    left: "-1rem",
                    fontSize: "9rem",
                    color: "rgba(184,50,128,0.15)",
                    fontFamily: "Georgia, serif",
                    lineHeight: 1,
                    pointerEvents: "none",
                    zIndex: 0,
                    userSelect: "none",
                  }}
                >
                  "
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h2
                    style={{
                      margin: 0,
                      marginBottom: "1.5rem",
                      fontSize: "clamp(2rem, 4vw, 3.2rem)",
                      fontWeight: 700,
                      lineHeight: 1.15,
                    }}
                  >
                    We don't judge a book
                    <br />
                    <em style={{ color: "#B83280", fontStyle: "italic" }}>
                      by its cover.
                    </em>
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.9,
                      maxWidth: "420px",
                    }}
                  >
                    On Convoo, you meet someone through conversation before you
                    ever see their photo. The connection comes first. The face
                    comes second.
                  </p>
                </div>
              </div>
            </div>

            {/* Right — 3 pillars */}
            <div data-reveal="" style={{ transitionDelay: "0.15s" }}>
              {PILLARS.map((p) => (
                <div
                  key={p.num}
                  className="lp-pillar"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2.5rem 1fr",
                    paddingTop: "1.8rem",
                    paddingBottom: "1.8rem",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      color: "#B83280",
                      fontWeight: 600,
                      paddingTop: "0.2rem",
                    }}
                  >
                    {p.num}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "white",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.6,
                      }}
                    >
                      {p.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ══════════════════════════════════════════════════
            SECTION 5 — ROOMS (host your own)
        ══════════════════════════════════════════════════ */}
        <section
          id="rooms"
          className="py-24 px-8"
          style={{ background: "#0f0f1a" }}
        >
          <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-20 items-start">
            {/* Left */}
            <div data-reveal="">
              <div className="lp-section-tag">Way two</div>
              <h2
                style={{
                  margin: 0,
                  marginBottom: "1.5rem",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                Put your single friends
                <br />
                <em style={{ color: "#B83280", fontStyle: "italic" }}>
                  in a room.
                </em>
              </h2>
              <p
                style={{
                  margin: 0,
                  marginBottom: "2rem",
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.85,
                }}
              >
                You're the matchmaker. Pick a night, share a code, and up to 20
                people meet each other one-on-one — no venue, no fees, no
                awkward mixer. Rooms work best when your guests come from
                different corners of your life.
              </p>

              {/* Use case list */}
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {USE_CASES.map((item) => (
                  <li
                    key={item.who}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      padding: "1rem 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#B83280",
                        flexShrink: 0,
                        marginTop: "0.45rem",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "white",
                        }}
                      >
                        {item.who}
                      </div>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "rgba(255,255,255,0.45)",
                          marginTop: "0.2rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — Room code card + host flow */}
            <div data-reveal="" style={{ transitionDelay: "0.2s" }}>
              <div
                style={{
                  border: "1px solid rgba(184,50,128,0.25)",
                  background: "#0f0f1e",
                  boxShadow:
                    "0 0 60px rgba(184,50,128,0.15), 0 0 120px rgba(184,50,128,0.06)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Radial overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(184,50,128,0.12) 0%, transparent 60%)",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />

                {/* Room status bar */}
                <div className="lp-room-bar">
                  <span className="lp-room-bar__left">
                    <span className="lp-live-dot" />
                    Goes live tonight
                  </span>
                  <span className="lp-room-bar__right">8 of 12 in</span>
                </div>

                {/* Card body */}
                <div
                  className="px-6 py-10 md:px-10 md:py-12"
                  style={{
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.22em",
                      color: "rgba(255,255,255,0.35)",
                      textTransform: "uppercase",
                      marginBottom: "1.25rem",
                    }}
                  >
                    YOUR ROOM CODE
                  </div>

                  <div
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      color: "#B83280",
                      textShadow: "0 0 30px rgba(184,50,128,0.4)",
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    K7WQ2M
                    <span className="lp-cursor" />
                  </div>

                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.45)",
                      marginBottom: "1.5rem",
                      lineHeight: 1.7,
                    }}
                  >
                    Share the code. They join. It goes live for 30 minutes.
                  </div>

                  <Link to="/apply-to-host" className="lp-room-card__cta">
                    Hosting more than 20 people? →
                  </Link>

                  <div
                    className="grid grid-cols-3 gap-3"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      paddingTop: "1.5rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    {[
                      { value: "6–20", label: "SEATS PER ROOM" },
                      { value: "30 min", label: "LIVE WINDOW" },
                      { value: "Any city", label: "NO DISTANCE LIMIT" },
                    ].map(({ value, label }) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: "clamp(1rem, 3.5vw, 1.5rem)",
                            fontWeight: 700,
                            color: "white",
                          }}
                        >
                          {value}
                        </span>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.55rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.35)",
                            marginTop: "0.2rem",
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Host flow */}
              <ol className="lp-host-flow">
                {[
                  {
                    title: "Set up your room",
                    desc: "Pick a night and a size — 6, 12 or 20 seats. Takes about a minute.",
                  },
                  {
                    title: "Invite from different circles",
                    desc: "Work, college, wherever. Rooms work best when your guests don't already know each other.",
                  },
                  {
                    title: "They meet, you host",
                    desc: "Everyone joins at the same time and talks one-on-one. Sit in or just host.",
                  },
                  {
                    title: "Watch the matches happen",
                    desc: "They match only if both say yes — and you see every match your room makes.",
                  },
                ].map((step, i) => (
                  <li key={step.title}>
                    <span className="lp-host-flow__num">{i + 1}</span>
                    <div>
                      <div className="lp-host-flow__title">{step.title}</div>
                      <div className="lp-host-flow__desc">{step.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
        {/* ══════════════════════════════════════════════════
            SECTION 6 — CONVOO INTROS
        ══════════════════════════════════════════════════ */}
        <section id="events" className="py-24 px-8">
          <div className="max-w-[1100px] mx-auto">
            <div data-reveal="" style={{ marginBottom: "3.5rem" }}>
              <h2
                style={{
                  margin: 0,
                  marginBottom: "1rem",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                One Intro.
                <br />
                <em style={{ color: "#B83280", fontStyle: "italic" }}>
                  One real conversation.
                </em>
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.5)",
                  maxWidth: "520px",
                  lineHeight: 1.85,
                }}
              >
                Intros are what you spend to talk to someone — in an event or in
                a room, it's the same currency. You start with five, you earn
                more for showing up, and nothing is deducted until a
                conversation actually begins.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              {/* Earn mechanics */}
              <div data-reveal="">
                <div
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.22em",
                    color: "#B83280",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                  }}
                >
                  HOW TO EARN
                </div>
                {EARN_ROWS.map((row) => (
                  <div
                    key={row.action}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.3rem 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "3px",
                          height: "2rem",
                          background: "#B83280",
                          borderRadius: "2px",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "rgba(255,255,255,0.8)",
                        }}
                      >
                        {row.action}
                      </span>
                    </div>
                    <span
                      style={{
                        border: "1px solid rgba(184,50,128,0.3)",
                        background: "rgba(184,50,128,0.1)",
                        borderRadius: "999px",
                        padding: "0.25rem 0.8rem",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        color: "#D94499",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.reward}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pass balance card */}
              <div
                data-reveal=""
                style={{
                  transitionDelay: "0.15s",
                  border: "1px solid rgba(184,50,128,0.4)",
                  background: "linear-gradient(135deg, #0f0f1e, #180a14)",
                  borderRadius: "20px",
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 0 60px rgba(184,50,128,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* Glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse at 75% 20%, rgba(184,50,128,0.14) 0%, transparent 55%)",
                    pointerEvents: "none",
                  }}
                />
                {/* Top row — label + balance */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.55rem",
                        letterSpacing: "0.22em",
                        color: "rgba(255,255,255,0.28)",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Convoo Intros
                    </div>
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color: "#fff",
                      }}
                    >
                      5
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.35)",
                        marginTop: "0.15rem",
                      }}
                    >
                      intros available
                    </div>
                  </div>
                  {/* Token icon */}
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      background: "rgba(184,50,128,0.2)",
                      border: "2px solid rgba(184,50,128,0.45)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ff4fb3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                </div>
                {/* Divider */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    height: "1px",
                    background: "rgba(245,242,248,0.06)",
                  }}
                />
                {/* Bottom — what a pass does */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  {[
                    "1 Intro = 1 live conversation",
                    "Works in live events and in rooms",
                    "Only spent when a conversation starts",
                    "Intros never expire",
                  ].map((line) => (
                    <div
                      key={line}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "#B83280",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ══════════════════════════════════════════════════
            SECTION 6 — ABOUT / OUR STORY
        ══════════════════════════════════════════════════ */}
        <section
          id="about"
          className="snap-section py-12 px-8"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          <div className="max-w-[860px] mx-auto">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-16">
              <span className="w-2 h-2 rounded-full bg-[#B83280] shadow-[0_0_0_6px_rgba(184,50,128,.2)]" />
              <span className="text-xs font-extrabold text-[rgba(245,242,248,.5)] tracking-[.2em] uppercase">
                Our story
              </span>
              <div className="flex-1 h-px bg-[rgba(245,242,248,.08)]" />
            </div>

            {/* Opening */}
            <div data-reveal="" className="mb-20">
              <h2 className="m-0 mb-6 text-[clamp(36px,5vw,60px)] leading-[1.1] font-black tracking-tight">
                We got tired of
                <br />
                <span className="bg-gradient-to-br from-[#ff4fb3] via-[#B83280] to-[#ff4fb3] text-transparent bg-clip-text">
                  swiping into nothing.
                </span>
              </h2>
              <p className="m-0 text-[rgba(245,242,248,.65)] text-xl leading-relaxed max-w-[620px]">
                Dating apps had every tool — algorithms, filters, photo stacks —
                and still left people feeling empty. We asked why. The answer
                was simple: you can't build real chemistry through a swipe.
              </p>
            </div>

            {/* Story beats */}
            <div className="relative pl-8 border-l border-[rgba(245,242,248,.1)] space-y-14">
              {[
                {
                  num: "01",
                  tag: "The problem",
                  title: "Dating apps weren't built for connection.",
                  body: "Swipe, match, ghost. Repeat. Success on these platforms is too heavily tied to looks, leaving most people feeling drained, not dating. The apps are built to keep you scrolling — not to actually find someone.",
                  extra: (
                    <div className="grid sm:grid-cols-2 gap-4 mt-6">
                      {[
                        {
                          title: "Appearance Over Substance",
                          body: "Success is too heavily tied to looks. Chemistry can't be judged from a photo.",
                          quote: '"Everyone just swipes..."',
                        },
                        {
                          title: "Emotional Fatigue",
                          body: "Current platforms harm self-esteem and mental wellness over time.",
                          quote: '"I feel drained using them."',
                        },
                        {
                          title: "Time Drain",
                          body: "Hours lost swiping instead of actually connecting with someone real.",
                          quote: '"Just wasted time."',
                        },
                        {
                          title: "Choice Overload",
                          body: "Too many options creates paralysis, not clarity.",
                          quote: '"Hard to know who\'s right."',
                        },
                      ].map((card) => (
                        <div
                          key={card.title}
                          className="p-5 rounded-2xl border border-[rgba(245,242,248,.1)] bg-[rgba(245,242,248,.04)]"
                        >
                          <div className="font-bold text-[#ff4fb3] text-sm mb-2">
                            {card.title}
                          </div>
                          <div className="text-[rgba(245,242,248,.65)] text-sm leading-relaxed mb-3">
                            {card.body}
                          </div>
                          <div className="text-[rgba(245,242,248,.4)] text-xs italic">
                            {card.quote}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  num: "02",
                  tag: "The idea",
                  title: "What if you talked first?",
                  body: "We flipped the model. No photo-based swiping. No endless feed. Instead, a live event opens inside the app every night. You get matched in real time and have a real conversation — before you ever see their photo.",
                  extra: (
                    <div className="mt-6 p-6 rounded-2xl bg-[radial-gradient(600px_200px_at_0%_50%,rgba(184,50,128,.15),transparent_70%)] border border-[rgba(245,242,248,.1)]">
                      <p className="m-0 text-[rgba(245,242,248,.9)] text-lg font-semibold leading-snug">
                        "Chemistry isn't something you see. It's something you
                        feel in a conversation."
                      </p>
                    </div>
                  ),
                },
                {
                  num: "03",
                  tag: "How it works",
                  title: "Live events. Private rooms. Same conversation.",
                  body: "Then people started asking to run their own. So rooms became the second way in: you host, you invite, and the app does the matching. Open event or private room, the conversation is identical — talk first, photos after.",
                  extra: (
                    <div className="grid sm:grid-cols-3 gap-4 mt-6">
                      {[
                        {
                          icon: (
                            <CalendarDays className="w-5 h-5" strokeWidth={2} />
                          ),
                          label: "Pick your way in",
                          desc: "An open event, or a room you host.",
                        },
                        {
                          icon: (
                            <MessageCircle
                              className="w-5 h-5"
                              strokeWidth={2}
                            />
                          ),
                          label: "Talk first",
                          desc: "Get matched live. No photos yet.",
                        },
                        {
                          icon: (
                            <UserCheck className="w-5 h-5" strokeWidth={2} />
                          ),
                          label: "Then connect",
                          desc: "Profiles unlock. You decide.",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="p-5 rounded-2xl border border-[rgba(245,242,248,.1)] bg-[rgba(245,242,248,.04)]"
                        >
                          <div className="text-[#ff4fb3] mb-3">{item.icon}</div>
                          <div className="font-bold text-white text-sm mb-1">
                            {item.label}
                          </div>
                          <div className="text-[rgba(245,242,248,.55)] text-sm">
                            {item.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  num: "04",
                  tag: "The community",
                  title: "Built city by city, with you.",
                  body: "We started in Atlanta, ran live events inside the app, listened, and iterated fast. Every city we launch in is community-driven — we expand where people actually want this. If that's your city, let us know.",
                  extra: (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {[
                        {
                          icon: (
                            <Users
                              className="w-4 h-4 text-[#ff4fb3]"
                              strokeWidth={2}
                            />
                          ),
                          label: "Community-first",
                        },
                        {
                          icon: (
                            <Zap
                              className="w-4 h-4 text-[#ff4fb3]"
                              strokeWidth={2}
                            />
                          ),
                          label: "Moving fast",
                        },
                        {
                          icon: (
                            <Heart
                              className="w-4 h-4 text-[#ff4fb3]"
                              strokeWidth={2}
                            />
                          ),
                          label: "Built for real connection",
                        },
                      ].map((tag) => (
                        <div
                          key={tag.label}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(184,50,128,.3)] bg-[rgba(184,50,128,.1)] text-sm font-semibold text-[rgba(245,242,248,.85)]"
                        >
                          {tag.icon}
                          {tag.label}
                        </div>
                      ))}
                    </div>
                  ),
                },
              ].map((beat, i) => (
                <div
                  key={beat.num}
                  data-reveal=""
                  className="relative"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="absolute -left-[calc(2rem+14px)] top-1 w-7 h-7 rounded-full bg-[#0a0a0a] border-2 border-[#B83280] grid place-items-center shadow-[0_0_12px_rgba(184,50,128,.4)]">
                    <span className="text-[9px] font-black text-[#ff4fb3] leading-none">
                      {beat.num}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[rgba(184,50,128,.8)] uppercase tracking-widest mb-3">
                    {beat.tag}
                  </div>
                  <h3 className="m-0 mb-4 text-2xl md:text-3xl font-black tracking-tight">
                    {beat.title}
                  </h3>
                  <p className="m-0 text-[rgba(245,242,248,.65)] text-base leading-relaxed">
                    {beat.body}
                  </p>
                  {beat.extra}
                </div>
              ))}
            </div>

            {/* Closing CTA */}
            <div
              data-reveal=""
              className="mt-20 p-8 md:p-10 rounded-3xl border border-[rgba(184,50,128,.3)] bg-gradient-to-br from-[rgba(184,50,128,.15)] to-[rgba(245,242,248,.03)] flex flex-col items-center text-center gap-6"
            >
              <div>
                <div className="font-black text-xl md:text-2xl mb-2">
                  Want to be part of it?
                </div>
                <div className="text-[rgba(245,242,248,.55)] text-sm">
                  Join tonight's live event, or host a room for your own people.
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {/* App Store Listing */}
                <a
                  href="https://apps.apple.com/us/app/convoo/id6746660683"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 border border-white/20 bg-white/10 text-white px-6 py-3 rounded-xl no-underline shadow-[0_4px_20px_rgba(0,0,0,.3)] transition-all hover:bg-white/15 hover:border-white/30"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      lineHeight: 1.2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 500,
                        opacity: 0.85,
                        letterSpacing: "0.04em",
                      }}
                    >
                      Available on the
                    </span>
                    <span style={{ fontSize: "1rem", fontWeight: 700 }}>
                      App Store
                    </span>
                  </div>
                </a>

                {/* Play Store */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.convooapp.convoo"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 border border-white/20 bg-white/10 text-white px-6 py-3 rounded-xl no-underline shadow-[0_4px_20px_rgba(0,0,0,.3)] transition-all hover:bg-white/15 hover:border-white/30"
                >
                  <svg width="22" height="22" viewBox="0 0 512 512" fill="none">
                    <path d="M48 432 L48 80 L304 256 Z" fill="#34A853" />
                    <path
                      d="M48 80 L304 256 L384 176 L96 16 Q64 0 48 80Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M48 432 L304 256 L384 336 L96 496 Q64 512 48 432Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M304 256 L384 176 L448 216 Q480 240 448 296 L384 336 Z"
                      fill="#FBBC05"
                    />
                  </svg>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      lineHeight: 1.2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 500,
                        opacity: 0.85,
                        letterSpacing: "0.04em",
                      }}
                    >
                      Get it on
                    </span>
                    <span style={{ fontSize: "1rem", fontWeight: 700 }}>
                      Google Play
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* ── Footer ──────────────────────────────────────── */}
        <footer className="py-12 px-8 mt-12 border-t border-[rgba(245,242,248,.08)]">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-[rgba(245,242,248,.5)]">
            <div>© {new Date().getFullYear()} Convoo. All rights reserved.</div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex gap-6 flex-wrap">
                <Link
                  to="/support"
                  className="text-[rgba(245,242,248,.65)] no-underline hover:text-white transition-colors"
                >
                  Support
                </Link>
                <Link
                  to="/privacy"
                  className="text-[rgba(245,242,248,.65)] no-underline hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  to="/terms"
                  className="text-[rgba(245,242,248,.65)] no-underline hover:text-white transition-colors"
                >
                  Terms
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/convooapp/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Convoo on Instagram"
                  className="h-10 w-10 rounded-2xl grid place-items-center border border-[rgba(245,242,248,.12)] bg-[rgba(245,242,248,.06)] text-[rgba(245,242,248,.7)] hover:text-white hover:bg-[rgba(245,242,248,.12)] transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/convooapp"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Convoo on X"
                  className="h-10 w-10 rounded-2xl grid place-items-center border border-[rgba(245,242,248,.12)] bg-[rgba(245,242,248,.06)] text-[rgba(245,242,248,.7)] hover:text-white hover:bg-[rgba(245,242,248,.12)] transition-all"
                >
                  <X className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61579067633531"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Convoo on Facebook"
                  className="h-10 w-10 rounded-2xl grid place-items-center border border-[rgba(245,242,248,.12)] bg-[rgba(245,242,248,.06)] text-[rgba(245,242,248,.7)] hover:text-white hover:bg-[rgba(245,242,248,.12)] transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/convooapp/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Convoo on LinkedIn"
                  className="h-10 w-10 rounded-2xl grid place-items-center border border-[rgba(245,242,248,.12)] bg-[rgba(245,242,248,.06)] text-[rgba(245,242,248,.7)] hover:text-white hover:bg-[rgba(245,242,248,.12)] transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Event Details Modal ──────────────────────────── */}
      {showEventDetails && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setShowEventDetails(false);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-[rgba(245,242,248,.12)] bg-[rgba(10,10,10,.95)] shadow-[0_20px_80px_rgba(0,0,0,.6)] p-7 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="font-extrabold text-xs text-[rgba(245,242,248,.5)] uppercase tracking-[.16em] mb-2">
                  How it works
                </div>
                <div className="text-2xl font-black tracking-tight text-white">
                  Matchmaking — live
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEventDetails(false)}
                className="h-10 w-10 rounded-2xl grid place-items-center border border-[rgba(245,242,248,.12)] bg-[rgba(245,242,248,.06)] text-[rgba(245,242,248,.8)] hover:text-white hover:bg-[rgba(245,242,248,.12)] transition-all cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="space-y-4 text-[rgba(245,242,248,.7)] leading-relaxed">
              {[
                {
                  step: "1) Open the Convoo app",
                  desc: "Download Convoo and open it when tonight's live event goes active.",
                },
                {
                  step: "2) Or enter a room code",
                  desc: "Hosting or invited to a private room? Enter the 6-character code your host shared.",
                },
                {
                  step: "3) Get matched live, in real time",
                  desc: "You're paired one-on-one for three minutes. Talk first. Photos unlock after the conversation.",
                },
              ].map(({ step, desc }) => (
                <div key={step}>
                  <div className="text-sm font-bold text-white mb-1">
                    {step}
                  </div>
                  <div className="text-sm">{desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3 flex-wrap justify-end">
              <button
                type="button"
                onClick={() => setShowEventDetails(false)}
                className="inline-flex items-center justify-center gap-2 border border-[rgba(245,242,248,.15)] bg-[rgba(245,242,248,.06)] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all hover:bg-[rgba(245,242,248,.12)] cursor-pointer"
              >
                Close
              </button>
              <a
                className="inline-flex items-center justify-center gap-2 border border-[rgba(184,50,128,.6)] bg-gradient-to-br from-[#B83280] to-[#ff4fb3] text-white px-5 py-3 rounded-xl no-underline font-bold text-sm shadow-[0_10px_40px_rgba(184,50,128,.25)] transition-all hover:shadow-[0_15px_50px_rgba(184,50,128,.35)]"
                href="https://apps.apple.com/us/app/convoo/id6746660683"
                target="_blank"
                rel="noreferrer"
              >
                Open Convoo (iOS)
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
