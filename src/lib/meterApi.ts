import { CharacterId } from "../components/meter/characters";

// Prefer an explicit override; otherwise derive the Edge Functions base from
// VITE_SUPABASE_URL. In CI only VITE_SUPABASE_URL is set, so deriving keeps
// the deploy working without adding another secret.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const BASE =
  import.meta.env.VITE_METER_API_URL ||
  (SUPABASE_URL ? `${SUPABASE_URL.replace(/\/+$/, "")}/functions/v1` : "");

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  age?: number;
  city?: string;
  vibe?: string;
}

export interface StartSessionResponse {
  session_id: string;
  started_at: string;
  duration_ms: number;
  /** Pre-written opening message from the character if they're set to text
   *  first. `null` when the user is expected to open the conversation. */
  opener: string | null;
  character: CharacterInfo;
}

export type Archetype =
  | "romantic"
  | "showstopper"
  | "poet"
  | "free_spirit"
  | "cool"
  | "wise"
  | "loyal"
  | "strategist"
  | "cliffhanger"
  | "comedian";

export type UserGender = "male" | "female";

export interface ScoreResult {
  score: number;
  archetype: Archetype;
  gender: UserGender;
  best_line: string;
  character: CharacterInfo | null;
}

export class MeterApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message?: string) {
    super(message ?? code);
    this.status = status;
    this.code = code;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let parsed: { error?: string; message?: string } & Partial<T>;
  try {
    parsed = text ? JSON.parse(text) : ({} as never);
  } catch {
    throw new MeterApiError(res.status, "invalid_response");
  }
  if (!res.ok) {
    throw new MeterApiError(
      res.status,
      parsed.error ?? "unknown_error",
      parsed.message,
    );
  }
  return parsed as T;
}

export function startSession(
  character: CharacterId,
): Promise<StartSessionResponse> {
  return postJson<StartSessionResponse>("meter-start", { character });
}

export function finalizeSession(sessionId: string): Promise<ScoreResult> {
  return postJson<ScoreResult>("meter-finalize", { session_id: sessionId });
}


export function submitLead(
  sessionId: string,
  countryCode: string,
  phone: string,
): Promise<{ ok: true }> {
  return postJson<{ ok: true }>("meter-lead", {
    session_id: sessionId,
    country_code: countryCode,
    phone,
  });
}

/**
 * Sessionless WhatsApp capture (the /in campaign page and the homepage).
 * Lands in the same meter_leads table as meter results, tagged by `source`.
 */
export function submitWaitlistLead(
  countryCode: string,
  phone: string,
  source: "in" | "home",
): Promise<{ ok: true }> {
  return postJson<{ ok: true }>("waitlist-lead", {
    country_code: countryCode,
    phone,
    source,
  });
}

export interface StreamHandlers {
  onTyping?: () => void;
  onChunk?: (text: string) => void;
  onDone?: (messageId: string | null) => void;
  onLocked?: (reason: string) => void;
  onError?: (message: string) => void;
}

export async function streamMessage(
  sessionId: string,
  content: string,
  handlers: StreamHandlers,
): Promise<void> {
  const res = await fetch(`${BASE}/meter-message`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      accept: "text/event-stream",
    },
    body: JSON.stringify({ session_id: sessionId, content }),
  });

  if (!res.ok || !res.body) {
    let code = "stream_failed";
    try {
      const j = await res.json();
      code = j.error ?? code;
    } catch {
      /* ignore */
    }
    throw new MeterApiError(res.status, code);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sep = buffer.indexOf("\n\n");
    while (sep !== -1) {
      const raw = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      sep = buffer.indexOf("\n\n");

      let event = "message";
      let data = "";
      for (const line of raw.split("\n")) {
        if (line.startsWith("event: ")) event = line.slice(7).trim();
        else if (line.startsWith("data: ")) data += line.slice(6);
      }
      if (!data) continue;
      let payload: {
        text?: string;
        message_id?: string | null;
        reason?: string;
        message?: string;
      };
      try {
        payload = JSON.parse(data);
      } catch {
        continue;
      }
      switch (event) {
        case "typing":
          handlers.onTyping?.();
          break;
        case "chunk":
          if (typeof payload.text === "string")
            handlers.onChunk?.(payload.text);
          break;
        case "done":
          handlers.onDone?.(payload.message_id ?? null);
          break;
        case "locked":
          handlers.onLocked?.(payload.reason ?? "expired");
          break;
        case "error":
          handlers.onError?.(payload.message ?? "stream_error");
          break;
      }
    }
  }
}
