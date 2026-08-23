const mongoose = require("mongoose");
const dns = require("dns");

// Bazi internet saglayicilarinin DNS sunuculari, mongodb+srv:// adreslerinin
// ihtiyac duydugu ozel "SRV" sorgularini duzgun cevaplamiyor.
// Bu yuzden Node.js'e, DNS sorgularini dogrudan Google/Cloudflare'in
// herkese acik DNS sunucularina yapmasini soyluyoruz. Bu, Windows'taki
// DNS ayarindan bagimsiz calisir.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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
