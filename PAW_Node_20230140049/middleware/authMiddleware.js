const jwt = require('jsonwebtoken');
const JWT_SECRET = 'KUNCI_RAHASIA_YANG_SANGAT_AMAN_123'; // Harus sama dengan di authController

exports.authenticateToken = (req, res, next) => {
  // 1. Ambil token dari Header (biasanya format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Ambil kode tokennya saja

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak: Token tidak ditemukan." });
  }

  // 2. Verifikasi Token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau kadaluarsa." });
    }
    
    // 3. Jika aman, simpan data user (dari token) ke request agar bisa dibaca Controller
    req.user = user;
    next(); // Lanjut ke Controller
  });
};