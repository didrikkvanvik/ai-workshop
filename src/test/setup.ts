import "@testing-library/jest-dom/vitest";

class MockGainNode {
  gain = {
    setValueAtTime: () => {},
    exponentialRampToValueAtTime: () => {},
  };
  connect() {}
}

class MockOscillatorNode {
  type = "sine";
  frequency = { value: 0 };
  connect() {}
  start() {}
  stop() {}
}

class MockAudioContext {
  state = "running";
  currentTime = 0;
  createGain() {
    return new MockGainNode();
  }
  createOscillator() {
    return new MockOscillatorNode();
  }
  destination = {};
  resume() {
    return Promise.resolve();
  }
}

// Plain assignment (not defineProperty) so vi.spyOn can wrap/restore it in tests.
(globalThis as unknown as { AudioContext: unknown }).AudioContext = MockAudioContext;
