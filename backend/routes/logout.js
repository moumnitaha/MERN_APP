const colors = require("colors");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "+y0ur4cc3sst0k3ns3cr3t+";
const REFRESH_TOKEN_SECRET = "+y0urR3fr3sht0k3ns3cr3t+";

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log(colors.red("Access denied"));
    return res.status(401).send("Access denied");
  }
  try {
    const verified = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    console.log(verified);
    //blacklist the token
    //TO DO: save the token in a database
  } catch (err) {
    console.log(colors.red("Invalid token"));
    return res.status(401).send("Invalid token");
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  console.log(colors.green("Logged out successfully"));
  res.status(200).send("Logged out successfully");
};
