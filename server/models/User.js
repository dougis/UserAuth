require("dotenv-safe").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  loginId: {
    type: String,
    required: true,
    minLength: process.env.USER_ID_MIN_LENGTH,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: process.env.PASSWORD_MIN_LENGTH,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = User = mongoose.model("users", UserSchema);
