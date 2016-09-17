var async = require('async');

var Cart = require('../models/cart');
var Coupon = require('../models/coupon');
var Order = require('../models/order');
var Payment = require('../models/payment');
var Product = require('../models/product');
var Shipping = require('../models/shipping');

var OrderController = function() {}

OrderController.prototype.getCart = function(req, res) {
  console.log('sid', req.session.id);
  Cart.findOne({
    sid: req.session.id
  }).populate('items.product coupon').exec(function(err, cart) {
    if (!cart) {
      res.status(204).end();
    } else {
      res.status(200).json({
        'cart': cart
      });
    }
  });
}

// check if cart qty > database qty
// check if 
OrderController.prototype.addToCart = function(req, res) {
  Product.findById(req.body.product_id, function(err, product) {
    if (!product || !req.body.product_quantity) {
      res.status(400).json('Invalid product');
    } else if (product.quantity < req.body.product_quantity) {
      res.status(400).json('Insufficient product quantity');
    } else {
      Cart.findOne({
        sid: req.session.id
      }, function(err, cart) {
        if (!cart) { // create new cart
          if (req.body.product_quantity < 0) {
            res.status(400).json('Invalid product quantity');
          } else {
            var cart = new Cart({
              sid: req.session.id,
              items: [{
                product: req.body.product_id,
                quantity: req.body.product_quantity
              }],
              valid_until: req.session.expires
            });

            cart.save(function(err) {
              res.status(201).end();
            });
          }
        } else { // update cart
          var itemIndex = -1;
          cart.items.forEach(function(item, i) {
            if (item.product == req.body.product_id) {
              itemIndex = i;
            }
          });

          if (itemIndex < 0 && req.body.product_quantity <= 0) {
            res.status(400).json('Invalid product quantity');
          } else {
            if (itemIndex < 0 && req.body.product_quantity > 0) {
              cart.items.push({
                product: req.body.product_id,
                quantity: req.body.product_quantity
              });
            } else if (itemIndex >= 0 && cart.items[itemIndex].quantity + req.body.product_quantity <= 0) {
              cart.items.splice(itemIndex, 1);
            } else {
              cart.items[itemIndex].quantity += req.body.product_quantity;
            }

            cart.save(function(err, updatedCart) { // err can be ignored
              res.status(200).end();
            });
          }
        }
      });
    }
  });
}

OrderController.prototype.addCoupon = function(req, res) {
  Coupon.validate(req.body.coupon_code, function(err, coupon) {
    if (err) {
      res.status(400).json(err);
    } else {
      Cart.findOrCreate({
        sid: req.session.id
      }, {
        coupon: coupon,
        valid_until: req.session.expires
      }, function(err, cart, created) {
        if (!cart) {
          res.status(400).json('Unknown error');
        } else {
          if (!created) {
            cart.coupon = coupon;
            cart.save(function(err, updatedCart) { // err can be ignored
              res.status(200).end();
            });
          } else {
            res.status(201).end();
          }
        }
      });
    }
  });
}

OrderController.prototype.order = function(req, res) {
  if (!req.body.name || !req.body.email || !req.body.address || !req.body.phone) {
    res.status(400).json('Invalid contact');
  } else {
    Cart.findOne({
      sid: req.session.id
    }).populate('items.product coupon').exec(function(err, cart) {
      if (!cart || !cart.items.length) {
        res.status(400).json('Invalid cart');
      } else {
        async.series([
          function(cb) { // validate coupon
            if (cart.coupon) {
              Coupon.validate(cart.coupon.code, function(err) {
                cb(err);
              });
            } else {
              cb(null);
            }
          },
          function(cb) { // validate order
            Order.validate(cart.items, function(err) {
              cb(err);
            });
          }
        ], function(err) {
          if (err) {
            res.status(400).json(err);
          } else {
            async.series([
              function(cb) { // invalidate coupon
                if (cart.coupon) {
                  Coupon.invalidate(cart.coupon, function(err, coupon) {
                    cb(err, coupon);
                  });
                } else {
                  cb(null);
                }
              },
              function(cb) { // invalidate order
                Order.invalidate(cart.items, function(err) {
                  cb(err);
                });
              }
            ], function(err, result) {
              var shipping = new Shipping({
                contact: req.body,
                status: 'pending'
              });

              shipping.save(function(err, updatedShipping) {
                var order = new Order({
                  items: cart.items,
                  coupon: result[0],
                  shipping: updatedShipping._id,
                  status: 'pending',
                  created_at: new Date()
                });

                order.save(function(err, updatedOrder) {
                  Cart.remove({
                    sid: req.session.id
                  }, function(err) {
                    req.session.destroy(function(err) {
                      res.status(201).json({
                        order_id: updatedOrder._id
                      });
                    });
                  });
                });
              });
            });
          }
        });
      }
    });
  }
}

OrderController.prototype.pay = function(req, res) {
  Order.findById(req.body.order_id, function(err, order) {
    if (!order) {
      res.status(400).json('Invalid order');
    } else {
      var payment = new Payment({
        order: order._id,
        proof: req.file.filename
      });

      payment.save(function(err) {
        order.status = 'paid';
        order.save(function(err, updatedOrder) {
          res.status(201).end();
        });
      });
    }
  });
}

OrderController.prototype.checkStatus = function(req, res) {
  Order.findById(req.params.order_id, function(err, order) {
    if (!order) {
      res.status(400).json('Invalid order');
    } else {
      res.status(200).json({
        status: order.status
      });
    }
  });
}

OrderController.prototype.shippingStatus = function(req, res) {
  Shipping.findOne({
    tracking: req.params.shipping_id
  }, function(err, shipping) {
    if (!shipping) {
      res.status(400).json('Invalid shipping');
    } else {
      res.status(200).json({
        status: shipping.status
      });
    }
  });
}

module.exports = new OrderController();
