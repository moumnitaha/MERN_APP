const jwt = require("jsonwebtoken");
const colors = require("colors");
const BlacklistedToken = require("../models/blacklistedTokens");

const authenticateToken = async (req, res, next) => {
  const requestPath = req.path;
  const accessToken =
    req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;
  if (accessToken == null || refreshToken == null) {
    console.log(
      colors.red("Access denied from middleware for:"),
      colors.cyan(requestPath)
    );
    return res.status(401).send("Access denied from middleware");
  }
  try {
    const blacklistedToken = await BlacklistedToken.findOne({
      token: refreshToken,
    });
    if (blacklistedToken) {
      console.log(
        colors.red("Already blacklisted token from middleware for:"),
        colors.cyan(requestPath)
      );
      return res.status(403).send("Blacklisted token from middleware");
    }
  } catch (err) {
    console.log(
      colors.red("Error checking blacklisted token from middleware for:"),
      colors.cyan(requestPath)
    );
    return res
      .status(500)
      .send("Error checking blacklisted token from middleware");
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(
        colors.red("Invalid token from middleware for:"),
        colors.cyan(requestPath)
      );
      return res.status(403).send("Invalid token from middleware");
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
