const express = require('express');
const { protect } = require('../middleware/auth');
const {
  depositFunds,
  createCampaign,
  getAdvertiserCampaigns,
  getAdvertiserSubmissions,
  verifySubmission
} = require('../controllers/advertiserController');

const router = express.Router();

router.use(protect);

router.post('/deposit', depositFunds);
router.post('/campaigns', createCampaign);
router.get('/campaigns', getAdvertiserCampaigns);
router.get('/submissions', getAdvertiserSubmissions);
router.post('/submissions/verify', verifySubmission);

module.exports = router;
