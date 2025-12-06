const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path'); // Wajib ada

const app = express();
const PORT = 3001;

const presensiRoutes = require("./routes/presensi");
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// PENTING: Buka akses ke folder uploads agar foto bisa dilihat
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/attendance", presensiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});