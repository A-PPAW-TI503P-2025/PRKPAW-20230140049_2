const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');

// GANTI INI: Hapus middleware dummy, pakai yang asli
const { authenticateToken } = require('../middleware/authMiddleware'); 

// Pasang Satpam Token di semua rute bawah ini
router.use(authenticateToken);

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.delete('/:id', presensiController.deletePresensi);

module.exports = router;