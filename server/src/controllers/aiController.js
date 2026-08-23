const { askGemini } = require("../services/geminiService");
const Material = require("../models/Material");
const { extractMaterialText } = require("./materialController");

// Bir metni ozetle. Ya dogrudan "text" gonderilir, ya da bir "materialId"
// verilir ve o materyalin gercek icerigi (not, .txt ya da .pdf) okunup ozetlenir.
async function summarize(req, res) {
  try {
    const { text, materialId } = req.body;
    let content = text;

    if (materialId) {
      const material = await Material.findById(materialId).populate("course");
      if (!material || String(material.course.owner) !== req.userId) {
        return res.status(404).json({ message: "Materyal bulunamadi" });
      }
      content = await extractMaterialText(material);
    }

    if (!content) {
      return res.status(400).json({ message: "text ya da materialId alani zorunlu" });
    }

    const prompt = `Asagidaki ders notunu Turkce olarak ozetle. Ana basliklari ve onemli kavramlari belirt, kisa ve anlasilir yaz:\n\n${content}`;
    const summary = await askGemini(prompt);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function generateQuiz(req, res) {
  try {
    const { topic, questionCount = 5, difficulty = "orta" } = req.body;
    if (!topic) {
      return res.status(400).json({ message: "topic alani zorunlu" });
    }

    const prompt = `"${topic}" konusundan Turkce, ${difficulty} seviyede ${questionCount} soruluk cok secmeli (A,B,C,D) bir quiz hazirla.
SADECE asagidaki JSON formatinda cevap ver, baska hicbir aciklama veya metin ekleme:
[
  { "question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "answer": "A" }
]`;

    const raw = await askGemini(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const quiz = JSON.parse(cleaned);
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ message: "Quiz olusturulamadi: " + err.message });
  }
}

async function generateStudyPlan(req, res) {
  try {
    const { examDate, availableTime, subjects } = req.body;
    if (!examDate || !availableTime || !subjects) {
      return res
        .status(400)
        .json({ message: "examDate, availableTime ve subjects alanlari zorunlu" });
    }

    const prompt = `Bir ogrenci icin calisma plani hazirla.
Sinav tarihi: ${examDate}
Musait zamanlar: ${JSON.stringify(availableTime)}
Calisilacak dersler: ${subjects.join(", ")}

Gune gore, saat araliklariyla, hangi derse ne kadar calisilacagini Turkce, okunakli bir metin halinde listele.`;

    const plan = await askGemini(prompt);
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { summarize, generateQuiz, generateStudyPlan };
