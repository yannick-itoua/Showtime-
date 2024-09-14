//user.route
var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authentication.middleware');

router.get('/me', authMiddleware.validToken, userController.me);
router.put('/me', authMiddleware.validToken, userController.update );
router.put('/borrow/:itemId',authMiddleware.validToken, userController.borrowItem);
router.put('/release/:itemId',authMiddleware.validToken,userController.releaseItem);

module.exports = router;

