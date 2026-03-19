const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📩 Sending email...");

    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully ✅");
    return true;

  } catch (error) {
    console.log("Email Error:", error.message);

    // 🔥 Retry once
    try {
      console.log("Retrying email...");
      const info = await transporter.sendMail({
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });

      console.log("Email sent on retry ✅");
      return true;

    } catch (err) {
      console.log("Retry failed ❌");
      return false;
    }
  }
};

module.exports = sendEmail;