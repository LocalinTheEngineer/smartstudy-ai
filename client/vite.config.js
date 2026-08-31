import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vitest bazi dosyalari esbuild ile on-isliyor; esbuild'e JSX'i "otomatik"
  // (React 17+ tarzi, "React" kelimesini elle import etmeden) modda
  // isleyecegini soylemezsek test dosyalarinda "React is not defined"
  // hatasi alinabiliyor.
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
    // @testing-library/jest-dom kendi ic dogrulamasinda global bir "expect"
    // bekliyor (biz test dosyalarinda "vitest"ten acikca import etsek de).
    globals: true,
  },
})
