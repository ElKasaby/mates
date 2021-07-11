const _ = require("lodash");
const User = require('../../models/user')

module.exports = async (req, res) => {
  const user = req.user;

  const token = req.body.token;
  if (token) {
    const index = _.findKey(
      user.pushTokens,
      _.matchesProperty("deviceToken", token)
    );
    if (index === undefined) {
      
      await User.updateOne(
        { _id: req.user.id },
        {
          $push: {
            pushTokens: {
              deviceType: req.body.deviceType,
              deviceToken: token
            },
          },
        }
      );
      return res.status(200).json({
        msg:"device token push succeeded!",
        user
      });

      
      // user.pushTokens.push({
      //   deviceType: req.body.deviceType,
      //   deviceToken: token,
      // });
    }
  }

  // await user.save();
  return res.status(200).json({
    msg:"this token was pushed",
    user
  })
};
