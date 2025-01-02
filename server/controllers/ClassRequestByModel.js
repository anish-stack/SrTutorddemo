const ClassRequest = require('../models/ClassRequestModel');

// Create Class Request
exports.CreateClassRequestDe = async (req, res) => {
    try {
        const { request_id, name, email, phone, message } = req.body;
     
        const newRequest = new ClassRequest({
            request_id,
            Name:name,
            Email:email,
            Contact:phone,
            message
        });

        await newRequest.save();

        return res.status(201).json({ success: true, message: 'Class request created successfully', data: newRequest });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.GetAllClassRequests = async (req, res) => {
    try {
        const classRequests = await ClassRequest.find().populate('request_id', 'Name email'); 
        return res.status(200).json({ success: true, data: classRequests });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};


exports.DeleteClassRequest = async (req, res) => {
    try {
        const { request_id } = req.params;

        const deletedRequest = await ClassRequest.findByIdAndDelete(request_id);

        if (!deletedRequest) {
            return res.status(404).json({ success: false, message: 'Class request not found' });
        }

        return res.status(200).json({ success: true, message: 'Class request deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
