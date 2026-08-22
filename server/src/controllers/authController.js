// Su an sadece iskelet - gercek kayit/giris mantigini birlikte yazacagiz.
async function register(req, res) {
  res.status(501).json({ message: "register henuz yazilmadi" });
}

async function login(req, res) {
  res.status(501).json({ message: "login henuz yazilmadi" });
}

module.exports = { register, login };
