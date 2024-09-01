const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const colors = require("colors");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Cookies==> ", req.cookies);
  if (req.cookies.accessToken) {
    try {
      let verify = jwt.verify(
        req.cookies.accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      let refreshVerify = jwt.verify(
        req.cookies.refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      if (verify && refreshVerify) {
        return res.status(400).send("You are already logged in");
      }
    } catch (error) {
      console.log(colors.red("Invalid access token"));
    }
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .send("Please verify your email first before logging in");
    }
    const accessToken = jwt.sign(
      { userId: user._id, type: "access" },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      //   maxAge: 1 * 60 * 1000,
    });
    let refreshToken = user.refreshToken;
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.log(colors.red("Invalid refresh token"));
      refreshToken = jwt.sign(
        { userId: user._id, type: "refresh" },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );
      await User.findByIdAndUpdate(user._id, { refreshToken });
    }
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log(colors.green("Login successfuly"));
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error logging in");
  }
};
