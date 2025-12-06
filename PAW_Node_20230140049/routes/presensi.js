const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/permissionMiddleware');

// 1. Cek Token -> 2. Upload Foto -> 3. Simpan Data
router.post('/check-in', 
  authenticateToken, 
  presensiController.upload.single('image'), // <-- WAJIB ADA
  presensiController.CheckIn
);

router.post('/check-out', authenticateToken, presensiController.CheckOut);
router.delete('/:id', authenticateToken, presensiController.deletePresensi);

module.exports = router;