const rateLimit = require("express-rate-limit");

// Genel API limiti: butun /api altina uygulanir, otomatik/kotuye kullanim
// trafigine karsi temel bir koruma.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Çok fazla istek gönderdin, birkaç dakika sonra tekrar dene." },
});

// AI endpoint'leri (Gemini kotasi tuketiyor) icin daha siki bir limit -
// boylece biri (ya da bir bot) canli demo'daki ucretsiz Gemini kotasini
// tek basina tuketemez.
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "AI istekleri için geçici limite ulaştın, birkaç dakika sonra tekrar dene.",
  },
});

module.exports = { apiLimiter, aiLimiter };
