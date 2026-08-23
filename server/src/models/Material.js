const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["note", "file"], required: true },
    content: { type: String, default: "" }, // "note" turu icin metin
    fileName: { type: String },
    filePath: { type: String },
    mimeType: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
