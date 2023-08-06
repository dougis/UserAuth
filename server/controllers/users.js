const User = require("../models/User");
const { validateUserSignup } = require("../utils/validation");
exports.signup = (req, res, next) => {
  const { errors, isValid } = validateUserSignup(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  
};

exports.signin = (req, res) => {
  const { errors, isValid } = userLogin(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
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
