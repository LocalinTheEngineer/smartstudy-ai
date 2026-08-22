// Basit hata yakalayici middleware.
// app.js'in en sonunda kullaniliyor, herhangi bir route hata firlatirsa buraya duser.
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Sunucuda bir hata olustu",
  });
}

module.exports = errorHandler;
