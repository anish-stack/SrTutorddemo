const ClassRequest = require('../models/ClassRequest');
const CatchAsync = require('../utils/CatchAsync'); // Assuming CatchAsync is a utility for handling async errors
const sanitizeHtml = require('sanitize-html'); // Assuming sanitize-html is installed

// Create a new class request
exports.CreateClassRequest = CatchAsync(async (req, res) => {
    try {
        const studentId = req.user.id;

        // Extract and format the data from req.body
        const {
            selectedClasses = [],
            numberOfSessions = [],
            subjects = [],
            minBudget,
            maxBudget,
            currentAddress,
            state,
            pincode,
            studentName,
            studentEmail,
            contactNumber,
            allDetailsCorrect
        } = req.body;

        // Ensure selectedClasses, numberOfSessions, and subjects are arrays of strings
        const formattedSelectedClasses = selectedClasses.map(item => item.value);
        const formattedNumberOfSessions = numberOfSessions.map(item => item.value);
        const formattedSubjects = subjects.map(item => item.value);

        // Create the new request with formatted data
        const requestData = {
            studentId,
            selectedClasses: formattedSelectedClasses,
            numberOfSessions: formattedNumberOfSessions,
            subjects: formattedSubjects,
            minBudget,
            maxBudget,
            currentAddress,
            state,
            pincode,
            studentName,
            studentEmail,
            contactNumber,
            allDetailsCorrect
        };

        // Create a new class request
        const newRequest = await ClassRequest.create(requestData);

        // Send success response
        res.status(201).json({
            success: true,
            data: newRequest
        });
    } catch (error) {
        console.error('Error creating class request:', error);
        res.status(400).json({
            success: false,
            message: 'Error creating class request',
            error: error.message
        });
    }
});
// Get all class requests
exports.getAllClassRequest = CatchAsync(async (req, res) => {
    try {
        const requests = await ClassRequest.find();
        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error fetching class requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching class requests',
            error: error.message
        });
    }
});

// Get class requests by student ID
exports.getClassRequestByStudentId = CatchAsync(async (req, res) => {
    try {
        const { studentId } = req.params;
        const request = await ClassRequest.findOne({ studentId });
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Class request not found'
            });
        }
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error fetching class request by student ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching class request by student ID',
            error: error.message
        });
    }
});

// Delete a class request
exports.DeleteClassRequest = CatchAsync(async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await ClassRequest.findByIdAndDelete(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Class request not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Class request deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting class request:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting class request',
            error: error.message
        });
    }
});

// Toggle the deal status of a class request
exports.toggleClassDone = CatchAsync(async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await ClassRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Class request not found'
            });
        }
        request.isDealDone = !request.isDealDone;
        await request.save();
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error toggling class request:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling class request',
            error: error.message
        });
    }
});

// Toggle the deal status and mark as done
exports.toggleClassRequest = CatchAsync(async (req, res) => {
    try {
        const { requestId ,action} = req.params;
        const request = await ClassRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Class request not found'
            });
        }
        request.isDealDone = true;
        request.statusOfRequest = action;  
        await request.save();
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error toggling deal class done:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling deal class done',
            error: error.message
        });
    }
});

// Add a comment by admin
exports.addAdminComments = CatchAsync(async (req, res) => {
    try {
        const { requestId, comment } = req.body;
        const request = await ClassRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Class request not found'
            });
        }
        request.commentByAdmin.push({ comment });
        await request.save();
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error adding admin comment:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding admin comment',
            error: error.message
        });
    }
});



exports.getCommentsForRequest = async (req, res) => {
    const requestId = req.params.id;

    try {
        // Validate requestId
        if (!requestId) {
            return res.status(400).json({ message: 'Request ID is required.' });
        }

        // Fetch the request by its ID
        const request = await ClassRequest.findOne({ _id: requestId });

        // Check if request exists
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        // Get comments from the request
        const comments = request.commentByAdmin || [];

        // Respond with the comments
        res.status(200).json({ comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching comments.' });
    }
};