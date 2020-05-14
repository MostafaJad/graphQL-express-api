const mongoose = require("mongoose");
const SChema = mongoose.Schema;

const accountSchema = new SChema({
  flowerId: String,
  firstName: String,
  lastName: String,
  email: String,
  beeId: String,
});

module.exports = mongoose.model("Account", accountSchema);
