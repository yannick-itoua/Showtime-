var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
// import controller for index
const shareController = require('../controllers/showtime.controller');

router.get('/admin',authMiddleware.validToken, shareController.sendAdminHTMLfile);
router.get('/',authMiddleware.validToken, shareController.sendUserHTMLfile);


module.exports = router;
