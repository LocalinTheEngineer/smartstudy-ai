const QuizAttempt = require("../models/QuizAttempt");

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

// Konu bazli dogru/yanlis istatistigi + zayif konu tespiti + tekrar zamani (spaced repetition)
async function getStats(req, res) {
  try {
    // createdAt'a gore artan sirada cekiyoruz ki her konu icin en son denemeyi
    // (dongunun sonunda) kolayca yakalayabilelim.
    const attempts = await QuizAttempt.find({ user: req.userId }).sort({ createdAt: 1 });

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
      // attempts artan tarihe gore geldigi icin en son islenen, en guncel deneme olur
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

    res.json({
      totalAttempts: attempts.length,
      totalQuestions,
      totalCorrect,
      overallAccuracy: totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      topics,
      weakTopics,
      dueForReview,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { saveAttempt, getAttempts, getStats };
