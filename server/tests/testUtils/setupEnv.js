// Testler gercek .env dosyasina (gercek DB/API anahtarlarina) hic
// dokunmuyor - burada sahte/test degerleri tanimliyoruz. Testler zaten
// gercek MongoDB yerine mongodb-memory-server, gercek Gemini yerine hicbir
// AI cagrisi yapmiyor (AI gerektiren route'lar test kapsaminda degil).
process.env.JWT_SECRET = "test-secret-key-for-jest";
process.env.GEMINI_API_KEY = "test-gemini-key";
