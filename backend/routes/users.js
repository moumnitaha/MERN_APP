const User = require("../models/user");

exports.users = async (req, res) => {
  const users = await User.find({
    _id: { $ne: req.user.userId },
  }).select({
    _id: 1,
    name: 1,
    avatar: 1,
    hobbies: 1,
    email: 1,
    createdAt: 1,
    updatedAt: 1,
    friends: 1,
  });
  res.send(users);
};
