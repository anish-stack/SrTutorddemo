const Student = require('../models/Student.model');
const TeacherProfile = require('../models/TeacherProfile.model');
const UniversalSchema = require('../models/UniversalSchema');
const CatchAsync = require('../utils/CatchAsync');
const axios = require('axios');
const crypto = require('crypto');
const sendEmail = require('../utils/SendEmails');

exports.CreateUniversalRequest = CatchAsync(async (req, res) => {
    try {
        const studentId = req.user.id;

        const {
            ClassLangUage, requestType, classId, VehicleOwned, className, subjects,
            interestedInTypeOfClass, studentInfo, teacherGenderPreference,
            numberOfSessions, experienceRequired, minBudget, maxBudget,
            locality, startDate, specificRequirement, location, teacherId
        } = req.body;
        console.log("request body", req.body)
        // Create a unique request ID using crypto
        const requestId = crypto.randomInt(1000, 9999);

        // Construct the new request object
        const newRequest = new UniversalSchema({
            requestId,
            studentId,
            requestType,
            classId,
            VehicleOwned,
            className,
            subjects,
            ClassLangUage,
            interestedInTypeOfClass,
            studentInfo,
            teacherGenderPreference,
            numberOfSessions,
            experienceRequired,
            minBudget,
            maxBudget,
            locality,
            startDate,
            specificRequirement,
            location,
            teacherId
        });

        // Save the request to the database
        console.log("newRequest newRequest", newRequest)

        if (teacherId) {
            const teacher = await TeacherProfile.findOne({ TeacherUserId: teacherId }).populate('TeacherUserId');

            if (teacher) {
                teacher.PostForHim = newRequest._id;

                await teacher.save();

                // const sendTeacherEmailOption = {
                //     email: teacher.TeacherUserId.Email,
                //     subject: 'New Request For You',
                //     message: `
                //         <html>
                //         <head>
                //             <style>
                //                 body {
                //                     font-family: Arial, sans-serif;
                //                     color: #333;
                //                     line-height: 1.6;
                //                     margin: 0;
                //                     padding: 0;
                //                 }
                //                 .container {
                //                     max-width: 600px;
                //                     margin: 0 auto;
                //                     padding: 20px;
                //                     background-color: #f9f9f9;
                //                     border-radius: 8px;
                //                     border: 1px solid #ddd;
                //                 }
                //                 h1, h2 {
                //                     color: #4CAF50;
                //                 }
                //                 .header {
                //                     background-color: #4CAF50;
                //                     color: #fff;
                //                     padding: 10px;
                //                     border-radius: 8px 8px 0 0;
                //                 }
                //                 .content {
                //                     padding: 20px;
                //                     background-color: #fff;
                //                     border-radius: 0 0 8px 8px;
                //                 }
                //                 .footer {
                //                     text-align: center;
                //                     padding: 10px;
                //                     background-color: #4CAF50;
                //                     color: #fff;
                //                     border-radius: 0 0 8px 8px;
                //                 }
                //                 .footer a {
                //                     color: #fff;
                //                     text-decoration: none;
                //                     font-weight: bold;
                //                 }
                //                 .button {
                //                     display: inline-block;
                //                     padding: 10px 20px;
                //                     margin: 10px 0;
                //                     color: #fff;
                //                     background-color: #4CAF50;
                //                     border-radius: 5px;
                //                     text-decoration: none;
                //                 }
                //                 .list-item {
                //                     margin-bottom: 10px;
                //                 }
                //                 .list-item strong {
                //                     display: block;
                //                     color: #333;
                //                 }
                //             </style>
                //         </head>
                //         <body>
                //             <div class="container">
                //                 <div class="header">
                //                     <h1>New Request Notification</h1>
                //                 </div>
                //                 <div class="content">
                //                     <h2>Dear ${teacher.TeacherUserId.name},</h2>
                //                     <p>We have received a new request for you. Below are the details:</p>
                //                     <ul>
                //                         <li class="list-item"><strong>Request Id:</strong> ${newRequest.requestId}</li>
                //                         <li class="list-item"><strong>Class Name:</strong> ${req.body.className}</li>
                //                         <li class="list-item"><strong>Subjects:</strong> ${Array.isArray(req.body.subjects) ? req.body.subjects.join(", ") : 'N/A'}</li>                   
                //                         <li class="list-item"><strong>Start Date:</strong> ${req.body.startDate}</li>
                //                         <li class="list-item"><strong>Current Address:</strong> ${req.body.locality}</li>
                //                         <li class="list-item"><strong>Near By Location:</strong> ${req.body.location}</li>
                //                         <li class="list-item"><strong>Specific Requirement:</strong> ${req.body.specificRequirement || 'None'}</li>
                //                         <li class="list-item"><strong>Budget:</strong> ${req.body.minBudget} - ${req.body.maxBudget}</li>
                //                     </ul>
                //                     <p>Please review the request and get back to us with your availability.</p>
                //                     <a href="https://www.example.com" class="button">View Request</a>
                //                 </div>
                //                 <div class="footer">
                //                     <p>Thank you for using our platform!</p>
                //                     <p><a href="https://www.example.com">Visit our website</a> | <a href="mailto:support@example.com">Contact Support</a></p>
                //                 </div>
                //             </div>
                //         </body>
                //         </html>
                //     `
                // };
                newRequest.teacherId = teacher._id
                // try {
                //     const mess = await sendEmail(sendTeacherEmailOption);
                //     if (mess === true) {

                //         newRequest.isTeacherEmailSend = true;
                //     } else {
                //         newRequest.isTeacherEmailSend = false;
                //     }

                // } catch (error) {
                //     newRequest.isTeacherEmailSend = false;
                //     console.error('Error sending email to teacher:', error);
                // }
            }
        }
        // console.log(studentInfo.emailAddress)
        // const sendStudentEmailOption = {
        //     email: studentInfo.emailAddress,
        //     subject: 'Thanks For Requesting a Teacher',
        //     message: `
        //         <html>
        //         <head>
        //             <style>
        //                 body {
        //                     font-family: Arial, sans-serif;
        //                     color: #333;
        //                     line-height: 1.6;
        //                     margin: 0;
        //                     padding: 0;
        //                 }
        //                 .container {
        //                     max-width: 600px;
        //                     margin: 0 auto;
        //                     padding: 20px;
        //                     background-color: #f9f9f9;
        //                     border-radius: 8px;
        //                     border: 1px solid #ddd;
        //                 }
        //                 h1, h2 {
        //                     color: #4CAF50;
        //                 }
        //                 .header {
        //                     background-color: #4CAF50;
        //                     color: #fff;
        //                     padding: 10px;
        //                     border-radius: 8px 8px 0 0;
        //                 }
        //                 .content {
        //                     padding: 20px;
        //                     background-color: #fff;
        //                     border-radius: 0 0 8px 8px;
        //                 }
        //                 .footer {
        //                     text-align: center;
        //                     padding: 10px;
        //                     background-color: #4CAF50;
        //                     color: #fff;
        //                     border-radius: 0 0 8px 8px;
        //                 }
        //                 .footer a {
        //                     color: #fff;
        //                     text-decoration: none;
        //                     font-weight: bold;
        //                 }
        //                 .button {
        //                     display: inline-block;
        //                     padding: 10px 20px;
        //                     margin: 10px 0;
        //                     color: #fff;
        //                     background-color: #4CAF50;
        //                     border-radius: 5px;
        //                     text-decoration: none;
        //                 }
        //                 .list-item {
        //                     margin-bottom: 10px;
        //                 }
        //                 .list-item strong {
        //                     display: block;
        //                     color: #333;
        //                 }
        //             </style>
        //         </head>
        //         <body>
        //             <div class="container">
        //                 <div class="header">
        //                     <h1>Request Received</h1>
        //                 </div>
        //                 <div class="content">
        //                     <h2>Dear ${newRequest.studentInfo.studentName},</h2>
        //                     <p>Thank you for your request. Here are the details:</p>
        //                     <ul>
        //                         <li class="list-item"><strong>Request Id:</strong> ${newRequest.requestId}</li>
        //                         <li class="list-item"><strong>Class Name:</strong> ${req.body.className}</li>
        //                         <li class="list-item"><strong>Subjects:</strong> ${Array.isArray(req.body.subjects) ? req.body.subjects.join(", ") : 'N/A'}</li>                   
        //                         <li class="list-item"><strong>Start Date:</strong> ${req.body.startDate}</li>
        //                         <li class="list-item"><strong>Current Address:</strong> ${req.body.locality}</li>
        //                         <li class="list-item"><strong>Near By Location:</strong> ${req.body.location}</li>
        //                         <li class="list-item"><strong>Specific Requirement:</strong> ${req.body.specificRequirement || 'None'}</li>
        //                         <li class="list-item"><strong>Budget:</strong> ${req.body.minBudget} - ${req.body.maxBudget}</li>
        //                     </ul>
        //                     <p>We will contact you soon.</p>
        //                     <a href="https://www.example.com" class="button">View Your Request</a>
        //                 </div>
        //                 <div class="footer">
        //                     <p>Thank you for using our platform!</p>
        //                     <p><a href="https://www.example.com">Visit our website</a> | <a href="mailto:support@example.com">Contact Support</a></p>
        //                 </div>
        //             </div>
        //         </body>
        //         </html>
        //     `
        // };

        // try {
        //     const mes = await sendEmail(sendStudentEmailOption);

        //     newRequest.isStudentEmailSend = true;
        //     // console.log(mes);
        //     if (mes === true) {

        //         newRequest.isStudentEmailSend = true;
        //     } else {
        //         newRequest.isStudentEmailSend = false;
        //     }


        // } catch (error) {
        //     newRequest.isStudentEmailSend = false;
        //     console.error('Error sending email to student:', error);
        // }


        await newRequest.save();
        console.log("save newRequest", newRequest)
        // Send a success response
        res.status(201).json({
            status: 'success',
            data: {
                request: newRequest
            }
        });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating the request'
        });
    }
});

