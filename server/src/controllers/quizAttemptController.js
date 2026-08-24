const QuizAttempt = require("../models/QuizAttempt");
const { askGemini } = require("../services/geminiService");

async function saveAttempt(req, res) {
  try {
    const { topic, difficulty, score, total, questions } = req.body;
    if (!topic || total == null || !questions) {
      return res.status(400).json({ message: "topic, total ve questions zorunlu" });
    }

    const attempt = await QuizAttempt.create({
      user: req.userId,
      topic,
      difficulty,
      score,
      total,
      questions,
    });

    res.status(201).json(attempt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAttempts(req, res) {
  try {
    const attempts = await QuizAttempt.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Bir konunun son quiz basarisina gore, bir sonraki tekrarin ne zaman
// yapilmasi gerektigini belirler (basit araliki tekrar / spaced repetition kurali).
function reviewIntervalDays(lastAccuracy) {
  if (lastAccuracy < 60) return 1; // zayifsan yarin tekrar et
  if (lastAccuracy < 80) return 3; // ortaysa 3 gun sonra
  return 7; // iyiysen 1 hafta sonra
}

// Konu bazli dogru/yanlis istatistigi + zayif konu tespiti + tekrar zamani (spaced repetition).
// Hem /stats hem /insights endpoint'i bu ortak hesaplamayi kullanir.
async function computeStats(userId) {
  const attempts = await QuizAttempt.find({ user: userId }).sort({ createdAt: 1 });

  const topicMap = {};
  let totalCorrect = 0;
  let totalQuestions = 0;

  attempts.forEach((a) => {
    if (!topicMap[a.topic]) {
      topicMap[a.topic] = { correct: 0, total: 0, lastAttemptAt: null, lastAccuracy: 0 };
    }
    a.questions.forEach((q) => {
      topicMap[a.topic].total += 1;
      totalQuestions += 1;
      if (q.isCorrect) {
        topicMap[a.topic].correct += 1;
        totalCorrect += 1;
      }
    });
    topicMap[a.topic].lastAttemptAt = a.createdAt;
    topicMap[a.topic].lastAccuracy = a.total ? Math.round((a.score / a.total) * 100) : 0;
  });

  const now = new Date();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const topics = Object.entries(topicMap)
    .map(([topic, v]) => {
      const intervalDays = reviewIntervalDays(v.lastAccuracy);
      const nextReviewAt = new Date(v.lastAttemptAt.getTime() + intervalDays * DAY_MS);
      const daysSinceLastAttempt = Math.floor((now - v.lastAttemptAt) / DAY_MS);
      return {
        topic,
        correct: v.correct,
        total: v.total,
        accuracy: v.total ? Math.round((v.correct / v.total) * 100) : 0,
        lastAttemptAt: v.lastAttemptAt,
        lastAccuracy: v.lastAccuracy,
        nextReviewAt,
        isDue: nextReviewAt <= now,
        daysSinceLastAttempt,
      };
    })
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakTopics = topics.filter((t) => t.accuracy < 60).map((t) => t.topic);

  const dueForReview = topics
    .filter((t) => t.isDue)
    .sort((a, b) => new Date(a.nextReviewAt) - new Date(b.nextReviewAt));

  return {
    totalAttempts: attempts.length,
    totalQuestions,
    totalCorrect,
    overallAccuracy: totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    topics,
    weakTopics,
    dueForReview,
  };
}

async function getStats(req, res) {
  try {
    const stats = await computeStats(req.userId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Gecmis quiz istatistiklerini Gemini'ye vererek dogal dilde bir ogrenme
// analizi + tavsiye ürettirir. Istege baglidir (ayri bir buton ile cagrilir),
// her sayfa yuklemesinde otomatik calismaz.
async function getInsights(req, res) {
  try {
    const stats = await computeStats(req.userId);

    if (stats.totalAttempts === 0) {
      return res.status(400).json({
        message: "Analiz icin en az bir quiz cozmus olman gerekiyor",
      });
    }

    const topicLines = stats.topics
      .map((t) => `- ${t.topic}: %${t.accuracy} dogruluk (${t.correct}/${t.total} soru)`)
      .join("\n");

    const prompt = `Bir ogrencinin quiz gecmisine bakarak ona kisa, yol gosterici bir ogrenme
analizi hazirla.

Genel dogruluk: %${stats.overallAccuracy}
Toplam cozulen quiz: ${stats.totalAttempts}
Konu bazli performans:
${topicLines}
Zayif konular (%60 alti dogruluk): ${stats.weakTopics.length > 0 ? stats.weakTopics.join(", ") : "yok"}

Bu verilere gore Turkce, samimi ama net bir dille:
1. Ogrencinin genel olarak nasil gittigini kisaca degerlendir.
2. Hangi konu(larda) zorlandigini belirt ve olasi bir neden tahmin et (kesin iddialarda
   bulunma, "olabilir" gibi ihtiyatli bir dil kullan).
3. Somut ve uygulanabilir 2-3 tavsiye ver (ne siklikta calismali, hangi konuya oncelik
   vermeli, nasil bir calisma yontemi deneyebilir gibi).

Kisa tut (en fazla 150-200 kelime). Markdown formatinda (basliklar icin ###, vurgular icin
**kalin**, tavsiyeler icin madde isaretleri) yaz, boylece okunakli gorunsun.`;

    const insight = await askGemini(prompt);
    res.json({ insight });
  } catch (err) {
    res.status(500).json({ message: "Analiz olusturulamadi: " + err.message });
  }
}

module.exports = { saveAttempt, getAttempts, getStats, getInsights };
