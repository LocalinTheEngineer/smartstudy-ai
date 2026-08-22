const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
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

// En sonda: hicbir route eslesmezse hata yakalayici devreye girer
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda calisiyor`);
});
