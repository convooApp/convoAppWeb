/**
 * Profanity filter — blocks messages containing banned words/phrases.
 *
 * STORAGE: a `Set<string>` of lowercased terms. O(1) lookup per token, much
 * faster than `Array.includes` (O(n)). For a list of a few hundred terms a
 * Set is the right tool — cheap memory, instant membership checks. (If we
 * ever cross ~10k entries with substring matching, switch to an Aho-Corasick
 * trie or a single compiled regex with alternation. Not there yet.)
 *
 * MATCHING STRATEGY:
 *  1. Normalize input — lowercase, NFC-normalize Devanagari, collapse spaces.
 *  2. Tokenize on Unicode word boundaries (so `\p{L}\p{N}'` letters/digits).
 *  3. Check each token against the Set (exact word match).
 *  4. Also check the normalized full string for a few short patterns that
 *     users try to evade with punctuation/spacing (e.g. "m.c.").
 *
 * EXTENDING: Edit BANNED_WORDS or BANNED_PHRASES below. Keep entries
 * lowercased. Devanagari script entries should be the natural Hindi spelling.
 */

// Single-word terms. Match as whole tokens after lowercasing + tokenization.
// English profanity + common Roman-Hindi gali + Devanagari Hindi gali.
// Keep this list maintainable — add new entries here, don't sprinkle elsewhere.
const BANNED_WORDS: ReadonlySet<string> = new Set([
  // English
  "fuck",
  "fucking",
  "fucker",
  "shit",
  "bitch",
  "bitches",
  "cunt",
  "asshole",
  "dick",
  "dickhead",
  "pussy",
  "bastard",
  "whore",
  "slut",
  "fag",
  "faggot",
  "nigger",
  "rape",
  "rapist",

  // Hindi profanity in Roman script (most common)
  "bsdk",
  "bhosdike",
  "bhosdiwala",
  "bhosadi",
  "bc",
  "bhenchod",
  "behenchod",
  "behanchod",
  "bhanchod",
  "mc",
  "madarchod",
  "maderchod",
  "mkb",
  "mkc",
  "chutiya",
  "chutiye",
  "chutia",
  "chut",
  "chutiyapa",
  "randi",
  "raand",
  "gaand",
  "gandu",
  "gaandu",
  "lund",
  "lauda",
  "laude",
  "laudu",
  "harami",
  "harampi",
  "haramzaada",
  "haramkhor",
  "kutta",
  "kutti",
  "kutte",
  "kamina",
  "kameena",
  "kamine",
  "saala",
  "sala",
  "saale",
  "chinaal",
  "rakhail",
  "tatti",
  "tatte",
  "jhaant",
  "jhant",

  // Devanagari script
  "भोसडीके",
  "भोसडी",
  "मादरचोद",
  "बहनचोद",
  "चूतिया",
  "चूत",
  "रंडी",
  "रांड",
  "लंड",
  "लौड़ा",
  "लौडा",
  "गांड",
  "गांडू",
  "हरामी",
  "हरामज़ादा",
  "कुत्ता",
  "कमीना",
  "साला",
  "टट्टी",
  "झांट",
]);

// Multi-character substring patterns checked against the normalized full
// string (after lowercasing + removing punctuation). Catches obfuscation
// like "f*ck", "m.c.", "b s d k". Keep these short and intentional —
// substring matching can false-positive on innocent words.
const BANNED_PHRASES: readonly string[] = [
  "f u c k",
  "b s d k",
  "m c b c",
  "b c m c",
  "madar chod",
  "behen chod",
  "bhen chod",
];

/**
 * Returns the first banned term found in `text`, or null if clean.
 * Useful when you want to show *which* word triggered the block (we don't
 * surface it to the user — just for logging).
 */
export function findBannedTerm(text: string): string | null {
  if (!text) return null;

  // Normalize: NFC for Devanagari composition, lowercase, strip leetspeak
  // basics (4 → a, 1 → i, 0 → o, 3 → e, @ → a, $ → s). Keeps the filter
  // resilient without becoming aggressive.
  const lowered = text.normalize("NFC").toLowerCase();
  const deLeet = lowered
    .replace(/4/g, "a")
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/7/g, "t");

  // Tokenize on Unicode letter/digit runs. Punctuation/whitespace splits.
  const tokens = deLeet.match(/[\p{L}\p{N}]+/gu) ?? [];
  for (const t of tokens) {
    if (BANNED_WORDS.has(t)) return t;
  }

  // Substring check: build a "deflated" form with single spaces between
  // tokens so spaced-out obfuscation lines up with BANNED_PHRASES entries.
  const deflated = tokens.join(" ");
  for (const phrase of BANNED_PHRASES) {
    if (deflated.includes(phrase)) return phrase;
  }

  return null;
}

export function containsProfanity(text: string): boolean {
  return findBannedTerm(text) !== null;
}
