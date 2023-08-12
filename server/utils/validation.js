const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = {
  validateUserSignup,
  validateLoginInput,
  loginIdInUse,
  emailInUse,
};

validateUserSignup = (data) => {
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
      min: process.env.USER_ID_MIN_LENGTH,
      max: 100,
    })
  ) {
    errors.loginId =
      "Login ID is required and must be " +
      process.env.USER_ID_MIN_LENGTH +
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
      min: process.env.PASSWORD_MIN_LENGTH,
      max: 100,
    })
  ) {
    errors.password =
      "Password field is required and must be " +
      process.env.PASSWORD_MIN_LENGTH +
      " or more characters";
  }
  if (!Validator.equals(data.password, data.passwordVerification)) {
    errors.passwordVerification = "Passwords do not match";
  }
  // only hit the DB if we have clean input so far
  if (isEmpty(errors)) {
    if (this.loginIdInUse(data.loginId)) {
      errors.loginId = "Login ID is already in use";
    }
    if (this.emailInUse(data.email)) {
      errors.loginId = "Email address is already in use";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

validateLoginInput = (data) => {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.loginId = !isEmpty(data.loginId) ? data.loginId : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  // Email checks
  if (Validator.isEmpty(data.loginId)) {
    errors.email = "Login ID is required";
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

loginIdInUse = (loginId) => {
  User.findOne({ loginId: loginId })
    .then((user) => {
      return user;
    })
    .catch((error) => {
      console.log("Error", error);
    });
};

emailInUse = (email) => {
  User.findOne({ email: email })
    .then((user) => {
      return user;
    })
    .catch((error) => {
      console.log("Error", error);
    });
};