exports.AcceptRequest = CatchAsync(async (req, res) => {
    try {
        const { requestId, status, requestType } = req.body;

        // Validate status
        const validStatuses = ["pending", "declined", "accepted"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        // Find the request document
        const request = await UniversalSchema.findById(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Handle admin request status
        if (requestType === 'admin') {
            if (request.statusOfRequest === 'declined') {
                return res.status(400).json({ success: false, message: 'Cannot update a declined request' });
            }
            request.statusOfRequest = status;

            // Handle teacher request status
        } else if (requestType === 'teacher') {
            if (request.teacherAcceptThis === 'declined') {
                return res.status(400).json({ success: false, message: 'You have already declined this request' });
            }
            request.teacherAcceptThis = status;

            // Invalid requestType
        } else {
            return res.status(400).json({ success: false, message: 'Invalid request type' });
        }

        // Save the updated request
        await request.save();

        res.status(200).json({ success: true, message: 'Request status updated successfully' });

    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ success: false, error: error.message, message: 'Request status not updated successfully' });
    }
});


exports.dealDoneRequest = CatchAsync(async (req, res) => {
    try {
        const { requestId, status } = req.body
        const request = await UniversalSchema.findById(requestId)
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' })
        }
        const preDefinedStatus = [true, false]

        if (!preDefinedStatus.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' })
        }
        if (request.dealDone === true) {
            return res.status(400).json({ success: false, message: 'Deal is already done' })
        }

        request.dealDone = status

        await request.save()
        res.status(200).json({ success: true, message: 'Request status updated successfully' })

    } catch (error) {

        res.status(501).json({ success: false, error: error.message, message: 'Request status not updated successfully' })

    }
})

