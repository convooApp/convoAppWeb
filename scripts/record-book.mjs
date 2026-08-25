/* ------------------------------------------------------------------
   Record the storybook homepage to a video.

     npm run record:book                 -- 1920x1080, dev server
     npm run record:book -- --preset reel
     npm run record:book -- --w 1280 --h 800 --dwell 2.4 --out promo.mp4

   Drives the book with real key presses and waits for each turn to finish
   rather than guessing at durations, so it stays correct if the animation
   timing changes. Screencast does not capture page audio, but the script
   knows exactly when every turn started — so it lays the real page-turn
   sound onto the track afterwards, frame-accurate, which is something a
   screen recording cannot do.
   ------------------------------------------------------------------ */

import { spawn } from "node:child_process";
import { mkdtemp, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import puppeteer from "puppeteer";

const PRESETS = {
  wide: { w: 1920, h: 1080, scale: 1 },
  hd: { w: 1280, h: 800, scale: 2 },
  square: { w: 1080, h: 1080, scale: 1 },
  /* The phone layout hides every photo, so a vertical cut still records the
     desktop spread — it is just framed tall and letterboxed. */
  reel: { w: 1080, h: 1920, scale: 1, stage: { w: 1440, h: 900 } },
};

function args() {
  const out = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, "");
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

const opt = args();
const preset = PRESETS[opt.preset ?? "wide"] ?? PRESETS.wide;

const WIDTH = Number(opt.w ?? preset.w);
const HEIGHT = Number(opt.h ?? preset.h);
const SCALE = Number(opt.scale ?? preset.scale);
/* What the browser actually renders at, before being fitted into the frame. */
const STAGE = preset.stage ?? { w: WIDTH, h: HEIGHT };
const URL = opt.url ?? "http://localhost:5173/";
const OUT = path.resolve(opt.out ?? "book.mp4");
/* Seconds to rest on each page once it has landed. */
const DWELL = Number(opt.dwell ?? 2.0);
const OPEN_HOLD = Number(opt.hold ?? 1.6);
const END_HOLD = Number(opt.end ?? 3.2);
const PAGES = Number(opt.pages ?? 6);
const TURN_SOUND = path.resolve("public/book/sound/page-turn.mp3");

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));

function run(cmd, list) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, list, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} failed:\n${err.slice(-2000)}`)),
    );
  });
}

const exists = (f) =>
  access(f).then(
    () => true,
    () => false,
  );

async function main() {
  const work = await mkdtemp(path.join(tmpdir(), "convoo-book-"));
  const raw = path.join(work, "raw.webm");

  console.log(`recording ${URL} at ${STAGE.w}x${STAGE.h} -> ${WIDTH}x${HEIGHT}`);

  const browser = await puppeteer.launch({
    /* Headful: the CSS 3D in the book wants a real compositor, and screencast
       is happiest with one too. */
    headless: false,
    defaultViewport: { width: STAGE.w, height: STAGE.h, deviceScaleFactor: SCALE },
    args: [
      `--window-size=${STAGE.w},${STAGE.h + 120}`,
      "--hide-scrollbars",
      "--autoplay-policy=no-user-gesture-required",
      "--force-device-scale-factor=" + SCALE,
      /* A window Chrome thinks is hidden gets its rAF throttled to a crawl,
         which stalls the animation and the recording along with it. */
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-background-timer-throttling",
      "--disable-features=CalculateNativeWinOcclusion",
    ],
  });

  const page = await browser.newPage();
  await page.bringToFront();
  await page.goto(URL, { waitUntil: "networkidle2" });

  /* Fonts and the cover art both change the first frame, so wait them out
     before a single frame is recorded. */
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector(".spread--cover");
  await page.evaluate(
    () =>
      new Promise((done) => {
        const imgs = [...document.images].filter((i) => !i.complete);
        if (!imgs.length) return done();
        let left = imgs.length;
        imgs.forEach((i) =>
          i.addEventListener("load", () => --left || done(), { once: true }),
        );
        setTimeout(done, 4000);
      }),
  );
  await sleep(0.4);

  const recorder = await page.screencast({ path: raw });
  const t0 = Date.now();
  /* When each turn began, relative to the first recorded frame. */
  const beats = [];

  await sleep(OPEN_HOLD);

  for (let i = 0; i < PAGES; i++) {
    beats.push((Date.now() - t0) / 1000);
    await page.keyboard.press("ArrowRight");
    /* The sheet element only exists while a turn is running. */
    await page.waitForFunction(() => !!document.querySelector(".turn-layer"), {
      timeout: 4000,
    });
    await page.waitForFunction(() => !document.querySelector(".turn-layer"), {
      timeout: 20000,
    });
    await sleep(i === PAGES - 1 ? END_HOLD : DWELL);
  }

  await recorder.stop();
  await browser.close();
  console.log(`captured ${beats.length} turns`);

  /* ---- fit into the target frame, and lay the turn sound underneath ---- */

  const fit =
    `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease:flags=lanczos,` +
    `pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2:color=0x0c0308,format=yuv420p`;

  const hasSound = await exists(TURN_SOUND);
  const inputs = ["-i", raw];
  let filter = `[0:v]${fit}[v]`;
  const map = ["-map", "[v]"];

  if (hasSound) {
    beats.forEach(() => inputs.push("-i", TURN_SOUND));
    const legs = beats
      .map((t, i) => `[${i + 1}:a]adelay=${Math.round(t * 1000)}:all=1[a${i}]`)
      .join(";");
    const mix = beats.map((_, i) => `[a${i}]`).join("");
    filter += `;${legs};${mix}amix=inputs=${beats.length}:normalize=0:dropout_transition=0[a]`;
    map.push("-map", "[a]", "-c:a", "aac", "-b:a", "192k");
  } else {
    console.log("no page-turn.mp3 found — writing a silent track");
  }

  await run("ffmpeg", [
    "-y",
    ...inputs,
    "-filter_complex",
    filter,
    ...map,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "18",
    "-movflags",
    "+faststart",
    "-r",
    "60",
    OUT,
  ]);

  await rm(work, { recursive: true, force: true });
  console.log(`\n  ${OUT}`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
