var Order = require('../models/order');

var AdminController = function() {}

AdminController.prototype.getOrder = function(req, res) {
  var options = {};
  if (req.query.status) {
    options.status = req.query.status;
  }

  Order.find(options, function(err, orders) {
    if (!orders.length) {
      res.status(204).end();
    } else {
      res.status(200).json({
        orders: orders
      });
    }
  });
}

AdminController.prototype.getOrderDetail = function(req, res) {
  Order.findById(req.params.order_id, function(err, order) {
    if (!order) {
      res.status(400).json('Invalid order');
    } else {
      res.status(200).json(order);
    }
  });
}

AdminController.prototype.updateOrder = function(req, res) {
  Order.findById(req.body.order_id, function(err, order) {
    if (!order || ['pending', 'paid'].indexOf(order.status) < 0 || ['verify', 'cancel'].indexOf(req.body.scenario) < 0) {
      res.status(400).json('Invalid order');
    } else {
      if (req.body.scenario == 'verify') {
        order.status = 'verified';
      } else {
        order.status = 'cancelled';
      }

      order.save(function(err, updatedOrder) {
        res.status(200).end();
      });
    }
  });
}

AdminController.prototype.shipOrder = function(req, res) {
  Order.findById(req.body.order_id).populate('shipping').exec(function(err, order) {
    if (!order || order.status != 'verified') {
      res.status(400).json('Invalid order');
    } else {
      order.status = 'shipped';

      order.save(function(err, updatedOrder) {
        order.shipping.tracking = req.body.shipping_id;
        order.shipping.save(function(updatedShipping) {
          res.status(200).end();
        });
      });
    }
  });
}

module.exports = new AdminController();
