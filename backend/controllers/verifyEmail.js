const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { sendVerificationEmail } = require("./sendVerificationEmail.js");

const verifyUser = async (token, req, res) => {
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(400)
        .send("<html><body><h1>User not found</h1></body></html>");
    }
    if (user.isVerified) {
      return res
        .status(400)
        .send(
          "<html><body><h1>Email already verified</h1><a href='http://localhost:5173/login'>Click here to login</a></body></html>"
        );
    }
    user.isVerified = true;
    // user.verificationToken = null;
    await user.save();
    res
      .status(200)
      .send(
        `<html><body><h1>Email verified successfully</h1><a href="http://localhost:5173/login">Click here to login</a></body></html>`
      );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Token expired");
      return res.status(400).send(
        `<html><body><h1>Email verification link expired</h1>
			  <a href='http://localhost:3000/verify?token=${token}&expired=true'>Click here to resend verification email</a></body></html>`
      );
    }
    res
      .status(500)
      .send("<html><body><h1>Error verifying email</h1></body></html>");
  }
};

exports.verify = async (req, res) => {
  const token = req.query.token;
  const expired = req.query.expired;
  if (!token) {
    return res
      .status(400)
      .send("<html><body><h1>Invalid token</h1></body></html>");
  }
  // expired token
  if (expired === "true") {
    console.log("expired >>");
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(400)
        .send("<html><body><h1>No User with such token!</h1></body></html>");
    }
    if (user.isVerified) {
      return res
        .status(400)
        .send(
          "<html><body><h1>Email already verified</h1><a href='http://localhost:5173/login'>Click here to login</a></body></html>"
        );
    }
    const payload = jwt.decode(token, process.env.EMAIL_TOKEN_SECRET, {
      complete: true,
    });
    if (payload.exp > Date.now() / 1000) {
      console.log("Token not expired yet");
      await verifyUser(token, req, res);
      return;
    }
    const newEmailToken = jwt.sign(
      { userId: user._id, type: "email", email: payload.email },
      process.env.EMAIL_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    try {
      sendVerificationEmail(payload.email, newEmailToken);
      user.verificationToken = newEmailToken;
      await user.save();
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(
          "<html><body><h1>Error sending verification email</h1></body></html>"
        );
    }
    return res
      .status(200)
      .send(
        "<html><body><h1>New Email verification link sent</h1></body></html>"
      );
  }
  // not expired
  verifyUser(token, req, res);
};
