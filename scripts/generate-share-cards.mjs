/**
 * Pre-render the Convooersation Meter share cards to static PNGs.
 *
 * The result card is fully determined by archetype × gender × template, so we
 * screenshot every combination once and serve them as static files. The Share
 * button on the result page fetches the matching PNG and hands it to the
 * system share sheet (navigator.share) for the Instagram-story flow.
 *
 * It screenshots the REAL result page (same CSS + fonts you see in the app)
 * via the dev-reveal route, so there's zero visual drift.
 *
 * Usage:
 *   npm run build                 # the script serves dist/
 *   npm i -D puppeteer            # one-time
 *   node scripts/generate-share-cards.mjs
 *
 * Output: public/share-cards/<archetype>_<gender>_<template>.png
 */
import { preview } from "vite";
import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdir } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = resolve(root, "public", "share-cards");

const ARCHETYPES = [
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
const GENDERS = ["male", "female"];
const TEMPLATES = ["zine", "vintage"];
const PORT = 4399;

async function main() {
  await mkdir(outDir, { recursive: true });

  const server = await preview({ root, preview: { port: PORT } });
  const base = `http://localhost:${PORT}`;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  // deviceScaleFactor 3 → the ~340px card renders at ~1020px wide (9:16),
  // crisp enough for Instagram Stories (which upscale to 1080×1920).
  await page.setViewport({ width: 480, height: 940, deviceScaleFactor: 3 });

  let count = 0;
  for (const archetype of ARCHETYPES) {
    for (const gender of GENDERS) {
      for (const template of TEMPLATES) {
        const url =
          `${base}/meter?dev=reveal&char=vedika` +
          `&archetype=${archetype}&gender=${gender}&template=${template}`;
        await page.goto(url, { waitUntil: "networkidle0" });
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        const el = await page.waitForSelector(".share-card", { timeout: 15000 });
        // Small settle for gradients/shadows to paint.
        await new Promise((r) => setTimeout(r, 250));
        const file = resolve(outDir, `${archetype}_${gender}_${template}.png`);
        await el.screenshot({ path: file, omitBackground: true });
        count += 1;
        console.log(`✓ ${archetype}_${gender}_${template}.png`);
      }
    }
  }

  await browser.close();
  await new Promise((resolveClose) =>
    server.httpServer.close(() => resolveClose()),
  );
  console.log(`\nDone — ${count} cards written to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
