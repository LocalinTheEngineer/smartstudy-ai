import { useState, useEffect } from "react";

// index.html'deki kucuk script sayfa daha React yuklenmeden dogru temayi
// <html> etiketine yaziyor - burada sadece o degeri okuyup React state'ine
// bagliyoruz, boylece "yanlis renkte acilip zipleme" olmuyor.
function getInitialTheme() {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
  }
  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // localStorage'a yazilamiyorsa (gizli sekme vb.) sessizce gec
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return { theme, toggleTheme };
}
