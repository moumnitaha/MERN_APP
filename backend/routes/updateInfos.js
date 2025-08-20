const User = require("../modules/users/user.model");

exports.updateInfos = async (req, res) => {
  const { firstName, lastName } = req.body;
  console.log("firstName", firstName);
  console.log("lastName", lastName);
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName },
      { new: true }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send("Error updating user");
  }
};
