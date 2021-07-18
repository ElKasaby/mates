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
    if (index !== undefined) {
      await User.updateOne(
        { _id: req.user.id },
        { $pull: {
          pushTokens: {
            deviceToken: token 
          }
        }
      })
      return res.status(200).json({
        msg:"device token delete succeeded!",
        user
      });
      // user.pushTokens.splice(index, 1);
      // await user.save();
    }
  }

  return res.status(401).json({
    msg:"Error device token here",
    user
  });
};
