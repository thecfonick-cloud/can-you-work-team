const express = require('express');
const { getTasks, getTaskById, submitTaskProof, getMyTasks, getLuckyTasks, completeLuckyTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const upload = require('../config/cloudinary');
const router = express.Router();

router.get('/', protect, getTasks);
router.get('/my-logs', protect, getMyTasks);
router.get('/lucky-tasks', protect, getLuckyTasks);
router.post('/lucky-tasks/:id/complete', protect, completeLuckyTask);
router.get('/:id', protect, getTaskById);
router.post('/:id/submit', protect, upload.single('proofImage'), submitTaskProof);

module.exports = router;