exports.deleteUniverSalRequest = CatchAsync(async (req, res) => {
    try {
        const { requestId } = req.params;

        if (!requestId) {
            return res.status(400).json({
                status: 'fail',
                message: 'Request ID is required.'
            });
        }

        // Find the request by ID
        const request = await UniversalSchema.findById(requestId);

        if (!request) {
            return res.status(404).json({
                status: 'fail',
                message: 'Request not found.'
            });
        }

        // Check if the status is 'accepted'
        if (request.statusOfRequest === 'accepted') {
            return res.status(400).json({
                status: 'fail',
                message: 'Cannot delete a request that has been accepted.'
            });
        }

        // Proceed to delete the request
        await UniversalSchema.findByIdAndDelete(requestId);

        res.status(200).json({
            status: 'success',
            message: 'Request deleted successfully.'
        });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while deleting the request.',
            error: error.message
        });
    }
});

exports.AddComment = CatchAsync(async (req, res) => {
    try {
        const { requestId, comment } = req.body
        // console.log(requestId, comment)
        const request = await UniversalSchema.findById(requestId)
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' })
        }

        const addComment = await request.addAdminComment(comment)

        await request.save()
        res.status(200).json({ success: true, message: 'Request status updated successfully' })

    } catch (error) {

        res.status(501).json({ success: false, error: error.message, message: 'Request status not updated successfully' })

    }
})

exports.DeleteComment = CatchAsync(async (req, res) => {
    try {
        const { commentId, requestId } = req.body;  // Assuming you pass both commentId and the _id of the document (requestId)
        // console.log(req.body);

        // Find the request document first
        const request = await UniversalSchema.findById(requestId);
        // console.log(request);

        if (!request) {
            // console.log("Request not found")
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Find the index of the comment in the commentByAdmin array
        const commentIndex = request.commentsByAdmin.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Remove the comment from the commentByAdmin array
        request.commentsByAdmin.splice(commentIndex, 1);

        // Save the updated request document
        await request.save();
        // console.log(request)
        // Return success response
        res.status(200).json({ success: true, message: 'Comment deleted successfully' });

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, error: error.message, message: 'Failed to delete comment' });
    }
});



