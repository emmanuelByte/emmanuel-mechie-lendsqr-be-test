// tests/setup.ts

// Optional: clear mocks, DB reset, etc.
beforeEach(() => {
  jest.clearAllMocks();
});

// tests/setup.ts
afterAll(() => {
  jest.useRealTimers(); // if any fake timers used
  jest.clearAllMocks();
});
