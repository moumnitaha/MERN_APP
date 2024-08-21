const express = require("express");
const colors = require("colors");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");

exports.upload_avatar = async (req, res) => {
  const avatar = req.body.avatar;
  try {
    const base64Data = avatar.replace(
      /^data:image\/(png|jpg|jpeg);base64,/,
      ""
    );
    const imageType = avatar.match(/^data:image\/(png|jpg|jpeg);base64,/)[1];
    const fileName = `${req.user.userId}_${Date.now()}_avatar.${imageType}`;
    const filePath = path.join(__dirname, "../uploads/avatars", fileName);
    fs.mkdirSync(path.join(__dirname, "../uploads/avatars"), {
      recursive: true,
    }); //check if uploads folder exists or create it
    //delete previous avatars
    fs.readdirSync(path.join(__dirname, "../uploads/avatars")).forEach(
      (file) => {
        if (file.includes(req.user.userId)) {
          console.log(file);
          fs.unlinkSync(path.join(__dirname, "../uploads/avatars", file)); // delete previous avatar file in uploads folder
        }
      }
    );
    fs.writeFileSync(filePath, base64Data, "base64"); //create new avatar file in uploads folder
    await User.findByIdAndUpdate(
      req.user.userId,
      { avatar: `http://localhost:3000/uploads/avatars/${fileName}` },
      { new: true }
    );
    return res
      .status(200)
      .send({ newAvatar: `http://localhost:3000/uploads/${fileName}` });
  } catch (error) {
    console.log(colors.red("Error uploading avatar: ", error));
    return res.status(500).send("Error uploading avatar");
  }
};
