const jwt = require("jsonwebtoken");
const User = require("../models/user");

const REFRESH_TOKEN_SECRET = "+y0urR3fr3sht0k3ns3cr3t+";
const ACCESS_TOKEN_SECRET = "+y0ur4cc3sst0k3ns3cr3t+";

exports.me = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  try {
    if (!accessToken) {
      return res.status(401).send("Access denied");
    }
    const verified = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    if (!verified) {
      console.log("Access denied");
      return res.status(401).send("Access denied");
    }
    const user = await User.findById(verified.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send("Error getting user");
  }
};
