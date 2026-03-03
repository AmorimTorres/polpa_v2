export type FruitType =
  | "Goiaba"
  | "Limão"
  | "Jaca"
  | "Manga"
  | "Mamão"
  | "Amora"
  | "Tomate"
  | "Jabuticaba"
  | "Pitanga"
  | "Acerola"
  | "Banana"
  | "Abacate"
  | "Ervas";

export interface FruitMarker {
  id: string;
  lat: number;
  lng: number;
  fruitName: FruitType | string;
  creator: string;
  approvals: number;
  refutations: number;
  voters: string[];
  consolidated: boolean;
  verified: boolean;
}

export interface User {
  username: string;
  points: number;
}
