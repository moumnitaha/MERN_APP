const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports =
  mongoose.models.BlacklistedToken ||
  mongoose.model("BlacklistedToken", blacklistedTokenSchema);
