const jwt = require("jsonwebtoken");
const colors = require("colors");
const BlacklistedToken = require("../../common/blacklistedTokens.model");

// Helper: Check if refresh token is blacklisted
const isTokenBlacklisted = async (token) => {
  return await BlacklistedToken.findOne({ token });
};

// Helper: Verify a JWT token
const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

// Helper: Blacklist a token
const blacklistToken = async (token, type = "refresh") => {
  const blackedToken = new BlacklistedToken({ token, type });
  await blackedToken.save();
};

// Main middleware
const authenticateToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken || req.body?.accessToken;
  const refreshToken = req.cookies.refreshToken || req.body?.refreshToken;
  const requestPath = req.path;

  if (!accessToken || !refreshToken) {
    console.log(colors.red("Access denied for:"), colors.cyan(requestPath));
    return res.status(401).send({ error: "Access denied" });
  }

  try {
    // Check if refresh token is blacklisted
    if (await isTokenBlacklisted(refreshToken)) {
      console.log(
        colors.red("Blacklisted refresh token for:"),
        colors.cyan(requestPath)
      );
      return res.status(403).send({ error: "Blacklisted refresh token" });
    }

    // Verify refresh token
    try {
      await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        await blacklistToken(refreshToken, "refresh");
        console.log(
          colors.red("Refresh token expired for:"),
          colors.cyan(requestPath)
        );
        return res.status(401).send({ error: "Refresh token expired" });
      }
      return res.status(403).send({ error: "Invalid refresh token" });
    }
  } catch (err) {
    console.log(
      colors.red("Error checking blacklisted token for:"),
      colors.cyan(requestPath)
    );
    return res.status(500).send({ error: "Internal server error" });
  }

  // Verify access token
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log(
          colors.red("Access token expired for:"),
          colors.cyan(requestPath)
        );
        return res.status(401).send({ error: "Access token expired" });
      }
      console.log(
        colors.red("Invalid access token for:"),
        colors.cyan(requestPath)
      );
      return res.status(403).send({ error: "Invalid access token" });
    }
    console.log(
      colors.green("User authorized for:"),
      colors.magenta(requestPath)
    );
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
