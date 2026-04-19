import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

/* ─── Config ──────────────────────────────────────────────────────────────── */

interface FormData {
  name: string;
  email: string;
  eventTitle: string;
  eventDescription: string;
  hostingAs: string;
  eventSetup: string;
  eventKind: string;
  expectedPeople: string;
  timeWindow: string;
  eventCode: string;
  additionalNotes: string;
}

const EMPTY: FormData = {
  name: "",
  email: "",
  eventTitle: "",
  eventDescription: "",
  hostingAs: "",
  eventSetup: "",
  eventKind: "",
  expectedPeople: "",
  timeWindow: "",
  eventCode: "",
  additionalNotes: "",
};


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

/* ─── Input ───────────────────────────────────────────────────────────────── */
const inputCls =
  "w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 text-sm outline-none transition-all focus:border-[#B83280]/50 focus:bg-[#B83280]/[0.04] hover:border-white/20";

/* ─── Main page ───────────────────────────────────────────────────────────── */
const ApplyToHost: React.FC = () => {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add focus style for inputs (Tailwind can't do focus on custom colors without plugin)
    const style = document.createElement("style");
    style.id = "ath-css";
    style.textContent = `
      .ath-input:focus { border-color: rgba(184,50,128,0.5) !important; background: rgba(184,50,128,0.04) !important; }
      .ath-input { transition: border-color .2s, background .2s; }
      @keyframes ath-ring { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:.6} }
      @keyframes ath-spin  { to{transform:rotate(360deg)} }
      .ath-ring { animation: ath-ring 2.2s ease-in-out infinite; }
      .ath-spin { animation: ath-spin .7s linear infinite; }
      
      /* Fix date and time picker styling for dark theme */
      input[type="date"], input[type="time"] {
        color-scheme: dark;
      }
      
      /* Force calendar picker to be visible */
      input[type="date"]::-webkit-calendar-picker-indicator {
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3E%3C/svg%3E") no-repeat center;
        background-size: 16px 16px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        filter: none !important;
        opacity: 1 !important;
      }
      
      input[type="time"]::-webkit-calendar-picker-indicator {
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'/%3E%3C/svg%3E") no-repeat center;
        background-size: 16px 16px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        filter: none !important;
        opacity: 1 !important;
      }
      
      input[type="time"]::-webkit-inner-spin-button,
      input[type="time"]::-webkit-outer-spin-button {
        filter: invert(1) brightness(1.5);
        opacity: 1;
      }
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
    if (!form.eventTitle.trim()) return "Please give your event a title.";
    if (!form.hostingAs) return "Please select who you are hosting as.";
    if (!form.eventKind) return "Please select the kind of event.";
    if (!form.expectedPeople.trim())
      return "Please enter expected attendee count.";
    if (!form.timeWindow.trim()) return "Please enter a time window.";
    if (!form.eventCode.trim()) return "Please enter a desired event code.";
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
          event_title: form.eventTitle.trim(),
          event_description: form.eventDescription.trim(),
          hosting_as: form.hostingAs,
          event_setup: form.eventSetup,
          event_kind: form.eventKind,
          expected_people: form.expectedPeople.trim(),
          time_window: form.timeWindow.trim(),
          event_code: form.eventCode.trim(),
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

  /* ── Nav — identical to Home.tsx ── */
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
              You're in the queue
            </h2>
            <p className="text-white/55 text-base max-w-sm mx-auto leading-relaxed mb-2">
              Thanks,{" "}
              <span className="text-white font-medium">{form.name}</span>. Your
              application for{" "}
              <span className="text-[#B83280]">"{form.eventTitle}"</span> is
              with us.
            </p>
            <p className="text-white/40 text-sm mb-10">
              We'll reach out to{" "}
              <span className="text-white/60">{form.email}</span> within 2–3
              business days.
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

  /* ── Form page ── */
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Nav />

      {/* Ambient glow — bottom right, matches convoo.app */}
      <div
        className="pointer-events-none fixed bottom-0 right-0 w-[600px] h-[600px] translate-x-1/3 translate-y-1/3 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(ellipse, rgba(184,50,128,0.12) 0%, transparent 65%)",
        }}
      />

      {/* ── Hero ── */}
      <section className="relative text-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Subtle top glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(184,50,128,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B83280]/30 bg-[#B83280]/10 text-[#B83280] text-xs font-semibold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B83280] animate-pulse" />
          Private In-App Events
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.04] tracking-tight mb-5">
          Host your own
          <br />
          <span className="text-[#B83280]">Convoo event</span>
        </h1>

        <p className="text-white/55 text-lg max-w-md mx-auto leading-relaxed mb-10">
          Bring your group, your club, or your community into the app. We'll set
          up a private event code — just for you.
        </p>

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

      {/* ── Form ── */}
      <div className="max-w-[640px] mx-auto px-6 pb-24">
        <form onSubmit={handleSubmit} noValidate>
          {/* ── 01 Who are you ── */}
          <div className="mb-12">
            <StepHead
              n="01"
              title="Who are you?"
              sub="So we know who to reply to"
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

          {/* ── 02 Your event ── */}
          <div className="mb-12">
            <StepHead n="02" title="Your event" sub="What are you planning?" />

            <Field
              label="Event title"
              required
              helper={
                'What attendees will see. E.g. "Friday Vibes", "CS Club Mixer", "Valentine\'s Night".'
              }
            >
              <input
                className={`${inputCls} ath-input`}
                type="text"
                placeholder='e.g. "Friday Vibes"'
                value={form.eventTitle}
                onChange={set("eventTitle")}
              />
            </Field>

            <Field
              label="Short tagline"
              helper="One line shown under the event name. 15 characters max."
            >
              <div className="relative">
                <input
                  className={`${inputCls} ath-input pr-14`}
                  type="text"
                  placeholder='e.g. "Speed dating"'
                  maxLength={15}
                  value={form.eventDescription}
                  onChange={(e) => {
                    set("eventDescription")(e);
                    setCharCount(e.target.value.length);
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/25 font-mono pointer-events-none">
                  {charCount}/15
                </span>
              </div>
            </Field>

            <Field label="Kind of event" required>
              <div className="grid sm:grid-cols-2 gap-3 mt-1">
                {[
                  {
                    value: "Private group event",
                    label: "Private group",
                    desc: "Invite-only for your circle",
                    icon: "🔒",
                  },
                  {
                    value: "College event",
                    label: "College event",
                    desc: "Campus-based social or club",
                    icon: "🏫",
                  },
                  {
                    value: "Creator-led matchmaking",
                    label: "Creator-led",
                    desc: "You curate for your audience",
                    icon: "✨",
                  },
                  {
                    value: "Offline meetup / pop-up",
                    label: "Offline meetup",
                    desc: "In-person with digital icebreaking",
                    icon: "📍",
                  },
                ].map((opt) => (
                  <RadioCard
                    key={opt.value}
                    name="eventKind"
                    {...opt}
                    selected={form.eventKind === opt.value}
                    onChange={radio("eventKind")}
                  />
                ))}
              </div>
            </Field>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-12" />

          {/* ── 03 Setup ── */}
          <div className="mb-12">
            <StepHead
              n="03"
              title="Setup details"
              sub="How do you want it configured?"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Expected attendees"
                required
                helper='E.g. "20", "50–100", "200+"'
              >
                <input
                  className={`${inputCls} ath-input`}
                  type="text"
                  placeholder='e.g. "50–100"'
                  value={form.expectedPeople}
                  onChange={set("expectedPeople")}
                />
              </Field>
              <Field
                label="Event date"
                required
                helper="Select the date of your event"
              >
                <input
                  className={`${inputCls} ath-input`}
                  type="date"
                  value={form.timeWindow.split(" ")[0] || ""}
                  onChange={(e) => {
                    const time = form.timeWindow.split(" ")[1] || "19:00";
                    setForm((p) => ({
                      ...p,
                      timeWindow: `${e.target.value} ${time}`,
                    }));
                  }}
                />
              </Field>
              <Field
                label="Event time"
                required
                helper="What time should the event start?"
              >
                <input
                  className={`${inputCls} ath-input`}
                  type="time"
                  value={form.timeWindow.split(" ")[1] || "19:00"}
                  onChange={(e) => {
                    const date = form.timeWindow.split(" ")[0] || "";
                    setForm((p) => ({
                      ...p,
                      timeWindow: `${date} ${e.target.value}`,
                    }));
                  }}
                />
              </Field>
            </div>

            <Field
              label="Desired event code"
              required
              helper="What guests type into the app. Letters and numbers only, no spaces."
            >
              <input
                className={`${inputCls} ath-input font-mono tracking-widest uppercase`}
                type="text"
                placeholder="e.g. FRIDAYFUN"
                value={form.eventCode}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    eventCode: e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, ""),
                  }))
                }
              />
            </Field>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-12" />

          {/* ── 04 Notes ── */}
          <div className="mb-12">
            <StepHead
              n="04"
              title="Anything else?"
              sub="Optional — venue info, special requests, whatever helps"
            />
            <textarea
              className={`${inputCls} ath-input resize-none leading-relaxed`}
              rows={4}
              placeholder="Share anything that helps us set up the right event for you…"
              value={form.additionalNotes}
              onChange={set("additionalNotes")}
            />
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
              "Submit application"
            )}
          </button>
          <p className="text-center text-xs text-white/25 mt-4 leading-relaxed">
            We review every application and reply within 2–3 business days.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ApplyToHost;
