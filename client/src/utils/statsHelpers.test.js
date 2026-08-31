import { describe, test, expect } from "vitest";
import { barColor } from "./statsHelpers";

describe("barColor", () => {
  test("%60 altinda kirmizi (danger) renk doner", () => {
    expect(barColor(0)).toBe("var(--color-danger)");
    expect(barColor(59)).toBe("var(--color-danger)");
  });

  test("%60-79 arasinda sari (warning) renk doner", () => {
    expect(barColor(60)).toBe("var(--color-warning)");
    expect(barColor(79)).toBe("var(--color-warning)");
  });

  test("%80 ve uzerinde yesil (success) renk doner", () => {
    expect(barColor(80)).toBe("var(--color-success)");
    expect(barColor(100)).toBe("var(--color-success)");
  });
});
