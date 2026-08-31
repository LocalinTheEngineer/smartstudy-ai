const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const courseRoutes = require("./routes/courseRoutes");
const materialRoutes = require("./routes/materialRoutes");
const quizAttemptRoutes = require("./routes/quizAttemptRoutes");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Bu dosya SADECE Express app'ini kurup disari aciyor - veritabanina
// baglanmiyor, sunucuyu dinlemeye baslatmiyor (app.listen yok). Boylece
// testler (bkz. tests/) bu app'i dogrudan import edip supertest ile
// gercek bir port acmadan/gercek MongoDB'ye baglanmadan calistirabiliyor.
// Gercek calistirma (DB baglantisi + app.listen) server.js'de.
const app = express();

// Middleware: gelen istekleri kullanabilmemiz icin
app.use(cors());
app.use(express.json());

// Basit bir test rotasi: sunucu ayakta mi diye bakmak icin
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SmartStudy AI backend calisiyor" });
});

// Butun /api rotalarina genel bir istek limiti uygulaniyor (kotuye kullanima karsi)
app.use("/api", apiLimiter);

// Auth ile ilgili tum route'lar /api/auth altinda toplanacak
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/quiz-attempts", quizAttemptRoutes);

// En sonda: hicbir route eslesmezse hata yakalayici devreye girer
app.use(errorHandler);

module.exports = app;
