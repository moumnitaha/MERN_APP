const multer = require("multer");
const path = require("path");
const tmpDir = path.join(__dirname, "../../../uploads/avatars/tmp");
const fs = require("fs");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const avatarsFolder = path.join(__dirname, "../../../uploads/avatars");
    const avatarPath = path.join(avatarsFolder, req.user.userId.toString());
    if (!fs.existsSync(avatarPath)) {
      fs.mkdirSync(avatarPath, { recursive: true });
    }
    // Delete previous avatars
    fs.readdirSync(avatarPath).forEach((file) => {
      if (file.includes(req.user.userId)) {
        fs.unlinkSync(path.join(avatarPath, file));
      }
    });
    // console.log(avatarPath);
    cb(null, avatarPath);
  },
  filename: function (req, file, cb) {
    // console.log(req.user, file);
    const ext = path.extname(file.originalname);
    const newFileName = req.user.userId + "_" + Date.now() + "_avatar" + ext;
    req.newFileName = newFileName; // Attach to req for later middleware
    cb(null, newFileName);
  },
});

const uploadAvatar = multer({ storage });

module.exports = uploadAvatar;
