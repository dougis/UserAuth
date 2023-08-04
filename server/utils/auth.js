const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

exports.createUser = (data) => {
  const { errors, isValid } = validateUserSignup(data);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // if we get here we have a valid payload, sign up the user
};

exports.userLogin = (data) => {
  const { errors, isValid } = validateUserSignup(data);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // if we get here we have a valid payload, sign up the user
};
// for use within this class only, abstracted away by exposed methods
createJWT = (loginId, userId, duration) => {
  const payload = {
    loginId,
    userId,
    duration,
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: duration,
  });
};
