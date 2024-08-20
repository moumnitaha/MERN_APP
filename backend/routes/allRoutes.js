const express = require("express");
const router = express.Router();
const login = require("./login");
const signup = require("./signup");
const logout = require("./logout");
const refresh = require("./refresh");
const me = require("./me");
const upload_avatar = require("./uploadAvatar");
const authenticateToken = require("../middleware/middleWare");
const path = require("path");

router.post("/login", login.login);
router.post("/signup", signup.signup);
router.post("/refresh", refresh.refresh);
router.use(authenticateToken);
router.post("/logout", logout.logout);
router.post("/upload_avatar", upload_avatar.upload_avatar);
router.get("/me", me.me);
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;
