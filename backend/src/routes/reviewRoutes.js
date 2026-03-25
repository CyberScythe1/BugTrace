const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const { analyze, getUserReviews, getReviewById } = require('../controllers/reviewController');

router.post('/analyze', authMiddleware, analyze);
router.get('/', authMiddleware, getUserReviews);
router.get('/:id', authMiddleware, getReviewById);

module.exports = router;
