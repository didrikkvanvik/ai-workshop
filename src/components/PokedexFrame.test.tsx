import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PokedexFrame } from "./PokedexFrame";

describe("PokedexFrame", () => {
  it("renders its children inside the frame", () => {
    render(
      <PokedexFrame>
        <p>Screen content</p>
      </PokedexFrame>
    );

    expect(screen.getByText("Screen content")).toBeInTheDocument();
  });
});
