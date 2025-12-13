const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');

// Endpoint: POST /api/iot/ping
router.post('/ping', iotController.testConnection);

module.exports = router;