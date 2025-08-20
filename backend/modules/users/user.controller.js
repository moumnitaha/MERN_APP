const userService = require("./user.service");

exports.uploadAvatar = async (req, res) => {
  try {
    const result = await userService.uploadAvatar(
      req.user.userId,
      req.newFileName
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error.message || "Error uploading avatar");
  }
};

exports.getUsers = async (req, res) => {
  const { me } = req.query;
  const excludeUserId =
    me && me === "false" && req.user ? req.user.userId : null;
  try {
    const users = await userService.getUsers(excludeUserId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInfos = async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const user = await userService.updateUserInfo(
      req.user.userId,
      firstName,
      lastName
    );
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err.message || "Error updating user");
  }
};

exports.changePass = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const result = await userService.changePassword(
      req.user.userId,
      oldPassword,
      newPassword
    );
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};
