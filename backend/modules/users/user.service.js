const fs = require("fs");
const path = require("path");
const colors = require("colors");
const User = require("./user.model");

async function getUsers(excludeUserId = null) {
  const query = excludeUserId ? { _id: { $ne: excludeUserId } } : {};
  return User.find(query).select(
    "_id firstName lastName email avatar createdAt updatedAt friends cart"
  );
}

const bcrypt = require("bcrypt");

async function updateUserInfo(userId, firstName, lastName) {
  const user = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName },
    { new: true }
  );
  if (!user) throw new Error("User not found");
  return user;
}

async function changePassword(userId, oldPassword, newPassword) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Invalid password");
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return { message: "Password changed successfully" };
}

async function uploadAvatar(userId, avatar) {
  if (!avatar) throw new Error("No avatar provided");
  try {
    const base64Data = avatar.replace(
      /^data:image\/(png|jpg|jpeg);base64,/,
      ""
    );
    const imageType = avatar.match(/^data:image\/(png|jpg|jpeg);base64,/)[1];
    const fileName = `${userId}_${Date.now()}_avatar.${imageType}`;
    const avatarsFolder = path.join(__dirname, "../../uploads/avatars");
    const avatarPath = path.join(avatarsFolder, userId.toString());
    const filePath = path.join(avatarPath, fileName);
    if (!fs.existsSync(avatarPath)) {
      fs.mkdirSync(avatarPath, { recursive: true });
    }
    //delete previous avatars
    fs.readdirSync(avatarPath).forEach((file) => {
      if (file.includes(userId)) {
        fs.unlinkSync(path.join(avatarPath, file));
      }
    });
    fs.writeFileSync(filePath, base64Data, "base64");
    await User.findByIdAndUpdate(
      userId,
      {
        avatar: `/uploads/avatars/${userId}/${fileName}`,
      },
      { new: true }
    );
    return { newAvatar: `/uploads/avatars/${userId}/${fileName}` };
  } catch (error) {
    throw new Error("Error uploading avatar");
  }
}

module.exports = {
  getUsers,
  updateUserInfo,
  changePassword,
  uploadAvatar,
};
