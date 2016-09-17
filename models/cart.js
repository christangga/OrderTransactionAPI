var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var cartSchema = new Schema({
  sid: {
    type: String,
    unique: true
  },
  items: [{
    product: {
      type: ObjectId,
      ref: 'Product'
    },
    quantity: Number
  }],
  coupon: {
    type: ObjectId,
    ref: 'Coupon'
  },
  valid_until: Date
}, {
  toJSON: {
    transform: function(doc, ret, options) {
      delete ret._id;
      delete ret.__v;
      delete ret.sid;
      delete ret.valid_until;

      return ret;
    }
  }
});

cartSchema.statics.findOrCreate = function(findClause, createClause, cb) {
  Cart.findOne(findClause, function(err, cart) {
    var isCreated = false;
    if (!cart) {
      isCreated = true;
      var newCart = new Cart(createClause);

      newCart.save(function(err, updatedCart) {
        cb(err, updatedCart, isCreated);
      });
    } else {
      cb(null, cart, isCreated);
    }
  });
}

var Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
