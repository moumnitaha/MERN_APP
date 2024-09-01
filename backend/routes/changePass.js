const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.changePass = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).send({ error: "Invalid password" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.status(201).send({ message: "Password changed successfully" });
};
