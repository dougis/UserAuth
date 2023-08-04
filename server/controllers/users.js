const User = require("../models/User");
const { validateUserSignup } = require("../utils/validation");
exports.signup = (req, res, next) => {
  const { errors, isValid } = validateUserSignup(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //     const user = new User({
  //       loginId: loginId,
  //       fullName: fullName,
  //       email: email,
  //       password: password,
  //     });
  //     bcrypt.genSalt(10, function (err, salt) {
  //       bcrypt.hash(password, salt, function (err, hash) {
  //         if (err) throw err;
  //         user.password = hash;
  //         user
  //           .save()
  //           .then((response) => {
  //             res.status(200).json({
  //               success: true,
  //               result: response,
  //             });
  //           })
  //           .catch((err) => {
  //             res.status(500).json({
  //               errors: [{ error: err }],
  //             });
  //           });
  //       });
  //     });
  //   }
  // })
  // .catch((err) => {
  //   res.status(500).json({
  //     errors: [{ error: "Something went wrong" }],
  //   });
  // });
};

exports.signin = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  let { loginId, password } = req.body;
  User.findOne({ loginId: loginId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          errors: [{ login: "invalid" }],
        });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(400).json({ errors: [{ login: "invalid" }] });
            }
            let access_token = createJWT(user.loginId, user._id, 3600);
            jwt.verify(
              access_token,
              process.env.TOKEN_SECRET,
              (err, decoded) => {
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
              }
            );
          })
          .catch((err) => {
            res.status(500).json({ errors: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ errors: err });
    });
};
