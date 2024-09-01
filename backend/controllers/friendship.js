const User = require("../models/User");

exports.friendship = async (req, res) => {
  try {
    const { userId } = req.body;
    const friend = await User.findById(userId);
    if (!friend) return res.status(404).send("User not found");
    const me = await User.findById(req.user.userId);
    if (!me) return res.status(404).send("Friend not found");
    if (me.friends.includes(userId)) {
      return res.status(400).send("Already friends");
    }
    me.friends.push(userId);
    friend.friends.push(req.user.userId);
    await friend.save();
    await me.save();
    res.status(200).send("Friendship created");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating friendship");
  }
};
