const express = require("express");
const router = express.Router();
const login = require("./login");
const signup = require("./signup");
const logout = require("./logout");
const refresh = require("./refresh");
const me = require("./me");
const authenticateToken = require("./middleWare");

router.post("/login", login.login);
router.post("/signup", signup.signup);
router.get("/logout", logout.logout);
router.post("/refresh", refresh.refresh);
router.get("/me", me.me);

module.exports = router;
