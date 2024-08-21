const express = require("express");
const router = express.Router();
const login = require("../controllers/login.js");
const signup = require("../controllers/signup.js");
const logout = require("../controllers/logout.js");
const refresh = require("./refresh");
const friendship = require("../controllers/friendship.js");
const me = require("./me");
const upload_avatar = require("./uploadAvatar");
const authenticateToken = require("../middleware/tokenMiddleWare");
const products = require("./products");
const users = require("./users");
const path = require("path");
const {
  loginValidator,
  signupValidator,
} = require("../middleware/authMiddleware");
const User = require("../models/user");

router.post("/login", loginValidator, login.login);
router.post("/signup", signupValidator, signup.signup);
router.post("/refresh", refresh.refresh);
router.post("/logout", logout.logout);
router.post("/upload_avatar", authenticateToken, upload_avatar.upload_avatar);
router.get("/me", authenticateToken, me.me);
router.post("/addFriend", authenticateToken, friendship.friendship);
router.get("/users", authenticateToken, users.users);
router.get("/products", authenticateToken, products.products);
router.use(
  "/uploads",
  authenticateToken,
  express.static(path.join(__dirname, "../uploads"))
);

module.exports = router;
