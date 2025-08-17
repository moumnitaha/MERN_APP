const User = require("../models/User");

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "_id firstName lastName email avatar hobbies refreshToken createdAt updatedAt"
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send("Error getting user");
  }
};
