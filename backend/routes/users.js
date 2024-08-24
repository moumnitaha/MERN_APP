const User = require("../models/user");

exports.users = async (req, res) => {
  const users = await User.find({
    _id: { $ne: req.user.userId },
  });
  const newUsers = users.map((user) => {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isFriend: user.friends.includes(req.user.userId),
    };
  });
  res.send(newUsers);
};
