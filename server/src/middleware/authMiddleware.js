const jwt = require("jsonwebtoken");

// Bu fonksiyonu, sadece giris yapmis kullanicilarin erisebilecegi
// route'larin basina koyacagiz (orn: "/api/courses" gibi).
function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Giris yapmalisin" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Gecersiz veya suresi dolmus token" });
  }
}

module.exports = protect;
