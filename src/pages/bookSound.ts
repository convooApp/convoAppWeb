/* ------------------------------------------------------------------
   The sound a page makes.

   Drop an mp3 into public/book/sound/ and it plays. Nothing there? A short
   filtered-noise tick stands in, so the book never sits silent waiting on an
   asset and a missing file is never a broken page.

   Browsers refuse to start audio outside a user gesture. Every page turn is
   one (click, tap or arrow key), so the first turn is already allowed.
   ------------------------------------------------------------------ */

const BASE = import.meta.env.BASE_URL;

/** Drop your own files at these paths to override the synthesised tick.
    Any format the browser can decode works — mp3, m4a, wav, ogg. If only the
    page file exists, the cover borrows it. */
export const PAGE_SRC = `${BASE}book/sound/page-turn.mp3`;
export const COVER_SRC = `${BASE}book/sound/cover-turn.mp3`;

/* ---------------------------------------------------------------- tuning */

/** Playback level for your own file. Separate from the synth volume below —
    a recording is already as loud as it was recorded. */
const SAMPLE_VOLUME = 0.05;

/** Peak loudness of the synthesised stand-in. */
const VOLUME = 0.01;

/** How long the synthesised tick lasts, in seconds. */
const LENGTH = 0.2;

/** The band sweeps down across the tick, which is what makes it read as paper
    rather than a click. Higher is drier and thinner; lower is heavier stock. */
const BAND_START = 2600;
const BAND_END = 1150;

/** Resonance. Below ~0.7 it is plain hiss; above ~2 it starts to whistle. */
const BAND_Q = 1;

/** Lowpass ceiling — drop this if it sounds harsh. */
const AIR = 6500;

/** The cover is board, not paper: duller, and a little longer. */
const COVER_BAND_SCALE = 0.6;
const COVER_LENGTH_SCALE = 1.4;

/* ------------------------------------------------------------------------ */

type Ctor = typeof AudioContext;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

/** null means tried and not there — checked once, then left alone. */
const samples = new Map<string, AudioBuffer | null>();
const loading = new Set<string>();

/** Creating a context is allowed before a gesture; it just starts suspended,
    which is enough to decode audio into. Resuming is what needs the gesture. */
function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor: Ctor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  return ctx;
}

function ensure(): AudioContext | null {
  const ac = context();
  if (!ac) return null;
  if (ac.state === "suspended") void ac.resume();
  return ac;
}

async function loadSample(url: string) {
  if (samples.has(url) || loading.has(url)) return;
  const ac = context();
  if (!ac) return;

  loading.add(url);
  try {
    const res = await fetch(url);
    /* A dev server can answer a missing asset with index.html rather than a
       404, so check what came back before handing it to the decoder. */
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || type.includes("text/html")) {
      samples.set(url, null);
      return;
    }
    samples.set(url, await ac.decodeAudioData(await res.arrayBuffer()));
  } catch {
    samples.set(url, null);
  } finally {
    loading.delete(url);
  }
}

/**
 * Fetch and decode the files up front so the very first turn already has
 * them. Safe to call on mount — it does not start any audio.
 */
export function warmSound() {
  void loadSample(PAGE_SRC);
  void loadSample(COVER_SRC);
}

function playBuffer(ac: AudioContext, buffer: AudioBuffer) {
  const src = ac.createBufferSource();
  src.buffer = buffer;
  /* A hair of variation so repeated turns are not obviously one clip. */
  src.playbackRate.value = 0.97 + Math.random() * 0.06;

  const gain = ac.createGain();
  gain.gain.value = SAMPLE_VOLUME;

  src.connect(gain).connect(ac.destination);
  src.start();
  src.onended = () => {
    src.disconnect();
    gain.disconnect();
  };
}

/** Half a second of white noise, looped. Built once and reused. */
function buildNoise(ac: AudioContext) {
  const frames = Math.floor(ac.sampleRate * 0.5);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function playSynth(ac: AudioContext, cover: boolean) {
  if (!noise) noise = buildNoise(ac);

  const t = ac.currentTime;
  const scale = cover ? COVER_BAND_SCALE : 1;
  const dur = LENGTH * (cover ? COVER_LENGTH_SCALE : 1);

  const src = ac.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  src.playbackRate.value = 0.9 + Math.random() * 0.2;

  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = BAND_Q;
  band.frequency.setValueAtTime(BAND_START * scale, t);
  band.frequency.exponentialRampToValueAtTime(BAND_END * scale, t + dur);

  const air = ac.createBiquadFilter();
  air.type = "lowpass";
  air.frequency.value = AIR * scale;

  /* Fast in, quick decay — a tick, not a swell. */
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(VOLUME, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  src.connect(band).connect(air).connect(gain).connect(ac.destination);
  src.start(t);
  src.stop(t + dur + 0.02);
  src.onended = () => {
    src.disconnect();
    gain.disconnect();
  };
}

/**
 * One page going over.
 *
 * @param cover the cover is heavier than a page and sounds like it
 */
export function playTurn(cover = false) {
  /* Nothing from a tab the reader is not looking at. */
  if (typeof document !== "undefined" && document.hidden) return;

  const ac = ensure();
  if (!ac) return;

  const url = cover ? COVER_SRC : PAGE_SRC;
  /* A cover with no file of its own borrows the page's. */
  const buffer = samples.get(url) ?? (cover ? samples.get(PAGE_SRC) : null);

  if (buffer) {
    playBuffer(ac, buffer);
    return;
  }

  /* Not loaded yet — start it for next time and cover this turn with noise. */
  if (!samples.has(url)) void loadSample(url);
  playSynth(ac, cover);
}
