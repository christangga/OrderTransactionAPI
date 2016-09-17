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
});

module.exports = mongoose.model('Shipping', ShippingSchema);
