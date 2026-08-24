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

// Konu bazli dogru/yanlis istatistigi + zayif konu tespiti
async function getStats(req, res) {
  try {
    const attempts = await QuizAttempt.find({ user: req.userId });

    const topicMap = {};
    let totalCorrect = 0;
    let totalQuestions = 0;

    attempts.forEach((a) => {
      if (!topicMap[a.topic]) topicMap[a.topic] = { correct: 0, total: 0 };
      a.questions.forEach((q) => {
        topicMap[a.topic].total += 1;
        totalQuestions += 1;
        if (q.isCorrect) {
          topicMap[a.topic].correct += 1;
          totalCorrect += 1;
        }
      });
    });

    const topics = Object.entries(topicMap)
      .map(([topic, v]) => ({
        topic,
        correct: v.correct,
        total: v.total,
        accuracy: v.total ? Math.round((v.correct / v.total) * 100) : 0,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    const weakTopics = topics.filter((t) => t.accuracy < 60).map((t) => t.topic);

    res.json({
      totalAttempts: attempts.length,
      totalQuestions,
      totalCorrect,
      overallAccuracy: totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      topics,
      weakTopics,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { saveAttempt, getAttempts, getStats };
