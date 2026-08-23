const fs = require("fs");
const Course = require("../models/Course");
const Material = require("../models/Material");
const pdfParse = require("pdf-parse");

async function assertCourseOwnership(courseId, userId) {
  return Course.findOne({ _id: courseId, owner: userId });
}

async function addNote(req, res) {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;

    const course = await assertCourseOwnership(courseId, req.userId);
    if (!course) return res.status(404).json({ message: "Ders bulunamadi" });

    if (!title || !content) {
      return res.status(400).json({ message: "title ve content zorunlu" });
    }

    const material = await Material.create({
      course: courseId,
      title,
      type: "note",
      content,
    });

    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function uploadFile(req, res) {
  try {
    const { courseId } = req.params;

    const course = await assertCourseOwnership(courseId, req.userId);
    if (!course) return res.status(404).json({ message: "Ders bulunamadi" });

    if (!req.file) {
      return res.status(400).json({ message: "Dosya bulunamadi" });
    }

    const material = await Material.create({
      course: courseId,
      title: req.body.title || req.file.originalname,
      type: "file",
      fileName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
    });

    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getMaterials(req, res) {
  try {
    const { courseId } = req.params;

    const course = await assertCourseOwnership(courseId, req.userId);
    if (!course) return res.status(404).json({ message: "Ders bulunamadi" });

    const materials = await Material.find({ course: courseId }).sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Bir materyalin gercek metnini cikarir: note ise direkt, dosyaysa pdf/txt'den okuyarak
async function extractMaterialText(material) {
  if (material.type === "note") {
    return material.content;
  }

  if (material.type === "file") {
    const lower = material.fileName.toLowerCase();
    if (lower.endsWith(".txt")) {
      return fs.readFileSync(material.filePath, "utf-8");
    }
    if (lower.endsWith(".pdf")) {
      const buffer = fs.readFileSync(material.filePath);
      const data = await pdfParse(buffer);
      return data.text;
    }
  }

  return "";
}

async function deleteMaterial(req, res) {
  try {
    const material = await Material.findById(req.params.id).populate("course");
    if (!material || String(material.course.owner) !== req.userId) {
      return res.status(404).json({ message: "Materyal bulunamadi" });
    }

    if (material.filePath && fs.existsSync(material.filePath)) {
      fs.unlinkSync(material.filePath);
    }
    await material.deleteOne();

    res.json({ message: "Materyal silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { addNote, uploadFile, getMaterials, deleteMaterial, extractMaterialText };
