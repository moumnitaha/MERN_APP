const nodemailer = require("nodemailer");

exports.sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "tahamoumni@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
  const mailOptions = {
    from: "Express Auth",
    to: email,
    subject: "Email verification",
    html: `Please click the following link to verify your email: <a href="${backendUrl}/verify?token=${token}">Click here</a>`,
  };
  try {
    const data = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", data.response);
  } catch (err) {
    console.log("Error occurred: ", err);
    throw new Error("Error sending email");
  }
};
