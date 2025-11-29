const { Presensi, User } = require('../models');

exports.getDailyReport = async (req, res) => {
  try {
    // Ambil data Presensi beserta data User pemiliknya
    const records = await Presensi.findAll({
      include: [
        {
          model: User,
          as: 'user', // PENTING: Harus sesuai dengan alias di models/presensi.js
          attributes: ['nama', 'email', 'role'] // Kita hanya butuh nama, email, role
        }
      ],
      order: [['createdAt', 'DESC']] // Urutkan dari yang paling baru
    });

    res.json({
      message: "Data Laporan Harian",
      data: records,
    });
  } catch (error) {
    console.error("Error Report:", error);
    res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
  }
};