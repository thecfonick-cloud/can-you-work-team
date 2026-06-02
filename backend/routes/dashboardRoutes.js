const express = require('express');
const { getDashboardOverview, getGlobalStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/overview', protect, getDashboardOverview);
router.get('/global-stats', getGlobalStats);

module.exports = router;

