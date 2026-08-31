// Bir konunun son quiz basarisina gore, bir sonraki tekrarin ne zaman
// yapilmasi gerektigini belirler (basit araliki tekrar / spaced repetition
// kurali). Test edilebilir olmasi icin ayri bir dosyada, saf (pure) bir
// fonksiyon olarak tutuluyor - bkz. tests/spacedRepetition.test.js.
function reviewIntervalDays(lastAccuracy) {
  if (lastAccuracy < 60) return 1; // zayifsan yarin tekrar et
  if (lastAccuracy < 80) return 3; // ortaysa 3 gun sonra
  return 7; // iyiysen 1 hafta sonra
}

module.exports = { reviewIntervalDays };
