var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductSchema = new Schema({
  id: ObjectId,
  name: String,
  description: String,
  quantity: {
    type: Number,
    min: 0
  },
  price: Number
}, {
  toJSON: {
    transform: function(doc, ret, options) {
      delete ret.quantity;

      return ret;
    }
  }
});

module.exports = mongoose.model('Product', ProductSchema);
