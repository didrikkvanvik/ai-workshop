import { useCallback, useReducer, useRef } from "react";
import { fetchGen1Names, fetchPokemon, GEN1_COUNT } from "../lib/pokeapi";
import type { GameStatus, NameEntry, PokemonData, RoundOption } from "../types";
import { useSound } from "./useSound";

const TOTAL_ROUNDS = 10;
const BEST_SCORE_KEY = "wtp_best_score";

interface GameState {
  status: GameStatus;
  round: number;
  score: number;
  best: number;
  pokemon: PokemonData | null;
  options: RoundOption[];
  selected: string | null;
  isCorrect: boolean | null;
  error: string | null;
}

type Action =
  | { type: "START" }
  | { type: "ROUND_READY"; pokemon: PokemonData; options: RoundOption[] }
  | { type: "GUESS"; name: string; correct: boolean }
  | { type: "NEXT_ROUND" }
  | { type: "GAME_OVER"; best: number }
  | { type: "ERROR"; message: string };

function readBestScore(): number {
  const raw = localStorage.getItem(BEST_SCORE_KEY);
  const parsed = raw ? Number(raw) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

function initialState(): GameState {
  return {
    status: "start",
    round: 0,
    score: 0,
    best: readBestScore(),
    pokemon: null,
    options: [],
    selected: null,
    isCorrect: null,
    error: null,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "START":
      return { ...initialState(), best: state.best, status: "loading", round: 1 };
    case "ROUND_READY":
      return {
        ...state,
        status: "playing",
        pokemon: action.pokemon,
        options: action.options,
        selected: null,
        isCorrect: null,
      };
    case "GUESS":
      return {
        ...state,
        status: "revealed",
        selected: action.name,
        isCorrect: action.correct,
        score: action.correct ? state.score + 1 : state.score,
      };
    case "NEXT_ROUND":
      return { ...state, status: "loading", round: state.round + 1 };
    case "GAME_OVER":
      return { ...state, status: "gameover", best: action.best };
    case "ERROR":
      return { ...state, error: action.message };
    default:
      return state;
  }
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickUnusedId(usedIds: Set<number>): number {
  const available = [];
  for (let id = 1; id <= GEN1_COUNT; id++) {
    if (!usedIds.has(id)) available.push(id);
  }
  const pool = available.length > 0 ? available : Array.from({ length: GEN1_COUNT }, (_, i) => i + 1);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickDistractors(names: NameEntry[], correctId: number, count: number): RoundOption[] {
  const candidates = shuffle(names.filter((n) => n.id !== correctId));
  return candidates.slice(0, count).map((n) => ({ id: n.id, name: n.name }));
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const namesRef = useRef<NameEntry[] | null>(null);
  const usedIdsRef = useRef<Set<number>>(new Set());
  const sound = useSound();

  const loadRound = useCallback(async () => {
    try {
      if (!namesRef.current) {
        namesRef.current = await fetchGen1Names();
      }
      const names = namesRef.current;
      const id = pickUnusedId(usedIdsRef.current);
      usedIdsRef.current.add(id);

      const pokemon = await fetchPokemon(id);
      const distractors = pickDistractors(names, id, 3);
      const options = shuffle([{ id: pokemon.id, name: pokemon.name }, ...distractors]);

      dispatch({ type: "ROUND_READY", pokemon, options });
    } catch (err) {
      dispatch({ type: "ERROR", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }, []);

  const startGame = useCallback(() => {
    usedIdsRef.current = new Set();
    dispatch({ type: "START" });
    void loadRound();
  }, [loadRound]);

  const submitGuess = useCallback(
    (name: string) => {
      if (state.status !== "playing" || !state.pokemon) return;
      const correct = name === state.pokemon.name;
      dispatch({ type: "GUESS", name, correct });
      if (correct) sound.playCorrect();
      else sound.playWrong();
    },
    [state.status, state.pokemon, sound]
  );

  const nextRound = useCallback(() => {
    if (state.round >= TOTAL_ROUNDS) {
      const finalScore = state.score;
      const best = Math.max(finalScore, state.best);
      localStorage.setItem(BEST_SCORE_KEY, String(best));
      dispatch({ type: "GAME_OVER", best });
      return;
    }
    dispatch({ type: "NEXT_ROUND" });
    void loadRound();
  }, [state.round, state.score, state.best, loadRound]);

  return {
    ...state,
    totalRounds: TOTAL_ROUNDS,
    startGame,
    submitGuess,
    nextRound,
    playClick: sound.playClick,
  };
}
