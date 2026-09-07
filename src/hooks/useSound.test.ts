import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSound } from "./useSound";

describe("useSound", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("plays three tones on a correct guess", () => {
    const spy = vi.spyOn(AudioContext.prototype, "createOscillator");
    const { result } = renderHook(() => useSound());

    expect(() => result.current.playCorrect()).not.toThrow();
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it("plays two tones on a wrong guess", () => {
    const spy = vi.spyOn(AudioContext.prototype, "createOscillator");
    const { result } = renderHook(() => useSound());

    expect(() => result.current.playWrong()).not.toThrow();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("plays one tone on click", () => {
    const spy = vi.spyOn(AudioContext.prototype, "createOscillator");
    const { result } = renderHook(() => useSound());

    expect(() => result.current.playClick()).not.toThrow();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("reuses a single AudioContext across calls", () => {
    const spy = vi.spyOn(globalThis, "AudioContext");
    const { result } = renderHook(() => useSound());

    result.current.playClick();
    result.current.playClick();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
