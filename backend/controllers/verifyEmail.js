const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { sendVerificationEmail } = require("./sendVerificationEmail.js");

// Helper: Render HTML response
const renderHtml = (message) => `<html><body>${message}</body></html>`;

// Helper: Verify user by token
const verifyUser = async (token, req, res) => {
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user)
      return res.status(400).send(renderHtml("<h1>User not found</h1>"));
    if (user.isVerified) {
      return res
        .status(400)
        .send(
          renderHtml(
            `<h1>Email already verified</h1><a href='${
              process.env.FRONTEND_URL || "http://localhost:5173"
            }/login'>Click here to login</a>`
          )
        );
    }
    user.isVerified = true;
    await user.save();
    return res
      .status(200)
      .send(
        renderHtml(
          `<h1>Email verified successfully</h1><a href="${
            process.env.FRONTEND_URL || "http://localhost:5173"
          }/login">Click here to login</a>`
        )
      );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(400)
        .send(
          renderHtml(
            `<h1>Email verification link expired</h1><a href='${
              process.env.BACKEND_URL || "http://localhost:3000"
            }/verify?token=${token}&expired=true'>Click here to resend verification email</a>`
          )
        );
    }
    return res.status(500).send(renderHtml("<h1>Error verifying email</h1>"));
  }
};

exports.verify = async (req, res) => {
  const token = req.query.token;
  const expired = req.query.expired;
  if (!token) return res.status(400).send(renderHtml("<h1>Invalid token</h1>"));

  // Expired token flow
  if (expired === "true") {
    const user = await User.findOne({ verificationToken: token });
    if (!user)
      return res
        .status(400)
        .send(renderHtml("<h1>No User with such token!</h1>"));
    if (user.isVerified) {
      return res
        .status(400)
        .send(
          renderHtml(
            `<h1>Email already verified</h1><a href='${
              process.env.FRONTEND_URL || "http://localhost:5173"
            }/login'>Click here to login</a>`
          )
        );
    }
    const payload = jwt.decode(token, process.env.EMAIL_TOKEN_SECRET, {
      complete: true,
    });
    if (payload.exp > Date.now() / 1000) {
      await verifyUser(token, req, res);
      return;
    }
    const newEmailToken = jwt.sign(
      { userId: user._id, type: "email", email: payload.email },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    try {
      await sendVerificationEmail(payload.email, newEmailToken);
      user.verificationToken = newEmailToken;
      await user.save();
    } catch (err) {
      return res
        .status(500)
        .send(renderHtml("<h1>Error sending verification email</h1>"));
    }
    return res
      .status(200)
      .send(renderHtml("<h1>New Email verification link sent</h1>"));
  }
  // Not expired
  verifyUser(token, req, res);
};
