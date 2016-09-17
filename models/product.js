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
});

module.exports = mongoose.model('Product', ProductSchema);
