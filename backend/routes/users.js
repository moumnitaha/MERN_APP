const User = require("../models/User");

exports.users = async (req, res) => {
  const { me } = req.query;
  console.log("me", typeof me);
  const users = await User.find({
    _id: { $ne: me && me === "false" ? req.user.userId : null },
  });
  const newUsers = users.map((user) => {
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isFriend: user.friends.includes(req.user.userId),
      cart: user.cart,
    };
  });
  res.send(newUsers);
};
