const mongoose = require("mongoose");

// Define Schemes
const kafkaItemSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    item: { type: String },
    kind: { type: String },
    weight: { type: Number },
    row: { type: Number },
    col: { type: Number },
    ratio: { type: Number },
    hardness: { type: Number },
    brix: { type: Number },
    acidity: { type: Number },
    color: { type: Number },
    grade: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
module.exports = mongoose.model("KafkaItem", kafkaItemSchema);