exports.UpdateComment = CatchAsync(async (req, res) => {
    try {
        const { requestId, commentId, updatedCommentText } = req.body;
        // console.log(req.body)
        // Find the request document and update the comment
        const request = await UniversalSchema.findOneAndUpdate(
            {
                _id: requestId,
                "commentsByAdmin._id": commentId
            },
            {
                $set: { "commentsByAdmin.$.comment": updatedCommentText }
            },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request or comment not found' });
        }
        // console.log(request)

        // Return success response
        res.status(200).json({ success: true, message: 'Comment updated successfully', data: request });

    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ success: false, error: error.message, message: 'Failed to update comment' });
    }
});


exports.GetMySubscribedClass = CatchAsync(async (req, res) => {
    try {
        const studentId = req.params.id
        const matchId = await UniversalSchema.find({ studentId })

    } catch (error) {

    }
})



exports.getAllCommentsOfRequest = CatchAsync(async (req, res) => {
    try {
        const { requestId } = req.params;

        // Find the request by requestId and only retrieve commentsByAdmin field
        const request = await UniversalSchema.findById(requestId, 'commentsByAdmin');

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Return the comments
        res.status(200).json({
            success: true,
            message: 'Comments retrieved successfully',
            data: request.commentsByAdmin,
        });

    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comments',
            error: error.message,
        });
    }
});

exports.getSingleComment = CatchAsync(async (req, res) => {
    try {
        const { requestId, CommentId } = req.params;

        // Find the request and retrieve the specific comment
        const request = await UniversalSchema.findOne(
            { _id: requestId, "commentsByAdmin._id": CommentId },
            { "commentsByAdmin.$": 1 }
        );

        if (!request || !request.commentsByAdmin.length) {
            return res.status(404).json({ success: false, message: 'Request or comment not found' });
        }

        // Return the found comment
        res.status(200).json({
            success: true,
            message: 'Comment retrieved successfully',
            data: request.commentsByAdmin,
        });

    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comment',
            error: error.message,
        });
    }
});



exports.AddTeacherIdInThis = CatchAsync(async (req, res) => {
    try {
        const { requestId, teacherId } = req.body;
        // console.log(req.body)
        // Find the request document
        const request = await UniversalSchema.findById(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Find the teacher document
        const teacher = await TeacherProfile.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher not found' });
        }

        // Add teacherId to request
        request.teacherId = teacherId;

        // Save the updated request
        await request.save();
        // console.log("request", request)
        res.status(200).json({ success: true, message: 'Teacher ID added successfully' });

    } catch (error) {
        console.error('Error adding teacher ID:', error);
        res.status(500).json({ success: false, message: 'Failed to add teacher ID', error: error.message });
    }
});



exports.MakeTeacherVerified = CatchAsync(async (req, res) => {
    try {
        const { teacherId, status } = req.query
        console.log(req.query)
        if (!teacherId) {
            return res.status(402).json({
                success: false,
                message: 'Teacher ID is required'

            })
        }

        if (!status) {
            return res.status(402).json({
                success: false,
                message: 'Status is required'
            })
        }

        const findTeacher = await TeacherProfile.findById(teacherId)
        if (!findTeacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            })
        }
        //toggle status
        findTeacher.srVerifiedTag = status
        await findTeacher.save()
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            throw new Error("Redis client is not available.");
        }

        // Check if Teacher is cached
        await redisClient.del(`Teacher`);
        console.log(findTeacher)
        res.status(201).json({
            success: true,
            message: 'Teacher has Verified Successful'

        })
    } catch (error) {
        console.log(error)
        res.status(501).json({
            success: false,
            message: 'Teacher has Not Verified '

        })
    }
})




exports.getAllUniversalRequest = CatchAsync(async (req, res) => {
    try {
        const requests = await UniversalSchema.find()
            .populate('teacherId')   // Populates the Teacher details
            .populate('studentId')   // Populates the Student details
            .populate('classId');    // Populates the Class details

        if (!requests || requests.length === 0) {
            return res.status(404).json({ success: false, message: 'No requests found' });
        }
        // console.log(requests)
        res.status(200).json({ success: true, count: requests.length, data: requests });

    } catch (error) {
        console.error('Error fetching universal requests:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch universal requests', error: error.message });
    }
});


