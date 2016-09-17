var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var couponSchema = new Schema({
  id: ObjectId,
  code: {
    type: String,
    unique: true
  },
  valid_from: Date,
  valid_until: Date,
  quantity: {
    type: Number,
    min: 0
  },
  type: {
    type: String,
    enum: ['percentage', 'nominal']
  },
  amount: Number
}, {
  toJSON: {
    transform: function(doc, ret, options) {
      delete ret.valid_from;
      delete ret.valid_until;
      delete ret.quantity;

      return ret;
    }
  }
});

couponSchema.statics.validate = function(code, cb) {
  Coupon.findOne({
    code: code
  }, function(err, coupon) {
    if (!coupon || coupon.valid_from > new Date() || coupon.valid_until < new Date() || coupon.quantity == 0) {
      cb('Invalid coupon');
    } else {
      cb(null, coupon);
    }
  });
}

couponSchema.statics.invalidate = function(code, cb) {
  Coupon.findOne({
    code: code
  }, function(err, coupon) {
    if (!coupon || coupon.valid_from > new Date() || coupon.valid_until < new Date() || coupon.quantity == 0) {
      cb('Invalid coupon');
    } else {
      coupon.quantity--;
      coupon.save(function(err, updatedCoupon) { // err can be ignored
        cb(null, updatedCoupon);
      });
    }
  });
}

var Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
