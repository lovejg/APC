const mongoose = require("mongoose");

// Define Schemes
const counselSchema = new mongoose.Schema(
  {
    counsel_id: { type: String },
    counsel_item: { type: String },
    counsel_title: { type: String },
    counsel_content: { type: String },
    counsel_answer: {type: String, default: 'no Answer'},
    counsel_check: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
module.exports = mongoose.model("Counsel", counselSchema);
