import React, { useEffect, useState } from "react";
import { MeterIntro } from "../components/meter/MeterIntro";
import { MeterChat } from "../components/meter/MeterChat";
import { MeterLoading } from "../components/meter/MeterLoading";
import { MeterScoreReveal } from "../components/meter/MeterScoreReveal";
import { CharacterId, getCharacterCard } from "../components/meter/characters";
import {
  Archetype,
  finalizeSession,
  MeterApiError,
  ScoreResult,
  startSession,
  UserGender,
} from "../lib/meterApi";

type Phase = "intro" | "chatting" | "loading" | "reveal";

interface SessionState {
  id: string;
  startedAt: number;
  durationMs: number;
  characterId: CharacterId;
  /** First message from the character (Kaira / Ameya open the chat). `null`
   *  when the user is expected to open. */
  opener: string | null;
}

/*
 * Dev-only shortcuts. Hit one of these to test the UI without chatting:
 *   /?dev=reveal — jump to the reveal poster (defaults: Raj / romantic / male).
 *   /?dev=reveal&archetype=showstopper&gender=female — pick a specific card.
 *   /?dev=loading — render the clapperboard loader forever.
 * In dev mode, "NEW SCENE" advances to the next archetype × gender and updates
 * the URL via replaceState so a page refresh keeps you on the current card.
 * Optional &char=vedika|kaira|ameya|aryan overrides the chat-character tint.
 */
const ARCHETYPES: Archetype[] = [
  "romantic",
  "showstopper",
  "poet",
  "free_spirit",
  "cool",
  "wise",
  "loyal",
  "strategist",
  "cliffhanger",
  "comedian",
];

// Every archetype × every gender, in display order.
const ARCHETYPE_GENDER_CYCLE: Array<{
  archetype: Archetype;
  gender: UserGender;
}> = ARCHETYPES.flatMap((a) => [
  { archetype: a, gender: "male" as UserGender },
  { archetype: a, gender: "female" as UserGender },
]);

function readDevParams() {
  if (typeof window === "undefined") return null;
  const q = new URLSearchParams(window.location.search);
  const dev = q.get("dev");
  if (!dev) return null;
  const archetype = (q.get("archetype") as Archetype) ?? "romantic";
  const gender: UserGender =
    (q.get("gender") as UserGender) === "female" ? "female" : "male";
  return {
    phase: dev as "reveal" | "loading" | "chatting",
    archetype: ARCHETYPES.includes(archetype)
      ? archetype
      : ("romantic" as Archetype),
    gender,
    char: (q.get("char") as CharacterId) ?? "vedika",
  };
}

// In dev mode, replace the URL's archetype + gender query params so a refresh
// keeps you on the same card. Uses replaceState so the back button isn't
// polluted with every cycle step.
function updateDevUrl(archetype: Archetype, gender: UserGender) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("archetype", archetype);
  url.searchParams.set("gender", gender);
  window.history.replaceState(null, "", url.toString());
}

