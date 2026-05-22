const express = require('express');
const { getDashboardOverview } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/overview', protect, getDashboardOverview);

module.exports = router;
