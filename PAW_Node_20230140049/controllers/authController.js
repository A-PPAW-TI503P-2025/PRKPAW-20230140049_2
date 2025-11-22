const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Kunci rahasia untuk membuat token (Nanti sebaiknya ditaruh di .env)
const JWT_SECRET = 'KUNCI_RAHASIA_YANG_SANGAT_AMAN_123'; 

exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    // Validasi input
    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password harus diisi" });
    }

    // Acak password (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke Database
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || 'mahasiswa' // Default jadi mahasiswa jika tidak diisi
    });

    res.status(201).json({
      message: "Registrasi berhasil!",
      data: { id: newUser.id, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    // Cek jika email sudah ada
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }
    res.status(500).json({ message: "Gagal registrasi", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    // 2. Cek password (bandingkan yg diinput dgn yg di database)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah." });
    }

    // 3. Jika benar, buatkan Token (Kartu Akses)
    const payload = {
      id: user.id,
      nama: user.nama,
      role: user.role
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: "Login berhasil",
      token: token // Token ini nanti dipakai untuk absen
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal login", error: error.message });
  }
};