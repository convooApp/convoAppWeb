import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface FormData {
  name: string;
  email: string;
  phone: string;
  communityName: string;
  communitySize: string;
  hostingAs: string;
  timeWindow: string;
  additionalNotes: string;
}

const EMPTY: FormData = {
  name: "",
  email: "",
  phone: "",
  communityName: "",
  communitySize: "",
  hostingAs: "",
  timeWindow: "",
  additionalNotes: "",
};

/* ─── Pill selector ───────────────────────────────────────────────────────── */
interface PillGroupProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}
const PillGroup: React.FC<PillGroupProps> = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2 mt-1">
    {options.map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(opt)}
        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 ${
          value === opt
            ? "border-[#B83280]/60 bg-[#B83280]/15 text-white"
            : "border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/75"
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

/* ─── Radio card ──────────────────────────────────────────────────────────── */
interface RadioCardProps {
  name: string;
  value: string;
  label: string;
  desc: string;
  icon: string;
  selected: boolean;
  onChange: (v: string) => void;
}
const RadioCard: React.FC<RadioCardProps> = ({
  name,
  value,
  label,
  desc,
  icon,
  selected,
  onChange,
}) => (
  <label
    onClick={() => onChange(value)}
    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
      selected
        ? "border-[#B83280]/50 bg-[#B83280]/10"
        : "border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
    }`}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={selected}
      onChange={() => onChange(value)}
      className="sr-only"
    />
    <span className="text-lg mt-0.5 flex-shrink-0">{icon}</span>
    <div className="flex-1 min-w-0">
      <div
        className={`text-sm font-medium leading-tight mb-1 ${selected ? "text-white" : "text-white/75"}`}
      >
        {label}
      </div>
      <div className="text-xs text-white/35 leading-relaxed">{desc}</div>
    </div>
    <div
      className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
        selected ? "border-[#B83280]" : "border-white/20"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full bg-[#B83280] transition-transform ${selected ? "scale-100" : "scale-0"}`}
      />
    </div>
  </label>
);

/* ─── Field wrapper ───────────────────────────────────────────────────────── */
const Field: React.FC<{
  label: string;
  required?: boolean;
  helper?: string;
  children: React.ReactNode;
}> = ({ label, required, helper, children }) => (
  <div className="mb-5">
    <label className="block text-sm font-medium text-white/75 mb-2">
      {label}
      {required && <span className="text-[#B83280] ml-0.5">*</span>}
    </label>
    {helper && (
      <p className="text-xs text-white/35 mb-2.5 leading-relaxed">{helper}</p>
    )}
    {children}
  </div>
);

/* ─── Step header ─────────────────────────────────────────────────────────── */
const StepHead: React.FC<{ n: string; title: string; sub: string }> = ({
  n,
  title,
  sub,
}) => (
  <div className="flex items-center gap-4 mb-7">
    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#B83280]/15 border border-[#B83280]/30 flex items-center justify-center text-[#B83280] text-xs font-semibold font-mono">
      {n}
    </div>
    <div>
      <div className="text-xl font-bold text-white leading-tight">{title}</div>
      <div className="text-sm text-white/40 mt-0.5">{sub}</div>
    </div>
  </div>
);

/* ─── Input class ─────────────────────────────────────────────────────────── */
const inputCls =
  "w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 text-sm outline-none transition-all focus:border-[#B83280]/50 focus:bg-[#B83280]/[0.04] hover:border-white/20";

