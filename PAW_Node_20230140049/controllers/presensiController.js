const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const multer = require('multer');
const path = require('path');

// --- KONFIGURASI MULTER ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya gambar!'), false);
  }
};

// Export middleware ini agar bisa dipanggil di Router
exports.upload = multer({ storage: storage, fileFilter: fileFilter });

// --- FUNGSI CHECK-IN ---
exports.CheckIn = async (req, res) => {
  try {
    // DEBUGGING: Cek apakah data sampai
    console.log("BODY (Lokasi):", req.body);
    console.log("FILE (Foto):", req.file);

    const { id } = req.user;
    const { latitude, longitude } = req.body;
    const buktiFoto = req.file ? req.file.path : null; // Ambil path foto

    const existingRecord = await Presensi.findOne({
      where: { userId: id, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah check-in." });
    }

    const newRecord = await Presensi.create({
      userId: id,
      checkIn: new Date(),
      latitude: latitude,
      longitude: longitude,
      buktiFoto: buktiFoto
    });

    res.status(201).json({ message: "Berhasil Check-in!", data: newRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Server", error: error.message });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    const { id } = req.user;
    const waktuSekarang = new Date();
    const record = await Presensi.findOne({ where: { userId: id, checkOut: null } });
    
    if (!record) return res.status(404).json({ message: "Belum check-in." });
    
    record.checkOut = waktuSekarang;
    await record.save();
    res.json({ message: "Berhasil Check-out!" });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

exports.deletePresensi = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Presensi.findByPk(id);
        if (!record) return res.status(404).json({ message: "Not found" });
        await record.destroy();
        res.json({ message: "Deleted" });
    } catch (e) { res.status(500).json({ error: e.message }); }
};