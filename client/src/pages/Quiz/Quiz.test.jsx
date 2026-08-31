import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Quiz from "./Quiz";

describe("Quiz sayfasi - URL'den konu on doldurma", () => {
  test("?topic= parametresi varsa konu alanini onceden doldurur", () => {
    render(
      <MemoryRouter initialEntries={["/quiz?topic=Unreal%20Engine"]}>
        <Quiz />
      </MemoryRouter>
    );

    const topicInput = screen.getByPlaceholderText(/Konu/i);
    expect(topicInput.value).toBe("Unreal Engine");
  });

  test("topic parametresi yoksa konu alani bos baslar", () => {
    render(
      <MemoryRouter initialEntries={["/quiz"]}>
        <Quiz />
      </MemoryRouter>
    );

    const topicInput = screen.getByPlaceholderText(/Konu/i);
    expect(topicInput.value).toBe("");
  });
});
