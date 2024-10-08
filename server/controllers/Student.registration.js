const Student = require('../models/Student.model')
const Testimonial = require('../models/Testinomial.mode')
const CatchAsync = require('../utils/CatchAsync')
const sendToken = require('../utils/SendToken')
const sendEmail = require('../utils/SendEmails')
const axios = require('axios')
const streamifier = require('streamifier');
const Cloudinary = require('cloudinary').v2;
const cron = require('node-cron');
require('dotenv').config();
const { ServerError, warn } = require('../utils/Logger');

// Configure Cloudinary
Cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});

const crypto = require('crypto')
const SendWhatsAppMessage = require('../utils/SendWhatsappMeg')


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
                return res.status(400).json({ message: 'Student with this email is already verified.' });
            } else if (existingStudent.isBlockForOtp) {
                return res.status(403).json({ message: 'Your account is blocked for OTP requests. Please contact support.' });
            } else {
                // If not verified, resend the OTP
                const newOtp = crypto.randomInt(100000, 999999);
                if (!Password) {
                    existingStudent.Password = PhoneNumber; // Assign default password
                }
                existingStudent.SignInOtp = newOtp;
                existingStudent.OtpExpiresTime = Date.now() + 4 * 60 * 1000;
                existingStudent.hit += 1;
                await existingStudent.save();

                const message = `Dear ${existingStudent.StudentName},\nWe are pleased to inform you that your OTP for verification is: ${existingStudent.SignInOtp}\n${!Password ? `Your Default Password is ${existingStudent.PhoneNumber}\n` : ''}Please use this OTP to complete your verification process. This OTP is valid for a limited time, so kindly proceed without delay.\nIf you did not request this OTP, please disregard this message.\nBest regards,\nS R Tutors`;

                await SendWhatsAppMessage(message, PhoneNumber);

                return res.status(200).json({ message: 'You are already registered. OTP has been resent. Please verify your contact number.' });
            }
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiresTime = Date.now() + 4 * 60 * 1000;
        const Image = `https://avatar.iran.liara.run/username?username=${StudentName}`;

        // Create a new student
        const newStudent = await Student.create({
            StudentName,
            PhoneNumber,
            profilePic: Image,
            Email,
            Password,
            latitude,
            AltPhoneNumber,
            hit: 1,
            longitude,
            isStudentVerified: false,
            SignInOtp: otp,
            OtpExpiresTime: otpExpiresTime
        });

        const message = `Dear ${newStudent.StudentName},\nWe are pleased to inform you that your OTP for verification is: ${newStudent.SignInOtp}\n${!Password ? `Your Default Password is ${newStudent.PhoneNumber}\n` : ''}Please use this OTP to complete your verification process. This OTP is valid for a limited time, so kindly proceed without delay.\nIf you did not request this OTP, please disregard this message.\nBest regards,\nS R Tutors`;

        await SendWhatsAppMessage(message, PhoneNumber);

        res.status(201).json({
            success: true,
            message: 'Please verify OTP to complete registration. OTP sent to phone number.',
            data: newStudent
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//Student Verify Otp
exports.StudentVerifyOtp = CatchAsync(async (req, res) => {
    try {
        const { PhoneNumber, Email, otp } = req.body;

        const student = await Student.findOne({ Email }) || await Student.findOne({ PhoneNumber });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (student.SignInOtp !== otp || student.OtpExpiresTime < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        student.isStudentVerified = true;
        student.SignInOtp = undefined;
        student.isBlockForOtp = false
        student.OtpExpiresTime = undefined;
        student.hit = 0
        await student.save();

        await sendToken(student, res, 201);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

//Student Resent Otp
const MAX_RESEND_ATTEMPTS = 3; // Maximum number of OTP resend attempts

exports.StudentResendOtp = CatchAsync(async (req, res) => {
    try {
        const { PhoneNumber, Email, HowManyHit } = req.body;
        const now = Date.now();


        const student = await Student.findOne({ Email }) || await Student.findOne({ PhoneNumber });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }


        if (student.isBlockForOtp === true) {
            return res.status(429).json({ message: "You have been temporarily blocked from requesting OTP. Please try again later." });
        }

        // Check if the previous OTP is still valid
        if (student.OtpExpiresTime && now < student.OtpExpiresTime - 1 * 60 * 1000) {
            const remainingTimeInMs = student.OtpExpiresTime - 1 * 60 * 1000 - now;
            const remainingSeconds = Math.ceil(remainingTimeInMs / 1000);

            return res.status(429).json({
                message: `OTP already sent recently. Please wait ${remainingSeconds} seconds before requesting a new OTP.`
            });
        }


        if (student.hit >= MAX_RESEND_ATTEMPTS || HowManyHit >= MAX_RESEND_ATTEMPTS) {
            student.isBlockForOtp = true;
            student.OtpBlockTime = new Date();
            await student.save();

            return res.status(403).json({ message: "You are blocked from requesting OTP for the end of the day." });
        }


        const newOtp = crypto.randomInt(100000, 999999);
        student.SignInOtp = newOtp;
        student.OtpExpiresTime = Date.now() + 1 * 60 * 1000;
        student.hit += 1

        const Message = `Your OTP for mobile number verification is: ${newOtp}\n\nPlease use this code to complete your verification process.\nThis OTP is valid for 10 minutes.\nIf you did not request this, please ignore this message.\nBest regards,\nS R Tutors`;


        const mes = await SendWhatsAppMessage(Message, student.PhoneNumber);
        if (!mes || !mes.success) {
            return res.status(500).json({ message: "Failed to send message. Please try again later." });
        }

        await student.save();
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


exports.CheckNumber = CatchAsync(async (req, res) => {
    try {
        const { userNumber, latitude, longitude, HowManyHit } = req.body;

        // Check for missing fields
        const missingFields = [];
        if (!userNumber) missingFields.push('Phone Number');
        if (typeof HowManyHit === 'undefined') missingFields.push('How Many Hit');

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'The following fields are missing: ' + missingFields.join(', ')
            });
        }

        const now = Date.now(); // Define now before using it
        const checkUser = await Student.findOne({ PhoneNumber: userNumber });
        const otp = crypto.randomInt(100000, 999999);
        const otpExpiresTime = now + 2 * 60 * 1000; // 2 minutes from now

        if (checkUser) {
            // Check if the user is blocked
            if (checkUser.isBlockForOtp === true) {
                return res.status(429).json({ message: "Your account is blocked for OTP requests. Please contact support." });
            }

            // Check if OTP has expired
            if (checkUser.OtpExpiresTime && now < checkUser.OtpExpiresTime) {
                const remainingTimeInMs = checkUser.OtpExpiresTime - now;
                const remainingSeconds = Math.ceil(remainingTimeInMs / 1000);

                return res.status(429).json({
                    message: `OTP already sent recently. Please wait ${remainingSeconds} seconds before requesting a new OTP.`
                });
            }

            // Block user if they hit the request limit
            if (checkUser.hit >= 3 || HowManyHit >= 3) {
                checkUser.isBlockForOtp = true;
                checkUser.OtpBlockTime = new Date();
                await checkUser.save();
                return res.status(403).json({ message: "You are blocked from requesting OTP until the end of the day." });
            }

            // Prepare message and send OTP
            const Message = `Your OTP for mobile number verification is: ${otp}.\nPlease use this code to complete your verification process.\nThis OTP is valid for 10 minutes. If you did not request this, please ignore this message.\nBest regards,\nS R Tutors`;
            checkUser.SignInOtp = otp;
            checkUser.OtpExpiresTime = otpExpiresTime;
            checkUser.hit += 1; // Increment hit count

            await checkUser.save(); // Save user data before sending the message

            const sendWhatsappMsg = await SendWhatsAppMessage(Message, userNumber);

            if (!sendWhatsappMsg || !sendWhatsappMsg.success) {
                return res.status(500).json({ message: "Failed to send message. Please try again later." });
            }

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
                hit: 1,
                AltPhoneNumber: userNumber,
                longitude,
                isStudentVerified: false,
                SignInOtp: otp,
                OtpExpiresTime: otpExpiresTime
            });

            const Message = `Your OTP for mobile number verification is: ${otp}. Please use this code to complete your verification process. This OTP is valid for 10 minutes. If you did not request this, please ignore this message. Best regards, S R Tutors`;

            const sendMsg = await SendWhatsAppMessage(Message, userNumber);

            if (!sendMsg || !sendMsg.success) {
                return res.status(500).json({ message: "Failed to send message for new registration. Please try again later." });
            }

            // Send success response
            return res.status(201).json({
                success: true,
                message: 'Please verify OTP to complete registration. OTP sent to phone number.',
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
    try {
        const { Email } = req.body;
        console.log(Email)
        const student = await Student.findOne({ Email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.ForgetPasswordOtp = crypto.randomInt(100000, 999999);
        student.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
        await student.save();

        const Message = `Password Change Request OTP Verification\n\nDear ${student.StudentName},\n\nYour OTP for verifying your password change is: ${student.ForgetPasswordOtp}.\n\nPlease use this OTP to complete your password change process. It is valid for a limited time, so kindly proceed without delay.\n\nIf you did not request this OTP, please disregard this message.\n\nBest regards,\nS R Tutors`;
        const sent = await SendWhatsAppMessage(Message, student.PhoneNumber)
        console.log(sent)
        if (!sent) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        res.status(200).json({ message: 'Password reset OTP sent' });
    } catch (error) {
        console.log(error)
    }
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

exports.StudentPasswordOtpResent = CatchAsync(async (req, res) => {
    const { Email, howManyHit } = req.body;

    const student = await Student.findOne({ Email });
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    if (student.isBlockForOtp === true) {
        return res.status(429).json({
            message: 'You have been temporarily blocked from requesting OTP. Please try again later.'
        });
    }

    const now = Date.now();

    // Check if the previous OTP is still valid
    if (student.OtpExpiresTime && now < student.OtpExpiresTime - 1 * 60 * 1000) {
        const remainingTimeInMs = student.OtpExpiresTime - 1 * 60 * 1000 - now;
        const remainingSeconds = Math.ceil(remainingTimeInMs / 1000);

        return res.status(429).json({
            message: `OTP already sent recently. Please wait ${remainingSeconds} seconds before requesting a new OTP.`
        });
    }
    console.log(howManyHit)

    if (howManyHit >= 3) {
        student.isBlockForOtp = true;
        student.OtpBlockTime = new Date();
        await student.save();

        return res.status(403).json({
            message: 'You are blocked from requesting OTP for the end of the day.'
        });
    }

    // Generate a new OTP and set its expiration time
    student.ForgetPasswordOtp = crypto.randomInt(100000, 999999);
    student.OtpExpiresTime = Date.now() + 2 * 60 * 1000;
    await student.save();

    // Prepare the message for WhatsApp
    const Message = `Password Change Request OTP Verification.\nDear ${student.name},\nYour OTP for verifying your password change is: ${student.ForgetPasswordOtp}.\nPlease use this OTP to complete your password change process. It is valid for a limited time, so kindly proceed without delay.\nIf you did not request this OTP, please disregard this message.\nBest regards,\nS R Tutors`;

    try {
        // Send OTP via WhatsApp
        await SendWhatsAppMessage(Message, student.PhoneNumber);
        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        // Handle WhatsApp message sending error
        console.error('Failed to send WhatsApp message:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
    }
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



cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        const blockedStudnet = await Student.find({ isBlockForOtp: true });

        blockedStudnet.forEach(async (teacher) => {
            const blockTime = teacher.OtpBlockTime;
            const timeDifference = now - blockTime;


            if (timeDifference >= 24 * 60 * 60 * 1000) {
                teacher.isBlockForOtp = false;
                teacher.hit = 0
                teacher.OtpBlockTime = null;
                await teacher.save();
                console.log(`Unblocked Studnets: ${teacher.Email}`);
            }
        });
    } catch (error) {
        console.error("Error in cron job for unblocking studnets:", error);
    }
});