const express = require("express");
const router = express.Router();
const usersController = require("./user.controller");

router.get("/", usersController.getUsers);
router.put("/updateInfos", usersController.updateInfos);
router.put("/changePass", usersController.changePass);
router.post("/upload_avatar", usersController.uploadAvatar);

module.exports = router;
