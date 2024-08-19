const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const colors = require("colors");
const User = require("../models/user");

const ACCESS_TOKEN_SECRET = "+y0ur4cc3sst0k3ns3cr3t+";
const REFRESH_TOKEN_SECRET = "+y0urR3fr3sht0k3ns3cr3t+";

exports.login = async (req, res) => {
  console.log("cookies => ", req.cookies);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    // Successful login, you can generate a token or session here
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    let refreshToken = user.refreshToken;
    const verified = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    if (!verified) {
      refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
      });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log(colors.green("Login successfuly"));
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error logging in");
  }
};
