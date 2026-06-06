export type CharacterId = "vedika" | "kaira" | "ameya" | "aryan" | "zoya" | "veer";

export type CharacterColor = "pink" | "amber" | "lime" | "violet" | "rose" | "teal";

export interface CharacterCard {
  id: CharacterId;
  name: string;
  age: number;
  city: string;
  vibe: string;
  color: CharacterColor;
  number: string;
  image: string;
  isNew?: boolean;
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
    image: "/assets/images/ved.svg",
  },
  {
    id: "kaira",
    name: "Kaira",
    age: 25,
    city: "Mumbai",
    vibe: "will roast you back. fairly.",
    color: "amber",
    number: "BADDIE",
    image: "/assets/images/kaira.png",
  },
  {
    id: "ameya",
    name: "Ameya",
    age: 28,
    city: "Pune",
    vibe: "5am, protein shake, Naval",
    color: "lime",
    number: "GYM FREAK",
    image: "/assets/images/Ameya.png",
  },
  {
    id: "aryan",
    name: "Aryan",
    age: 27,
    city: "Mumbai",
    vibe: "asks better than he answers",
    color: "violet",
    number: "COOL NERD",
    image: "/assets/images/Aryan.png",
  },
  {
    id: "zoya",
    name: "Zoya",
    age: 26,
    city: "Goa / Mumbai",
    vibe: "surfs, treks, always says yes",
    color: "rose",
    number: "ADVENTURER",
    image: "/assets/images/Zoya.svg",
    isNew: true,
  },
  {
    id: "veer",
    name: "Veer",
    age: 27,
    city: "Mumbai",
    vibe: "charming, warm, makes you feel seen",
    color: "teal",
    number: "THE CHARMER",
    image: "/assets/images/Veer.svg",
    isNew: true,
  },
];

export function getCharacterCard(id: CharacterId): CharacterCard {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
