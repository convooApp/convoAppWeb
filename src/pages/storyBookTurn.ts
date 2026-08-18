/* ------------------------------------------------------------------
   The physics behind a page turn.

   A page is not a rigid plate. It bows while it swings, every part of it
   sits at a slightly different angle to the light, and it drags a shadow
   across whatever is underneath. Those three things are what stop the
   photo on the far page from looking pasted on: the reader watches it
   arrive on a surface that is behaving like paper.

   The sheet is built as a chain of nested vertical strips. Each strip
   rotates a little further than the one before it, so the sum is a curve
   rather than a hinge. This module works out, for one progress value,
   what every strip should do.
   ------------------------------------------------------------------ */

/** Where a turned page comes to rest — matches the static verso exactly, so
    handing over from the animated sheet to the resting one is invisible. */
export const REST_ANGLE = -178;

export const TURN_SECONDS = 1;

/** Strips across the page. One means a flat sheet (small screens, or when
    the reader has asked for reduced motion). */
export const STRIPS = 7;

/** Degrees of bow at the peak of the turn. Higher reads as flimsier paper. */
const CURL = 42;

/* The light sits in front of the book and slightly to the left. A page only
   ever rotates about its spine, so its normal stays in the x/z plane and the
   vertical component of the light never matters. */
const LX = -0.29;
const LZ = 0.957;

/**
 * A page turn has two compounding non-linearities. The rotation is eased, and
 * a rotating plane's *apparent* width tracks the cosine of its angle, which
 * also moves fastest as it passes upright. Ease the angle directly and the two
 * multiply: the page whips through the middle and has visibly finished long
 * before the animation has, so it reads as arriving and then stopping dead.
 *
 * So shape the thing the eye actually follows — how much of the far page the
 * sheet covers — and solve back for the angle. The smootherstep also cancels
 * the singularity at the two ends, so the page leaves and lands at rest
 * instead of jumping off the surface.
 *
 * @param t raw 0 → 1 through the turn (feed this a linear tween)
 */
export function sweep(t: number) {
  /* Smootherstep: zero velocity *and* zero acceleration at both ends. */
  const glide = t * t * t * (t * (t * 6 - 15) + 10);
  const edge = Math.max(-1, Math.min(1, 1 - 2 * glide));
  return {
    /* Even, decelerating travel — what the book slide and the shadows track. */
    glide,
    /* 0 → 1 of the way round, once the cosine has been undone. */
    angle: Math.acos(edge) / Math.PI,
  };
}

export type StripState = {
  /** Rotation relative to the previous strip — strips are nested, so
      transforms compound and each one only carries its own share. */
  delta: number;
  /** Absolute angle of this strip, used for shading. */
  angle: number;
  rectoDark: number;
  rectoSpec: number;
  versoDark: number;
  versoSpec: number;
};

function shade(angleDeg: number, back: boolean) {
  const t = (angleDeg * Math.PI) / 180;
  const nx = back ? -Math.sin(t) : Math.sin(t);
  const nz = back ? -Math.cos(t) : Math.cos(t);
  const lit = Math.max(0, nx * LX + nz * LZ);
  return { dark: (1 - lit) * 0.5, spec: Math.pow(lit, 9) * 0.18 };
}

/**
 * @param turned 0 → 1 of the way round, from `sweep().angle`
 * @param strips how many segments the sheet is built from
 * @param end    the angle the free edge finishes at
 */
export function turnFrame(
  turned: number,
  strips: number,
  end: number = REST_ANGLE
): StripState[] {
  const lead = end * turned;
  /* Zero at both ends, widest when the page is upright: it is flat when it
     leaves and flat when it lands, and only bows while it is in the air. */
  const bow = -CURL * Math.sin(Math.PI * turned);

  const out: StripState[] = [];
  let angle = 0;

  for (let k = 0; k < strips; k++) {
    /* The shares sum to `lead` exactly, so however hard the page bows the
       free edge still finishes where it was aimed. */
    const spread =
      strips > 1 ? ((2 * bow) / strips) * (k / (strips - 1) - 0.5) : 0;
    const delta = lead / strips + spread;
    angle += delta;

    const recto = shade(angle, false);
    const verso = shade(angle, true);
    out.push({
      delta,
      angle,
      rectoDark: recto.dark,
      rectoSpec: recto.spec,
      versoDark: verso.dark,
      versoSpec: verso.spec,
    });
  }

  return out;
}

/**
 * How hard the lifted page shadows the far page below it. Nothing until the
 * page is past upright — before that the sheet is still over on the recto
 * side — then a soft sweep that tightens into a contact shadow as it settles.
 *
 * @param turned 0 → 1 of the way round
 */
export function castShadow(turned: number) {
  if (turned <= 0.5) return { opacity: 0, reach: 0 };
  const u = (turned - 0.5) * 2;
  return {
    opacity: Math.sin(Math.PI * u) * 0.55,
    /* The shadow's edge travels out from the spine as the page comes down. */
    reach: 18 + u * 82,
  };
}

/** Matching darkening on the page underneath while the sheet is over it. */
export function rectoShadow(turned: number) {
  if (turned >= 0.5) return 0;
  return Math.sin(Math.PI * turned * 2) * 0.4;
}

/** How far the book slides right to make room for the verso, per breakpoint. */
export function openShift(width: number) {
  if (width <= 560) return { x: 0, scale: 1 };
  if (width <= 1000) return { x: 37, scale: 0.68 };
  if (width <= 1340) return { x: 40, scale: 0.8 };
  return { x: 50, scale: 1 };
}
