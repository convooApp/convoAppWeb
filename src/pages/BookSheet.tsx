import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";

/* ------------------------------------------------------------------
   The sheet in flight.

   It is a chain of nested strips: strip 0 hinges on the spine, strip 1
   hinges on strip 0's outer edge, and so on. Each strip clips its own
   slice of the full page — the recto artwork on the front, the verso on
   the back — so the page can bow while the picture printed on it stays
   whole and in register.

   The turn writes each strip's angle and lighting into CSS custom
   properties; nothing here re-renders while the page is moving.
   ------------------------------------------------------------------ */

type Props = {
  strips: number;
  /** Front of the page: plain stock, or the cover on the way out of page 0. */
  recto: ReactNode;
  /** Back of the page: the photo and line that land on the left. */
  verso: ReactNode;
};

function stripChain(depth: number, props: Props): ReactNode {
  const { strips, recto, verso } = props;
  if (depth >= strips) return null;

  const first = depth === 0;
  const last = depth === strips - 1;

  return (
    <div
      className="strip"
      data-strip={depth}
      style={{ "--i": depth } as CSSProperties}
    >
      <div
        className={
          "strip-face strip-face--recto" +
          (first ? " is-spine" : "") +
          (last ? " is-edge" : "")
        }
      >
        <div className="face-slide">{recto}</div>
        <span className="strip-dark" />
        <span className="strip-spec" />
      </div>

      <div
        className={
          "strip-face strip-face--verso" +
          (first ? " is-spine" : "") +
          (last ? " is-edge" : "")
        }
      >
        <div className="face-slide">{verso}</div>
        <span className="strip-dark" />
        <span className="strip-spec" />
      </div>

      {stripChain(depth + 1, props)}
    </div>
  );
}

const BookSheet = forwardRef<HTMLDivElement, Props>(function BookSheet(
  props,
  ref
) {
  return (
    <div className="turn-layer" aria-hidden="true">
      <div
        className="sheet"
        ref={ref}
        style={{ "--n": props.strips } as CSSProperties}
      >
        {stripChain(0, props)}
      </div>
    </div>
  );
});

export default BookSheet;
