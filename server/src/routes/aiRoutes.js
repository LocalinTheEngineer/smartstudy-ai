const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  summarize,
  generateQuiz,
  generateStudyPlan,
} = require("../controllers/aiController");

const router = express.Router();

// Bu route'larin hepsi girisi yapmis olmani gerektiriyor (protect middleware'i sayesinde)
router.post("/summarize", protect, summarize);
router.post("/quiz", protect, generateQuiz);
router.post("/study-plan", protect, generateStudyPlan);

module.exports = router;
