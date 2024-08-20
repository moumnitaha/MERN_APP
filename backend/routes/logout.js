const colors = require("colors");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/blacklistedTokens");

exports.logout = async (req, res) => {
  try {
    let valiated = jwt.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const blacklistedToken = new BlacklistedToken({
      token: req.cookies.accessToken,
      type: valiated.type,
    });
    await blacklistedToken.save();
    console.log(colors.green("Token blacklisted successfully"));
  } catch (err) {
    console.log(err);
    console.log(colors.red("Error blacklisting token"));
    return res.status(500).send("Error blacklisting token");
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  console.log(colors.green("Logged out successfully"));
  res.status(200).send("Logged out successfully");
};
