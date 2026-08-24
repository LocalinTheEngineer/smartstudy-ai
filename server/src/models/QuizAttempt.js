const mongoose = require("mongoose");

const questionResultSchema = new mongoose.Schema(
  {
    question: String,
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean,
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, default: "orta" },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    questions: [questionResultSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
