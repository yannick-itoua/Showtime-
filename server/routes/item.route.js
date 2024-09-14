//item.route
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const itemController = require('../controllers/item.controller');

router.get('/',authMiddleware.validToken, itemController.allitems);
router.get('/:itemId', authMiddleware.validToken, itemController.getItem);
router.post('/',authMiddleware.validToken, itemController.createitems);
router.delete('/:id',authMiddleware.validToken,itemController.deleteitems);
router.put('/update/:itemId',authMiddleware.validToken, itemController.updateItemDescription);

module.exports = router;
