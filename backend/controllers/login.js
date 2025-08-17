const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const colors = require("colors");
const User = require("../models/User");

// Helper to create JWT
const createToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

// Helper to set cookie
const setCookie = (res, name, value) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ error: "Please verify your email first before logging in" });
    }
    user.verificationToken = undefined;
    await user.save();

    const accessToken = createToken(
      { userId: user._id, type: "access" },
      process.env.ACCESS_TOKEN_SECRET,
      "10m"
    );
    setCookie(res, "accessToken", accessToken);

    let refreshToken = user.refreshToken;
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      refreshToken = createToken(
        { userId: user._id, type: "refresh" },
        process.env.REFRESH_TOKEN_SECRET,
        "7d"
      );
      await User.findByIdAndUpdate(user._id, { refreshToken });
    }
    setCookie(res, "refreshToken", refreshToken);

    let userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(200).send(userWithoutPassword);
  } catch (err) {
    res.status(500).send("Error logging in");
  }
};
