const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI .env dosyasinda tanimli degil!");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB baglantisi basarili");
  } catch (err) {
    console.error("MongoDB baglanti hatasi:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
