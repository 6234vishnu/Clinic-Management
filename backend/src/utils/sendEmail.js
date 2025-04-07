// utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendOtpEmail = async (toEmail, otp) => {

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.NODEEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODEEMAILER_EMAIL,
    to: toEmail,
    subject: 'Your OTP Code',
    html: `
      <h2>OTP Verification</h2>
      <p>Your OTP code is:</p>
      <h1 style="color:blue">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  return true;
};


export default sendOtpEmail