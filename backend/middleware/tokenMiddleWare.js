const jwt = require("jsonwebtoken");
const colors = require("colors");
const BlacklistedToken = require("../models/BlacklistedTokens");

const authenticateToken = async (req, res, next) => {
  const requestPath = req.path;
  const accessToken = req.cookies.accessToken || req.body?.accessToken;
  const refreshToken = req.cookies.refreshToken || req.body?.refreshToken;
  if (accessToken == null || refreshToken == null) {
    console.log(
      colors.red("Access denied from middleware for:"),
      colors.cyan(requestPath)
    );
    return res.status(401).send({ error: "Access denied from middleware" });
  }
  try {
    const blacklistedToken = await BlacklistedToken.findOne({
      token: refreshToken,
    });
    if (blacklistedToken) {
      //   res.clearCookie("refreshToken");
      console.log(
        colors.red("Already blacklisted token from middleware for:"),
        colors.cyan(requestPath)
      );
      return res
        .status(403)
        .send({ error: "Blacklisted token from middleware" });
    }
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      //   res.clearCookie("refreshToken");
      if (error.name === "TokenExpiredError") {
        let blackedToken = new BlacklistedToken({
          token: refreshToken,
          type: "refresh",
        });
        await blackedToken.save();
        console.log(
          colors.red("Refresh token expired from middleware for:"),
          colors.cyan(requestPath)
        );
        return res
          .status(401)
          .send({ error: "Refresh token expired from middleware" });
      }
      return res
        .status(403)
        .send({ error: "Invalid refresh token from middleware" });
    }
  } catch (err) {
    console.log(
      colors.red("Error checking blacklisted token from middleware for:"),
      colors.cyan(requestPath)
    );
    return res
      .status(500)
      .send({ error: "Error checking blacklisted token from middleware" });
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log(
          colors.red("Access Token expired from middleware for:"),
          colors.cyan(requestPath)
        );
        return res
          .status(401)
          .send({ error: "Access Token expired from middleware" });
      }
      console.log(
        colors.red("Invalid token from middleware for:"),
        colors.cyan(requestPath)
      );
      return res.status(403).send({ error: "Invalid token from middleware" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
