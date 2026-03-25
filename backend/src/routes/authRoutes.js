const router = require('express').Router();
const { googleLogin } = require('../controllers/authController');
router.post('/google', googleLogin);
module.exports = router;
