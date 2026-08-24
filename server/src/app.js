const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const courseRoutes = require("./routes/courseRoutes");
const materialRoutes = require("./routes/materialRoutes");
const quizAttemptRoutes = require("./routes/quizAttemptRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware: gelen istekleri kullanabilmemiz icin
app.use(cors());
app.use(express.json());

// Basit bir test rotasi: sunucu ayakta mi diye bakmak icin
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SmartStudy AI backend calisiyor" });
});

// Auth ile ilgili tum route'lar /api/auth altinda toplanacak
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/quiz-attempts", quizAttemptRoutes);

// En sonda: hicbir route eslesmezse hata yakalayici devreye girer
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Once veritabanina baglan, basariliysa sunucuyu baslat
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda calisiyor`);
  });
});
