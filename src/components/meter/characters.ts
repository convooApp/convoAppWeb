export type CharacterId = "vedika" | "kaira" | "ameya" | "aryan";

export type CharacterColor = "pink" | "amber" | "lime" | "violet";

export interface CharacterCard {
  id: CharacterId;
  name: string;
  age: number;
  city: string;
  vibe: string;
  color: CharacterColor;
  number: string;
}

export const CHARACTERS: CharacterCard[] = [
  {
    id: "vedika",
    name: "Vedika",
    age: 26,
    city: "Pune",
    vibe: "puneri, dry wit, will test you",
    color: "pink",
    number: "Soft Hearted",
  },
  {
    id: "kaira",
    name: "Kaira",
    age: 25,
    city: "Mumbai",
    vibe: "will roast you back. fairly.",
    color: "amber",
    number: "BADDIE",
  },
  {
    id: "ameya",
    name: "Ameya",
    age: 28,
    city: "Pune",
    vibe: "5am, protein shake, Naval",
    color: "lime",
    number: "GYM FREAK",
  },
  {
    id: "aryan",
    name: "Aryan",
    age: 27,
    city: "Mumbai",
    vibe: "asks better than he answers",
    color: "violet",
    number: "COOL NERD",
  },
];

export function getCharacterCard(id: CharacterId): CharacterCard {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
