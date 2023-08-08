const User = require("../models/User");
const { createUser } = require("../utils/user_auth");
const { confirmUserLogin } = require("../utils/user_auth");
const { createLoginTokenAndLogin } = require("../utils/user_auth");

exports.signup = (req, res, next) => {
  const { errors, isValid, user } = createUser(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // if we get here then the registration worked, sign them in
  createLoginTokenAndLogin(user);
};

exports.signin = (req, res) => {
  const { errors, isValid, user } = confirmUserLogin(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // if we get here we have a valid login
  createLoginTokenAndLogin(user);
};
