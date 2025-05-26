const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  name: { type: String, required: true },     // store name snapshot
  price: { type: Number, required: true },    // store price snapshot
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  sellerId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],  // array of cart items
  createdAt: { type: Date, default: Date.now }
});

const CartModel = mongoose.model("carts", cartSchema);
module.exports = CartModel;
