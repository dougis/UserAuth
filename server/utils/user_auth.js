const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

// this ONLY creates a user, all validation must be performed before calling this method
exports.createUser = (data) => {
  var newUser = new User({
    loginId: data.loginId,
    fullName: data.fullName,
    email: data.email,
    password: hashUserPassword(data.password),
  });
  newUser.save().catch((err) => console.log(err));
  return newUser;
};

exports.userLogin = (data) => {
  const { errors, isValid } = validateLoginInput(data);
  if (!isValid) {
    return {
      errors,
      isValid,
      null,
    };
  }
  const user = loginIdInUse(data.loginId);
  // if either the user doesn't exist OR the password doesn't match, return an error
  let authErrors = {};
  if (!user || !validateUserPassword(user, data.password)) {
    authErrors.credentials = "Invalid login credentials";
  }
  return {
    authErrors,
    isValid: isEmpty(authErrors),
    user,
  };
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

// for use within this class only, generates and saves a salt value as well as the hashed password
hashUserPassword = (newPasswordString) => {
  // Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newPasswordString, salt, (err, hash) => {
      if (err) throw err;
    });
  });
  return hash;
};

validateUserPassword = (user, suppliedPassword) => {
  return bcrypt.compare(suppliedPassword, user.password);
};
