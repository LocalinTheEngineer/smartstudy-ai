const { GoogleGenAI } = require("@google/genai");

// Gemini'ye baglanan tek merkezi client.
// API anahtarini .env dosyasindan okuyor.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Gemini'den gelen ham (genelde Ingilizce, teknik) hata mesajlarini
// kullaniciya gosterilebilecek Turkce, anlasilir mesajlara ceviriyor.
// Bilinmeyen bir hata gelirse ham mesaji da ekleyerek geri veriyoruz,
// boylece debug ederken bilgi kaybetmiyoruz.
function friendlyGeminiError(err) {
  const raw = err?.message || String(err);

  if (raw.includes("429") || /quota/i.test(raw)) {
    return "AI şu an çok yoğun (kota doldu). Birkaç dakika sonra tekrar dener misin?";
  }
  if (raw.includes("404") || /not found|no longer available/i.test(raw)) {
    return "AI modeliyle bağlantıda geçici bir sorun var, birazdan tekrar dene.";
  }
  if (/network|ECONNRESET|ETIMEDOUT|fetch failed/i.test(raw)) {
    return "AI servisine ulaşılamadı, internet bağlantını kontrol edip tekrar dene.";
  }
  return "AI isteği işlenemedi: " + raw;
}

async function askGemini(prompt) {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });
    return interaction.output_text;
  } catch (err) {
    throw new Error(friendlyGeminiError(err));
  }
}

module.exports = { askGemini };