const Meter: React.FC = () => {
  const devParams = readDevParams();
  const [phase, setPhase] = useState<Phase>(
    devParams?.phase === "reveal"
      ? "reveal"
      : devParams?.phase === "loading"
        ? "loading"
        : "intro",
  );
  const [devCycleIndex, setDevCycleIndex] = useState(() => {
    if (!devParams) return 0;
    const idx = ARCHETYPE_GENDER_CYCLE.findIndex(
      (e) =>
        e.archetype === devParams.archetype && e.gender === devParams.gender,
    );
    return Math.max(0, idx);
  });
  const [session, setSession] = useState<SessionState | null>(
    devParams?.phase === "reveal"
      ? {
          id: "dev-session-0000",
          startedAt: Date.now(),
          durationMs: 180_000,
          characterId: devParams.char,
          opener: null,
        }
      : null,
  );
  const [result, setResult] = useState<ScoreResult | null>(
    devParams?.phase === "reveal"
      ? (() => {
          const card = getCharacterCard(devParams.char);
          return {
            score: 88,
            archetype: devParams.archetype,
            gender: devParams.gender,
            best_line: "",
            character: { id: card.id, name: card.name, city: card.city },
          };
        })()
      : null,
  );
  const [introError, setIntroError] = useState<string | null>(null);
  const [startingId, setStartingId] = useState<CharacterId | null>(null);

  // In dev mode (?dev=reveal), "NEW SCENE" advances to the next archetype × gender
  // combo and rewrites the URL so a refresh keeps you on the current card.
  const devCycleNext = () => {
    if (!devParams) return;
    const next = (devCycleIndex + 1) % ARCHETYPE_GENDER_CYCLE.length;
    setDevCycleIndex(next);
    const card = getCharacterCard(devParams.char);
    const entry = ARCHETYPE_GENDER_CYCLE[next];
    setResult({
      score: 88,
      archetype: entry.archetype,
      gender: entry.gender,
      best_line: "",
      character: { id: card.id, name: card.name, city: card.city },
    });
    updateDevUrl(entry.archetype, entry.gender);
  };

  const pickCharacter = async (id: CharacterId) => {
    setStartingId(id);
    setIntroError(null);
    try {
      const r = await startSession(id);
      setSession({
        id: r.session_id,
        startedAt: new Date(r.started_at).getTime(),
        durationMs: r.duration_ms,
        characterId: id,
        opener: r.opener ?? null,
      });
      setPhase("chatting");
    } catch (err) {
      if (err instanceof MeterApiError && err.status === 429) {
        setIntroError("You've hit today's limit. Come back tomorrow.");
      } else {
        setIntroError("Could not start the session. Try again in a moment.");
      }
    } finally {
      setStartingId(null);
    }
  };

  const finalize = async () => {
    if (!session) return;
    setPhase("loading");
    try {
      const r = await finalizeSession(session.id);
      setResult(r);
      setPhase("reveal");
    } catch {
      const card = getCharacterCard(session.characterId);
      // Fallback if scoring fails: default to Romantic + opposite-gender of
      // the character they chatted with.
      const fallbackGender: UserGender =
        card.id === "ameya" || card.id === "aryan" ? "female" : "male";
      setResult({
        score: 70,
        archetype: "romantic",
        gender: fallbackGender,
        best_line: "",
        character: { id: card.id, name: card.name, city: card.city },
      });
      setPhase("reveal");
    }
  };

  const restart = () => {
    setSession(null);
    setResult(null);
    setIntroError(null);
    setPhase("intro");
  };

  useEffect(() => {
    document.title = "Convooversation Meter — Convoo";

    // Tell search engines to skip indexing while the user is on the Meter.
    // The HashRouter setup means crawlers see "/" by default anyway, but
    // this is belt-and-suspenders if anyone server-renders or shares the URL
    // via a tool that follows hash routes.
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive, nosnippet";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  if (phase === "intro") {
    return (
      <MeterIntro
        onPick={pickCharacter}
        starting={startingId !== null}
        startingId={startingId}
        error={introError}
      />
    );
  }
  if (phase === "chatting" && session) {
    return (
      <MeterChat
        sessionId={session.id}
        startedAt={session.startedAt}
        durationMs={session.durationMs}
        characterId={session.characterId}
        opener={session.opener}
        onEnd={finalize}
      />
    );
  }
  if (phase === "loading") {
    return <MeterLoading />;
  }
  if (phase === "reveal" && result && session) {
    // Soft WhatsApp capture now lives inline on the reveal page — no
    // standalone gate before the ticket. Skippable per the brief.
    return (
      <MeterScoreReveal
        result={result}
        sessionId={session.id}
        onRestart={devParams ? devCycleNext : restart}
      />
    );
  }

  return <MeterLoading />;
};

export default Meter;
