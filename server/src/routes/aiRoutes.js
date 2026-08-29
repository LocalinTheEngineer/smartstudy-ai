const express = require("express");
const protect = require("../middleware/authMiddleware");
const { aiLimiter } = require("../middleware/rateLimiter");
const {
  summarize,
  generateQuiz,
  generateStudyPlan,
} = require("../controllers/aiController");

const router = express.Router();

// Bu route'larin hepsi girisi yapmis olmani gerektiriyor (protect middleware'i sayesinde)
router.post("/summarize", aiLimiter, protect, summarize);
router.post("/quiz", aiLimiter, protect, generateQuiz);
router.post("/study-plan", aiLimiter, protect, generateStudyPlan);

module.exports = router;
