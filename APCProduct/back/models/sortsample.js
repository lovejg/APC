/*const mongoose = require("mongoose");

// Define Schemes
const sortsampleSchema = new mongoose.Schema(
  {
    importnumber: { type: String,},
    importdate: { type: String },
    usercode: { type: String },
    name: { type: String },
    address: { type: String },
    phonenumber: { type: String },
    kind: { type: String },
    importbox: { type: String },
    note: { type: String },
    GAP: { type: String },
    GAPinfo: { type: String },
    settlementdate: { type: String },
    grade: { type: String },
    product: { type: String },
    KG: { type: String },
    quantity: { type: String },
    price: { type: String },

   
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
module.exports = mongoose.model("Sort", sortsampleSchema);*/
const mongoose = require("mongoose");

// 이전에 이미 생성된 'sortsample' 컬렉션과 연결
const sortsampleSchema = new mongoose.Schema({}, { collection: 'sortsample' });

module.exports = mongoose.model("Sort", sortsampleSchema);
