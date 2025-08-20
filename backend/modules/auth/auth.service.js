const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const colors = require("colors");
const User = require("../users/user.model");
const BlacklistedToken = require("../common/blacklistedTokens.model");
const { sendVerificationEmail } = require("../email/email.service.js");

// Helper: Render HTML response
const renderHtml = (message) =>
  `<html><body style="font-family: Arial, sans-serif; line-height: 1.6; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #000; color: #fff; padding: 0px; margin: 0px;">${message}</body></html>`;

// Helper: Verify user by token
const verifyUserService = async (token, req, res) => {
  const expired = req.query.expired;
  if (!token) {
    return res.status(400).send(renderHtml("<h1>Token is required</h1>"));
  }
  // expired token
  if (expired === "true") {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(400)
        .send(renderHtml("<h1>No User with such token!</h1>"));
    }
    if (user.isVerified) {
      return res
        .status(400)
        .send(
          renderHtml(
            "<h1>Email already verified</h1><a style='color: #1d4ed8; text-decoration: underline; font-weight: bold;' href='http://localhost:5173/login'>Click here to login</a>"
          )
        );
    }
    const decoded = jwt.decode(token, { complete: true });
    if (decoded && decoded.payload.exp * 1000 < Date.now()) {
      console.log("Token expired");
      const newEmailToken = createToken(
        { userId: user._id, type: "email", email: decoded.payload.email },
        process.env.EMAIL_TOKEN_SECRET,
        "10min"
      );
      try {
        await sendVerificationEmail(decoded.payload.email, newEmailToken);
        user.verificationToken = newEmailToken;
        await user.save();
        return res
          .status(200)
          .send(renderHtml("<h1>New Email verification link sent</h1>"));
      } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).send(renderHtml("<h1>Error</h1>"));
      }
    }
  }
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user)
      return res.status(400).send(renderHtml("<h1>User not found</h1>"));
    if (user.isVerified) {
      return res.status(400).send(
        renderHtml(
          `<h1>Email already verified</h1>
			<a style="color: #1d4ed8; text-decoration: underline; font-weight: bold;" href='${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/login'>Click here to login</a>`
        )
      );
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).send(
      renderHtml(
        `<h1>Email verified successfully</h1>
		  <a style="color: #1d4ed8; text-decoration: underline; font-weight: bold;" href='${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/login'>Click here to login</a>`
      )
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(400)
        .send(
          renderHtml(
            `<h1>Email verification link expired</h1><a style="color: #1d4ed8; text-decoration: underline; font-weight: bold;" href='${
              process.env.BACKEND_URL || "http://localhost:3000"
            }/verify?token=${token}&expired=true'>Click here to resend verification email</a>`
          )
        );
    }
    return res.status(500).send(renderHtml("<h1>Error verifying email</h1>"));
  }
};

// Helper to create JWT
const createToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

async function refreshTokenService(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) throw new Error("Access denied");
    let blacklistedToken = await BlacklistedToken.findOne({
      token: refreshToken,
    });
    if (blacklistedToken) {
      throw new Error("Blacklisted token");
    }
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(verified.userId);
    if (!user) throw new Error("User not found");
    if (!user.isVerified) {
      throw new Error("Please verify your email first before logging in");
    }
    const accessToken = jwt.sign(
      { userId: user._id, type: "access" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });
    console.log(colors.green("Token refreshed successfully"));
    res
      .status(200)
      .send({ message: "Token refreshed successfully", token: accessToken });
  } catch (err) {
    if (err.message === "Access denied") {
      return res.status(401).send({ error: err.message });
    }
    if (err.message === "Blacklisted token") {
      return res.status(403).send(err.message);
    }
    if (err.message === "User not found") {
      return res.status(404).send(err.message);
    }
    if (err.message === "Please verify your email first before logging in") {
      return res.status(400).send(err.message);
    }
    res.status(500).send("Error refreshing token");
  }
}

// LOGIN SERVICE
async function loginService(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    if (!user.isVerified) {
      console.log(user.verificationToken);
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
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

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
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    let userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(200).send(userWithoutPassword);
  } catch (err) {
    res.status(500).send("Error logging in");
  }
}

// SIGNUP SERVICE
async function signupService(req, res) {
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
      "10min"
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
}

// LOGOUT SERVICE
async function logoutService(req, res) {
  try {
    if (req.cookies.accessToken) {
      await new BlacklistedToken({
        token: req.cookies.accessToken,
        type: "access",
      }).save();
    }
  } catch (err) {
    return res.status(500).send({ error: "Error blacklisting token" });
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).send({ res: "Logged out successfully" });
}

module.exports = {
  refreshTokenService,
  loginService,
  signupService,
  logoutService,
  verifyUserService,
};
