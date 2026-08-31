import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MarkdownText from "./MarkdownText";

describe("MarkdownText", () => {
  test("**kalin** yaziyi <strong> etiketine cevirir", () => {
    render(<MarkdownText>{"Bu **önemli** bir not."}</MarkdownText>);
    const strongEl = screen.getByText("önemli");
    expect(strongEl.tagName).toBe("STRONG");
  });

  test("bos icerik icin hicbir sey render etmez", () => {
    const { container } = render(<MarkdownText>{""}</MarkdownText>);
    expect(container).toBeEmptyDOMElement();
  });
});
