const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,  // transaction IDs should be unique
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  status: { 
    type:String, 
    enum: ['pending', 'completed'], 
    default: 'pending' },

}, { timestamps: true });

const OrderModel = mongoose.model("orders", OrderSchema);
module.exports = OrderModel;
