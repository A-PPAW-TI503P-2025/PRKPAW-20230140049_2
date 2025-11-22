const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
// Pastikan path-nya benar '../middleware/permissionMiddleware'
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');


// Baris yang error tadi
router.get('/daily', authenticateToken, isAdmin, reportController.getDailyReport);

module.exports = router;