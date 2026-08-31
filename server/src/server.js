const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Once veritabanina baglan, basariliysa sunucuyu baslat.
// (app.js'in kendisi bunu yapmiyor artik - bkz. app.js'teki not.)
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda calisiyor`);
  });
});
