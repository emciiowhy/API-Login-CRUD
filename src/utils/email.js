const nodemailer = require('nodemailer');

const sendVerificationEmail = async (userEmail, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // Use true if port is 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // The URL the user will click to verify their account
    // For now, it points to your backend route directly to test it easily
    const verifyUrl = `http://localhost:${process.env.PORT || 5000}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
      from: `"Express API" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Please verify your email address',
      html: `
        <h2>Welcome to our App!</h2>
        <p>We are excited to have you on board. Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        <br><br>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verifyUrl}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send verification email');
  }
};

module.exports = { sendVerificationEmail };