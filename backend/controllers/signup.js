const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const colors = require("colors");
const User = require("../models/user");
const { sendVerificationEmail } = require("./sendVerificationEmail.js");

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const euser = await User.findOne({ email });
    if (euser) {
      return res.status(400).send("User already exists with this email");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar: `http://localhost:3000/uploads/avatars/noUser.png`,
    });
    const emailToken = jwt.sign(
      { userId: user._id, type: "email", email },
      process.env.EMAIL_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    user.verificationToken = emailToken;
    try {
      sendVerificationEmail(email, emailToken);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error sending verification email");
    }
    const refreshToken = jwt.sign(
      { userId: user._id, type: "refresh" },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    user.refreshToken = refreshToken;
    await user.save();
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "Strict",
    // });
    console.log(colors.green("User created successfully"));
    res.status(201).send("User created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: `Error creating user: ${err.errmsg}` });
  }
};
