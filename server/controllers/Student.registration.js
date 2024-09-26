const Student = require('../models/Student.model')
const Testimonial = require('../models/Testinomial.mode')
const CatchAsync = require('../utils/CatchAsync')
const sendToken = require('../utils/SendToken')
const sendEmail = require('../utils/SendEmails')
const axios = require('axios')
const streamifier = require('streamifier');
const Cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { ServerError, warn } = require('../utils/Logger');

// Configure Cloudinary
Cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});

const crypto = require('crypto')

async function regsiter(req, res) {
    try {
        const { StudentName, AltPhoneNumber, PhoneNumber, Email, Password, latitude, longitude } = req.body;

        // Check for missing fields
        const missingFields = [];
        if (!StudentName) missingFields.push('Student Name');
        if (!PhoneNumber) missingFields.push('Phone Number');
        if (!Email) missingFields.push('Email');


        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'The following fields are missing: ' + missingFields.join(', ')
            });
        }

        // Check if the student already exists
        const existingStudent = await Student.findOne({ Email });
        if (existingStudent) {
            // Check if the student is verified
            if (existingStudent.isStudentVerified) {
                return res.status(400).json({ message: 'Student with this email already exists' });
            } else {
                // If not verified, resend the OTP
                const newOtp = crypto.randomInt(100000, 999999)
                existingStudent.Password = !Password || PhoneNumber;
                existingStudent.SignInOtp = newOtp// Generate a 6-digit OTP
                existingStudent.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
                await existingStudent.save();

                const sendOtpOnMobileNumber = await axios.get(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${PhoneNumber}/${newOtp}/OTP1`)
                if (!sendOtpOnMobileNumber) {
                    return res.status(400).json({ message: 'Failed to send OTP' });
                }

                const Options = {
                    email: Email,
                    subject: 'OTP Verification',
                    message: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #000000; border: 1px solid #E21C1C;">
                                <h2 style="color: #E21C1C; text-align: center;">OTP Verification</h2>
                                <p>Dear ${existingStudent.StudentName}</p>
                                <p>We are pleased to inform you that your OTP for verification is:</p>
                                <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                                    ${existingStudent.SignInOtp}
                                </p>
                                 ${!Password ? `
                            <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                                Your Default Password is ${newStudent.PhoneNumber}
                            </p>
                        ` : ''}
                                <p>Please use this OTP to complete your verification process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                                <p>If you did not request this OTP, please disregard this message.</p>
                                <p>Best regards,</p>
                                <p><strong>S R Tutors</strong></p>
                                <hr style="border: 0; height: 1px; background-color: #E21C1C;">
                                <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                            </div>`
                };

                await sendEmail(Options)

                return res.status(200).json({ message: 'OTP resent. Please verify your email.' });
            }
        }



        // Generate OTP
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Create a new student
        const newStudent = await Student.create({
            StudentName,
            PhoneNumber,
            Email,
            Password,
            latitude,
            AltPhoneNumber,
            longitude,
            isStudentVerified: false,
            SignInOtp: otp,
            OtpExpiresTime: otpExpiresTime
        });

        const Options = {
            email: Email,
            subject: 'OTP Verification',
            message: `
                <div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E21C1C;">
                        <h2 style="color: #E21C1C; text-align: center; margin-top: 0;">OTP Verification</h2>
                        <p>Dear ${newStudent.StudentName},</p>
                        <p>We are pleased to inform you that your OTP for verification is:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                            ${newStudent.SignInOtp}
                        </p>
                        ${!Password ? `
                            <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                                Your Default Password is ${newStudent.PhoneNumber}
                            </p>
                        ` : ''}
                        <p>Please use this OTP to complete your verification process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                        <p>If you did not request this OTP, please disregard this message.</p>
                        <p>Best regards,</p>
                        <p><strong>S R Tutors</strong></p>
                        <hr style="border: 0; height: 1px; background-color: #E21C1C; margin: 20px 0;">
                        <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                    </div>
                </div>
            `
        };

        await sendEmail(Options)
        const sendOtpOnMobileNumber = await axios.get(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${PhoneNumber}/${otp}/OTP1`)
        if (!sendOtpOnMobileNumber) {
            return res.status(400).json({ message: 'Failed to send OTP' });
        }

        res.status(201).json({
            success: true,
            message: 'Please verify Otp For Complete Registration Otp sends On Email and Phone Number Both',
            data: newStudent
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

//Student New Register
exports.StudentRegister = CatchAsync(async (req, res) => {
    try {
        const { StudentName, AltPhoneNumber, PhoneNumber, Email, Password, latitude, longitude } = req.body;

        // Check for missing fields
        const missingFields = [];
        if (!StudentName) missingFields.push('Student Name');
        if (!PhoneNumber) missingFields.push('Phone Number');
        if (!Email) missingFields.push('Email');


        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'The following fields are missing: ' + missingFields.join(', ')
            });
        }

        // Check if the student already exists
        const existingStudent = await Student.findOne({ Email });
        if (existingStudent) {
            // Check if the student is verified
            if (existingStudent.isStudentVerified) {
                return res.status(400).json({ message: 'Student with this email already exists' });
            } else {
                // If not verified, resend the OTP
                const newOtp = crypto.randomInt(100000, 999999)
                existingStudent.Password = !Password || PhoneNumber;
                existingStudent.SignInOtp = newOtp// Generate a 6-digit OTP
                existingStudent.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
                await existingStudent.save();

                const sendOtpOnMobileNumber = await axios.get(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${PhoneNumber}/${newOtp}/OTP1`)
                if (!sendOtpOnMobileNumber) {
                    return res.status(400).json({ message: 'Failed to send OTP' });
                }

                const Options = {
                    email: Email,
                    subject: 'OTP Verification',
                    message: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #000000; border: 1px solid #E21C1C;">
                                <h2 style="color: #E21C1C; text-align: center;">OTP Verification</h2>
                                <p>Dear ${existingStudent.StudentName}</p>
                                <p>We are pleased to inform you that your OTP for verification is:</p>
                                <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                                    ${existingStudent.SignInOtp}
                                </p>
                                 ${!Password ? `
                            <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                                Your Default Password is ${newStudent.PhoneNumber}
                            </p>
                        ` : ''}
                                <p>Please use this OTP to complete your verification process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                                <p>If you did not request this OTP, please disregard this message.</p>
                                <p>Best regards,</p>
                                <p><strong>S R Tutors</strong></p>
                                <hr style="border: 0; height: 1px; background-color: #E21C1C;">
                                <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                            </div>`
                };

                await sendEmail(Options)

                return res.status(200).json({ message: 'OTP resent. Please verify your email.' });
            }
        }



        // Generate OTP
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
        const Image = `https://avatar.iran.liara.run/username?username=${StudentName}`
        // Create a new student
        const newStudent = await Student.create({
            StudentName,
            PhoneNumber,
            profilePic: Image,
            Email,
            Password,
            latitude,
            AltPhoneNumber,
            longitude,
            isStudentVerified: false,
            SignInOtp: otp,
            OtpExpiresTime: otpExpiresTime
        });

        const Options = {
            email: Email,
            subject: 'OTP Verification',
            message: `
                <div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E21C1C;">
                        <h2 style="color: #E21C1C; text-align: center; margin-top: 0;">OTP Verification</h2>
                        <p>Dear ${newStudent.StudentName},</p>
                        <p>We are pleased to inform you that your OTP for verification is:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                            ${newStudent.SignInOtp}
                        </p>
                        ${!Password ? `
                            <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                                Your Default Password is ${newStudent.PhoneNumber}
                            </p>
                        ` : ''}
                        <p>Please use this OTP to complete your verification process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                        <p>If you did not request this OTP, please disregard this message.</p>
                        <p>Best regards,</p>
                        <p><strong>S R Tutors</strong></p>
                        <hr style="border: 0; height: 1px; background-color: #E21C1C; margin: 20px 0;">
                        <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                    </div>
                </div>
            `
        };

        await sendEmail(Options)
        const sendOtpOnMobileNumber = await axios.get(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${PhoneNumber}/${otp}/OTP1`)
        if (!sendOtpOnMobileNumber) {
            return res.status(400).json({ message: 'Failed to send OTP' });
        }

        res.status(201).json({
            success: true,
            message: 'Please verify Otp For Complete Registration Otp sends On Email and Phone Number Both',
            data: newStudent
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//Student Verify Otp
exports.StudentVerifyOtp = CatchAsync(async (req, res) => {
    try {
        const { PhoneNumber, Email, otp } = req.body;
        console.log(req.body)
        const student = await Student.findOne({ Email }) || await Student.findOne({ PhoneNumber });
        console.log(student)
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (student.SignInOtp !== otp || student.OtpExpiresTime < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        student.isStudentVerified = true;
        student.SignInOtp = undefined;
        student.OtpExpiresTime = undefined;
        await student.save();

        await sendToken(student, res, 201);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//Student Resent Otp
exports.StudentResendOtp = CatchAsync(async (req, res) => {
    try {
        console.log("I am hit");
        const { PhoneNumber, Email } = req.body;
        console.log(req.body);

        const student = await Student.findOne({ Email }) || await Student.findOne({ PhoneNumber });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        console.log(student);
        const newOtp = crypto.randomInt(100000, 999999);
        student.SignInOtp = newOtp;
        student.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
        await student.save();

        const Options = {
            email: Email,
            subject: 'Resent OTP For Verification',
            message: `<div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
                        <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E21C1C;">
                        <h2 style="color: #E21C1C; text-align: center; margin-top: 0;">OTP Verification</h2>
                        <p>Dear ${student.StudentName},</p>
                        <p>We are pleased to inform you that your OTP for verification is:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                            ${student.SignInOtp}
                        </p>
                        <p>Please use this OTP to complete your verification process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                        <p>If you did not request this OTP, please disregard this message.</p>
                        <p>Best regards,</p>
                        <p><strong>S R Tutors</strong></p>
                        <hr style="border: 0; height: 1px; background-color: #E21C1C; margin: 20px 0;">
                        <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                        </div>
                        </div>`
        };

        console.log(process.env.TWO_FACTOR_API_KEY);

        const sendOtpOnMobileNumber = await axios.get(`https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${PhoneNumber}/${newOtp}/OTP1`);
        if (sendOtpOnMobileNumber.data.Status !== 'Success') {
            return res.status(400).json({ message: 'Failed to send OTP' });
        }

        // Send OTP email if Email is provided
        if (Email) {
            await sendEmail(Options);
        }

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error("Error in StudentResendOtp:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Student And 
exports.StudentLogin = CatchAsync(async (req, res) => {
    try {
        const { anyPhoneAndEmail, Password } = req.body;
        console.log(req.body)
        if (!anyPhoneAndEmail || !Password) {
            return res.status(403).json({
                Success: false,
                message: "Please fill all required fields"
            });
        }


        const isEmail = anyPhoneAndEmail.includes('@');
        const query = isEmail ? { Email: anyPhoneAndEmail } : { PhoneNumber: anyPhoneAndEmail };

        // Check if user exists (either Student or Teacher)
        const CheckUser = await Student.findOne(query) || await Teacher.findOne(query);

        if (!CheckUser) {
            return res.status(403).json({
                Success: false,
                message: "User not found"
            });
        }
        // Determine user type and compare password
        if (CheckUser.Role === 'Student' || CheckUser.Role === 'admin') {
            const isPasswordMatch = await CheckUser.comparePassword(Password);
            if (!isPasswordMatch) {
                return res.status(403).json({
                    Success: false,
                    message: "Invalid password"
                });
            }
            await sendToken(CheckUser, res, 201);

        } else {
            return res.status(403).json({
                Success: false,
                message: "Invalid role"
            });
        }

    } catch (error) {
        return res.status(500).json({
            Success: false,
            message: "Server error",
            error: error.message
        });
    }
});



//check number
exports.CheckNumber = CatchAsync(async (req, res) => {
    try {
        const { userNumber, latitude, longitude } = req.body;

        // Check for missing fields
        const missingFields = [];
        if (!userNumber) missingFields.push('Phone Number');

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'The following fields are missing: ' + missingFields.join(', ')
            });
        }

        // Check if the user exists
        const checkUser = await Student.findOne({ PhoneNumber: userNumber });
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        if (checkUser) {
            const sendOtpOnMobileNumber = await axios.get(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${userNumber}/${otp}/OTP1`);

            // Handle OTP sending failure
            if (sendOtpOnMobileNumber.data.Status !== 'Success') {
                return res.status(400).json({ message: 'Failed to send OTP' });
            }

            // Update user with new OTP
            checkUser.SignInOtp = otp;
            checkUser.OtpExpiresTime = otpExpiresTime;

            await checkUser.save();
            return res.status(200).json({
                success: true,
                message: 'OTP sent successfully.'
            });
        } else {
            // Create a new student
            const newStudent = await Student.create({
                StudentName: `Student${crypto.randomInt(100, 999)}`,
                PhoneNumber: userNumber,
                Email: `Student${crypto.randomInt(100, 999)}@gmail.com`,
                Password: `Student${crypto.randomInt(100, 999)}`,
                latitude,
                AltPhoneNumber: userNumber,
                longitude,
                isStudentVerified: false,
                SignInOtp: otp,
                OtpExpiresTime: otpExpiresTime
            });

            // Send OTP via mobile number
            const sendOtpOnMobileNumber = await axios.get(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${userNumber}/${otp}/OTP1`);

            // Handle OTP sending failure
            if (sendOtpOnMobileNumber.data.Status !== 'Success') {
                return res.status(400).json({ message: 'Failed to send OTP' });
            }

            // Send success response
            res.status(201).json({
                success: true,
                message: 'Please verify OTP for complete registration. OTP sent to phone number.',
                data: newStudent
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});



exports.AdminLogin = CatchAsync(async (req, res) => {
    try {
        // console.log("i am hit")
        const { Email, Password } = req.body;
        // console.log(req.body)
        if (!Email || !Password) {
            return res.status(403).json({
                Success: false,
                message: "Please fill all required fields"
            });
        }

        // Check if user exists (either Student or Teacher)
        const CheckUser = await Student.findOne({ Email })
        if (!CheckUser) {
            return res.status(403).json({
                Success: false,
                message: "User not found"
            });
        }
        // console.log(CheckUser)
        // Determine user type and compare password
        if (CheckUser.Role === 'admin') {
            const isPasswordMatch = await CheckUser.comparePassword(Password);
            // console.log(isPasswordMatch)
            if (!isPasswordMatch) {
                return res.status(403).json({
                    Success: false,
                    message: "Invalid password"
                });
            }
            await sendToken(CheckUser, res, 201);

        } else {
            return res.status(403).json({
                Success: false,
                message: "Invalid role"
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            Success: false,
            message: "Server error",
            error: error.message
        });
    }
});

//Student Password Change Request
exports.StudentPasswordChangeRequest = CatchAsync(async (req, res) => {
    const { Email } = req.body;

    const student = await Student.findOne({ Email });
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    student.ForgetPasswordOtp = crypto.randomInt(100000, 999999);
    student.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await student.save();

    const Options = {
        email: Email,
        subject: 'Password Change Request Otp Verification',
        message: `<div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E21C1C;">
                    <h2 style="color: #E21C1C; text-align: center; margin-top: 0;">OTP Verification For Password Change</h2>
                    <p>Dear ${student.StudentName},</p>
                    <p>We are pleased to inform you that your OTP for verification is:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                        ${student.ForgetPasswordOtp}
                    </p>
                    <p>Please use this OTP to complete your Password change process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                    <p>If you did not request this OTP, please disregard this message.</p>
                    <p>Best regards,</p>
                    <p><strong>S R Tutors</strong></p>
                    <hr style="border: 0; height: 1px; background-color: #E21C1C; margin: 20px 0;">
                    <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                    </div>
                    </div>
                            `
    };

    await sendEmail(Options)
    res.status(200).json({ message: 'Password reset OTP sent' });
});

//Student Verify Password Otp
exports.StudentVerifyPasswordOtp = CatchAsync(async (req, res) => {
    const { Email, otp, newPassword } = req.body;

    const student = await Student.findOne({ Email });
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    if (student.ForgetPasswordOtp !== otp || student.OtpExpiresTime < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    student.Password = newPassword
    student.ForgetPasswordOtp = undefined;
    student.OtpExpiresTime = undefined;
    await student.save();

    res.status(200).json({ message: 'Password changed successfully' });
});

//Student Resent Password Otp
exports.StudentPasswordOtpResent = CatchAsync(async (req, res) => {
    const { Email } = req.body;

    const student = await Student.findOne({ Email });
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    student.ForgetPasswordOtp = crypto.randomInt(100000, 999999);
    student.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await student.save();
    const Options = {
        email: Email,
        subject: 'Password Change Request Resend Otp Verification',
        message: `<div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E21C1C;">
                    <h2 style="color: #E21C1C; text-align: center; margin-top: 0;">OTP Verification For Password Change</h2>
                    <p>Dear ${student.StudentName},</p>
                    <p>We are pleased to inform you that your OTP for verification is:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                        ${student.ForgetPasswordOtp}
                    </p>
                    <p>Please use this OTP to complete your Password change process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                    <p>If you did not request this OTP, please disregard this message.</p>
                    <p>Best regards,</p>
                    <p><strong>S R Tutors</strong></p>
                    <hr style="border: 0; height: 1px; background-color: #E21C1C; margin: 20px 0;">
                    <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                    </div>
                    </div>
                            `
    };
    await sendEmail(Options);
    res.status(200).json({ message: 'OTP resent Successful' });
});

exports.getAllStudents = CatchAsync(async (req, res) => {
    try {
        const Students = await Student.find({ Role: "Student" }).select('-Password')
        if (Student.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'No Students Found'
            })
        }
        res.status(201).json({
            success: true,
            message: ' Students Found',
            data: Students
        })
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'No Students Found',
            error
        })
    }
})

exports.getSingleStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const singleStudent = await Student.findById(id)
        if (!singleStudent) {
            return res.status(404).json({
                success: false,
                message: 'no student found by this id'
            })
        }

        res.status(200).json({
            success: true,
            message: 'student founded successfully',
            data: singleStudent
        })
    } catch (error) {
        console.log(error)
        res.status({
            success: false,
            message: 'Internal server error'
        })
    }
}

//Add Testimonial Review 

exports.AddTestimonial = CatchAsync(async (req, res) => {
    const { Rating, Text, Name, isActive } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded',
        });
    }

    // Function to upload image using buffer
    const uploadFromBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
            let stream = Cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });
            streamifier.createReadStream(buffer).pipe(stream);
        });
    };

    // Upload the image and get the URL
    const uploadResult = await uploadFromBuffer(file.buffer);
    const UserthumbnailUrl = uploadResult.url;
    if (!Rating || !Text || !Name) {
        return res.status(403).json({
            success: false,
            message: "Please fill all required fields"
        });
    }

    // Assuming you have a Testimonial model
    const newTestimonial = await Testimonial.create({
        Rating,
        Text,
        userImage: UserthumbnailUrl,
        Name,
        isActive: isActive || false // default to false if not provided
    });
    const redisClient = req.app.locals.redis;

    if (!redisClient) {
        throw new Error('Redis client is not available.');
    }
    await redisClient.del('active-Testimonials')
    res.status(201).json({
        success: true,
        data: newTestimonial
    });
});

// controllers/Student.registration.js
exports.GetAllActiveTestimonial = CatchAsync(async (req, res) => {
    try {
        // Access the Redis client from req.app.locals
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        // Attempt to get the active testimonials from Redis
        const cachedTestimonials = await redisClient.get('active-Testimonials');

        if (cachedTestimonials) {
            // If found, parse the JSON string back to an object
            const activeTestimonials = JSON.parse(cachedTestimonials);

            return res.status(200).json({
                success: true,
                message: "data from cached",
                data: activeTestimonials
            });
        } else {
            // If not found in Redis, fetch from the database
            const activeTestimonials = await Testimonial.find()

            // Store the fetched testimonials in Redis for future requests
            await redisClient.set('active-Testimonials', JSON.stringify(activeTestimonials));

            return res.status(200).json({

                success: true,
                message: "data from db",
                data: activeTestimonials
            });
        }
    } catch (error) {
        console.error('Error fetching active testimonials:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});


exports.ToggleTestimonialStatus = CatchAsync(async (req, res) => {
    try {
        const { id } = req.params; // Assuming the ID is passed in the URL

        // Find the testimonial by ID
        const testimonial = await Testimonial.findById(id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        // Access the Redis client from req.app.locals
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        // Toggle the isActive status of the testimonial
        testimonial.isActive = !testimonial.isActive;
        await testimonial.save();

        // Delete the cached 'active-Testimonials' from Redis after updating the status
        await redisClient.del('active-Testimonials');

        // Respond with the updated testimonial
        res.status(200).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        // Log the error and send a 500 response if something goes wrong
        console.error('Error toggling testimonial status:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});


exports.DeleteTestimonial = CatchAsync(async (req, res) => {
    const { id } = req.params; // Assuming the ID is passed in the URL

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        return res.status(404).json({
            success: false,
            message: "Testimonial not found"
        });
    }

    const redisClient = req.app.locals.redis;

    if (!redisClient) {
        throw new Error('Redis client is not available.');
    }
    await redisClient.del('active-Testimonials');
    await testimonial.deleteOne();
    res.status(200).json({
        success: true,
        message: "Testimonial deleted successfully"
    });
});

exports.UpdateTestimonial = CatchAsync(async (req, res) => {
    try {
        const { id } = req.params; // Assuming the ID is passed in the URL
        const { Rating, Text, Name, isActive } = req.body;
        console.log(id)
        const testimonial = await Testimonial.findById(id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        // Update the fields with provided data
        if (Rating) testimonial.Rating = Rating;
        if (Text) testimonial.Text = Text;
        if (Name) testimonial.Name = Name;
        if (typeof isActive !== 'undefined') testimonial.isActive = isActive;
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }
        await redisClient.del('active-Testimonials');
        await testimonial.save();

        res.status(200).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        return res.status(200).json({
            success: false,
            data: error
        });
    }
});



exports.studentDeleteById = CatchAsync(async (req, res) => {
    const { id } = req.params;

  
    if (!id) {
        return res.status(400).json({
            status: 'fail',
            message: 'Student ID is required'
        });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
        return res.status(404).json({
            status: 'fail',
            message: 'Student not found'
        });
    }

    // Respond with success
    res.status(204).json({
        status: 'success',
        message: 'Student successfully deleted'
    });
});