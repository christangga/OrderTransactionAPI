var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ShippingSchema = new Schema({
  tracking: String,
  contact: {
    name: String,
    email: String,
    address: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'received', 'done']
  }
}, {
  toJSON: {
    transform: function(doc, ret, options) {
      delete ret._id;
      delete ret.__v;

      return ret;
    }
  }
});

module.exports = mongoose.model('Shipping', ShippingSchema);
