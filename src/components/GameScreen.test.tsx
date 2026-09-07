import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameScreen } from "./GameScreen";

const pokemon = { id: 1, name: "bulbasaur", artworkUrl: "art.png" };
const options = [
  { id: 1, name: "bulbasaur" },
  { id: 2, name: "ivysaur" },
  { id: 3, name: "venusaur" },
  { id: 4, name: "charmander" },
];

describe("GameScreen", () => {
  it("shows a loading spinner and no image while loading", () => {
    render(
      <GameScreen
        round={1}
        totalRounds={10}
        score={0}
        pokemon={null}
        options={[]}
        selected={null}
        isCorrect={null}
        isRevealed={false}
        isLoading={true}
        onGuess={() => {}}
        onNext={() => {}}
      />
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the silhouette unrevealed, with the round/score header", () => {
    render(
      <GameScreen
        round={2}
        totalRounds={10}
        score={1}
        pokemon={pokemon}
        options={options}
        selected={null}
        isCorrect={null}
        isRevealed={false}
        isLoading={false}
        onGuess={() => {}}
        onNext={() => {}}
      />
    );
    const img = screen.getByRole("img", { name: /mystery pokémon/i });
    expect(img).toHaveStyle({ filter: "brightness(0)" });
    expect(screen.getByText(/ROUND 2\/10/)).toBeInTheDocument();
    expect(screen.getByText(/SCORE 1/)).toBeInTheDocument();
  });

  it("calls onGuess with the clicked option's name", async () => {
    const onGuess = vi.fn();
    const user = userEvent.setup();
    render(
      <GameScreen
        round={1}
        totalRounds={10}
        score={0}
        pokemon={pokemon}
        options={options}
        selected={null}
        isCorrect={null}
        isRevealed={false}
        isLoading={false}
        onGuess={onGuess}
        onNext={() => {}}
      />
    );

    await user.click(screen.getByRole("button", { name: "ivysaur" }));

    expect(onGuess).toHaveBeenCalledWith("ivysaur");
  });

  it("highlights the correct answer and the wrong pick, and disables all options", () => {
    render(
      <GameScreen
        round={5}
        totalRounds={10}
        score={2}
        pokemon={pokemon}
        options={options}
        selected="ivysaur"
        isCorrect={false}
        isRevealed={true}
        isLoading={false}
        onGuess={() => {}}
        onNext={() => {}}
      />
    );

    const correctButton = screen.getByRole("button", { name: "bulbasaur" });
    const wrongButton = screen.getByRole("button", { name: "ivysaur" });

    expect(correctButton).toHaveClass("bg-green-200");
    expect(wrongButton).toHaveClass("bg-red-200");
    expect(correctButton).toBeDisabled();
    expect(wrongButton).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("labels the final round's continue button 'See Results'", () => {
    render(
      <GameScreen
        round={10}
        totalRounds={10}
        score={9}
        pokemon={pokemon}
        options={options}
        selected="bulbasaur"
        isCorrect={true}
        isRevealed={true}
        isLoading={false}
        onGuess={() => {}}
        onNext={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: "See Results" })).toBeInTheDocument();
  });

  it("calls onNext when the continue button is clicked", async () => {
    const onNext = vi.fn();
    const user = userEvent.setup();
    render(
      <GameScreen
        round={3}
        totalRounds={10}
        score={1}
        pokemon={pokemon}
        options={options}
        selected="bulbasaur"
        isCorrect={true}
        isRevealed={true}
        isLoading={false}
        onGuess={() => {}}
        onNext={onNext}
      />
    );

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
