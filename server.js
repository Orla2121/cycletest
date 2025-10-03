const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

app.use(express.static('.'));
app.use(express.urlencoded({ extended: true }));

const axios = require('axios');

app.post('/send-email', async (req, res) => {
  const { name, email, service, message, 'g-recaptcha-response': recaptchaResponse } = req.body;

  // Server-side validation
  if (!name || !email || !message) {
    return res.status(400).send('Name, email, and message are required.');
  }

  if (!recaptchaResponse) {
    return res.status(400).send('Please complete the reCAPTCHA.');
  }

  // Verify reCAPTCHA
  try {
    const secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Google test secret key
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

    const response = await axios.post(verificationUrl);
    if (!response.data.success) {
      return res.status(400).send('Failed reCAPTCHA verification.');
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).send('Error verifying reCAPTCHA.');
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'simjanoskisimjanoski@gmail.com', // Replace with your Gmail
      pass: 'nrfsplbskpkscjrz' // Replace with app password
    }
  });

  const mailOptions = {
    from: 'simjanoskisimjanoski@gmail.com',
    to: 'swagprodmk@gmail.com', // Replace with recipient email
    replyTo: email,
    subject: 'Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nService: ${service || 'N/A'}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email: ' + error.message);
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).send('Thank you for contacting us! We will get back to you shortly.');
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
