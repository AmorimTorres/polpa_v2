import { FruitType } from "@/data/fruits";

export type { FruitType };

export interface FruitMarker {
  id: string;
  lat: number;
  lng: number;
  fruitName: FruitType;
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

export interface AuthUser {
  username: string;
  passwordHash: string;
  points: number;
}
