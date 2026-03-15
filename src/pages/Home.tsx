import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
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
} from "lucide-react";
import "../landing.css";

dayjs.extend(utc);

interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  duration: string;
}

const NAV_DOTS = [
  { id: "top", label: "Home" },
  { id: "how", label: "How it works" },
  { id: "pov", label: "Vision" },
  { id: "live", label: "Community" },
  { id: "events", label: "Passes" },
  { id: "about", label: "Our Story" },
];

const TICKER = [
  "Conversation first",
  "No swiping",
  "Atlanta, GA",
  "Live at 7 PM",
  "Date Differently",
  "Real connections",
  "City-only matching",
  "Talk before you see",
  "No ghosting games",
  "You'll actually like them",
  "7 PM every night",
];

const HOW_STEPS = [
  {
    title: "Join the live event",
    subtitle: "Every night at 7 PM, a live event opens inside the app.",
    pinkBg: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      >
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Start a conversation",
    subtitle: "1-on-1 text chat. No photos yet. Just words.",
    pinkBg: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="#B83280"
        strokeWidth="1.5"
        fill="none"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Conversation sparks",
    subtitle: "Prompts keep the chat flowing naturally.",
    pinkBg: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="#B83280"
        strokeWidth="1.5"
        fill="none"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "Profiles reveal",
    subtitle: "After the convo, photos are unlocked.",
    pinkBg: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="#B83280"
        strokeWidth="1.5"
        fill="none"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Both decide to match",
    subtitle: "Mutual opt-in only. No pressure, ever.",
    pinkBg: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="#B83280"
        strokeWidth="1.5"
        fill="none"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
    title: "City-only",
    sub: "Every match is within your city. Hyper-local by design.",
  },
];

const USE_CASES = [
  { who: "Creators & influencers", desc: "Drop a code to your followers and host a live dating room for your audience." },
  { who: "College organizations", desc: "Run a speed-dating night for your campus club or Greek chapter." },
  { who: "Run clubs & fitness crews", desc: "Turn your weekly group into a mixer — same energy, new connections." },
  { who: "Friend groups & social hosts", desc: "Curate a blind date night for your circle without a venue or app fees." },
  { who: "Local event organizers", desc: "Pair a Convoo room with your IRL event so guests connect before they arrive." },
];

const EARN_ROWS = [
  { action: "Show up at 7 PM daily", reward: "+2 Passes" },
  { action: "Invite a friend", reward: "+1 Pass each" },
  { action: "Rate on App Store", reward: "+2 Passes" },
];

/* ═══════════════════════════════════════════════════════ */

