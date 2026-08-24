const express = require("express");
const protect = require("../middleware/authMiddleware");
const { saveAttempt, getAttempts, getStats } = require("../controllers/quizAttemptController");

const router = express.Router();

router.use(protect);

router.post("/", saveAttempt);
router.get("/", getAttempts);
router.get("/stats", getStats);

module.exports = router;
