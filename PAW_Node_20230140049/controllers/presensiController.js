const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { latitude, longitude } = req.body; // <-- Ambil data lokasi dari Frontend

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah check-in (belum check-out)." });
    }

    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: new Date(),
      latitude: latitude, // <-- Simpan Lat
      longitude: longitude // <-- Simpan Long
    });

    res.status(201).json({
      message: "Berhasil Check-in!",
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({ message: "Error Server", error: error.message });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    const { id } = req.user;
    const waktuSekarang = new Date();

    // Cari data check-in yang aktif
    const recordToUpdate = await Presensi.findOne({
      where: { userId: id, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Belum ada data check-in aktif." });
    }

    // Update waktu check-out
    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    res.json({
      message: "Berhasil Check-out!",
      data: {
        id: recordToUpdate.id,
        checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ss", { timeZone }),
        checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ss", { timeZone }),
      }
    });
  } catch (error) {
    console.error("Error CheckOut:", error);
    res.status(500).json({ message: "Error Server", error: error.message });
  }
};

exports.deletePresensi = async (req, res) => {
    try {
      const { id } = req.params; 
      const record = await Presensi.findByPk(id);
      if (!record) return res.status(404).json({ message: "Data tidak ditemukan." });
      await record.destroy();
      res.json({ message: "Berhasil dihapus." });
    } catch (error) {
      res.status(500).json({ message: "Gagal menghapus", error: error.message });
    }
};