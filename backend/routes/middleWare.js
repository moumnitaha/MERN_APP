const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "+y0ur4cc3sst0k3ns3cr3t+";

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
