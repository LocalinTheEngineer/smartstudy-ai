// Bir konunun dogruluk yuzdesine gore hangi renkte gosterilecegini belirler
// (dataviz kilavuzundaki durum-renk mantigi: kirmizi/sari/yesil).
// Ayri bir dosyada tutulmasinin sebebi: hem Stats.jsx'te kullaniliyor hem
// de dogrudan test edilebiliyor (bkz. statsHelpers.test.js).
export function barColor(accuracy) {
  if (accuracy < 60) return "var(--color-danger)";
  if (accuracy < 80) return "var(--color-warning)";
  return "var(--color-success)";
}
