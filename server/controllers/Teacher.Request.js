
const teacherPro = require('../models/Teacher.model')
const TeacherRequest = require('../models/TeacherRequest.model')
const ParticularTeacher = require('../models/Particular.model')
const SubjectTeacherModel = require('../models/SubjectRequest')
const Student = require('../models/Student.model')
const CatchAsync = require('../utils/CatchAsync')
const crypto = require('crypto')
const sendEmail = require('../utils/SendEmails')
const { check } = require('express-validator')
const RequestSchema = require('../models/UniversalSchema')
const Request = require('../models/UniversalSchema')

exports.MakeARequestForTeacher = CatchAsync(async (req, res) => {
    try {
        const {
            ClassName,
            Subjects,  //done
            teacherId,  //done
            InterestedInTypeOfClass,  //done
            TeacherGenderPreference,  //done
            NumberOfSessions,   //un-done
            minBudget,  //done
            maxBudget,  //done
            Locality,  //done
            StartDate,  //done
            SpecificRequirement,  //done
            longitude,  //done
            latitude //done
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!ClassName) missingFields.push("ClassName is required.");
        if (!Subjects || !Array.isArray(Subjects) || Subjects.length === 0) missingFields.push("At least one Subject is required.");
        if (!InterestedInTypeOfClass) missingFields.push("InterestedInTypeOfClass is required.");
        if (!TeacherGenderPreference) missingFields.push("TeacherGenderPreference is required.");
        if (NumberOfSessions === undefined || NumberOfSessions <= 0) missingFields.push("NumberOfSessions must be greater than 0.");
        if (minBudget === undefined || minBudget < 0) missingFields.push("minBudget must be a non-negative number.");
        if (maxBudget === undefined || maxBudget < minBudget) missingFields.push("maxBudget must be greater than or equal to minBudget.");
        if (!Locality) missingFields.push("Locality is required.");
        if (!StartDate) missingFields.push("StartDate is required.");

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                errors: missingFields
            });
        }

        // Check if student is present
        const StudentId = req.user.id;
        const student = await Student.findById(StudentId);
        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Please Login To make A Request For Teacher"
            });
        }

        // Generate OTP and expiration time
        const GenerateOtp = crypto.randomInt(100000, 999999);
        const ExpireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Create a new TeacherRequest
        const newRequest = new TeacherRequest({
            ClassName,
            Subjects,
            InterestedInTypeOfClass,
            TeacherGenderPreference,
            NumberOfSessions,
            minBudget,
            maxBudget,
            Locality,
            StartDate,
            SpecificRequirement,
            longitude,
            latitude,
            StudentInfo: {
                StudentName: student.StudentName,
                ContactNumber: student.PhoneNumber,
                EmailAddress: student.Email
            },
            StudentId,
            Otp: GenerateOtp,
            OtpExpiredDate: ExpireTime
        });

        // Save the request to the database
        await newRequest.save();

        // Send OTP email
        const emailOptions = {
            email: student.Email,
            subject: 'Your OTP for Teacher Request',
            message: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>OTP for Teacher Request</title>
                        <style>
                        body {
                            font-family: Arial, sans-serif;
                            color: #333;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            overflow: hidden;
                        }
                        .header {
                            background-color: #00aaa9;
                            padding: 20px;
                            text-align: center;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content h2 {
                            font-size: 20px;
                            color: #333;
                            margin-top: 0;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                            margin: 10px 0;
                        }
                        .footer {
                            background-color: #eeeeee;
                            padding: 10px;
                            text-align: center;
                            color: #777777;
                        }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                        <div class="header">
                            <h1>Teacher Request OTP</h1>
                        </div>
                        <div class="content">
                            <h2>Hello,</h2>
                            <p>We have received your request for a teacher. To proceed, please use the following One-Time Password (OTP):</p>
                            <p style="font-size: 24px; font-weight: bold; color: #d64444;">${GenerateOtp}</p>
                            <p>This OTP is valid for the next 5 minutes. If you did not request this, please ignore this email.</p>
                            <p>Thank you for using our service.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                        </div>
                        </div>
                        </body>
                        </html>`
        };
        await sendEmail(emailOptions);

        res.status(201).json({
            success: true,
            message: "Teacher request created successfully. An OTP has been Sent to Your Contact Number.",
            data: newRequest
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});


exports.VerifyPost = CatchAsync(async (req, res) => {
    try {
        const { id, otp } = req.body;

        if (!id || !otp) {
            return res.status(403).json({
                success: false,
                message: "Please provide a valid ID or OTP."
            });
        }

        const checkPost = await TeacherRequest.findById(id);
        if (!checkPost) {
            return res.status(403).json({
                success: false,
                message: "Post ID is not valid."
            });
        }

        if (checkPost.Otp !== otp || checkPost.OtpExpiredDate < Date.now()) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired OTP."
            });
        }

        checkPost.PostIsVerifiedOrNot = true;
        checkPost.Otp = undefined;
        checkPost.OtpExpiredDate = undefined;


        console.log(checkPost.StudentInfo?.EmailAddress)
        await checkPost.save();

        const emailOptions = {
            email: checkPost.StudentInfo?.EmailAddress,
            subject: 'Thanks for Your Teacher Request',
            message: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Request Verified</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            color: #333;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            overflow: hidden;
                        }
                        .header {
                            background-color: #00aaa9;
                            padding: 20px;
                            text-align: center;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content h2 {
                            font-size: 20px;
                            color: #333;
                            margin-top: 0;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                            margin: 10px 0;
                        }
                        .footer {
                            background-color: #eeeeee;
                            padding: 10px;
                            text-align: center;
                            color: #777777;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Request Verified Successfully</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${checkPost.StudentInfo.StudentName},</h2>
                            <p>We are pleased to inform you that your request for a teacher has been successfully verified. Here are the details of your request:</p>
                            <ul>
                                <li><strong>Class Name:</strong> ${checkPost.ClassName}</li>
                                <li><strong>Subjects:</strong> ${checkPost.Subjects.map(subject => subject.SubjectName).join(', ')}</li>
                                <li><strong>Mode of Teaching:</strong> ${checkPost.InterestedInTypeOfClass}</li>
                                <li><strong>Budget:</strong> ${checkPost.minBudget} - ${checkPost.maxBudget}</li>
                                <li><strong>Location:</strong> ${checkPost.Locality}</li>
                                <li><strong>Start Date:</strong> ${checkPost.StartDate}</li>
                            </ul>
                            <p>Thank you for using our service. We will get back to you with suitable teacher options soon.</p>
                            <p>If you have any questions or need further assistance, feel free to reply to this email.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await sendEmail(emailOptions);

        res.status(200).json({
            success: true,
            message: "Request verified and email sent successfully."
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});


exports.GetPostByStudentId = CatchAsync(async (req, res) => {
    try {
        const studentId = req.user.id;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required."
            });
        }

        const posts = await RequestSchema.find({ studentId })
            .populate({
                path: 'Class', // Populate the Class field
                populate: {
                    path: 'InnerClasses.InnerClass', // Populate InnerClass within InnerClasses
                    model: 'InnerClass'
                }
            })
            .populate(['Teacher', 'Student']);

        if (!posts.length) {
            return res.status(404).json({
                success: false,
                message: "No posts found for this student."
            });
        }

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
});


exports.getSubscribed = CatchAsync(async (req, res) => {
    try {
        const studentId = req.user.id;
        console.log(studentId)
        // Check if studentId is provided
        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required."
            });
        }

        // Query to check if the student is subscribed (dealDone is true)
        const CheckSubscribed = await Request.find({
            studentId: studentId,  // Match studentId
            dealDone: true          // Only include where dealDone is true
        }).populate('teacherId');

        // Send response with subscribed requests
        res.status(200).json({
            success: true,
            data: CheckSubscribed
        });

    } catch (error) {
        console.log(error)
        // Handle errors and send response
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching subscribed posts.",
            error: error.message
        });
    }
});


exports.ShowAllPost = CatchAsync(async (req, res) => {
    try {
        // Fetch posts and sort by createdAt in descending order
        const posts = await TeacherRequest.find().sort({ createdAt: -1 });

        if (!posts || posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No posts found."
            });
        }

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

exports.AddCommentOnPostByAdmin = CatchAsync(async (req, res) => {
    try {
        const { id, Comment } = req.body;

        if (!id || !Comment) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid ID and Comment."
            });
        }

        const checkPost = await TeacherRequest.findById(id);

        if (!checkPost) {
            return res.status(404).json({
                success: false,
                message: "No matching post found."
            });
        }
        // qswsw

        // Add comment without disturbing existing comments
        checkPost.CommentByAdmin.push({
            Comment,
            Date: Date.now()
        });

        await checkPost.save();

        res.status(200).json({
            success: true,
            message: "Comment added successfully.",
            data: checkPost
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

// Make a request for particular Teacher Request request

exports.ParticularRequestForTeacher = CatchAsync(async (req, res) => {
    try {
        const {
            ClassId,
            className,
            Subject,
            teacherId,
            TeachingMode,
            Gender,
            TeachingExperience,
            HowManyClassYouWant,
            MinRange,
            MaxRange,
            Location,
            StartDate,
            SpecificRequirement,
            longitude,
            latitude,
            isBestFaculty
        } = req.body;
        console.log(req.body)
        // Validate required fields
        const missingFields = [];

        // Check each required field
        if (!ClassId) missingFields.push('ClassId');
        if (!className) missingFields.push('className');
        if (!Subject) missingFields.push('Subject');
        if (!teacherId) missingFields.push('teacherId');
        if (!TeachingMode) missingFields.push('TeachingMode');
        if (!Gender) missingFields.push('Gender');
        if (!HowManyClassYouWant) missingFields.push('HowManyClassYouWant');
        if (!MinRange) missingFields.push('MinRange');
        if (!MaxRange) missingFields.push('MaxRange');
        if (!Location) missingFields.push('Location');
        if (!StartDate) missingFields.push('StartDate');

        if (!longitude) missingFields.push('longitude');
        if (!latitude) missingFields.push('latitude');

        // If there are missing fields, return an error response
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                errors: missingFields
            });
        }

        // Check if student is present
        const studentId = req.user.id;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Please Login To make A Request For Teacher"
            });
        }

        const getTeacherInfo = await teacherPro.findById(teacherId)

        // Create a new ParticularTeacher request
        const newRequest = new ParticularTeacher({
            ClassId,
            Subject,
            TeachingMode,
            Gender,
            HowManyClassYouWant,
            className,
            TeachingExperience,
            MinRange,
            MaxRange,
            Location,
            StartDate,
            teacherId,
            SpecificRequirement,
            longitude,
            latitude,
            studentId,
            isBestFaculty,
            StudentInfo: {
                StudentName: student.StudentName,
                ContactNumber: student.PhoneNumber,
                EmailAddress: student.Email
            }
        });
        const createdTime = new Date().toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });

        // Save the request to the database
        await newRequest.save();

        // Send confirmation email
        const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Template</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #003873;
                    padding: 20px;
                    text-align: center;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    color: #ffffff;
                }
                .header img {
                    max-width: 80px;
                    height: auto;
                    margin-bottom: 10px;
                }
                .header h1 {
                    font-size: 26px;
                    margin: 0;
                    font-weight: 700;
                }
                .content {
                    padding: 20px;
                    text-align: left;
                    color: #333333;
                }
                .content h2 {
                    font-size: 22px;
                    color: #003873;
                    margin-bottom: 10px;
                    border-bottom: 2px solid #003873;
                    padding-bottom: 5px;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 10px 0;
                }
                .teacher-profile {
                    background-color: #f0f8ff;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                .teacher-profile h3 {
                    font-size: 20px;
                    color: #003873;
                    margin: 0 0 10px;
                }
                .teacher-profile p {
                    font-size: 16px;
                    margin: 5px 0;
                }
                .cta {
                    text-align: center;
                    padding: 20px;
                    margin-top: 20px;
                }
                .cta a {
                    display: inline-block;
                    padding: 12px 25px;
                    background-color: #e21c1c;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 18px;
                    border-radius: 5px;
                    font-weight: 600;
                }
                @media only screen and (max-width: 600px) {
                    .email-container {
                        padding: 15px;
                    }
                    .content h2 {
                        font-size: 20px;
                    }
                    .cta a {
                        font-size: 16px;
                        padding: 10px 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <img src="https://i.ibb.co/zS0B0TQ/srtutor-removebg-preview.png" alt="Logo">
                    <h1>Thank You for Your Request</h1>
                </div>
                <div class="content">
                    <h2>${Subject} Request Received!</h2>
                    <p>Dear <strong>${student.StudentName}</strong>,</p>
                    <p>We have successfully received your request for a subject teacher. Our team is actively working to find the best match for you. We will provide you with the details shortly.</p>
                    <p><strong>Request Details:</strong></p>
                    <ul style="list-style-type: none; padding: 0;">
                        <li><strong>Date:</strong> ${createdTime}</li>
                        <li><strong>Class:</strong> ${className}</li>
                        <li><strong>Location:</strong> ${Location}</li>
                    </ul>
                    
                    <div class="teacher-profile">
                        <h3>Teacher Profile</h3>
                        <p><strong>Name:</strong> ${getTeacherInfo.TeacherName}</p>
                        <p><strong>Gender:</strong> ${getTeacherInfo.gender}</p>
                        <p>Our dedicated teacher, <strong>${getTeacherInfo.TeacherName}</strong>, is ready to assist you. With extensive experience and a commitment to excellence, you can expect outstanding guidance in your learning journey.</p>
                    </div>
    
                    <div class="cta">
                        <a href="${process.env.FRONTEND_URL}" target="_blank">Go To Website</a>
                    </div>
                </div>
            </div>
        </body>
        </html>`;

        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        await redisClient.del('particularTeacherData');
        await sendEmail({
            email: student.Email,
            subject: `${Subject} Request Received`,
            message
        });

        // Respond with success message
        res.status(201).json({
            success: true,
            message: "Request Created Successfully and email sent"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

exports.getParticularTeacherRequest = CatchAsync(async (req, res) => {
    try {
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        // Cache key for particular teacher data
        const cacheKey = 'particularTeacherData';

        // Check if data exists in the cache
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            // Parse and send the cached data if available
            const teachers = JSON.parse(cachedData);
            return res.status(200).json({
                status: 'success',
                data: teachers,
                source: 'cache', // Optional: to indicate data came from cache
            });
        }

        // If data is not in the cache, fetch from the database
        const teachers = await ParticularTeacher.find().sort({ createdAt: -1 });

        // Set the data to cache with an expiry time (e.g., 60 seconds)
        await redisClient.set(cacheKey, JSON.stringify(teachers), 'EX', 60);

        // Send the fetched data
        res.status(200).json({
            status: 'success',
            data: teachers,
            source: 'database', // Optional: to indicate data came from database
        });
    } catch (error) {
        // Handle errors properly
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

exports.addAdminCommentOnParticular = CatchAsync(async (req, res) => {
    try {
        const { requestId, comment } = req.body;
        // console.log(req.body)
        const request = await ParticularTeacher.findById(requestId);
        if (!request) {
            return res.status(404).json({
                status: "error",
                message: "Request not found",
            });
        }
        request.commentByAdmin.push({
            comment
        })

        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error('Redis client is not available.');
        }

        await redisClient.del('particularTeacherData');
        await request.save()
        res.status(200).json({
            status: "success",
            data: request,
            message: "Comment added and email sent to the student.",
        });
    } catch (error) {
        console.log(error);
        res.status(200).json({
            status: "failed",
            message: "Comment not added and email not be  sent to the student.",
        });
    }
});



