const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createCourse,
  getCourses,
  getCourseById,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.use(protect);

router.post("/", createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.delete("/:id", deleteCourse);

module.exports = router;
