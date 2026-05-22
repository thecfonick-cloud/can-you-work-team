const express = require('express');
const { 
  createTask, 
  editTask, 
  reviewTaskSubmission, 
  reviewWithdrawal, 
  suspendUser, 
  createBonus, 
  getAnalytics 
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

module.exports = router;
