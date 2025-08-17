const colors = require("colors");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedTokens");

exports.logout = async (req, res) => {
  try {
    // Blacklist both access and refresh tokens if present
    if (req.cookies.accessToken) {
      await new BlacklistedToken({
        token: req.cookies.accessToken,
        type: "access",
      }).save();
    }
    if (req.cookies.refreshToken) {
      await new BlacklistedToken({
        token: req.cookies.refreshToken,
        type: "refresh",
      }).save();
    }
  } catch (err) {
    return res.status(500).send({ error: "Error blacklisting token" });
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).send({ res: "Logged out successfully" });
};
