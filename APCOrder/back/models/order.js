const mongoose = require("mongoose");

// Define Schemes
const orderSchema = new mongoose.Schema(
  {
    order_id: { type: String },
    order_number: { type: String },
    order_product_number: { type: String },
    order_item: { type: String },
    order_quantity: { type: Number },
    order_price: { type: Number },
    order_status: { type: Number },
    order_shipped: {
      type: Boolean,
      default: false,
    },
    order_request_cancel: {
      type: Boolean,
      default: false,
    },
    order_others: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
module.exports = mongoose.model("Order", orderSchema);
