const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, html, from = "Express Auth" }) {
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
  const mailOptions = {
    from,
    to,
    subject,
    html,
  };
  try {
    const data = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", data.response);
    return data;
  } catch (err) {
    console.log("Error occurred: ", err);
    throw new Error("Error sending email");
  }
}

async function sendVerificationEmail(email, token) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
  const subject = "Email verification";
  const html = `Please click the following link to verify your email: <a href="${backendUrl}/verify?token=${token}">Click here</a>`;
  return sendEmail({ to: email, subject, html });
}

module.exports = { sendEmail, sendVerificationEmail };
