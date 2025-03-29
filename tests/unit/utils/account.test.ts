import { generateAccountNumber } from "../../../src/utils/account";

describe("generateAccountNumber", () => {
  it("should return a 10-digit string", () => {
    const accountNumber = generateAccountNumber();
    expect(typeof accountNumber).toBe("string");
    expect(accountNumber).toMatch(/^\d{10}$/);
  });

  it("should generate unique values over multiple calls", () => {
    const generated = new Set();
    for (let i = 0; i < 1000; i++) {
      const acc = generateAccountNumber();
      expect(generated.has(acc)).toBe(false);
      generated.add(acc);
    }
  });

  it("should not include non-numeric characters", () => {
    const accountNumber = generateAccountNumber();
    expect(/^\d+$/.test(accountNumber)).toBe(true);
  });
});
