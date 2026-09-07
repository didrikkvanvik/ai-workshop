import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import * as pokeapi from "./lib/pokeapi";

const { NAMES } = vi.hoisted(() => ({
  NAMES: [
    { id: 1, name: "bulbasaur" },
    { id: 2, name: "ivysaur" },
    { id: 3, name: "venusaur" },
    { id: 4, name: "charmander" },
    { id: 5, name: "squirtle" },
  ],
}));

vi.mock("./lib/pokeapi", () => ({
  GEN1_COUNT: NAMES.length,
  fetchGen1Names: vi.fn().mockResolvedValue(NAMES),
  fetchPokemon: vi.fn((id: number) => {
    const entry = NAMES.find((n) => n.id === id)!;
    return Promise.resolve({ id: entry.id, name: entry.name, artworkUrl: `art-${id}.png` });
  }),
}));

const fetchPokemonMock = vi.mocked(pokeapi.fetchPokemon);

/** Waits for the round's 4 answer buttons, then guesses correctly or incorrectly and continues. */
async function playRound(user: ReturnType<typeof userEvent.setup>, correct: boolean) {
  await waitFor(() => {
    const optionButtons = screen
      .getAllByRole("button")
      .filter((b) => NAMES.some((n) => n.name === b.textContent));
    expect(optionButtons).toHaveLength(4);
  });

  const calls = fetchPokemonMock.mock.calls;
  const lastCall = calls[calls.length - 1];
  const correctName = NAMES.find((n) => n.id === lastCall[0])!.name;

  const optionButtons = screen
    .getAllByRole("button")
    .filter((b) => NAMES.some((n) => n.name === b.textContent));
  const target = correct
    ? optionButtons.find((b) => b.textContent === correctName)!
    : optionButtons.find((b) => b.textContent !== correctName)!;

  await user.click(target);

  const continueButton = await screen.findByRole("button", { name: /^(next|see results)$/i });
  await user.click(continueButton);
}

describe("App integration", () => {
  beforeEach(() => {
    localStorage.clear();
    fetchPokemonMock.mockClear();
  });

  it("plays a full 10-round session and shows the correct final score", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));

    const guesses = [true, true, false, true, true, false, true, true, true, false];
    for (const correct of guesses) {
      await playRound(user, correct);
    }

    await waitFor(() => expect(screen.getByText(/Game Over/i)).toBeInTheDocument());

    const expectedScore = guesses.filter(Boolean).length;
    expect(screen.getByText(`${expectedScore}/10`)).toBeInTheDocument();
    expect(localStorage.getItem("wtp_best_score")).toBe(String(expectedScore));
  });

  it("keeps the saved best score after a lower-scoring replay", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    for (let i = 0; i < 10; i++) await playRound(user, true);
    await waitFor(() => expect(screen.getByText(/Game Over/i)).toBeInTheDocument());
    expect(screen.getByText("10/10")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /play again/i }));
    for (let i = 0; i < 10; i++) await playRound(user, false);
    await waitFor(() => expect(screen.getByText(/Game Over/i)).toBeInTheDocument());

    expect(screen.getByText("0/10")).toBeInTheDocument();
    expect(screen.getByText(/BEST 10\/10/)).toBeInTheDocument();
    expect(localStorage.getItem("wtp_best_score")).toBe("10");
  });
});
