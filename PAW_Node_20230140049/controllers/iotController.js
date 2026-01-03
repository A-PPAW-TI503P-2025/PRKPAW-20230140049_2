exports.testConnection = (req, res) => {
  const { message, deviceId, uptime } = req.body;

  console.log(`\n📡 [IOT LOG] Data Diterima!`);
  console.log(`   - Device ID : ${deviceId}`);
  console.log(`   - Pesan     : ${message}`);
  
  // Bagian TUGAS: Menampilkan Uptime (jika ada)
  if (uptime) {
    console.log(`   - Uptime    : ${uptime} ms (Waktu Nyala Alat)`);
  }

  res.status(200).json({ 
    status: "ok", 
    reply: "Halo ESP32, Server menerima datamu!" 
  });
};

exports.receiveSensorData = async (req, res) => {
  try {
    // 1. Terima data dari ESP32
    // Catatan: 'cahaya' opsional jika belum pasang LDR, default 0
    const { suhu, kelembaban, cahaya, alert } = req.body; 

    // 2. Validasi Sederhana
    if (suhu === undefined || kelembaban === undefined) {
      return res.status(400).json({ 
        status: "error", 
        message: "Data suhu/kelembaban kosong!" 
      });
    }

    // 3. Simpan ke Database
    const newData = await SensorLog.create({
      suhu: parseFloat(suhu),
      kelembaban: parseFloat(kelembaban),
      cahaya: parseInt(cahaya) || 0 // Default 0 jika null
    });

    // 4. Log Cantik di Terminal
    console.log(`💾 [SAVED] Suhu: ${suhu}°C | Lembab: ${kelembaban}% | Alert: ${alert || '-'}`);

    res.status(201).json({ status: "ok", message: "Data tersimpan di DB" });
  
  } catch (error) {
    console.error("Gagal simpan:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getSensorHistory = async (req, res) => {
  try {
    // 1. Ambil 20 data terakhir (biar grafik tidak berat)
    const data = await SensorLog.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']] // Urutkan dari yang paling baru
    });

    // 2. Balik urutannya (Reverse)
    // Supaya di grafik muncul dari Kiri (Lama) -> Kanan (Baru)
    const formattedData = data.reverse();

    res.json({
      status: "success",
      data: formattedData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};