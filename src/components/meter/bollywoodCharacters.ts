import { Archetype, UserGender } from "../../lib/meterApi";

/**
 * Bollywood (and OTT) character map keyed by archetype × gender. Every blurb is
 * pre-written and shipped verbatim — the backend just returns the key.
 * That keeps the AI's job small (key + score + best_line) and lets us
 * keep marketing copy locked in.
 *
 * Tagline format is "<vibe> · from <Film>" — the film is parsed off the end
 * for the share card's "From <Film>" line, so there's one source of truth.
 */
export interface BollywoodCharacter {
  /** Big poster-style name shown as the ticket title (English caps). */
  name: string;
  /** Same name in Devanagari, rendered below the English in poster font. */
  nameHindi: string;
  /** Italic phrase under the name, e.g. "apni favourite · from Jab We Met". */
  tagline: string;
  /** Short subtitle ("THE ROMANTIC", "THE SHOWSTOPPER", …). */
  archetypeLabel: string;
  /** Verbatim celebration line shown as the ticket blurb. */
  blurb: string;
}

type ArchetypeEntry = Record<UserGender, BollywoodCharacter>;

export const BOLLYWOOD_CHARACTERS: Record<Archetype, ArchetypeEntry> = {
  romantic: {
    male: {
      name: "RAJ",
      nameHindi: "राज",
      tagline: "the OG romantic · from DDLJ",
      archetypeLabel: "THE ROMANTIC",
      blurb:
        "You didn't rush. You waited for the moment, said the right thing, and let the feeling do the work. The classic.",
    },
    female: {
      name: "SIMRAN",
      nameHindi: "सिमरन",
      tagline: "the OG heroine · from DDLJ",
      archetypeLabel: "THE ROMANTIC",
      blurb:
        "Not easy to win over, and that's the point. You made every reply count and made them work for it. The classic heroine.",
    },
  },
  showstopper: {
    male: {
      name: "ROCKY",
      nameHindi: "रॉकी",
      tagline: "the showstopper of delhi · from Rocky Aur Rani",
      archetypeLabel: "THE SHOWSTOPPER",
      blurb:
        "You walked in loud and stayed there. Big heart, bigger personality. The energy in the room shifts when you're in it.",
    },
    female: {
      name: "POO",
      nameHindi: "पू",
      tagline: "main character energy · from K3G",
      archetypeLabel: "THE SHOWSTOPPER",
      blurb:
        "You know what you're worth and you said it out loud. Main character, no apologies. Effortlessly extra, deliberately iconic.",
    },
  },
  poet: {
    male: {
      name: "MURAD",
      nameHindi: "मुराद",
      tagline: "the underdog poet · from Gully Boy",
      archetypeLabel: "THE POET",
      blurb:
        "You don't waste words. Every line you sent felt written down somewhere first. The underdog who turned out to be the writer.",
    },
    female: {
      name: "SAFEENA",
      nameHindi: "सफ़ीना",
      tagline: "the quiet storm · from Gully Boy",
      archetypeLabel: "THE POET",
      blurb:
        "Still water, deep current. You said less and meant more. Soft on the surface, sharp where it counts.",
    },
  },
  free_spirit: {
    male: {
      name: "BUNNY",
      nameHindi: "बनी",
      tagline: "the wanderer · from YJHD",
      archetypeLabel: "THE FREE SPIRIT",
      blurb:
        "Curious, restless, full of plans. You made the conversation feel like an adventure already in motion. Hard to keep up with, in the best way.",
    },
    female: {
      name: "GEET",
      nameHindi: "गीत",
      tagline: "apni favourite · from Jab We Met",
      archetypeLabel: "THE FREE SPIRIT",
      blurb:
        "Apni favourite ho tum. Talkative, fearless, impossible to fake. You brought the whole vibe and no one was going to slow you down.",
    },
  },
  cool: {
    male: {
      name: "JORDAN",
      nameHindi: "जॉर्डन",
      tagline: "the moody magnet · from Rockstar",
      archetypeLabel: "THE COOL",
      blurb:
        "Unbothered. Unhurried. Slightly dangerous. You didn't chase the conversation. It chased you.",
    },
    female: {
      name: "VERONICA",
      nameHindi: "वेरोनिका",
      tagline: "the original heartbreaker · from Cocktail",
      archetypeLabel: "THE COOL",
      blurb:
        "You don't explain yourself. You don't have to. The room re-arranges itself when you walk in.",
    },
  },
  wise: {
    male: {
      name: "SRIKANT",
      nameHindi: "श्रीकांत",
      tagline: "the everyman analyst · from The Family Man",
      archetypeLabel: "THE WISE ONE",
      blurb:
        "You see what people aren't saying. Patient, observant, three steps ahead but won't tell you. The one your friends call when something's actually wrong.",
    },
    female: {
      name: "NAINA",
      nameHindi: "नैना",
      tagline: "the quiet observer · from YJHD",
      archetypeLabel: "THE WISE ONE",
      blurb:
        "You watch first, speak after. Thoughtful in a world that mistakes loud for confident. The one who actually remembers what people said.",
    },
  },
  loyal: {
    male: {
      name: "IMRAAN",
      nameHindi: "इमरान",
      tagline: "the one who shows up · from ZNMD",
      archetypeLabel: "THE LOYAL",
      blurb:
        "You don't perform loyalty, you live it. The friend who'll drive twelve hours and not make it a thing. Steady, soulful, in your corner without asking.",
    },
    female: {
      name: "ANJALI",
      nameHindi: "अंजली",
      tagline: "the truest friend · from K3G",
      archetypeLabel: "THE LOYAL",
      blurb:
        "Soft hands, steady heart. You don't perform, you show up. The kind of love that's quiet and lasts.",
    },
  },
  strategist: {
    male: {
      name: "DON",
      nameHindi: "डॉन",
      tagline: "always five moves ahead · from Don",
      archetypeLabel: "THE STRATEGIST",
      blurb:
        "You don't just answer, you ask better than you're asked. Always one move ahead. The kind of conversation that turns into a chess game, in the best way.",
    },
    female: {
      name: "RANI",
      nameHindi: "रानी",
      tagline: "the one with the questions · from Rocky Aur Rani",
      archetypeLabel: "THE STRATEGIST",
      blurb:
        "Sharp, curious, never just nodding along. You made the conversation a debate worth winning. The one with the questions everyone wishes they'd thought of.",
    },
  },
  cliffhanger: {
    male: {
      name: "DEVDAS",
      nameHindi: "देवदास",
      tagline: "the silent deep end · from Devdas",
      archetypeLabel: "THE CLIFFHANGER",
      blurb:
        "You said almost nothing. And somehow, it was the loudest thing in the room.",
    },
    female: {
      name: "TARA",
      nameHindi: "तारा",
      tagline: "the deep end · from Gehraiyaan",
      archetypeLabel: "THE CLIFFHANGER",
      blurb: "You let the silence do the talking. And it said plenty.",
    },
  },
  comedian: {
    male: {
      name: "CIRCUIT",
      nameHindi: "सर्किट",
      tagline: "perfect comic timing · from Munna Bhai",
      archetypeLabel: "THE COMEDIAN",
      blurb:
        "Timing like a punchline. You made them laugh, actually laugh, and that's the rarest thing of all.",
    },
    female: {
      name: "BITTI",
      nameHindi: "बिट्टी",
      tagline: "quick, dry, unbothered · from Bareilly Ki Barfi",
      archetypeLabel: "THE COMEDIAN",
      blurb:
        "Quick, dry, unbothered. You'd roast and flirt in the same sentence and somehow make it work.",
    },
  },
};

export const FALLBACK_ARCHETYPE: Archetype = "romantic";
export const FALLBACK_GENDER: UserGender = "male";

export function getBollywoodCharacter(
  archetype: Archetype | string | undefined,
  gender: UserGender | string | undefined,
): BollywoodCharacter {
  const a = (
    archetype && archetype in BOLLYWOOD_CHARACTERS
      ? archetype
      : FALLBACK_ARCHETYPE
  ) as Archetype;
  const g = (
    gender === "female" || gender === "male" ? gender : FALLBACK_GENDER
  ) as UserGender;
  return BOLLYWOOD_CHARACTERS[a][g];
}

/**
 * The film a character is from, parsed off the end of the tagline
 * ("<vibe> · from <Film>"). Used for the share card's "From <Film>" line.
 */
export function getBollywoodFilm(
  archetype: Archetype | string | undefined,
  gender: UserGender | string | undefined,
): string {
  const { tagline } = getBollywoodCharacter(archetype, gender);
  const last = tagline.split("·").pop()?.trim() ?? "";
  return last.replace(/^from\s+/i, "").trim() || tagline;
}
