require("dotenv-safe").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isEmpty = require("is-empty");
const User = require("../models/User");
const validation = require("../utils/validation");

module.exports = { createUser, confirmUserLogin, createLoginTokenAndLogin };

async function createUser(data) {
  var newUser = null;

  const { errors, isValid } = await validation.validateUserSignup(data);
  if (!isValid) {
    return {
      errors,
      isValid,
      newUser,
    };
  }
  let createErrors = {};

  newUser = new User({
    loginId: data.loginId,
    fullName: data.fullName,
    email: data.email,
    password: hashUserPassword(data.password),
  });
  await newUser.save().catch((err) => (createErrors.creation = err));
  return {
    createErrors,
    isValid: isEmpty(createErrors),
    newUser,
  };
}

async function confirmUserLogin(data) {
  var user = null;
  const { errors, isValid } = validation.validateLoginInput(data);
  if (!isValid) {
    return {
      errors,
      isValid,
      user,
    };
  }
  const foundUser = await validation.loginIdInUse(data.loginId);
  if (foundUser) {
    user = foundUser;
  }
  // if either the user doesn't exist OR the password doesn't match, return an error
  let authErrors = {};
  if (!user || !confirmUserPassword(user, data.password)) {
    authErrors.credentials = "Invalid login credentials";
  }
  return {
    authErrors,
    isValid: isEmpty(authErrors),
    user,
  };
}

// assumes all auth done and uses the passed in user to log in and set the JWT token
function createLoginTokenAndLogin(user) {
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
}

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
  let hashValue;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newPasswordString, salt, (err, hash) => {
      if (err) {
        throw err;
      } else {
        hashValue = hash;
      }
    });
  });
  return hashValue;
};

confirmUserPassword = (user, suppliedPassword) => {
  return bcrypt.compare(suppliedPassword, user.password);
};
