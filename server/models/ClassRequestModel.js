const mongoose = require('mongoose');

const classModelSchema = new mongoose.Schema({

    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
    },
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Contact: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const ClassRequest = mongoose.model('ClassRequestFromTeacher', classModelSchema);
module.exports = ClassRequest;