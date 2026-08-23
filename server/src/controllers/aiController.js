const { askGemini } = require("../services/geminiService");

// Bir metni ozetle
async function summarize(req, res) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "text alani zorunlu" });
    }

    const prompt = `Asagidaki ders notunu Turkce olarak ozetle. Ana basliklari ve onemli kavramlari belirt, kisa ve anlasilir yaz:\n\n${text}`;
    const summary = await askGemini(prompt);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Bir konudan cok secmeli quiz uret
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

// Calisma plani uret
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
