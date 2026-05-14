import React, { useEffect, useMemo, useRef, useState } from "react";
import { streamMessage, MeterApiError } from "../../lib/meterApi";
import { CharacterId, getCharacterCard } from "./characters";
import { containsProfanity } from "./profanityFilter";
import "./meter-chat.css";

export interface ChatMessage {
  id: string;
  role: "user" | "maya";
  content: string;
  pending?: boolean;
}

interface MeterChatProps {
  sessionId: string;
  startedAt: number;
  durationMs: number;
  characterId: CharacterId;
  /** When the character texts first (Kaira / Ameya), this is their opening
   *  line — pre-rendered as the first maya message before the user types. */
  opener: string | null;
  onEnd: () => void;
}

const MAX_CHARS = 1000;

// Per-character one-liner used in the billing strip — same copy the intro
// shows on the poster card.
const CHARACTER_AS: Record<CharacterId, string> = {
  vedika: "the puneri",
  kaira: "the bandra baddie",
  ameya: "the founder type",
  aryan: "the gym romantic",
};

function formatTimer(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export const MeterChat: React.FC<MeterChatProps> = ({
  sessionId,
  startedAt,
  durationMs,
  characterId,
  opener,
  onEnd,
}) => {
  const card = useMemo(() => getCharacterCard(characterId), [characterId]);

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    opener
      ? [
          {
            id: `maya-opener-${characterId}`,
            role: "maya" as const,
            content: opener,
          },
        ]
      : [],
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const endedRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Timer state — replicates MeterTimer behavior inline so the display
  // matches the scene-strip style.
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, durationMs - (Date.now() - startedAt)),
  );
  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, durationMs - (Date.now() - startedAt));
      setRemaining(left);
      if (left <= 0) triggerEnd();
    };
    const id = setInterval(tick, 250);
    tick();
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt, durationMs]);
  const timerWarning = remaining < 30_000;

  const triggerEnd = () => {
    if (endedRef.current) return;
    endedRef.current = true;
    onEnd();
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };
  useEffect(scrollToBottom, [messages, typing]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending || endedRef.current) return;
    if (containsProfanity(text)) {
      setError(
        "let's keep it clean — pick different words and try again.",
      );
      return;
    }
    setError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };
    const placeholder: ChatMessage = {
      id: `maya-${Date.now()}`,
      role: "maya",
      content: "",
      pending: true,
    };
    setMessages((prev) => [...prev, userMsg, placeholder]);
    setDraft("");
    setSending(true);

    try {
      await streamMessage(sessionId, text, {
        onTyping: () => setTyping(true),
        onChunk: (chunk) => {
          setTyping(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholder.id
                ? { ...m, content: m.content + chunk }
                : m,
            ),
          );
        },
        onDone: () => {
          setTyping(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholder.id ? { ...m, pending: false } : m,
            ),
          );
        },
        onLocked: () => {
          setTyping(false);
          setMessages((prev) => prev.filter((m) => m.id !== placeholder.id));
          triggerEnd();
        },
        onError: () => {
          setTyping(false);
          setMessages((prev) => prev.filter((m) => m.id !== placeholder.id));
          setError("Something went wrong. Try sending again.");
        },
      });
    } catch (err) {
      setTyping(false);
      setMessages((prev) => prev.filter((m) => m.id !== placeholder.id));
      if (err instanceof MeterApiError) {
        if (
          err.code === "session_expired" ||
          err.code === "session_locked" ||
          err.code === "message_limit_reached"
        ) {
          triggerEnd();
        } else {
          setError("Something went wrong. Try sending again.");
        }
      } else {
        setError("Something went wrong. Try sending again.");
      }
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="chat-root" data-color={card.color}>
      <div className="chat-bg-warm" aria-hidden />
      <div className="chat-bg-noise" aria-hidden />

      <div className="scene-strip">
        <div className="scene-strip-left">
          <span className="pill">SCENE 01</span>
          <span>TAKE 01 / DIALOGUE</span>
        </div>
        <div className="scene-strip-right">
          <span>
            <span className="live-dot" />
            REC
          </span>
          <span className={`timer-display${timerWarning ? " warning" : ""}`}>
            {formatTimer(remaining)}
          </span>
          <button type="button" className="cut-btn" onClick={triggerEnd}>
            ★ CUT
          </button>
        </div>
      </div>

      <div className="char-billing">
        <div className="char-avatar">
          <span className="initial">{card.name[0]}</span>
        </div>
        <div className="char-info">
          <div className="starring">STARRING</div>
          <div className="name">
            {card.name.toUpperCase()}
            <span className="accent"> · </span>
            {card.age}
            <span className="accent"> · </span>
            {card.city.toUpperCase()}
          </div>
          <div className="meta">
            as <span className="red">{CHARACTER_AS[card.id]}</span> —{" "}
            {card.vibe}
          </div>
        </div>
        <div className="scene-num">
          READING NO.
          <span className="num">{sessionId.slice(0, 3).toUpperCase()}</span>
        </div>
      </div>

      <main className="chat-main">
        <section className="chat-wrap" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="chat-opener">
              <div className="label">SCENE BEGINS</div>
              <div className="title">
                say something <span className="accent">specific.</span>{" "}
                {card.name} is listening.
              </div>
            </div>
          ) : null}

          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              characterName={card.name.toUpperCase()}
            />
          ))}

          {typing ? (
            <div className="typing">
              <div className="msg-attribution">{card.name.toUpperCase()}</div>
              <div className="typing-bubble">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          ) : null}
        </section>

      </main>

      <form
        className="input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        {error ? <div className="chat-error">{error}</div> : null}
        <div className="input-wrap">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="type your line..."
            rows={1}
            disabled={sending || endedRef.current}
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="send-btn"
          disabled={!draft.trim() || sending || endedRef.current}
        >
          ROLL<span className="arrow">→</span>
        </button>
      </form>
    </div>
  );
};

const MessageBubble: React.FC<{
  message: ChatMessage;
  characterName: string;
}> = ({ message, characterName }) => {
  const isUser = message.role === "user";
  if (!message.content && message.pending) return null;
  return (
    <div className={`msg ${isUser ? "you" : "them"}`}>
      <div className="msg-attribution">{isUser ? "YOU" : characterName}</div>
      <div className="msg-bubble">{message.content}</div>
    </div>
  );
};
