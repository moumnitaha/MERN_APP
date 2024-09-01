const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const newUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      hobbies: user.hobbies,
      refreshToken: user.refreshToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return res.status(200).send(newUser);
  } catch (err) {
    return res.status(500).send("Error getting user");
  }
};
