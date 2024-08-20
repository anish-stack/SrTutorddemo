const Subject = require('../models/TeacherRequest.model')
const Class = require('../models/ClassModel')
const TeacherRequest = require('../models/TeacherRequest.model')

const Student = require('../models/Student.model')
const CatchAsync = require('../utils/CatchAsync')
const crypto = require('crypto')
const sendEmail = require('../utils/SendEmails')
const { check } = require('express-validator')


exports.MakeARequestForTeacher = CatchAsync(async (req, res) => {
    try {
        const {
            ClassName,  //done
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
            message: "Teacher request created successfully. An OTP has been sent to your email.",
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
        const studentId = req.user.id; // Assuming student ID is passed as a URL parameter

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required."
            });
        }

        const posts = await TeacherRequest.find({ 'StudentId': studentId });

        if (!posts || posts.length === 0) {
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
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
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
