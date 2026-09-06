/* ------------------------------------------------------------------
   The positions convoo is hiring for.

   THIS LIST IS THE PAGE. Edit it here and the cards, the job descriptions,
   the counts and the hiring bars all follow.

   `slug` is what gets written to the database AND what appears in the URL of
   a shared listing, so changing one after launch both orphans the
   applications filed under it and breaks any link already out in the world.
   Rename anything else freely; change `slug` only deliberately.
   ------------------------------------------------------------------ */

export type Position = {
  slug: string;
  /** The job title, as it appears at the top of the listing. */
  title: string;
  /** What the headline cycles through: "…for <cycle> positions." */
  cycle: string;
  /** Requisition number. Pure theatre, but it is what sells the bit. */
  ref: string;
  /** Contract terms — the chip under the title. */
  terms: string;
  /** One line on the card, and the opening line of the description. */
  summary: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  /** Which vocabulary the "looking to work with" field uses. A boyfriend post
      can say girl and boy; a marriage one should not. Defaults to casual. */
  seekingStyle?: "casual" | "formal";
  tone?: "pink" | "gold";
};

export const POSITIONS: Position[] = [
  {
    slug: "boyfriend",
    title: "Boyfriend",
    cycle: "boyfriend",
    ref: "CVO-001",
    terms: "full-time",
    summary:
      "a generalist post for someone who wants to be somebody's first phone call.",
    responsibilities: [
      "reply to a text within a reasonable window",
      "retain at least two things she mentioned last time",
      "take her on a date every other week",
      "hold the position on the days it is not fun",
    ],
    requirements: [
      "able to have a good conversation for at least three minutes",
      "no prior experience necessary",
    ],
    benefits: [
      "somebody to send the funny thing to at 1am",
      "a standing plan on a bad week",
    ],
  },
  {
    slug: "girlfriend",
    title: "Girlfriend",
    cycle: "girlfriend",
    ref: "CVO-002",
    terms: "full-time",
    summary:
      "for someone who would rather be known properly than looked at briefly.",
    responsibilities: [
      "hold an opinion about where to eat, and defend it",
      "work out which of his friends are worth your time, accurately, in one evening",
      "say the difficult thing early rather than the easy thing twice",
    ],
    requirements: [
      "willing to be the first to say what this is",
      "comfortable being liked for the reasons that are actually true",
    ],
    benefits: [
      "equity, paid as somebody being unambiguously on your side",
      "your name known to his mother inside six months",
    ],
    tone: "gold",
  },
  {
    slug: "husband",
    title: "Husband",
    cycle: "husband",
    ref: "CVO-003",
    terms: "full-time",
    summary: "a long post. we are not looking to fill it twice.",
    responsibilities: [
      "share a calendar and mean it",
      "be the name somebody's mother asks after first",
      "carry the half of it that nobody ever sees",
      "keep being interesting to one person for decades",
    ],
    requirements: [
      "prepared to do the unglamorous portion of the work",
      "understands that the good version of this is mostly ordinary days",
    ],
    benefits: ["one (1) joint account", "listed as next of kin", "a person"],
    seekingStyle: "formal",
  },
  {
    slug: "wife",
    title: "Wife",
    cycle: "wife",
    ref: "CVO-004",
    terms: "full-time",
    summary: "senior position. reports to nobody.",
    responsibilities: [
      "be somebody's favourite person for the rest of their life",
      "hold the plot when he loses it",
      "decide, jointly, what the two of you are for",
    ],
    requirements: [
      "wants to be chosen deliberately rather than settled for",
      "no interest in auditioning for the part indefinitely",
    ],
    benefits: [
      "one (1) joint account",
      "somebody in your corner without being asked",
    ],
    tone: "gold",
    seekingStyle: "formal",
  },
];

/* ------------------------------------------------------------------
   Where an applicant is applying from.

   Convoo runs IN and US as separate data regions with their own rooms. The
   drive is only recruiting for one of them at a time, so this is no longer
   asked — it is stamped on every application from the list below, and the
   board reads its "locations" line from the same place.
   ------------------------------------------------------------------ */

export type Region = { value: string; label: string };

export const REGIONS: Region[] = [{ value: "in", label: "India" }];

/** Filed against every application. The drive runs in one region, so asking
    was a question with one answer — but the column stays, so a second region
    later is a one-line change here rather than a migration. */
export const DEFAULT_REGION = REGIONS[0].value;

/* ------------------------------------------------------------------
   Who an applicant wants to be matched with.

   The position says which role somebody would play; this says which side of
   the room they belong in. The two are deliberately separate — assuming a
   Boyfriend applicant wants a girl is exactly the assumption that puts the
   wrong people in the same room.
   ------------------------------------------------------------------ */

export type Seeking = { value: string; label: string };

/* The wording changes with the post, but the stored value never does. If
   "a girl" filed itself as `girl` and "a woman" as `woman`, splitting the
   rooms would mean remembering that four values are really two — so the
   labels vary and `woman`/`man` is what lands in the database either way. */
export const SEEKING_LABELS: Record<"casual" | "formal", Seeking[]> = {
  casual: [
    { value: "woman", label: "a girl" },
    { value: "man", label: "a boy" },
  ],
  formal: [
    { value: "woman", label: "a woman" },
    { value: "man", label: "a man" },
  ],
};

/** Who the applicant wants to meet. */
export const seekingFor = (p: Position) =>
  SEEKING_LABELS[p.seekingStyle ?? "casual"];

/**
 * How the applicant describes themselves — the same vocabulary the post uses
 * for who they want, so the two fields read as one sentence: "i am a boy, i
 * want to meet a girl." A boyfriend post says boy and girl; a marriage one
 * says man and woman.
 *
 * This is the field that makes the position title stop mattering. Gender used
 * to be inferred from the post applied for, which only held if everybody read
 * "Boyfriend" as "I would be one" rather than "I want one" — and the first
 * fifteen applications proved they do not. Asked outright, a room can still be
 * built correctly when somebody applies for the wrong post.
 */
export const identityFor = (p: Position) =>
  SEEKING_LABELS[p.seekingStyle ?? "casual"];

export const positionBySlug = (slug?: string) =>
  POSITIONS.find((p) => p.slug === slug) ?? null;
