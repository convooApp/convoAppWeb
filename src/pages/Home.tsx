import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { WaitlistForm } from "../components/WaitlistForm";
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
} from "lucide-react";

dayjs.extend(utc);

interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  duration: string;
}

const Home = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [todayEvent, setTodayEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const isToday = (dateString: string) => {
    const eventDate = dayjs.utc(dateString).format("YYYY-MM-DD");
    const todayInUTC = dayjs().utc().format("YYYY-MM-DD");
    return eventDate === todayInUTC;
  };

  useEffect(() => {
    const fetchTodayEvent = async () => {
      try {
        setLoadingEvent(true);
        const now = dayjs();

        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("start_time", now.format("YYYY-MM-DD"))
          .order("start_time", { ascending: true });

        if (error) {
          console.error("Error fetching events:", error);
        } else {
          const events = (data as Event[]) || [];
          const todayEvent = events.find((event) => isToday(event.start_time));
          if (todayEvent) {
            setTodayEvent(todayEvent);
          }
        }
      } catch (err) {
        console.error("Error fetching today events:", err);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchTodayEvent();
  }, []);

  useEffect(() => {
    if (!showEventDetails) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowEventDetails(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showEventDetails]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div
        className="bg-[#07060a] text-[#f5f2f8] min-h-screen"
        style={{
          background:
            "radial-gradient(1200px 600px at 15% 10%, rgba(184,50,128,.18), transparent 60%), radial-gradient(900px 520px at 85% 15%, rgba(255,79,179,.10), transparent 60%), radial-gradient(900px 620px at 50% 90%, rgba(184,50,128,.14), transparent 62%), #07060a",
        }}
      >
        {/* Top Nav */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(7,6,10,.75)] border-b border-[rgba(245,242,248,.08)]">
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
              <a
                href="#how"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("how");
                }}
                className="no-underline text-[rgba(245,242,248,.7)] font-medium text-sm px-4 py-2 rounded-xl hover:bg-[rgba(245,242,248,.08)] hover:text-white transition-all"
              >
                How it works
              </a>
              <a
                href="#pov"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("pov");
                }}
                className="no-underline text-[rgba(245,242,248,.7)] font-medium text-sm px-4 py-2 rounded-xl hover:bg-[rgba(245,242,248,.08)] hover:text-white transition-all"
              >
                Why Convoo
              </a>
              <a
                href="#live"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("live");
                }}
                className="no-underline text-[rgba(245,242,248,.7)] font-medium text-sm px-4 py-2 rounded-xl hover:bg-[rgba(245,242,248,.08)] hover:text-white transition-all"
              >
                Live in
              </a>
              <a
                href="#events"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("events");
                }}
                className="no-underline text-[rgba(245,242,248,.7)] font-medium text-sm px-4 py-2 rounded-xl hover:bg-[rgba(245,242,248,.08)] hover:text-white transition-all"
              >
                Events
              </a>
            </div>

            <div className="flex gap-3 items-center">
              <a
                className="inline-flex items-center justify-center gap-2 border border-[rgba(184,50,128,.6)] bg-gradient-to-br from-[#B83280] to-[#ff4fb3] text-white px-5 py-2.5 rounded-xl no-underline font-bold text-sm shadow-[0_10px_40px_rgba(184,50,128,.25)] transition-all hover:shadow-[0_15px_50px_rgba(184,50,128,.35)] hover:scale-[1.02]"
                href="https://apps.apple.com/us/app/convoo/id6746660683"
                target="_blank"
                rel="noreferrer"
              >
                Download (iOS)
              </a>
            </div>
          </div>
        </nav>

        <main id="top" className="max-w-[1200px] mx-auto px-8">
          {/* Hero */}
          <header className="py-20 md:py-28">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2.5 text-xs font-extrabold text-[rgba(245,242,248,.65)] tracking-[.2em] uppercase mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#B83280] shadow-[0_0_0_6px_rgba(184,50,128,.2)] animate-pulse"></span>
                  LIVE • CITY BY CITY
                </div>
                <h1 className="m-0 mb-6 text-[clamp(40px,5vw,64px)] leading-[1.1] tracking-[-0.02em] font-bold">
                  A{" "}
                  <span className="bg-gradient-to-br from-[#ff4fb3] via-[#B83280] to-[#ff4fb3] text-transparent bg-clip-text">
                    live dating experience
                  </span>
                  <br />
                  built around real conversation.
                </h1>
                <p className="m-0 mb-8 text-[rgba(245,242,248,.75)] text-lg leading-relaxed max-w-[560px]">
                  Chat first. Profiles later. Convoo brings people together in
                  real time through live events in your city.
                </p>
                <div className="flex gap-4 flex-wrap items-center">
                  <a
                    className="inline-flex items-center justify-center gap-2 border border-[rgba(184,50,128,.6)] bg-gradient-to-br from-[#B83280] to-[#ff4fb3] text-white px-7 py-4 rounded-2xl no-underline font-bold shadow-[0_10px_40px_rgba(184,50,128,.3)] transition-all hover:shadow-[0_15px_50px_rgba(184,50,128,.4)] hover:scale-[1.02]"
                    href="#events"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("events");
                    }}
                  >
                    Join a IRL event
                  </a>
                  <a
                    className="inline-flex items-center justify-center gap-2 border border-[rgba(245,242,248,.15)] bg-[rgba(245,242,248,.06)] text-white px-7 py-4 rounded-2xl no-underline font-bold transition-all hover:bg-[rgba(245,242,248,.12)] hover:border-[rgba(245,242,248,.25)]"
                    href="#how"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("how");
                    }}
                  >
                    How it works
                  </a>
                </div>
                <div className="mt-6 text-[rgba(245,242,248,.5)] text-sm">
                  Currently testing live events in select cities. Building with
                  the community.
                </div>
              </div>

              <aside className="bg-gradient-to-br from-[rgba(245,242,248,.08)] to-[rgba(245,242,248,.03)] border border-[rgba(245,242,248,.12)] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,.4)] p-6 backdrop-blur-sm">
                <div className="font-extrabold text-xs text-[rgba(245,242,248,.6)] uppercase tracking-[.16em] mb-5">
                  Today's event
                </div>

                {loadingEvent ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B83280]"></div>
                  </div>
                ) : todayEvent ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-[rgba(245,242,248,.5)] uppercase tracking-wider mb-1">
                        Name
                      </div>
                      <div className="text-base font-bold text-white">
                        {todayEvent.title}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[rgba(245,242,248,.5)] uppercase tracking-wider mb-1">
                        Description
                      </div>
                      <div className="text-sm text-[rgba(245,242,248,.7)]">
                        {todayEvent.description}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[rgba(245,242,248,.5)] uppercase tracking-wider mb-1">
                        Location
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
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-[rgba(245,242,248,.6)]">
                    No events today
                  </div>
                )}
              </aside>
            </div>
          </header>

          {/* How it works */}
          <section id="how" className="py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold m-0 mb-4 tracking-tight">
                How it works
              </h2>
              <p className="m-0 text-[rgba(245,242,248,.7)] text-lg max-w-[680px] mx-auto">
                Convoo is designed for presence and intent. A short flow that
                gets you into real conversations fast.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
              <div className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-gradient-to-br from-[rgba(245,242,248,.06)] to-[rgba(245,242,248,.02)] hover:border-[rgba(184,50,128,.3)] transition-all group">
                <div className="w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br from-[rgba(184,50,128,.2)] to-[rgba(184,50,128,.1)] border border-[rgba(184,50,128,.3)] mb-6 group-hover:scale-110 transition-transform">
                  <CalendarDays
                    className="w-6 h-6 text-[rgba(245,242,248,.85)]"
                    strokeWidth={2}
                  />
                </div>

                <h3 className="m-0 mb-3 text-xl font-bold">
                  Join today’s event
                </h3>
                <p className="m-0 text-[rgba(245,242,248,.7)] leading-relaxed">
                  Show up at the scheduled time and meet people in your city.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-gradient-to-br from-[rgba(245,242,248,.06)] to-[rgba(245,242,248,.02)] hover:border-[rgba(184,50,128,.3)] transition-all group">
                <div className="w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br from-[rgba(184,50,128,.2)] to-[rgba(184,50,128,.1)] border border-[rgba(184,50,128,.3)] mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircle
                    className="w-6 h-6 text-[rgba(245,242,248,.85)]"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="m-0 mb-3 text-xl font-bold">
                  Chat in real time
                </h3>
                <p className="m-0 text-[rgba(245,242,248,.7)] leading-relaxed">
                  Start with conversation. It's quick, natural, and low
                  pressure.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-gradient-to-br from-[rgba(245,242,248,.06)] to-[rgba(245,242,248,.02)] hover:border-[rgba(184,50,128,.3)] transition-all group">
                <div className="w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br from-[rgba(184,50,128,.2)] to-[rgba(184,50,128,.1)] border border-[rgba(184,50,128,.3)] mb-6 group-hover:scale-110 transition-transform">
                  <UserCheck
                    className="w-6 h-6 text-[rgba(245,242,248,.85)]"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="m-0 mb-3 text-xl font-bold">
                  See profiles after
                </h3>
                <p className="m-0 text-[rgba(245,242,248,.7)] leading-relaxed">
                  Only after you’ve talked decide based on a real interaction.
                </p>
              </div>
            </div>
          </section>

          {/* POV */}
          <section id="pov" className="py-20">
            <h2 className="text-4xl md:text-5xl font-bold m-0 tracking-tight text-center mb-12">
              Why Convoo?
            </h2>
            <div className="p-10 md:p-12 rounded-3xl bg-[radial-gradient(800px_300px_at_30%_0%,rgba(184,50,128,.2),transparent_70%),rgba(245,242,248,.04)] border border-[rgba(245,242,248,.12)] max-w-[1000px] mx-auto">
              <blockquote className="m-0 text-[clamp(24px,3vw,32px)] leading-tight font-black tracking-tight mb-5">
                "Dating apps decide who you meet."
              </blockquote>
              <p className="m-0 text-[rgba(245,242,248,.75)] text-lg leading-relaxed">
                That's not inherently bad, but it does change how dating feels.
                Convoo is built around live, shared moments where people decide
                through real conversation.
              </p>
            </div>
          </section>

          {/* Live in */}
          <section id="live" className="py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold m-0 mb-4 tracking-tight">
                Live events - city by city
              </h2>
              <p className="m-0 text-[rgba(245,242,248,.7)] text-lg max-w-[680px] mx-auto">
                We're starting local and learning fast. If you're in Atlanta,
                come try a live event.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
              <div className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-gradient-to-br from-[rgba(245,242,248,.06)] to-[rgba(245,242,248,.02)] hover:border-[rgba(184,50,128,.3)] transition-all">
                <div className="w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br from-[rgba(184,50,128,.2)] to-[rgba(184,50,128,.1)] border border-[rgba(184,50,128,.3)] font-black text-sm mb-6">
                  ATL
                </div>
                <h3 className="m-0 mb-3 text-xl font-bold">Atlanta</h3>
                <p className="m-0 text-[rgba(245,242,248,.7)] leading-relaxed">
                  Live pop-ups + outdoor activations.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-gradient-to-br from-[rgba(245,242,248,.06)] to-[rgba(245,242,248,.02)] hover:border-[rgba(184,50,128,.3)] transition-all">
                <div className="w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br from-[rgba(184,50,128,.2)] to-[rgba(184,50,128,.1)] border border-[rgba(184,50,128,.3)] font-black text-lg mb-6">
                  +
                </div>
                <h3 className="m-0 mb-3 text-xl font-bold">Next cities</h3>
                <p className="m-0 text-[rgba(245,242,248,.7)] leading-relaxed">
                  Expanding based on density and community pull.
                </p>
              </div>

              <a
                className="p-8 rounded-3xl border border-[rgba(245,242,248,.12)] bg-gradient-to-br from-[rgba(245,242,248,.06)] to-[rgba(245,242,248,.02)] hover:border-[rgba(184,50,128,.3)] transition-all block no-underline focus:outline-none focus:ring-2 focus:ring-[#B83280]/40"
                href="mailto:convooapp@gmail.com?subject=Host%20with%20Convoo&body=Hi%20Convoo%20team%2C%0A%0AI'm%20interested%20in%20hosting%20with%20Convoo.%0A%0ACity%3A%20%0AAvailability%3A%20%0APhone%20%2F%20Instagram%3A%20%0A%0AThanks!"
              >
                <div className="w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br from-[rgba(184,50,128,.2)] to-[rgba(184,50,128,.1)] border border-[rgba(184,50,128,.3)] font-black text-lg mb-6">
                  ★
                </div>
                <h3 className="m-0 mb-3 text-xl font-bold">Host with us</h3>
                <p className="m-0 text-[rgba(245,242,248,.7)] leading-relaxed">
                  Hosts help run events and create the vibe.
                </p>
              </a>
            </div>
          </section>

          {/* Events */}
          <section id="events" className="py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold m-0 mb-4 tracking-tight">
                Upcoming IRL Events
              </h2>
            </div>

            <div className="bg-gradient-to-br from-[rgba(245,242,248,.08)] to-[rgba(245,242,248,.03)] border border-[rgba(245,242,248,.12)] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,.4)] p-8 max-w-[900px] mx-auto">
              <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div className="flex-1">
                  <div className="font-extrabold text-xs text-[rgba(245,242,248,.6)] uppercase tracking-[.16em] mb-3">
                    Upcoming
                  </div>
                  <div className="font-black text-2xl mb-3">
                    We’ll resume IRL events in the coming months.
                  </div>
                  {/* <div className="text-[rgba(245,242,248,.7)] mb-2">
                    Date: <strong className="text-white">Jan 17</strong> • Time: <strong className="text-white">4:00–6:00 PM</strong>
                  </div> */}
                  <div className="text-[rgba(245,242,248,.6)] text-sm">
                    Bring a friend. Join live. Chat first.
                  </div>
                </div>
                <div className="flex gap-3 items-center flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowEventDetails(true)}
                    className="inline-flex items-center justify-center gap-2 border border-[rgba(245,242,248,.15)] bg-[rgba(245,242,248,.06)] text-white px-5 py-3 rounded-xl no-underline font-bold text-sm transition-all hover:bg-[rgba(245,242,248,.12)] hover:border-[rgba(245,242,248,.25)] cursor-pointer"
                  >
                    How it works
                  </button>
                  <a
                    className="inline-flex items-center justify-center gap-2 border border-[rgba(184,50,128,.6)] bg-gradient-to-br from-[#B83280] to-[#ff4fb3] text-white px-5 py-3 rounded-xl no-underline font-bold text-sm shadow-[0_10px_40px_rgba(184,50,128,.25)] transition-all hover:shadow-[0_15px_50px_rgba(184,50,128,.35)]"
                    href="https://apps.apple.com/us/app/convoo/id6746660683"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Join on iOS
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Android CTA */}
          <section id="android" className="py-20">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 p-8 md:p-10 rounded-3xl border border-[rgba(184,50,128,.3)] bg-gradient-to-br from-[rgba(184,50,128,.18)] to-[rgba(245,242,248,.03)] max-w-[900px] mx-auto">
              <div className="flex-1">
                <h3 className="m-0 mb-3 text-2xl font-bold">Android user?</h3>
                <p className="m-0 text-[rgba(245,242,248,.75)] leading-relaxed">
                  We're actively improving the Android experience. If you want
                  access, leave your email and we'll notify you.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center gap-2 border border-[rgba(245,242,248,.15)] bg-[rgba(245,242,248,.06)] text-white px-5 py-3 rounded-xl no-underline font-bold text-sm transition-all hover:bg-[rgba(245,242,248,.12)] hover:border-[rgba(245,242,248,.25)] cursor-pointer"
                >
                  Join Android waitlist
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
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
                <Link
                  to="/business"
                  className="text-[rgba(245,242,248,.65)] no-underline hover:text-white transition-colors"
                >
                  Host an Event
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

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_20px_80px_rgba(0,0,0,.5)]">
            <WaitlistForm onClose={() => setShowWaitlist(false)} />
          </div>
        </div>
      )}

      {showEventDetails && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setShowEventDetails(false);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-[rgba(245,242,248,.12)] bg-[rgba(7,6,10,.92)] shadow-[0_20px_80px_rgba(0,0,0,.6)] p-7 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="font-extrabold text-xs text-[rgba(245,242,248,.6)] uppercase tracking-[.16em] mb-2">
                  How it works
                </div>
                <div className="text-2xl font-black tracking-tight text-white">
                  Matchmaking - live
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

            <div className="space-y-4 text-[rgba(245,242,248,.75)] leading-relaxed">
              <div>
                <div className="text-sm font-bold text-white mb-1">
                  1) Arrive at the location
                </div>
                <div className="text-sm">
                  Show up during the event window. You’ll receive an event code
                  once you’re there.
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">
                  2) Get the code
                </div>
                <div className="text-sm">
                  The code verifies you’re on-site. Only people with the code
                  join the live matchmaking.
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">
                  3) Match live, in real time
                </div>
                <div className="text-sm">
                  Everyone with the code gets matched in real time, so the
                  energy stays present and intentional.
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 flex-wrap justify-end">
              <button
                type="button"
                onClick={() => setShowEventDetails(false)}
                className="inline-flex items-center justify-center gap-2 border border-[rgba(245,242,248,.15)] bg-[rgba(245,242,248,.06)] text-white px-5 py-3 rounded-xl no-underline font-bold text-sm transition-all hover:bg-[rgba(245,242,248,.12)] hover:border-[rgba(245,242,248,.25)] cursor-pointer"
              >
                Close
              </button>
              <a
                className="inline-flex items-center justify-center gap-2 border border-[rgba(184,50,128,.6)] bg-gradient-to-br from-[#B83280] to-[#ff4fb3] text-white px-5 py-3 rounded-xl no-underline font-bold text-sm shadow-[0_10px_40px_rgba(184,50,128,.25)] transition-all hover:shadow-[0_15px_50px_rgba(184,50,128,.35)]"
                href="https://apps.apple.com/us/app/convoo/id6473327939"
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
