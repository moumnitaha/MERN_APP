const User = require("../models/User");

exports.users = async (req, res) => {
  const { me } = req.query;
  const users = await User.find({
    _id: { $ne: me && me === "false" ? req.user.userId : null },
  }).select(
    "_id firstName lastName email avatar createdAt updatedAt friends cart"
  );
  res.send(users);
};
