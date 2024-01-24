const mongoose = require("mongoose");

// Define Schemes
const storageSchema = new mongoose.Schema(
  {
    zone_number: { type: Number },
    sector: [
      new mongoose.Schema(
        {
          sector_number: { type: Number, default: 0 },
          grade: { type: String },
          pallet: [
            new mongoose.Schema(
              {
                item: { type: String },
                quantity: { type: Number },
              },
              { _id: false, timestamps: true }
            ),
          ],
        },
        { _id: false, timestamps: true }
      ),
    ],
    import_date_time: { type: Date, default: Date.now },
    export_date_time: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
module.exports = mongoose.model("Storage", storageSchema);
