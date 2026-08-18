import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import BookSheet from "./BookSheet";
import Spread from "./BookSpreads";
import {
  STRIPS,
  TURN_SECONDS,
  castShadow,
  openShift,
  rectoShadow,
  sweep,
  turnFrame,
} from "./storyBookTurn";
import "./story-book.css";

/* ------------------------------------------------------------------
   Convoo homepage — the site is one book you page through.
   Cover (0) → index (1) → five chapters (2-6).
   ------------------------------------------------------------------ */

const BASE = import.meta.env.BASE_URL;
const img = (file: string) => `${BASE}book/${file}`;

/* Swap this for the artwork from the design file by dropping it into
   public/book/ and pointing here — nothing else needs to change. */
const COVER_ART = img("Cover.png");

const LAST_PAGE = 6;

/* One photo + one line per left-hand page. Index 0 is the closed cover,
   which has no verso. */
const VERSOS = [
  null,
  {
    src: img("index.jpg"),
    alt: "a couple sitting together looking out over a valley",
    quote: "most stories start with a look. this one doesn't.",
  },
  {
    src: img("p2-introduction.jpg"),
    alt: "a friend introducing two people",
    quote: "someone always makes the introduction. tonight it might be you.",
  },
  {
    src: img("p3-message.jpg"),
    alt: "smiling at a message on his phone",
    quote: "he laughed before he knew what she looked like.",
  },
  {
    src: img("p4-party.jpg"),
    alt: "friends whispering at a house party",
    quote: "she'd been saying they'd get on for two years.",
  },
  {
    src: img("team.jpg"),
    alt: "a couple laughing together holding flowers",
    quote: "we're the friend who insists you'll get along.",
  },
  {
    src: img("cover-sunset.jpg"),
    alt: "a couple silhouetted against the sunset",
    quote: "somewhere, someone is about to show up.",
  },
] as const;

type VersoData = Exclude<(typeof VERSOS)[number], null>;

function Verso({ verso }: { verso: VersoData }) {
  return (
    <div className="verso">
      <div className="verso-plate">
        <img className="verso-photo" src={verso.src} alt={verso.alt} />
      </div>
      <div className="verso-quote">
        <span className="verso-mark" aria-hidden="true">
          &ldquo;
        </span>
        <span className="verso-text">{verso.quote}</span>
      </div>
    </div>
  );
}

