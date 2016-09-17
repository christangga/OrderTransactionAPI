var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PaymentSchema = new Schema({
  order: {
    type: ObjectId,
    ref: 'Order'
  },
  proof: String
});

module.exports = mongoose.model('Payment', PaymentSchema);
