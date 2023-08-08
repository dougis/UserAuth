const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

// this ONLY creates a user, all validation must be performed before calling this method
exports.createUser = (data) => {
  const { errors, isValid } = validateUserSignup(data);
  if (!isValid) {
    return {
      errors,
      isValid,
      null,
    };
  }  
  let createErrors = {};

  var newUser = new User({
    loginId: data.loginId,
    fullName: data.fullName,
    email: data.email,
    password: hashUserPassword(data.password),
  });
  newUser.save().catch((err) => createErrors.creation = err;);
    return {
    createErrors,
    isValid: isEmpty(createErrors),
    newUser,
  };
};

exports.confirmUserLogin = (data) => {
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

// assumes all auth done and uses the passed in user to log in and set the JWT token
exports.createLoginTokenAndLogin = (user) => {
  let access_token = createJWT(user.loginId, user._id, 3600);
  jwt
    .verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(500).json({ errors: err });
      }
      if (decoded) {
        return res.status(200).json({
          success: true,
          token: access_token,
          message: user,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ errors: err });
    });
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