type Turn = {
  from: number;
  to: number;
  dir: "next" | "prev";
  strips: number;
};

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function StoryHome() {
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  /* turnTo is bound into long-lived listeners, so it reads the live page
     through a ref rather than closing over a stale render. */
  const stateRef = useRef({ page: 0, busy: false });
  stateRef.current = { page, busy: turn !== null };

  const turnTo = useCallback((n: number) => {
    const { page: current, busy } = stateRef.current;
    if (busy || n === current || n < 0 || n > LAST_PAGE) return;

    if (reducedMotion()) {
      setPage(n);
      return;
    }

    setTurn({
      from: current,
      to: n,
      dir: n > current ? "next" : "prev",
      strips: window.innerWidth <= 560 ? 5 : STRIPS,
    });
  }, []);

  /* Drive the turn. Everything the sheet does — the bow, the light on each
     strip, the shadow it drags across the far page, the book sliding over to
     make room — comes off one progress value, so nothing can drift out of
     step with anything else. */
  useLayoutEffect(() => {
    if (!turn) return;

    const sheet = sheetRef.current;
    const book = bookRef.current;
    const reverse = turn.dir === "prev";

    const strips = sheet
      ? Array.from(sheet.querySelectorAll<HTMLElement>(".strip"))
      : [];
    const rectos = strips.map((s) =>
      s.querySelector<HTMLElement>(":scope > .strip-face--recto"),
    );
    const versos = strips.map((s) =>
      s.querySelector<HTMLElement>(":scope > .strip-face--verso"),
    );
    const cast = book?.querySelector<HTMLElement>(".cast-shadow") ?? null;
    const under = book?.querySelector<HTMLElement>(".recto-shadow") ?? null;

    const shift = openShift(window.innerWidth);
    const closed = { x: 0, scale: 1 };
    const opens = (turn.from === 0) !== (turn.to === 0);
    const from = turn.from > 0 ? shift : closed;
    const to = turn.to > 0 ? shift : closed;

    /* The tween runs linearly; all the shaping lives in sweep(), so the page,
       the shadows and the book's slide are driven off one motion curve. */
    const draw = (t: number) => {
      const { glide, angle } = sweep(t);
      const frame = turnFrame(angle, turn.strips);
      frame.forEach((f, i) => {
        const prev = frame[i - 1] ?? f;
        const next = frame[i + 1] ?? f;
        strips[i]?.style.setProperty("--a", `${f.delta}deg`);

        /* Each face is shaded across its width, from the midpoint it shares
           with the strip before it to the midpoint it shares with the one
           after, so the facets blend into a continuous surface. */
        const set = (
          el: HTMLElement | null,
          dark: (s: typeof f) => number,
          spec: (s: typeof f) => number,
        ) => {
          if (!el) return;
          el.style.setProperty("--dkA", `${(dark(prev) + dark(f)) / 2}`);
          el.style.setProperty("--dkB", `${(dark(f) + dark(next)) / 2}`);
          el.style.setProperty("--spA", `${(spec(prev) + spec(f)) / 2}`);
          el.style.setProperty("--spB", `${(spec(f) + spec(next)) / 2}`);
        };
        set(
          rectos[i],
          (x) => x.rectoDark,
          (x) => x.rectoSpec,
        );
        set(
          versos[i],
          (x) => x.versoDark,
          (x) => x.versoSpec,
        );
      });

      if (cast) {
        const c = castShadow(angle);
        cast.style.setProperty("--cast", `${c.opacity}`);
        cast.style.setProperty("--reach", `${c.reach}%`);
      }
      if (under) under.style.setProperty("--rk", `${rectoShadow(angle)}`);

      /* Opening and closing rides the same curve as the page rather than its
         own tween, so the book can never drift out of step with the sheet. */
      if (opens && wrapRef.current) {
        gsap.set(wrapRef.current, {
          xPercent: from.x + (to.x - from.x) * glide,
          scale: from.scale + (to.scale - from.scale) * glide,
        });
      }
    };

    const state = { p: reverse ? 1 : 0 };
    draw(state.p);

    const tl = gsap.timeline({
      onComplete: () => {
        setPage(turn.to);
        setTurn(null);
      },
    });

    tl.to(
      state,
      {
        p: reverse ? 0 : 1,
        duration: TURN_SECONDS,
        ease: "none",
        onUpdate: () => draw(state.p),
      },
      0,
    );

    return () => {
      tl.kill();
    };
  }, [turn]);

  /* Keep the open book positioned correctly when the breakpoint changes. */
  useEffect(() => {
    const onResize = () => {
      if (!wrapRef.current || turn) return;
      const open = stateRef.current.page > 0;
      const shift = open ? openShift(window.innerWidth) : { x: 0, scale: 1 };
      gsap.set(wrapRef.current, { xPercent: shift.x, scale: shift.scale });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [turn, page]);

  /* The whole spread is the control: left click forward, right click back,
     arrows for keyboards. Links and buttons keep their own behaviour. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) return;
      turnTo(stateRef.current.page + 1);
    };
    const onCtx = (e: MouseEvent) => {
      e.preventDefault();
      turnTo(stateRef.current.page - 1);
    };
    /* Touch gets swipes instead of a right button. */
    let swipeFrom: { x: number; y: number } | null = null;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      swipeFrom = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!swipeFrom) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - swipeFrom.x;
      const dy = t.clientY - swipeFrom.y;
      swipeFrom = null;

      /* A tap turns forward. The click the browser synthesises straight
         after lands inside the turn and is ignored, so this never
         double-advances. */
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        if ((e.target as HTMLElement).closest("a, button")) return;
        turnTo(stateRef.current.page + 1);
        return;
      }

      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      turnTo(stateRef.current.page + (dx < 0 ? 1 : -1));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") turnTo(stateRef.current.page + 1);
      if (e.key === "ArrowLeft") turnTo(stateRef.current.page - 1);
    };

    stage.addEventListener("click", onClick);
    stage.addEventListener("contextmenu", onCtx);
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("keydown", onKey);

    return () => {
      stage.removeEventListener("click", onClick);
      stage.removeEventListener("contextmenu", onCtx);
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("keydown", onKey);
    };
  }, [turnTo]);

  /* Warm the versos so a page turn never reveals a half-loaded photo. */
  useEffect(() => {
    VERSOS.forEach((v) => {
      if (!v) return;
      const im = new Image();
      im.src = v.src;
    });
  }, []);

  useEffect(() => {
    document.body.classList.add("story-book-lock");
    return () => document.body.classList.remove("story-book-lock");
  }, []);

  /* Two pages are in play during a turn, and which is where does not depend
     on the direction: the higher-numbered one lies on the book and the
     lower-numbered one is on the sheet that is moving. So the reader never
     sees a page change — only paper come off one and onto the other. */
  const rectoPage = turn ? Math.max(turn.from, turn.to) : page;
  const pileP = turn ? Math.min(turn.from, turn.to) : page;
  const sheetFront = turn ? Math.min(turn.from, turn.to) : page;

  const pileVerso = VERSOS[pileP];
  const sheetVerso = VERSOS[rectoPage];

  return (
    <div
      className="story-book"
      ref={stageRef}
      style={{ "--cover-art": `url(${COVER_ART})` } as CSSProperties}
    >
      <div className="book-topbar">
        <Link className="book-brand" to="/">
          convoo<span className="brand-dot">.</span>
        </Link>
        <Link className="book-cta" to="/download-now">
          get the app
        </Link>
      </div>

      <div className="bookwrap" ref={wrapRef}>
        <div className="book" ref={bookRef}>
          <span className="book-edge-side" />
          <span className="book-edge-bottom" />
          <div className="book-base" />
          <div className="book-gutter" />

          {/* The page the reader is arriving at, lying on the book. During a
              turn it is already in place, uncovered as the sheet lifts. */}
          <Spread n={rectoPage} go={turnTo} />

          {rectoPage > 0 && (
            <span className="book-folio">&mdash; {rectoPage} &mdash;</span>
          )}

          {/* Cast by the raised page onto the spread it is lifting off. */}
          <span className="recto-shadow" aria-hidden="true" />

          {/* The verso: the previous sheet, flipped over behind the spine. */}
          {pileVerso && (
            <div className="leftpage" key={pileP}>
              {pileP > 2 && <div className="leftpage-stack" />}
              <div className="leftpage-sheet">
                <div className="leftpage-face">
                  <Verso verso={pileVerso} />
                  {/* Cast by the raised page as it comes down over this one. */}
                  <span className="cast-shadow" aria-hidden="true" />
                </div>
              </div>
            </div>
          )}

          {/* The sheet actually in flight. */}
          {turn && (
            <BookSheet
              ref={sheetRef}
              strips={turn.strips}
              recto={
                <>
                  <span className="sheet-stock" />
                  <Spread n={sheetFront} go={turnTo} />
                </>
              }
              verso={sheetVerso ? <Verso verso={sheetVerso} /> : null}
            />
          )}
        </div>
      </div>

      <span className="book-hint">
        <span className="hint-mouse">
          click to turn the page &middot; right-click to go back
        </span>
        <span className="hint-touch">
          tap to turn the page &middot; swipe right to go back
        </span>
      </span>
    </div>
  );
}
