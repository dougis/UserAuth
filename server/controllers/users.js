const userAuth = require("../utils/user_auth");

module.exports = { signup, signin };

signup = (req, res, next) => {
  const { errors, isValid, user } = userAuth.createUser(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // if we get here then the registration worked, sign them in
  userAuth.createLoginTokenAndLogin(user);
};

signin = (req, res) => {
  const { errors, isValid, user } = userAuth.confirmUserLogin(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // if we get here we have a valid login
  userAuth.createLoginTokenAndLogin(user);
};
