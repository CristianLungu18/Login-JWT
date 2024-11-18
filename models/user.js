const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  refreshTokens: {
    type: [String],
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
