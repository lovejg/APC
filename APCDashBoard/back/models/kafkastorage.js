const mongoose = require("mongoose");

// Define Schemes
const kafkaStorageSchema = new mongoose.Schema(
  {
    zone_number: { type: Number },
    temp: { type: Number },
    humid: { type: Number },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
module.exports = mongoose.model("KafkaStorage", kafkaStorageSchema);
