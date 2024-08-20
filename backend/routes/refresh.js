const jwt = require("jsonwebtoken");
const colors = require("colors");
const User = require("../models/user");
const BlacklistedToken = require("../models/blacklistedTokens");

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    let accessToken = req.cookies.accessToken;
    if (!refreshToken || !accessToken) {
      return res.status(401).send("Access denied");
    }
    let blacklistedToken = await BlacklistedToken.findOne({
      token: refreshToken,
    });
    if (blacklistedToken) {
      console.log(colors.red("Blacklisted token"));
      return res.status(403).send("Blacklisted token");
    }
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(verified.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    accessToken = jwt.sign(
      { userId: user._id, type: "access" },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    console.log(colors.green("Token refreshed successfully"));
    res.status(200).send("Token refreshed successfully");
  } catch (err) {
    res.status(500).send("Error refreshing token");
  }
};
