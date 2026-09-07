import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ResultsScreen } from "./ResultsScreen";

describe("ResultsScreen", () => {
  it("shows the final score out of the total and the saved best", () => {
    render(<ResultsScreen score={6} totalRounds={10} best={8} onPlayAgain={() => {}} />);
    expect(screen.getByText("6/10")).toBeInTheDocument();
    expect(screen.getByText(/BEST 8\/10/)).toBeInTheDocument();
  });

  it("shows a New Best badge only when the score matches a non-zero best", () => {
    const { rerender } = render(
      <ResultsScreen score={8} totalRounds={10} best={8} onPlayAgain={() => {}} />
    );
    expect(screen.getByText(/New Best/i)).toBeInTheDocument();

    rerender(<ResultsScreen score={5} totalRounds={10} best={8} onPlayAgain={() => {}} />);
    expect(screen.queryByText(/New Best/i)).not.toBeInTheDocument();

    rerender(<ResultsScreen score={0} totalRounds={10} best={0} onPlayAgain={() => {}} />);
    expect(screen.queryByText(/New Best/i)).not.toBeInTheDocument();
  });

  it("calls onPlayAgain when the button is clicked", async () => {
    const onPlayAgain = vi.fn();
    const user = userEvent.setup();
    render(<ResultsScreen score={3} totalRounds={10} best={5} onPlayAgain={onPlayAgain} />);

    await user.click(screen.getByRole("button", { name: /play again/i }));

    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });
});
