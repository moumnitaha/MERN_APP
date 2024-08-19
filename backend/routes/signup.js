const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const colors = require("colors");
const User = require("../models/user");

const ACCESS_TOKEN_SECRET = "+y0ur4cc3sst0k3ns3cr3t+";
const REFRESH_TOKEN_SECRET = "+y0urR3fr3sht0k3ns3cr3t+";

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValidator.test(email)) {
    console.log(colors.red("Invalid email address"));
    return res.status(400).send("Invalid email address");
  } else {
    console.log(colors.green("Email is valid"));
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    console.log(colors.green("User created successfully"));
    res.status(201).send("User created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: `Error creating user: ${err.errmsg}` });
  }
};
