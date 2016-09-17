var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({
  dest: 'uploads/'
});

var OrderController = require('./controllers/OrderController');
var AdminController = require('./controllers/AdminController');

router.get('/cart', OrderController.getCart);
router.post('/cart', OrderController.addToCart);
router.post('/cart/coupon', OrderController.addCoupon);
router.post('/order', OrderController.order);
router.post('/order/pay', upload.single('proof'), OrderController.pay);
router.get('/order/:order_id', OrderController.checkStatus);
router.get('/shipping/:shipping_id', OrderController.shippingStatus);

// router.post('/admin/auth', AdminController.auth);
router.get('/admin/order', AdminController.getOrder);
router.get('/admin/order/:order_id', AdminController.getOrderDetail);
router.post('/admin/order/update', AdminController.updateOrder);
router.post('/admin/order/ship', AdminController.shipOrder);

module.exports = router;
