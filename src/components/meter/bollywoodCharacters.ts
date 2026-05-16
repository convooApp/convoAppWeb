import { Archetype, UserGender } from "../../lib/meterApi";

/**
 * Bollywood character map keyed by archetype × gender. Every blurb is
 * pre-written and shipped verbatim — the backend just returns the key.
 * That keeps the AI's job small (key + score + best_line) and lets us
 * keep marketing copy locked in.
 */
export interface BollywoodCharacter {
  /** Big poster-style name shown as the ticket title (English caps). */
  name: string;
  /** Same name in Devanagari, rendered below the English in poster font. */
  nameHindi: string;
  /** Italic phrase under the name, e.g. "the OG romantic, 1995". */
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
      tagline: "the OG romantic, 1995",
      archetypeLabel: "THE ROMANTIC",
      blurb:
        "You didn't rush. You waited for the moment, said the right thing, and let the feeling do the work. The classic.",
    },
    female: {
      name: "SIMRAN",
      nameHindi: "सिमरन",
      tagline: "the OG heroine, 1995",
      archetypeLabel: "THE ROMANTIC",
      blurb:
        "Not easy to win over, and that's the point. You made every reply count and made them work for it. The classic heroine.",
    },
  },
  showstopper: {
    male: {
      name: "ROCKY",
      nameHindi: "रॉकी",
      tagline: "the showstopper of delhi, 2023",
      archetypeLabel: "THE SHOWSTOPPER",
      blurb:
        "You walked in loud and stayed there. Big heart, bigger personality. The energy in the room shifts when you're in it.",
    },
    female: {
      name: "POO",
      nameHindi: "पू",
      tagline: "main character energy, 2001",
      archetypeLabel: "THE SHOWSTOPPER",
      blurb:
        "You know what you're worth and you said it out loud. Main character, no apologies. Effortlessly extra, deliberately iconic.",
    },
  },
  poet: {
    male: {
      name: "MURAD",
      nameHindi: "मुराद",
      tagline: "the underdog poet, 2019",
      archetypeLabel: "THE POET",
      blurb:
        "You don't waste words. Every line you sent felt written down somewhere first. The underdog who turned out to be the writer.",
    },
    female: {
      name: "SAFEENA",
      nameHindi: "सफ़ीना",
      tagline: "the quiet storm, 2019",
      archetypeLabel: "THE POET",
      blurb:
        "Still water, deep current. You said less and meant more. Soft on the surface, sharp where it counts.",
    },
  },
  free_spirit: {
    male: {
      name: "BUNNY",
      nameHindi: "बनी",
      tagline: "the wanderer, 2013",
      archetypeLabel: "THE FREE SPIRIT",
      blurb:
        "Curious, restless, full of plans. You made the conversation feel like an adventure already in motion. Hard to keep up with, in the best way.",
    },
    female: {
      name: "GEET",
      nameHindi: "गीत",
      tagline: "apni favourite, 2007",
      archetypeLabel: "THE FREE SPIRIT",
      blurb:
        "Apni favourite ho tum. Talkative, fearless, impossible to fake. You brought the whole vibe and no one was going to slow you down.",
    },
  },
  cool: {
    male: {
      name: "JORDAN",
      nameHindi: "जॉर्डन",
      tagline: "the moody magnet, 2011",
      archetypeLabel: "THE COOL",
      blurb:
        "Unbothered. Unhurried. Slightly dangerous. You didn't chase the conversation. It chased you.",
    },
    female: {
      name: "VERONICA",
      nameHindi: "वेरोनिका",
      tagline: "the original heartbreaker, 2012",
      archetypeLabel: "THE COOL",
      blurb:
        "You don't explain yourself. You don't have to. The room re-arranges itself when you walk in.",
    },
  },
  wise: {
    male: {
      name: "RANCHO",
      nameHindi: "रैंचो",
      tagline: "aal izz well, 2009",
      archetypeLabel: "THE WISE ONE",
      blurb:
        "You answered the question behind the question. Patient, observant, smarter than you let on. The one your friends call when things get heavy.",
    },
    female: {
      name: "NAINA",
      nameHindi: "नैना",
      tagline: "the quiet observer, 2013",
      archetypeLabel: "THE WISE ONE",
      blurb:
        "You watch first, speak after. Thoughtful in a world that mistakes loud for confident. The one who actually remembers what people said.",
    },
  },
  loyal: {
    male: {
      name: "MUNNA",
      nameHindi: "मुन्ना",
      tagline: "jadoo ki jhappi, 2003",
      archetypeLabel: "THE LOYAL",
      blurb:
        "Heart on your sleeve, sleeve rolled up. You meant every word and would mean them again tomorrow. The one you want in your corner.",
    },
    female: {
      name: "ANJALI",
      nameHindi: "अंजली",
      tagline: "the truest friend, 2001",
      archetypeLabel: "THE LOYAL",
      blurb:
        "Soft hands, steady heart. You don't perform, you show up. The kind of love that's quiet and lasts.",
    },
  },
  strategist: {
    male: {
      name: "VIJAY",
      nameHindi: "विजय",
      tagline: "always five moves ahead, 2012",
      archetypeLabel: "THE STRATEGIST",
      blurb:
        "You don't just answer, you ask better than you're asked. Always one move ahead. The kind of conversation that turns into an interview, in the best way.",
    },
    female: {
      name: "RANI",
      nameHindi: "रानी",
      tagline: "the one with the questions, 2023",
      archetypeLabel: "THE STRATEGIST",
      blurb:
        "Sharp, curious, never just nodding along. You made the conversation a debate worth winning. The girl with the questions everyone wishes they'd thought of.",
    },
  },
  cliffhanger: {
    male: {
      name: "VIJAY",
      nameHindi: "विजय",
      tagline: "mere paas silence hai, 1975",
      archetypeLabel: "THE CLIFFHANGER",
      blurb:
        "You said almost nothing. And somehow, it was the most powerful thing in the room.",
    },
    female: {
      name: "TARA",
      nameHindi: "तारा",
      tagline: "the deep end, 2022",
      archetypeLabel: "THE CLIFFHANGER",
      blurb: "You let the silence do the talking. And it said plenty.",
    },
  },
  comedian: {
    male: {
      name: "CIRCUIT",
      nameHindi: "सर्किट",
      tagline: "perfect comic timing, 2003",
      archetypeLabel: "THE COMEDIAN",
      blurb:
        "Timing like a punchline. You made her laugh, actually laugh, and that's the rarest thing of all.",
    },
    female: {
      name: "BITTI",
      nameHindi: "बिट्टी",
      tagline: "quick, dry, unbothered, 2017",
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
