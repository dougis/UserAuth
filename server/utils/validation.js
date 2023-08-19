const Validator = require("validator");
const isEmpty = require("is-empty");
// const userIdMinLength = process.env.USER_ID_MIN_LENGTH;
// const passwordMinLength = process.env.PASSWORD_MIN_LENGTH;
const userIdMinLength = 4;
const passwordMinLength = 8;

module.exports = {
  validateUserSignup,
  validateLoginInput,
  loginIdInUse,
  emailInUse,
  userIdMinLength,
  passwordMinLength,
};

function validateUserSignup(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.passwordVerification = !isEmpty(data.passwordVerification)
    ? data.passwordVerification
    : "";
  data.loginId = !isEmpty(data.loginId) ? data.loginId : "";
  data.fullName = !isEmpty(data.fullName) ? data.fullName : "";
  // login id
  if (
    Validator.isEmpty(data.loginId) ||
    !Validator.isLength(data.loginId, {
      min: userIdMinLength,
      max: 100,
    })
  ) {
    errors.loginId =
      "Login ID is required and must be " +
      userIdMinLength +
      " or more characters";
  }
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  // Password checks
  if (
    Validator.isEmpty(data.password) ||
    !Validator.isLength(data.password, {
      min: passwordMinLength,
      max: 100,
    })
  ) {
    errors.password =
      "Password field is required and must be " +
      passwordMinLength +
      " or more characters";
  } else if (!Validator.equals(data.password, data.passwordVerification)) {
    errors.passwordVerification = "Passwords do not match";
  }
  // only hit the DB if we have clean input so far
  if (isEmpty(errors)) {
    if (loginIdInUse(data.loginId)) {
      errors.loginId = "Login ID is already in use";
    }
    if (emailInUse(data.email)) {
      errors.loginId = "Email address is already in use";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function validateLoginInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.loginId = !isEmpty(data.loginId) ? data.loginId : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  // Email checks
  if (Validator.isEmpty(data.loginId)) {
    errors.loginId = "Login ID is required";
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function emailInUse(email) {
  User.findOne({ email: email })
    .then((user) => {
      return user;
    })
    .catch((error) => {
      console.log("Error", error);
    });
}

function loginIdInUse(loginId) {
  User.findOne({ loginId: loginId })
    .then((user) => {
      return user;
    })
    .catch((error) => {
      console.log("Error", error);
    });
}
