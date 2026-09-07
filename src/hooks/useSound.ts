import { useRef } from "react";

type ToneStep = { freq: number; duration: number; delay: number };

function playTones(ctx: AudioContext, steps: ToneStep[], type: OscillatorType = "square") {
  const now = ctx.currentTime;
  for (const step of steps) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = step.freq;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const start = now + step.delay;
    const end = start + step.duration;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(0.15, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, end);

    osc.start(start);
    osc.stop(end + 0.02);
  }
}

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  function getContext(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }

  function playCorrect() {
    const ctx = getContext();
    playTones(
      ctx,
      [
        { freq: 523.25, duration: 0.1, delay: 0 },
        { freq: 659.25, duration: 0.1, delay: 0.1 },
        { freq: 783.99, duration: 0.16, delay: 0.2 },
      ],
      "square"
    );
  }

  function playWrong() {
    const ctx = getContext();
    playTones(
      ctx,
      [
        { freq: 220, duration: 0.18, delay: 0 },
        { freq: 164.81, duration: 0.24, delay: 0.15 },
      ],
      "sawtooth"
    );
  }

  function playClick() {
    const ctx = getContext();
    playTones(ctx, [{ freq: 440, duration: 0.05, delay: 0 }], "square");
  }

  return { playCorrect, playWrong, playClick };
}
