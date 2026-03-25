const router = require('express').Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getStats, getAllUsers, getAllReviews } = require('../controllers/adminController');

router.get('/stats', authMiddleware, adminMiddleware, getStats);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/reviews', authMiddleware, adminMiddleware, getAllReviews);

module.exports = router;
