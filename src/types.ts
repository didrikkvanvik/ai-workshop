export type GameStatus = "start" | "loading" | "playing" | "revealed" | "gameover";

export interface NameEntry {
  id: number;
  name: string;
}

export interface PokemonData {
  id: number;
  name: string;
  artworkUrl: string;
}

export interface RoundOption {
  id: number;
  name: string;
}
