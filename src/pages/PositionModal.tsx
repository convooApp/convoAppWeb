import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { track } from "../lib/analytics";
import type { Position } from "./openPositions";
import { REGIONS, guessRegion, seekingFor } from "./openPositions";

/* ------------------------------------------------------------------
   One job description, and the form to apply for it.

   Opened from a card and addressable at /apply/<slug>, so a listing can be
   shared on its own — which for a recruitment drive is most of the point.
   ------------------------------------------------------------------ */

type Props = {
  position: Position;
  onClose: () => void;
};

/** Nobody under this may apply. Convoo is an adults-only introduction and the
    child-safety policy says so, which makes this a rule rather than a form
    nicety — so it is enforced here and again by a check constraint on the
    table, not on one side only. */
const MIN_AGE = 18;

export default function PositionModal({ position, onClose }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState(guessRegion);
  const [seeking, setSeeking] = useState("");
  /* The only locator either region has, so it is asked for in both and
     required in both — a room is opened in a city, not in a country. */
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  /* Escape closes, the page behind does not scroll, and focus moves into the
     dialog and back to wherever it came from on the way out. */
  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      returnTo?.focus?.();
    };
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    if (!name.trim()) return setError("Please enter your name.");

    const years = Number(age);
    if (!age.trim() || !Number.isFinite(years) || !Number.isInteger(years))
      return setError("Please enter your age.");
    if (years < MIN_AGE)
      return setError(`You have to be ${MIN_AGE} or over to apply.`);
    if (years > 120) return setError("Please enter a real age.");
    if (!region) return setError("Please say where you're applying from.");
    if (!seeking)
      return setError("Please say who you're looking to work with.");
    if (!city.trim()) return setError("Please enter your city.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please enter a valid email address.");

    setBusy(true);
    setError("");

    const { error: err } = await supabase.from("group_signups").insert([
      {
        name: name.trim(),
        age: years,
        region,
        seeking,
        city: city.trim(),
        email: email.trim().toLowerCase(),
        group_slug: position.slug,
        created_at: new Date().toISOString(),
      },
    ]);

    if (err) {
      setError(
        err.code === "23505"
          ? "You've already applied for this one. Try another position?"
          : "Something went wrong. Please try again.",
      );
      setBusy(false);
      return;
    }

    track("position_apply", { position: position.slug });
    setDone(true);
    setBusy(false);
  };

  return (
    <div
      className="jd-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="jd-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="jd-title"
        tabIndex={-1}
        ref={panelRef}
      >
        <header className="jd-top">
          <span className="jd-topmeta">
            <span className="post-ref">{position.ref}</span>
            <span className="post-open">open</span>
          </span>
          <button
            type="button"
            className="jd-close"
            onClick={onClose}
            aria-label="close this listing"
          >
            &times;
          </button>
        </header>

        <div className="jd-scroll">
          <h2 id="jd-title" className="jd-title">
            {position.title}
          </h2>
          <p className="jd-terms">{position.terms}</p>
          <p className="jd-summary">{position.summary}</p>

          <p className="jd-status">
            we&apos;ll send you instructions for the interview date and time.
          </p>

          <section className="jd-section">
            <h3>what the role involves</h3>
            <ul>
              {position.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <section className="jd-section">
            <h3>what we're looking for</h3>
            <ul>
              {position.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <section className="jd-section">
            <h3>what you get</h3>
            <ul>
              {position.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>

          <div className="jd-apply">
            {done ? (
              <div className="apply-done">
                <h3>
                  application received
                  <span className="apply-dot">.</span>
                </h3>
                <p className="jd-summary">
                  you&apos;ve applied for <strong>{position.title}</strong>.
                  we&apos;ll send you instructions for the interview date and
                  time.
                </p>
                <button type="button" className="apply-ghost" onClick={onClose}>
                  back to the other positions
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h3>
                  apply for this position
                  <span className="apply-dot">.</span>
                </h3>
                <p className="apply-formnote">
                  six fields. that is the entire hiring process.
                </p>

                <label className="apply-field">
                  <span>name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="what people call you"
                  />
                </label>

                <div className="apply-row is-triple">
                  <label className="apply-field">
                    <span>age</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={MIN_AGE}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder={`${MIN_AGE}+`}
                    />
                  </label>
                  <label className="apply-field">
                    <span>applying from</span>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="">region…</option>
                      {REGIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="apply-field">
                    <span>looking to work with</span>
                    <select
                      value={seeking}
                      onChange={(e) => setSeeking(e.target.value)}
                    >
                      <option value="">choose…</option>
                      {seekingFor(position).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>


                <div className="apply-row">
                  <label className="apply-field">
                    <span>city</span>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2"
                      placeholder="so we open it near you"
                    />
                  </label>
                  <label className="apply-field">
                    <span>email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="where we send the offer"
                    />
                  </label>
                </div>

                {error && (
                  <p className="apply-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="apply-submit" disabled={busy}>
                  {busy ? "submitting…" : `apply for ${position.title}`}
                </button>

                <p className="apply-fine">
                  {MIN_AGE}+ only. we email you about this position and nothing
                  else — withdraw any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
