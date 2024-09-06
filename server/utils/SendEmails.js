const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587, // Default port for Gmail SMTP is 587
            secure: false, 
            auth: {
                user: process.env.SMTP_EMAIL_USERNAME, // your Gmail address
                pass: process.env.SMTP_EMAIL_PASSWORD // your Gmail password
            }
        });

        // Define mail options
        const mailOptions = {
            from: `"Sr Tutors" <${process.env.SMTP_EMAIL_USERNAME}>`,
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            html: options.message // html body
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        if (info.accepted.length > 0) {
            console.log('Email sent successfully');
        } else {
            console.log('Email not sent. No recipients accepted the email.');
        }
    } catch (error) {
        // Check for specific error codes or messages
        if (error.responseCode) {
            // Handle known SMTP error codes (e.g., invalid recipient)
            console.error('SMTP error:', error.responseCode, error.response);
        } else {
            // Handle other errors
            console.error('Error sending email:', error.message);
        }
        throw new Error('Error sending email');
    }
};

module.exports = sendEmail;