// Fetch a single universal request by its ID
exports.getSingleUniverSalRequest = CatchAsync(async (req, res) => {
    try {
        const { requestId } = req.params;

        // Find the universal request by ID
        const request = await UniversalSchema.findOne({ _id: requestId }).populate('teacherId')
            .populate('studentId')
            .populate('classId');;

        if (!request) {
            return res.status(404).json({
                status: 'error',
                message: 'Request not found',
            });
        }

        // Send the found request as response
        res.status(200).json({
            status: 'success',
            data: {
                request,
            },
        });
    } catch (error) {
        console.error('Error fetching the request:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the request',
        });
    }
});

// Fetch multiple universal requests based on query parameters
exports.getUniverSalRequestAccordingToQuery = CatchAsync(async (req, res) => {
    try {
        const {
            isDealDone,
            StautsOfRequest,
            CreatedDate,
            IsShowAtSlider,
            ShowViaEmailSendTeacher,
            ShowViaEmailStudent,
            minBudget,
            maxBudget,
            locality,
            teacherGenderPreference,
            className
        } = req.query;

        // Build a query object dynamically based on provided parameters
        const query = {};

        if (isDealDone !== undefined) query.isDealDone = isDealDone;

        // Using case-insensitive regular expressions for string fields
        if (StautsOfRequest) query.StautsOfRequest = { $regex: new RegExp(StautsOfRequest, 'i') };
        if (CreatedDate) query.CreatedDate = { $gte: new Date(CreatedDate) };
        if (IsShowAtSlider !== undefined) query.IsShowAtSlider = IsShowAtSlider;
        if (ShowViaEmailSendTeacher !== undefined) query.isTeacherEmailSend = ShowViaEmailSendTeacher;
        if (ShowViaEmailStudent !== undefined) query.isStudentEmailSend = ShowViaEmailStudent;

        // Handling budget range
        if (minBudget || maxBudget) {
            query.minBudget = { $gte: minBudget || 0 };
            query.maxBudget = { $lte: maxBudget || Infinity };
        }

        // Using case-insensitive regular expressions for string fields
        if (locality) query.locality = { $regex: new RegExp(locality, 'i') };
        if (teacherGenderPreference) query.teacherGenderPreference = { $regex: new RegExp(teacherGenderPreference, 'i') };
        if (className) query.className = { $regex: new RegExp(className, 'i') };

        // Fetch the requests based on the query
        const requests = await UniversalSchema.find(query);

        // Send the found requests as response
        res.status(200).json({
            status: 'success',
            results: requests.length,
            data: {
                requests,
            },
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching requests',
        });
    }
});


exports.GetRequestFromTeacherId = CatchAsync(async (req, res) => {
    try {
        const { id } = req.query;
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not provided

        // Validate pagination parameters
        if (page < 1 || limit < 1) {
            return res.status(400).json({ status: 'error', message: 'Invalid pagination parameters' });
        }

        // Find requests by teacherId and only select the specified fields with pagination
        const FindRequest = await UniversalSchema.find({ teacherId: id })
            .select([
                'classId',
                'className',
                'subjects',
                'interestedInTypeOfClass',
                'numberOfSessions',
                'minBudget',
                'maxBudget',
                'locality',
                'startDate',
                'dealDone',
                'studentInfo',
                'studentId',
                'location',
                'teacherAcceptThis'
            ]).populate('studentId')
            .skip((page - 1) * limit) // Skip documents for pagination
            .limit(limit); // Limit the number of documents returned

        // Count total number of documents for pagination metadata
        const totalCount = await UniversalSchema.countDocuments({ teacherId: id });

        if (!FindRequest || FindRequest.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No request found for this teacher' });
        }

        // Return the found request(s) with pagination metadata
        res.status(200).json({
            status: 'success',
            results: FindRequest.length,
            totalResults: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            data: FindRequest,
        });

    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the requests',
            error: error.message,
        });
    }
});



exports.PerformAdvancedSearch = CatchAsync(async (req, res) => {
    try {

        //Ist step
        const TeacherProfiles = await TeacherProfile.find()
            .populate({
                path: 'AcademicInformation.ClassId',
            })
            .exec();

        // Handle cases where ClassId might not match and try with InnerClasses


        // console.log(filteredProfiles);

        // console.log("Teacher Profile", TeacherProfiles)

        //IInd step get the Query Methods
        const { ClassId, Subjects, TeacherGender, TypeofClass, Budget, coordinates } = req.query

        //First Fetch  the Class 

        const FetchIstStep = TeacherProfiles.flatMap((item) => item.AcademicInformation)
        // console.log(FetchIstStep)
        res.status(200).json({
            status: 'success',
            teacher: TeacherProfiles,
            data: FetchIstStep,
        });

    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the requests',
            error: error.message,
        });
    }
})