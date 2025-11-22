const jwt = require("jsonwebtoken");

// PENTING: Samakan kuncinya dengan yang ada di authController.js!
const JWT_SECRET = 'KUNCI_RAHASIA_YANG_SANGAT_AMAN_123'; 

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (token == null) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau kedaluwarsa." });
    }
    // Simpan data user dari token ke request
    req.user = userPayload;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  // Cek role dari data yang sudah didecode middleware sebelumnya
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Akses ditolak. Hanya untuk admin." });
  }
};