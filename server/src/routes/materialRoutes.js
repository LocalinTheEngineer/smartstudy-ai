const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  addNote,
  uploadFile,
  getMaterials,
  deleteMaterial,
} = require("../controllers/materialController");

const router = express.Router();

router.use(protect);

router.post("/course/:courseId/note", addNote);
router.post("/course/:courseId/upload", upload.single("file"), uploadFile);
router.get("/course/:courseId", getMaterials);
router.delete("/:id", deleteMaterial);

module.exports = router;
