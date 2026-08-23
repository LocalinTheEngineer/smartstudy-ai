const fs = require("fs");
const Course = require("../models/Course");
const Material = require("../models/Material");

async function createCourse(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Ders adi zorunlu" });

    const course = await Course.create({ owner: req.userId, name, description });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCourses(req, res) {
  try {
    const courses = await Course.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCourseById(req, res) {
  try {
    const course = await Course.findOne({ _id: req.params.id, owner: req.userId });
    if (!course) return res.status(404).json({ message: "Ders bulunamadi" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteCourse(req, res) {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!course) return res.status(404).json({ message: "Ders bulunamadi" });

    const materials = await Material.find({ course: course._id });
    for (const m of materials) {
      if (m.filePath && fs.existsSync(m.filePath)) fs.unlinkSync(m.filePath);
    }
    await Material.deleteMany({ course: course._id });

    res.json({ message: "Ders silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createCourse, getCourses, getCourseById, deleteCourse };
