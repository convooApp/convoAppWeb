import React, { useEffect, useMemo, useRef, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { streamMessage, MeterApiError } from "../../lib/meterApi";
import { CharacterId, getCharacterCard } from "./characters";
import { containsProfanity } from "./profanityFilter";
import "./meter-chat.css";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}

interface MeterChatProps {
  sessionId: string;
  startedAt: number;
  durationMs: number;
  characterId: CharacterId;
  /** When the character texts first (Kaira / Ameya), this is their opening
   *  line — pre-rendered as the first assistant message before the user types. */
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
  zoya: "the adventurer",
  veer: "the charmer",
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
            id: `assistant-opener-${characterId}`,
            role: "assistant" as const,
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

  // iOS Safari soft-keyboard handling.
  //
  // The trick: keep the chat-root pinned to the *visual* viewport (the
  // shrinking area above the keyboard), not the layout viewport. We do this
  // by writing both `visualViewport.height` and `visualViewport.offsetTop`
  // to CSS vars, and consuming them in meter-chat.css as
  //   height: var(--app-vh)  +  top: var(--app-vt)
  // — so when iOS pans the visual viewport (which it does even when we lock
  // <body>), the chat-root follows the pan and stays fully on screen.
  //
  // We also force the layout-viewport scroll position back to (0, 0) on
  // every visual-viewport event. iOS sometimes scrolls the document a few
  // px when focusing an input — clobbering it keeps the math simple.
  //
  // Body lock is also applied to prevent any residual page scroll.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("meter-chat-active");

    const setAppVh = () => {
      const vv = window.visualViewport;
      const h = vv?.height ?? window.innerHeight;
      const t = vv?.offsetTop ?? 0;
      root.style.setProperty("--app-vh", `${h}px`);
      root.style.setProperty("--app-vt", `${t}px`);
      // Keep latest message in view as the viewport shrinks/grows.
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "auto",
      });
    };

    // Force the layout viewport back to (0, 0). iOS occasionally scrolls
    // the document a few px when an input is focused; this undoes that.
    const resetScroll = () => {
      if (window.scrollX !== 0 || window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    setAppVh();
    resetScroll();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", setAppVh);
    vv?.addEventListener("scroll", setAppVh);
    window.addEventListener("orientationchange", setAppVh);
    window.addEventListener("scroll", resetScroll, { passive: true });

    return () => {
      root.classList.remove("meter-chat-active");
      root.style.removeProperty("--app-vh");
      root.style.removeProperty("--app-vt");
      vv?.removeEventListener("resize", setAppVh);
      vv?.removeEventListener("scroll", setAppVh);
      window.removeEventListener("orientationchange", setAppVh);
      window.removeEventListener("scroll", resetScroll);
    };
  }, []);

  // Timer state
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
      id: `assistant-${Date.now()}`,
      role: "assistant",
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
    <RemoveScroll>
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
    </RemoveScroll>
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
