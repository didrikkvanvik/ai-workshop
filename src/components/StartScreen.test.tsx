import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StartScreen } from "./StartScreen";

describe("StartScreen", () => {
  it("shows the best score and total rounds", () => {
    render(<StartScreen best={7} totalRounds={10} onStart={() => {}} />);
    expect(screen.getByText(/BEST 7\/10/)).toBeInTheDocument();
    expect(screen.getByText(/10 silhouettes/)).toBeInTheDocument();
  });

  it("calls onStart when the Start button is clicked", async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    render(<StartScreen best={0} totalRounds={10} onStart={onStart} />);

    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
