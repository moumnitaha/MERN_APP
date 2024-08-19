const jwt = require("jsonwebtoken");
const colors = require("colors");
const User = require("../models/user");

const ACCESS_TOKEN_SECRET = "+y0ur4cc3sst0k3ns3cr3t+";
const REFRESH_TOKEN_SECRET = "+y0urR3fr3sht0k3ns3cr3t+";

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).send("Access denied");
    }
    const verified = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(verified.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
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