const Home = () => {
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [todayEvent, setTodayEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [activeSection, setActiveSection] = useState("top");
  const [countdown, setCountdown] = useState("");
  const spyRef = useRef<IntersectionObserver | null>(null);

  /* countdown to 7 PM local */
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(19, 0, 0, 0);
      if (now >= target) {
        setCountdown("Live now");
        return;
      }
      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`Opens in ${h}h ${m}m`);
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);

  const isToday = (dateString: string) => {
    const eventDate = dayjs.utc(dateString).format("YYYY-MM-DD");
    const todayInUTC = dayjs().utc().format("YYYY-MM-DD");
    return eventDate === todayInUTC;
  };

  /* fetch today's event */
  useEffect(() => {
    (async () => {
      try {
        setLoadingEvent(true);
        const now = dayjs();
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("start_time", now.format("YYYY-MM-DD"))
          .order("start_time", { ascending: true });
        if (!error) {
          const events = (data as Event[]) || [];
          const found = events.find((e) => isToday(e.start_time));
          if (found) setTodayEvent(found);
        }
      } finally {
        setLoadingEvent(false);
      }
    })();
  }, []);

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

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* ── render ─────────────────────────────────────────── */
  return (
    <>
      <div className="bg-[#0a0a0a] text-white min-h-screen">
        {/* ── Nav ─────────────────────────────────────────── */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(10,10,10,.8)] border-b border-white/[0.06]">
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
              {[
                { id: "how", label: "How it works" },
                { id: "pov", label: "Why Convoo" },
                { id: "live", label: "Community" },
                { id: "events", label: "Passes" },
                { id: "about", label: "Our Story" },
              ].map(({ id, label }) => (
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
                "radial-gradient(ellipse 70% 60% at 75% 45%, rgba(184,50,128,0.18) 0%, transparent 60%)",
            }}
          />

          {/* Concentric rings */}
          <div
            className="lp-ring lp-ring-1"
            style={{ left: "75%", top: "50%" }}
          />
          <div
            className="lp-ring lp-ring-2"
            style={{ left: "75%", top: "50%" }}
          />
          <div
            className="lp-ring lp-ring-3"
            style={{ left: "75%", top: "50%" }}
          />

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
            <div className="max-w-[1200px] mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-12 items-center">
              {/* Left */}
              <div data-reveal="">
                {/* Headline */}
                <h1
                  style={{
                    margin: 0,
                    marginBottom: "1.25rem",
                    fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
                    lineHeight: 1.06,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Stop{" "}
                  <span style={{ color: "#B83280" }}>feeling nothing.</span>
                  <br />
                  Start a real conversation.
                </h1>

                {/* Subtext */}
                <p
                  style={{
                    margin: 0,
                    marginBottom: "1.75rem",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    maxWidth: "480px",
                  }}
                >
                  No swiping. No algorithms. Every night at 7 PM, Convoo matches
                  you live with someone real — and you talk before you ever see
                  their face.
                </p>

                {/* CTAs */}
                <div
                  style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}
                >
                  <a
                    href="#how"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("how");
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.06)",
                      color: "white",
                      padding: "0.875rem 1.75rem",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    How it works
                  </a>
                </div>
              </div>

              {/* Right — Today's Event card (desktop only) */}
              <aside
                data-reveal=""
                className="hidden lg:block"
                style={{
                  transitionDelay: "0.15s",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderLeft: "3px solid #B83280",
                  borderRadius: "16px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                  padding: "1.5rem",
                  backdropFilter: "blur(8px)",
                  animation:
                    countdown === "Live now"
                      ? "pulse-border 1.5s ease-in-out infinite"
                      : undefined,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.25rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    Today's event
                  </span>
                  {countdown && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: countdown === "Live now" ? "#ff4fb3" : "#B83280",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {countdown}
                    </span>
                  )}
                </div>

                {loadingEvent ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B83280]" />
                  </div>
                ) : todayEvent ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-[rgba(245,242,248,.4)] uppercase tracking-wider mb-1">
                        Name
                      </div>
                      <div className="text-base font-bold text-white">
                        {todayEvent.title}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[rgba(245,242,248,.4)] uppercase tracking-wider mb-1">
                        Description
                      </div>
                      <div className="text-sm text-[rgba(245,242,248,.7)]">
                        {todayEvent.description}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[rgba(245,242,248,.4)] uppercase tracking-wider mb-1">
                        Where
                      </div>
                      <a
                        href="https://apps.apple.com/us/app/convoo/id6746660683"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-[#ff4fb3] hover:text-[#B83280] transition-colors font-semibold no-underline flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.05 13.5c-.91 0-1.82-.3-2.58-.86l-2.2 2.2c.56.76.86 1.67.86 2.58 0 2.91-2.36 5.27-5.27 5.27S2.29 21.33 2.29 18.42s2.36-5.27 5.27-5.27c.91 0 1.82.3 2.58.86l2.2-2.2c-.56-.76-.86-1.67-.86-2.58 0-2.91 2.36-5.27 5.27-5.27s5.27 2.36 5.27 5.27-2.36 5.27-5.27 5.27zm0-8.54c-1.82 0-3.27 1.45-3.27 3.27s1.45 3.27 3.27 3.27 3.27-1.45 3.27-3.27-1.45-3.27-3.27-3.27z" />
                        </svg>
                        Open in iOS App
                      </a>
                      <div
                        style={{
                          marginTop: "0.6rem",
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        Tonight at 7 PM · Live inside the app
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    No events today
                  </div>
                )}
              </aside>
            </div>
          </div>

          {/* Ticker strip — always at the bottom of the viewport */}
          <div
            style={{
              flexShrink: 0,
              height: "40px",
              background: "rgba(0,0,0,0.5)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div className="lp-ticker-track">
              {[0, 1].map((copy) => (
                <span
                  key={copy}
                  style={{ display: "inline-flex", alignItems: "center" }}
                >
                  {TICKER.map((item, j) => (
                    <span
                      key={j}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "1.25rem",
                        marginRight: "1.25rem",
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        color: "rgba(255,255,255,0.35)",
                        textTransform: "uppercase",
                      }}
                    >
                      {item}
                      <span style={{ color: "#B83280" }}>·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>
        {/* ══════════════════════════════════════════════════
            SECTION 2 — HOW IT WORKS
        ══════════════════════════════════════════════════ */}
        <section id="how" className="py-24 px-8">
          <div className="max-w-[1100px] mx-auto">
            <div data-reveal="" className="text-center mb-16">
              <h2
                style={{
                  margin: 0,
                  marginBottom: "1rem",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                How it works
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
                Convoo is designed for presence and intent. A short flow that
                gets you into real conversations fast.
              </p>
            </div>

            {/* 5-step flow */}
            {/* Mobile: vertical list. Desktop: horizontal row */}
            <div className="relative flex flex-col gap-4 md:flex-row md:gap-0">
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
                  className="flex flex-row items-center gap-4 md:flex-col md:items-center md:text-center md:flex-1 md:px-4"
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
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.65,
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
        <section
          id="pov"
          className="py-24 px-8"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
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
            SECTION 4 — COMMUNITY / EVENTS
        ══════════════════════════════════════════════════ */}
        <section
          id="live"
          className="py-24 px-8"
          style={{ background: "#0f0f1a" }}
        >
          <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-20 items-start">
            {/* Left */}
            <div data-reveal="">
              <h2
                style={{
                  margin: 0,
                  marginBottom: "1.5rem",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                Host your own
                <br />
                <em style={{ color: "#B83280", fontStyle: "italic" }}>
                  dating event.
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
                Convoo lets anyone create a private live dating room — no venue,
                no ticket system, no third-party tools. Generate a unique event
                code, share it with your community, and your guests unlock a
                live matching room inside the app. Fully access-controlled and
                real-time.
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
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "white" }}>
                        {item.who}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", marginTop: "0.2rem", lineHeight: 1.6 }}>
                        {item.desc}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pink callout */}
              <div
                style={{
                  marginTop: "2rem",
                  padding: "1.2rem 1.5rem",
                  borderLeft: "2px solid #B83280",
                  background: "rgba(184,50,128,0.08)",
                  fontSize: "0.85rem",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.75,
                }}
              >
                "Generate a unique code. Share it anywhere — Instagram, group
                chat, email list. Your guests tap it in the app and land in a
                live matching room built just for them."
              </div>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeMnGv9DEDomSQ6OnjNnBrszxmBjwPqefzgCx-zXqCR3i_2sw/viewform"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "1.5rem",
                  border: "1px solid rgba(184,50,128,0.5)",
                  background: "rgba(184,50,128,0.1)",
                  color: "white",
                  padding: "0.85rem 1.5rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(184,50,128,0.2)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(184,50,128,0.8)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(184,50,128,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(184,50,128,0.5)";
                }}
              >
                Apply to host an event →
              </a>
            </div>

            {/* Right — Terminal card */}
            <div
              data-reveal=""
              style={{
                transitionDelay: "0.2s",
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

              {/* macOS bar */}
              <div
                style={{
                  padding: "0.75rem 1.2rem",
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#e05252",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#e0b852",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#52c57a",
                    display: "inline-block",
                  }}
                />
              </div>

              {/* Card body */}
              <div
                style={{
                  padding: "3rem 2.5rem",
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
                    marginBottom: "1.5rem",
                  }}
                >
                  ENTER EVENT CODE
                </div>

                <div
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "2.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: "#B83280",
                    textShadow: "0 0 30px rgba(184,50,128,0.4)",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  CONVOO26
                  <span className="lp-cursor" />
                </div>
                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    paddingTop: "1.8rem",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  {[
                    { value: "Private", label: "ACCESS CONTROLLED" },
                    { value: "Live", label: "REAL-TIME" },
                    { value: "Hybrid", label: "DATING FOCUSED" },
                  ].map(({ value, label }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {value}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.6rem",
                          letterSpacing: "0.16em",
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
          </div>
        </section>
        {/* ══════════════════════════════════════════════════
            SECTION 5 — CONVOO PASSES
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
                One Pass.
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
                Passes are Convoo's in-app currency. Use 1 Pass to join an extra
                live event and have one more conversation. No Pass used until a
                conversation actually starts.
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
                      Convoo Passes
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
                      passes available
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
                    "1 Pass = 1 extra live conversation",
                    "Only used when a conversation starts",
                    "Passes don't expire — use them anytime",
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
          className="py-24 px-8"
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
                  body: "We flipped the model. No photo-based swiping. No endless feed. Instead, every night at 7 PM, a live event opens inside the app. You get matched with someone real-time and have a real conversation — before you ever see their photo.",
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
                  title: "Live events. Real-time matching. Inside the app.",
                  body: "Every night at 7 PM, a live event opens inside Convoo. You join, get matched with someone in real-time, and have a real conversation before you ever see their photo. No algorithms. No swiping. Just presence.",
                  extra: (
                    <div className="grid sm:grid-cols-3 gap-4 mt-6">
                      {[
                        {
                          icon: (
                            <CalendarDays className="w-5 h-5" strokeWidth={2} />
                          ),
                          label: "Join the event",
                          desc: "Every night at 7 PM inside the app.",
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
                  Join a live event inside the app or create one with a code.
                </div>
              </div>
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
                  desc: "Download Convoo on iOS and open it at 7 PM when the live event goes active.",
                },
                {
                  step: "2) Enter an event code (optional)",
                  desc: "For private or community events, enter a code to unlock a specific matching room.",
                },
                {
                  step: "3) Get matched live, in real time",
                  desc: "You're matched with someone instantly. Talk first. Photos unlock after the conversation.",
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
