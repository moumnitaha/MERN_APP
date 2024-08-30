const express = require("express");
const colors = require("colors");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");

exports.upload_avatar = async (req, res) => {
  const avatar = req.body.avatar;
  if (!avatar) return res.status(500).send("sir lhih");
  try {
    const base64Data = avatar.replace(
      /^data:image\/(png|jpg|jpeg);base64,/,
      ""
    );
    const imageType = avatar.match(/^data:image\/(png|jpg|jpeg);base64,/)[1];
    const fileName = `${req.user.userId}_${Date.now()}_avatar.${imageType}`;
    const avatarsFolder = path.join(__dirname, "../uploads/avatars");
    const avatarPath = path.join(avatarsFolder, req.user.userId.toString());
    const filePath = path.join(avatarPath, fileName);
    // if (!fs.existsSync(avatarsFolder)) {
    //   fs.mkdirSync(avatarsFolder, {
    //     recursive: true,
    //   }); //check if uploads folder exists or create it
    // }
    if (!fs.existsSync(avatarPath)) {
      fs.mkdirSync(avatarPath, { recursive: true });
    }
    //delete previous avatars
    fs.readdirSync(avatarPath).forEach((file) => {
      if (file.includes(req.user.userId)) {
        console.log(file);
        fs.unlinkSync(path.join(avatarPath, file)); // delete previous avatar file in uploads folder
      }
    });
    fs.writeFileSync(filePath, base64Data, "base64"); //create new avatar file in uploads folder
    await User.findByIdAndUpdate(
      req.user.userId,
      {
        avatar: `http://localhost:3000/uploads/avatars/${req.user.userId}/${fileName}`,
      },
      { new: true }
    );
    return res.status(200).send({
      newAvatar: `http://localhost:3000/uploads/avatars/${req.user.userId}/${fileName}`,
    });
  } catch (error) {
    console.log(colors.red("Error uploading avatar: ", error));
    return res.status(500).send("Error uploading avatar");
  }
};
