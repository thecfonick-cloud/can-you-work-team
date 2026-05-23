const express = require('express');
const { 
  createTask, 
  editTask, 
  reviewTaskSubmission, 
  reviewWithdrawal, 
  suspendUser, 
  createBonus, 
  getAnalytics,
  getPendingDeposits,
  approveDeposit,
  rejectDeposit,
  getAllUsers,
  updateUserBalance,
  getAllCampaigns,
  updateCampaignStatus,
  getAllSubmissions,
  getAllWithdrawals
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Apply admin protection to all routes
router.use(protect, isAdmin);

router.post('/task/create', createTask);
router.post('/task/edit/:id', editTask);
router.post('/task/review', reviewTaskSubmission);
router.post('/withdraw/approve', reviewWithdrawal);
router.post('/user/suspend', suspendUser);
router.post('/bonus/create', createBonus);
router.get('/analytics', getAnalytics);

// Deposit routes
router.get('/deposits', getPendingDeposits);
router.post('/deposits/approve', approveDeposit);
router.post('/deposits/reject', rejectDeposit);

// User override routes
router.get('/users', getAllUsers);
router.post('/users/update-balance', updateUserBalance);

// Campaign management routes
router.get('/campaigns', getAllCampaigns);
router.post('/campaigns/status', updateCampaignStatus);

// Submissions & Withdrawals overview routes
router.get('/submissions', getAllSubmissions);
router.get('/withdrawals', getAllWithdrawals);

module.exports = router;
