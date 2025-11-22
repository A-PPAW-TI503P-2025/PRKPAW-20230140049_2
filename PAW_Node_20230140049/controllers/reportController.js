const { Presensi, User } = require('../models'); // <-- PENTING: Import User
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;
    
    let options = {
      include: [{ model: User, attributes: ['nama'] }], // <-- JOIN ke tabel User ambil namanya saja
      order: [['createdAt', 'DESC']]
    };

    
    const records = await Presensi.findAll(options);

    res.json({
      message: "Laporan Harian",
      data: records,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal", error: error.message });
  }
};