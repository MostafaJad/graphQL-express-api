const mongoose = require("mongoose");
const SChema = mongoose.Schema;

const beeSchema = new SChema({
  beeId: { type: String },
  businessPhone: String,
  businessName: String,
  businessDescription: String,
  rating: String,
  verified: Boolean,
  membershipType: String,
});

module.exports = mongoose.model("Bee", beeSchema);
