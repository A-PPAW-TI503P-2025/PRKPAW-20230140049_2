const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = 3001;

// Import Rute
const presensiRoutes = require("./routes/presensi");
const authRoutes = require('./routes/auth'); // <-- Tambahan 1: Import Auth
const reportRoutes = require('./routes/reports');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Pasang Rute
app.use("/api/attendance", presensiRoutes);
app.use('/api/auth', authRoutes); // <-- Tambahan 2: Endpoint Auth
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});