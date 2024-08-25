const nodemailer = require("nodemailer");

exports.sendVerificationEmail = (email, token) => {
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
  let mailOptions = {
    from: "Express Auth",
    to: email,
    subject: "Email verification",
    text: `Please click the following link to verify your email: http://localhost:3000/verify?token=${token}`,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error occurred: ", err);
      throw new Error("Error sending email");
    } else {
      console.log("Email sent successfully: ", data.response);
    }
  });
};
