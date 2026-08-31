const { reviewIntervalDays } = require("../src/utils/spacedRepetition");

describe("reviewIntervalDays (spaced repetition kurali)", () => {
  test("%60 altindaki dogrulukta 1 gun sonra tekrar onerilmeli", () => {
    expect(reviewIntervalDays(0)).toBe(1);
    expect(reviewIntervalDays(40)).toBe(1);
    expect(reviewIntervalDays(59)).toBe(1);
  });

  test("%60-79 arasindaki dogrulukta 3 gun sonra tekrar onerilmeli", () => {
    expect(reviewIntervalDays(60)).toBe(3);
    expect(reviewIntervalDays(70)).toBe(3);
    expect(reviewIntervalDays(79)).toBe(3);
  });

  test("%80 ve uzerindeki dogrulukta 7 gun sonra tekrar onerilmeli", () => {
    expect(reviewIntervalDays(80)).toBe(7);
    expect(reviewIntervalDays(100)).toBe(7);
  });
});
