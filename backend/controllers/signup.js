const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const colors = require("colors");
const User = require("../models/User.js");
const { sendVerificationEmail } = require("./sendVerificationEmail.js");

// Helper to create JWT
const createToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const euser = await User.findOne({ email });
    if (euser) {
      return res
        .status(400)
        .send({ error: "User already exists with this email" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar: `/uploads/avatars/noUser.png`,
    });
    const emailToken = createToken(
      { userId: user._id, type: "email", email },
      process.env.EMAIL_TOKEN_SECRET,
      "1d"
    );
    user.verificationToken = emailToken;
    try {
      await sendVerificationEmail(email, emailToken);
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Error sending verification email" });
    }
    const refreshToken = createToken(
      { userId: user._id, type: "refresh" },
      process.env.REFRESH_TOKEN_SECRET,
      "7d"
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).send({ error: `Error creating user: ${err.message}` });
  }
};
