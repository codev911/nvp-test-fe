import '@testing-library/jest-dom';

const vitest = (globalThis as unknown as { vi: typeof vi }).vi;

// Global fetch mock
global.fetch = vitest.fn();

// Basic WebSocket stub
class MockSocket {
  static OPEN = 1;
  readyState = MockSocket.OPEN;
  send = vitest.fn();
  close = vitest.fn();
}
// @ts-expect-error override for tests
global.WebSocket = MockSocket as unknown as typeof WebSocket;

// ResizeObserver stub for components using measurements
class ResizeObserverStub {
  observe = vitest.fn();
  unobserve = vitest.fn();
  disconnect = vitest.fn();
}
// @ts-expect-error override for tests
global.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

// LocalStorage shim
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    Object.keys(store).forEach((k) => {
      delete store[k];
    });
  },
};
// @ts-expect-error override for tests
global.localStorage = localStorageMock;
