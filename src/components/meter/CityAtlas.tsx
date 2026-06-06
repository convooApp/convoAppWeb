import React, { useEffect, useState } from "react";
import { fetchCityAtlas, CityAtlasCity } from "../../lib/meterApi";
import "./city-atlas.css";

// ── Seed data — shown immediately; replaced by live fetch if available ─────────
const SEED_CITIES: CityAtlasCity[] = [
  {
    name: "Pune",
    total_takes: 1104,
    is_low_sample: false,
    top_archetypes: [
      { name: "Romantic", pct: 34 },
      { name: "Poet", pct: 22 },
      { name: "Comedian", pct: 16 },
      { name: "Loyal", pct: 14 },
    ],
  },
  {
    name: "Mumbai",
    total_takes: 743,
    is_low_sample: false,
    top_archetypes: [
      { name: "Showstopper", pct: 29 },
      { name: "Comedian", pct: 24 },
      { name: "Cool", pct: 18 },
      { name: "Romantic", pct: 15 },
    ],
  },
];

// ── One-liner per archetype ───────────────────────────────────────────────────
const ARCH_DESC: Record<string, string> = {
  Romantic: "Soft, patient. Takes its time before saying anything real.",
  Showstopper: "Loud, charming, makes sure you remember them.",
  Poet: "Reads between the lines. Speaks in feelings, not facts.",
  Comedian: "Deflects with jokes. Means more than they let on.",
  Cool: "Unbothered. Says less, implies more.",
  Wise: "Listens first. Always has the thing you needed to hear.",
  Loyal: "All in, always. The kind that actually shows up.",
  Strategist: "Plays the long game. Knows what they want before you do.",
  Cliffhanger: "Keeps you guessing. You're never quite sure where you stand.",
  "Free Spirit": "Impossible to pin down. Magnetic precisely because of it.",
};

// ── Archetype colours ─────────────────────────────────────────────────────────
const ARCH_COLOR: Record<string, string> = {
  Romantic: "#a8123c",
  Poet: "#c2185b",
  Comedian: "#d4a04c",
  Strategist: "#7a3a2a",
  Cool: "#3a1a1a",
  Wise: "#8b6754",
  Loyal: "#e07b2e",
  Showstopper: "#b83280",
  "Free Spirit": "#c9779a",
  Cliffhanger: "#5a2418",
};

function color(name: string) {
  return ARCH_COLOR[name] ?? "#5a2418";
}

// ── City card ─────────────────────────────────────────────────────────────────
const CityCard: React.FC<{ city: CityAtlasCity }> = ({ city }) => {
  const top = city.top_archetypes[0];
  const rest = city.top_archetypes.slice(1);

  return (
    <div className="atlas-city-card">
      {/* City badge */}
      <div className="atlas-city-badge">★ {city.name.toUpperCase()} ★</div>

      {/* Hero archetype */}
      <div className="atlas-hero-arch" style={{ color: color(top.name) }}>
        {top.name}.
      </div>
      <p className="atlas-hero-desc">{ARCH_DESC[top.name] ?? ""}</p>

      {/* Stat */}
      <div className="atlas-hero-stat">
        <span className="atlas-hero-pct">{top.pct}%</span>
        <span className="atlas-hero-of">
          {" "}
          of {city.total_takes.toLocaleString("en-IN")} takes
        </span>
      </div>

      {/* Divider */}
      <div className="atlas-card-rule" />

      {/* Secondary archetypes — inline row */}
      <div className="atlas-secondary-row">
        {rest.map((a, i) => (
          <React.Fragment key={a.name}>
            <span className="atlas-secondary-item">
              <span className="atlas-secondary-name">{a.name}</span>
              <span className="atlas-secondary-pct">{a.pct}%</span>
            </span>
            {i < rest.length - 1 && (
              <span className="atlas-secondary-dot">·</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export const CityAtlas: React.FC = () => {
  const [cities, setCities] = useState<CityAtlasCity[]>(SEED_CITIES);
  const [totalTakes, setTotalTakes] = useState(
    SEED_CITIES.reduce((s, c) => s + c.total_takes, 0),
  );

  // Try fetching live data on mount, refresh every hour
  useEffect(() => {
    const load = () => {
      fetchCityAtlas()
        .then((d) => {
          if (d.cities.length > 0) {
            setCities(d.cities);
            setTotalTakes(d.totals.all_time_takes);
          }
        })
        .catch(() => {
          /* keep seed data */
        });
    };
    load();
    const id = setInterval(load, 60 * 60 * 1000); // hourly
    return () => clearInterval(id);
  }, []);

  return (
    <section className="atlas-root">
      {/* Header */}
      <div className="atlas-eyebrow">★ THE CITY ATLAS ★</div>
      <h2 className="atlas-headline">How each city dates.</h2>
      <p className="atlas-subline">Pune and Mumbai, in their own words.</p>

      {/* Live badge */}
      <div className="atlas-live-row">
        <span className="atlas-live-badge">
          <span className="atlas-live-dot" aria-hidden />
          LIVE
        </span>
        <span className="atlas-live-sep">·</span>
        <span className="atlas-live-meta">
          UPDATED HOURLY · {totalTakes.toLocaleString("en-IN")} TOTAL TAKES
        </span>
      </div>

      {/* Cards grid */}
      <div className="atlas-cards-grid">
        {cities.map((city) => (
          <CityCard key={city.name} city={city} />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="atlas-footer-cta">
        <p className="atlas-footer-main">
          Take the Meter. <em>Tip the scale.</em>
        </p>
        <p className="atlas-footer-sub">
          YOUR ARCHETYPE COUNTS TOWARD YOUR CITY.
        </p>
      </div>
    </section>
  );
};
