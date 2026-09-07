import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGame } from "./useGame";

const { NAMES } = vi.hoisted(() => ({
  NAMES: [
    { id: 1, name: "bulbasaur" },
    { id: 2, name: "ivysaur" },
    { id: 3, name: "venusaur" },
    { id: 4, name: "charmander" },
    { id: 5, name: "squirtle" },
  ],
}));

vi.mock("../lib/pokeapi", () => ({
  GEN1_COUNT: NAMES.length,
  fetchGen1Names: vi.fn().mockResolvedValue(NAMES),
  fetchPokemon: vi.fn((id: number) => {
    const entry = NAMES.find((n) => n.id === id)!;
    return Promise.resolve({ id: entry.id, name: entry.name, artworkUrl: `art-${id}.png` });
  }),
}));

describe("useGame", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts in the start state with best score read from storage", () => {
    localStorage.setItem("wtp_best_score", "4");
    const { result } = renderHook(() => useGame());
    expect(result.current.status).toBe("start");
    expect(result.current.best).toBe(4);
  });

  it("loads a round when the game starts", async () => {
    const { result } = renderHook(() => useGame());

    act(() => result.current.startGame());

    await waitFor(() => expect(result.current.status).toBe("playing"));
    expect(result.current.round).toBe(1);
    expect(result.current.pokemon).not.toBeNull();
    expect(result.current.options).toHaveLength(4);
    expect(result.current.options.map((o) => o.name)).toContain(result.current.pokemon!.name);
  });

  it("scores a correct guess and reveals it", async () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame());
    await waitFor(() => expect(result.current.status).toBe("playing"));

    const correctName = result.current.pokemon!.name;
    act(() => result.current.submitGuess(correctName));

    expect(result.current.status).toBe("revealed");
    expect(result.current.isCorrect).toBe(true);
    expect(result.current.score).toBe(1);
  });

  it("does not score a wrong guess", async () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame());
    await waitFor(() => expect(result.current.status).toBe("playing"));

    const correctName = result.current.pokemon!.name;
    const wrongOption = result.current.options.find((o) => o.name !== correctName)!;
    act(() => result.current.submitGuess(wrongOption.name));

    expect(result.current.status).toBe("revealed");
    expect(result.current.isCorrect).toBe(false);
    expect(result.current.score).toBe(0);
  });

  it("advances through all 10 rounds, ends the game, and persists a new best score", async () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame());
    await waitFor(() => expect(result.current.status).toBe("playing"));

    for (let round = 1; round <= 10; round++) {
      const correctName = result.current.pokemon!.name;
      act(() => result.current.submitGuess(correctName));
      expect(result.current.status).toBe("revealed");

      act(() => result.current.nextRound());

      if (round < 10) {
        await waitFor(() => expect(result.current.status).toBe("playing"));
        expect(result.current.round).toBe(round + 1);
      } else {
        await waitFor(() => expect(result.current.status).toBe("gameover"));
      }
    }

    expect(result.current.score).toBe(10);
    expect(result.current.best).toBe(10);
    expect(localStorage.getItem("wtp_best_score")).toBe("10");
  });

  it("does not let a lower-scoring session regress a saved best score", async () => {
    localStorage.setItem("wtp_best_score", "10");
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame());
    await waitFor(() => expect(result.current.status).toBe("playing"));

    for (let round = 1; round <= 10; round++) {
      const correctName = result.current.pokemon!.name;
      const wrongOption = result.current.options.find((o) => o.name !== correctName)!;
      act(() => result.current.submitGuess(wrongOption.name));
      act(() => result.current.nextRound());

      if (round < 10) {
        await waitFor(() => expect(result.current.status).toBe("playing"));
      } else {
        await waitFor(() => expect(result.current.status).toBe("gameover"));
      }
    }

    expect(result.current.score).toBe(0);
    expect(result.current.best).toBe(10);
    expect(localStorage.getItem("wtp_best_score")).toBe("10");
  });
});
