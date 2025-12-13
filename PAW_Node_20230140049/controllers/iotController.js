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