/* ─── FAQ accordion ───────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: "How much time does this take from me?",
    a: "About 20 minutes total. Fill out this form (2 min), hop on a quick call with our team (10–15 min), then share the event code with your community. We handle everything else.",
  },
  {
    q: "What if my community isn't focused on dating?",
    a: "That's fine. Many of our best events come from groups that just want something fun and social to do together. The app creates real conversations — romantic or not.",
  },
  {
    q: "What if no one shows up?",
    a: "We'll reschedule at no cost. Events need at least 6 people to run well — if you're unsure about turnout, just tell us and we'll help you figure out the right size and timing.",
  },
  {
    q: "Can I cancel after applying?",
    a: "Yes, anytime before the event goes live. Just reply to our email or text us. No commitment until your community actually joins.",
  },
  {
    q: "Does it cost anything?",
    a: "No charge to host. Convoo is free for your community to use. We're growing and want more events on the platform — that's the deal.",
  },
];

/* ─── Main page ───────────────────────────────────────────────────────────── */
const ApplyToHost: React.FC = () => {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "ath-css";
    style.textContent = `
      .ath-input:focus { border-color: rgba(184,50,128,0.5) !important; background: rgba(184,50,128,0.04) !important; }
      .ath-input { transition: border-color .2s, background .2s; }
      @keyframes ath-ring { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:.6} }
      @keyframes ath-spin  { to{transform:rotate(360deg)} }
      .ath-ring { animation: ath-ring 2.2s ease-in-out infinite; }
      .ath-spin { animation: ath-spin .7s linear infinite; }
    `;
    document.head.appendChild(style);
    return () => document.getElementById("ath-css")?.remove();
  }, []);

  const set =
    (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
      setError("");
    };
  const radio = (k: keyof FormData) => (v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Please enter a valid email.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (!form.hostingAs) return "Please select who you are hosting as.";
    if (!form.communitySize) return "Please select your community size.";
    if (!form.timeWindow) return "Please select when you'd like to host.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      setTimeout(
        () =>
          errorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
        50,
      );
      return;
    }
    setSubmitting(true);
    try {
      await supabase.from("host_applications").insert([
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          community_name: form.communityName.trim(),
          community_size: form.communitySize,
          hosting_as: form.hostingAs,
          time_window: form.timeWindow,
          additional_notes: form.additionalNotes.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Nav ── */
  const Nav = () => (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(10,10,10,.85)] border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-6 px-8 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 no-underline font-bold tracking-wide text-white"
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/Convoo-logo-removebg-preview.png`}
            alt="Convoo"
            className="w-9 h-9 rounded-xl object-contain shadow-[0_10px_30px_rgba(184,50,128,.3)]"
          />
          <span className="text-lg text-white">Convoo</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors no-underline"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>
      </div>
    </nav>
  );

  /* ── Success ── */
  if (submitted) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen">
        <Nav />
        <div className="flex items-center justify-center min-h-[calc(100vh-73px)] px-6 text-center">
          <div>
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="ath-ring absolute inset-0 rounded-full bg-[#B83280]/10 border border-[#B83280]/25" />
              <div className="absolute inset-2 rounded-full bg-[#B83280]/15 border border-[#B83280]/30 flex items-center justify-center">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B83280"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Application received
            </h2>
            <p className="text-white/55 text-base max-w-sm mx-auto leading-relaxed mb-2">
              Thanks,{" "}
              <span className="text-white font-medium">{form.name}</span>. Your
              application is with us.
            </p>
            <p className="text-white/40 text-sm mb-10">
              We'll reach out to{" "}
              <span className="text-white/60">{form.email}</span> within 24
              hours.
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3.5 bg-[#B83280] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity no-underline"
            >
              Back to Convoo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main page ── */
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Nav />

      <div
        className="pointer-events-none fixed bottom-0 right-0 w-[600px] h-[600px] translate-x-1/3 translate-y-1/3 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(ellipse, rgba(184,50,128,0.12) 0%, transparent 65%)",
        }}
      />

      {/* ── Hero ── */}
      <section className="relative text-center px-6 pt-24 pb-16 overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(184,50,128,0.15) 0%, transparent 70%)",
          }}
        />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B83280]/30 bg-[#B83280]/10 text-[#B83280] text-xs font-semibold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B83280] animate-pulse" />
          Host a Private Event
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.04] tracking-tight mb-5">
          Run a singles night for
          <br />
          <span className="text-[#B83280]">your community</span>
          <br />
          <span className="text-white/60 text-4xl md:text-5xl font-bold">
            we handle the tech.
          </span>
        </h1>

        <p className="text-white/55 text-lg max-w-lg mx-auto leading-relaxed mb-8">
          Your people text live for 3 minutes, photos reveal after, and both
          decide if they want to keep talking. Real conversation before any
          photo. We handle the tech, you just share the code.
        </p>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("apply-form")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#B83280] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity mb-10"
        >
          Tell us about your community
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 3v10M3 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Friend Groups",
            "College Clubs",
            "Creator Communities",
            "Offline Meetups",
            "Local Businesses",
            "Event Organizers",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── Featured quote ── */}
      <section className="max-w-[760px] mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] px-8 py-8">
          <div className="flex gap-1 mb-5">
            <div className="w-3 h-3 rounded-sm bg-[#B83280]/60" />
            <div className="w-3 h-3 rounded-sm bg-[#B83280]/60" />
          </div>
          <p className="text-white text-xl md:text-2xl font-semibold leading-snug mb-5">
            There's no other dating app where you can say you're using the
            interface while you're outside.
          </p>
          <p className="text-white/35 text-sm">
            — Attendee, first Convoo live event — Atlanta
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-[960px] mx-auto px-6 pb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-3">
          How it works
        </h2>
        <p className="text-white/40 text-sm text-center mb-12">
          From application to live event in under a week.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Apply in 2 minutes",
              desc: "Tell us who you are and what your community looks like. Short form — no essays.",
            },
            {
              step: "02",
              title: "We contact you within 24 hours",
              desc: "A 15-minute call to understand your community and shape the event format together.",
            },
            {
              step: "03",
              title: "Share the code, we do the rest",
              desc: "Your people enter the code at event time. They're paired in 3-minute live text conversations, photos reveal after, and they both decide if it's a match. All in 30 minutes.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="p-6 rounded-2xl bg-[#141414] border border-white/[0.06]"
            >
              <div className="w-9 h-9 rounded-full bg-[#B83280]/20 border border-[#B83280]/30 flex items-center justify-center text-[#B83280] text-xs font-bold font-mono mb-5">
                {step}
              </div>
              <div className="text-lg font-bold text-white mb-2 leading-snug">
                {title}
              </div>
              <div className="text-sm text-white/40 leading-relaxed">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stronger relationships, stronger community ── */}
      <section className="max-w-[760px] mx-auto px-6 pb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-3">
          Be where their story started
        </h2>
        <p className="text-white/40 text-sm text-center mb-12">
          When relationships start in your community, your community becomes
          their home.
        </p>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111] px-8 py-8">
          <p className="text-white text-lg leading-relaxed mb-5">
            When two of your members meet through Convoo, you're not just
            hosting an event. You're becoming the place where their story
            started. They keep showing up. They bring their partner. They invite
            friends. The connections built inside your community become reasons
            people stay.
          </p>
          <p className="text-white/55 text-base leading-relaxed">
            Most communities give people something to do. The ones that last
            give them someone to know.
          </p>
        </div>
      </section>

      {/* ── Built for communities ── */}
      <section className="max-w-[960px] mx-auto px-6 pb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-3">
          Built for communities that already meet
        </h2>
        <p className="text-white/40 text-sm text-center mb-12">
          If you're already the person who brings people together, this is your
          night.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "Run clubs & fitness groups",
              desc: "Singles who already show up weekly. Give them a reason to stick around after.",
            },
            {
              title: "College clubs & student orgs",
              desc: "Valentine's, rush week, finals blow-off — make your event the one people remember.",
            },
            {
              title: "Cultural & identity groups",
              desc: "Desi, Black, Jewish, LGBTQ+, alumni — host a night just for your people.",
            },
            {
              title: "Bars, cafés & venues",
              desc: "Fill a slow Tuesday. We bring the matching; you bring the drinks.",
            },
            {
              title: "Creators & local hosts",
              desc: "Give your audience a real-world moment they'll actually post about.",
            },
            {
              title: "Young professional networks",
              desc: "Alumni chapters, co-working spaces, industry meetups — warm, low-pressure, local.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-[#141414] border border-white/[0.06]"
            >
              <div className="text-base font-bold text-white mb-2">{title}</div>
              <div className="text-sm text-white/40 leading-relaxed">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Host story ── */}
      <section className="max-w-[760px] mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B83280]">
              Host story
            </span>
            <span className="text-xs text-white/40 border border-white/[0.12] px-2.5 py-1 rounded-full">
              Aspirational example
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 leading-snug">
            "I ran a 40-person singles night for my college club in one week."
          </h3>
          <p className="text-sm text-white/45 leading-relaxed mb-6">
            Campus social chair at a 500-person university club. No events
            experience. Just wanted to do something different for Valentine's
            week.
          </p>

          <div className="h-px bg-white/[0.07] mb-6" />

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Setup time", value: "~20 min" },
              { label: "Attendees", value: "38" },
              { label: "Matches made", value: "14" },
            ].map(({ label, value }, i) => (
              <div
                key={label}
                className={`text-center ${i > 0 ? "border-l border-white/[0.07]" : ""}`}
              >
                <div className="text-2xl font-extrabold text-[#B83280]">
                  {value}
                </div>
                <div className="text-xs text-white/35 mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/[0.07] mb-6" />

          <blockquote className="border-l-2 border-[#B83280]/50 pl-4 text-sm text-white/45 italic leading-relaxed">
            "I literally just filled out the form, got on a call the next day,
            and shared a code in our group chat. People were matching before I
            even got home."
          </blockquote>
        </div>
      </section>

      {/* ── What attendees are saying ── */}
      <section className="max-w-[960px] mx-auto px-6 pb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-3">
          What attendees are saying
        </h2>
        <p className="text-white/40 text-sm text-center mb-12">
          From our first live event in Atlanta.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              quote:
                "There's a community element to it. You feel like you're part of something, not just on another app.",
              attr: "Attendee, first Convoo event",
            },
            {
              quote:
                "It's much more than building relationships romantically — genuine friendships were created at this event as well.",
              attr: "Attendee, first Convoo event",
            },
          ].map(({ quote, attr }) => (
            <div
              key={quote}
              className="p-7 rounded-2xl bg-[#141414] border border-white/[0.06] flex flex-col justify-between"
            >
              <p className="text-white text-lg font-semibold leading-snug mb-6">
                "{quote}"
              </p>
              <p className="text-white/35 text-sm">— {attr}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-[760px] mx-auto px-6 pb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-12">
          Common questions
        </h2>
        <div>
          {FAQ_ITEMS.map(({ q, a }, i) => (
            <div key={q}>
              {i > 0 && <div className="h-px bg-white/[0.07]" />}
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === q ? null : q)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base font-medium text-white/80 hover:text-white transition-colors">
                  {q}
                </span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                  <svg
                    className={`w-3 h-3 text-white/50 transition-transform duration-200 ${openFaq === q ? "rotate-45" : ""}`}
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M6 1v10M1 6h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
              {openFaq === q && (
                <div className="pb-5 text-sm text-white/45 leading-relaxed">
                  {a}
                </div>
              )}
            </div>
          ))}
          <div className="h-px bg-white/[0.07]" />
        </div>
      </section>

      {/* ── Form ── */}
      <div
        id="apply-form"
        className="max-w-[640px] mx-auto px-6 pb-24 scroll-mt-20"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Tell us about your community
          </h2>
          <p className="text-white/40 text-sm">Takes 2 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* ── 01 Who are you ── */}
          <div className="mb-12">
            <StepHead
              n="01"
              title="Who are you?"
              sub="So we know who to reach out to"
            />

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <Field label="Name" required>
                <input
                  className={`${inputCls} ath-input`}
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={set("name")}
                  autoComplete="name"
                />
              </Field>
              <Field label="Email" required>
                <input
                  className={`${inputCls} ath-input`}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  autoComplete="email"
                />
              </Field>
            </div>

            <Field label="Phone number" required>
              <input
                className={`${inputCls} ath-input`}
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={set("phone")}
                autoComplete="tel"
              />
            </Field>

            <Field
              label="Community or group name"
              helper="What do you call your group? (Optional — helps us personalise your event)"
            >
              <input
                className={`${inputCls} ath-input`}
                type="text"
                placeholder='e.g. "CS Club", "Sunday Crew", "NYC Founder Circle"'
                value={form.communityName}
                onChange={set("communityName")}
              />
            </Field>

            <Field label="Community size" required>
              <PillGroup
                options={["Under 50", "50–200", "200–1,000", "1,000+"]}
                value={form.communitySize}
                onChange={(v) => {
                  setForm((p) => ({ ...p, communitySize: v }));
                  setError("");
                }}
              />
            </Field>

            <Field label="You're hosting as" required>
              <div className="grid sm:grid-cols-2 gap-3 mt-1">
                {[
                  {
                    value: "An individual",
                    label: "An individual",
                    desc: "Just you, personal event",
                    icon: "👤",
                  },
                  {
                    value: "A friend group",
                    label: "A friend group",
                    desc: "Small crew hosting together",
                    icon: "👥",
                  },
                  {
                    value: "A college club",
                    label: "A college club",
                    desc: "Campus org or student group",
                    icon: "🎓",
                  },
                  {
                    value: "A creator/influencer",
                    label: "A creator",
                    desc: "Audience-led or community",
                    icon: "🎙️",
                  },
                  {
                    value: "A local business",
                    label: "A local business",
                    desc: "Brand or business-sponsored",
                    icon: "🏢",
                  },
                  {
                    value: "An event organizer",
                    label: "Event organizer",
                    desc: "Professional or recurring series",
                    icon: "📅",
                  },
                ].map((opt) => (
                  <RadioCard
                    key={opt.value}
                    name="hostingAs"
                    {...opt}
                    selected={form.hostingAs === opt.value}
                    onChange={radio("hostingAs")}
                  />
                ))}
              </div>
            </Field>
          </div>

          {/* divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-12" />

          {/* ── 02 Timing + notes ── */}
          <div className="mb-12">
            <StepHead
              n="02"
              title="When & anything else?"
              sub="That's all we need for now"
            />

            <Field label="When would you like to host?" required>
              <PillGroup
                options={[
                  "Next 2 weeks",
                  "2–4 weeks",
                  "1–2 months",
                  "Just exploring",
                ]}
                value={form.timeWindow}
                onChange={(v) => {
                  setForm((p) => ({ ...p, timeWindow: v }));
                  setError("");
                }}
              />
            </Field>

            <Field
              label="Anything else?"
              helper="Venue details, special requests, questions — whatever helps."
            >
              <textarea
                className={`${inputCls} ath-input resize-none leading-relaxed`}
                rows={4}
                placeholder="Share anything that helps us set up the right event for you…"
                value={form.additionalNotes}
                onChange={set("additionalNotes")}
              />
            </Field>
          </div>

          {/* Error */}
          {error && (
            <div
              ref={errorRef}
              className="flex items-start gap-3 px-4 py-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-4"
            >
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#f87171"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 5v3.5M8 11h.01"
                  stroke="#f87171"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#B83280] text-white font-bold text-base rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="ath-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                Submitting…
              </span>
            ) : (
              "Send"
            )}
          </button>
          <p className="text-center text-xs text-white/25 mt-4 leading-relaxed">
            We review every application and reply within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ApplyToHost;
