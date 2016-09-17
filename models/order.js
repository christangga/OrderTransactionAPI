var mongoose = require('mongoose');
var async = require('async');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var orderSchema = new Schema({
  items: Array,
  coupon: Object,
  shipping: {
    type: ObjectId,
    ref: 'Shipping'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'verified', 'cancelled', 'shipped']
  },
  created_at: Date
}, {
  toJSON: {
    transform: function(doc, ret, options) {
      delete ret.__v;

      return ret;
    }
  }
});

orderSchema.statics.validate = function(items, cb) {
  async.each(items, function(item, cb) {
    if (item.product.quantity < item.quantity) {
      cb('Insufficient product quantity');
    } else {
      cb(null);
    }
  }, function(err) {
    cb(err);
  });
}

orderSchema.statics.invalidate = function(items, cb) {
  async.each(items, function(item, cb) {
    if (item.product.quantity < item.quantity) {
      cb('Insufficient product quantity');
    } else {
      item.product.quantity -= item.quantity;
      item.product.save(function(err, updatedProduct) {
        cb(null);
      });
    }
  }, function(err, updatedCart) {
    cb(err);
  });
}

module.exports = mongoose.model('Order', orderSchema);
