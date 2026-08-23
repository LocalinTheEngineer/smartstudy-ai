const { GoogleGenAI } = require("@google/genai");

// Gemini'ye baglanan tek merkezi client.
// API anahtarini .env dosyasindan okuyor.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function askGemini(prompt) {
  const interaction = await ai.interactions.create({
    model: "gemini-2.5-flash",
    input: prompt,
  });
  return interaction.output_text;
}

module.exports = { askGemini };
