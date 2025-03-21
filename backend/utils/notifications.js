const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Twilio setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send Email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Luxury Hotel" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Email error: ${error.message}`);
  }
};

// Send SMS
const sendSMS = async (to, body) => {
  try {
    await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error(`SMS error: ${error.message}`);
  }
};

module.exports = { sendEmail, sendSMS };
