// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendContactEmail = async (contactData) => {
  const { name, email, phone, message } = contactData;

  // Create reusable transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Fabrication Workshop" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Send to yourself
    subject: `New Contact Form Enquiry from ${name}`,
    text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}
    `,
    html: `
      <h3>New Enquiry</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Email notification sent successfully');
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Don't throw — we still want to save the enquiry even if email fails
  }
};

module.exports = sendContactEmail;