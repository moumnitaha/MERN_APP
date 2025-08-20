const express = require("express");
const router = express.Router();
const usersController = require("./user.controller");
const uploadAvatar = require("./middlewares/uploadAvatarMiddleware");

// const uploadAvatar = require("./modules/users/validators/uploadAvatarMiddleware");
function progress_middleware(req, res, next) {
  let progress = 0;
  const file_size = req.headers["content-length"];

  // set event listener
  req.on("data", (chunk) => {
    progress += chunk.length;
    const percentage = (progress / file_size) * 100;
    console.log(`Progress: ${percentage.toFixed(2)}%`);
  });

  // invoke next middleware
  next();
}

router.get("/", usersController.getUsers);
router.put("/updateInfos", usersController.updateInfos);
router.put("/changePass", usersController.changePass);
router.post(
  "/upload_avatar",
  progress_middleware,
  uploadAvatar.single("avatar"),
  usersController.uploadAvatar
);

module.exports = router;
