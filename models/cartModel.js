const mongoose = require('mongoose');

// Cart Schema
const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
});

module.exports = mongoose.model('Cart', cartSchema);
