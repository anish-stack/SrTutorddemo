const mongoose = require('mongoose');

const LeadSendSchema = new mongoose.Schema({
    LeadSendTime: {
        type: Date,
        default: Date.now
    },
    UserInfo: {
        Name: {
            type: String,
            default: "S.R. USER"
        },
        ContactNumber: {
            type: String,
            default: "9899247916"
        }
    },
    LeadId: {
        type: String,
        required: true
    },
    LeadSendDate: {
        type: Date,
        default: Date.now  // Changed from Date.Now to Date.now (note the lowercase)
    },
    LeadSearchTeacherLength: {
        type: Number,
        required: true
    },
    LeadSendTeacherNumber: {
        type: Number,
        required: true
    },
    WhichTeacherHasNotSendMessage: [  
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TeacherProfile',
        },
        {
            ContactNumber: {
                type: String
            }
        }
    ],
    LeadTeacherIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherProfile',
        required: true
    }],
    SearchUrl: {
        type: String,
        required: true
    },
    LeadSendStatus: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('LeadSend', LeadSendSchema);
