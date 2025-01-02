const mongoose = require('mongoose');

const classModelSchema = new mongoose.Schema({

    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
    },
    Name: {
        type: String,
       
    },
    Email: {
        type: String,
       
    },
    Contact: {
        type: String,
       
    },
    message: {
        type: String,
     
    },

}, { timestamps: true });

const ClassRequest = mongoose.model('ClassRequestFromTeacher', classModelSchema);
module.exports = ClassRequest;