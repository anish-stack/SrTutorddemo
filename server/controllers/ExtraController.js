const Student = require('../models/Student.model');
const TeacherProfile = require('../models/TeacherProfile.model');
const UniversalSchema = require('../models/UniversalSchema');
const CatchAsync = require('../utils/CatchAsync');
const axios = require('axios');
const crypto = require('crypto');
const sendEmail = require('../utils/SendEmails');
const SendWhatsAppMessage = require('../utils/SendWhatsappMeg');
const sendLeadMessageToTeacher = require('../utils/SendLeadMsg');

exports.CreateUniversalRequest = CatchAsync(async (req, res) => {
    try {
        const studentId = req.user.id;

        const {

            requestByAdmin,

            ClassLangUage, requestType, classId, VehicleOwned, className, subjects,
            interestedInTypeOfClass, studentInfo, teacherGenderPreference,
            numberOfSessions, experienceRequired, minBudget, maxBudget,
            currentAddress, studentContactNumber,
            locality, startDate, specificRequirement, location, teacherId
        } = req.body;



        console.log(req.body)

        const requestId = crypto.randomInt(1000, 9999);

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

            teacherId,
            requestByAdmin,

            teacherId

        });

        let message;
        message = `Hey! You got a new request:\n*Student Name:* ${studentInfo.studentName || "User"}\n*Request Type:* ${requestType}\n*Class ID:* ${classId || "Not-Disclosed"}\n*Class Name:* ${className}\n*Subjects:* ${subjects}\n*Type of Class:* ${interestedInTypeOfClass}\n*Gender Preference:* ${teacherGenderPreference}\n*Number of Sessions:* ${numberOfSessions}\n*Experience Required:* ${experienceRequired} years\n*Budget Range:* ₹${maxBudget}\n*Start Date:* ${startDate}\n*Current Address:* ${currentAddress || locality}\n*Student Contact Number:* ${studentInfo.contactNumber}\nThank you!`;


        if (teacherId) {
            const teacher = await TeacherProfile.findOne({ TeacherUserId: teacherId }).populate('TeacherUserId');
            const nameOfTeacher = teacher?.FullName;
            const contactNumberOfTeacher = teacher?.ContactNumber;
            const gender = teacher?.Gender;
            const teacherAddress = teacher?.PermanentAddress?.streetAddress;

            if (teacher) {
                teacher.PostForHim = newRequest._id;
                await teacher.save();
                newRequest.teacherId = teacher._id
                message = `Hey Admin! You got a new request for Teacher: Please review the details and take action\n\n Teacher Details\n\n *Teacher Name:* ${nameOfTeacher};\n*Contact Number:* ${contactNumberOfTeacher};\n*Gender:* ${gender};\n\n\nStudent Details: \n *Student Name:* ${studentInfo?.studentName || "User"} \n*Request Type:* ${requestType};\n*Class ID:* ${classId};\n*Class Name:* ${className};\n*Subjects:* ${subjects};\n*Type of Class:* ${interestedInTypeOfClass};\n*Gender Preference:* ${teacherGenderPreference};\n*Number of Sessions:* ${numberOfSessions};\n*Experience Required:* ${experienceRequired} years;\n*Budget Range:* ₹${maxBudget};\n*Start Date:* ${startDate};\n*Current Address:* ${currentAddress || locality};\n*Student Contact Number:* ${studentInfo.contactNumber}.\nThank you!`;

            }
        }

        const userLocation = {
            type: 'Point',
            coordinates: [location.coordinates[1], location.coordinates[0]]
        };

        const findTeacherWhichTechInLocation = await TeacherProfile.find({
            'RangeWhichWantToDoClasses.location': {
                $near: {
                    $geometry: userLocation,
                    $maxDistance: 5000
                }
            }
        })
        
        const url = `${process.env.FRONETND_URL}/Search-result?role=student&SearchPlaceLat=${location.coordinates[0]}&SearchPlaceLng=${location.coordinates[1]}&via-home-page&Location=${locality || currentAddress}&ClassId=${classId}&ClassNameValue=${className}&Subject=${subjects[0]}&lat=${location.coordinates[0]}7&lng=${location.coordinates[1]}&locationParam=${locality || currentAddress}`

        await sendLeadMessageToTeacher(findTeacherWhichTechInLocation.length, findTeacherWhichTechInLocation, url)
        // console.log("teachers",findTeacherWhichTechInLocation.length)
        await newRequest.save();
        if (!process.env.SR_WHATSAPP_NO_SINGLE) {
            return res.status(403).json({
                message: "WhatsApp number not found"
            })
        }

        await SendWhatsAppMessage(message, process.env.SR_WHATSAPP_NO_SINGLE)

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