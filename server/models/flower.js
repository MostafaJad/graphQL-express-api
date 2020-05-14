const mongoose = require("mongoose");
const SChema = mongoose.Schema;

const flowerSchema = new SChema({
  flowerId: String,
  phone: String,
  inviteCode: String,
});

module.exports = mongoose.model("Flower", flowerSchema);
