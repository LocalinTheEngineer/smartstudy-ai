const express = require("express");
const protect = require("../middleware/authMiddleware");
const { saveAttempt, getAttempts, getStats, getInsights } = require("../controllers/quizAttemptController");
const { aiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.use(protect);

router.post("/", saveAttempt);
router.get("/", getAttempts);
router.get("/stats", getStats);
router.get("/insights", aiLimiter, getInsights);

module.exports = router;
