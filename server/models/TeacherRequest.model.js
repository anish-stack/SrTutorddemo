const mongoose = require('mongoose');
const Validator = require('express-validator')

// use validator to prevent xss attack 

const TeacherRequestSchema = new mongoose.Schema({
    ClassName: {
        type: String,
        required: true
    },
    Subjects: [
        {
            SubjectName: {
                type: String,
                required: true
            }
        }
    ],
    InterestedInTypeOfClass: {
        type: String,
        enum: ["Online Class", "Home Tuition at My Home","Home Tuition at Student's Home", "Willing to travel to Teacher's Home"],
        required: true
    },
    StudentInfo: {
        StudentName: {
            type: String,
            required: true
        },
        ContactNumber: {
            type: String,
            required: true
        },
        EmailAddress: {
            type: String,
            required: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'] // Email validation
        }
    },
    TeacherGenderPreference: {
        type: String,
        enum: ["Male", "Female", "Any"],
        required: true
    },
    NumberOfSessions: {
        type: Number,
        required: true
    },
    HowMuchYearOfExperinceTeacherWant:{
        type: Number
    },
    minBudget: {
        type: Number,
        required: true
    },
    maxBudget: {
        type: Number,
        required: true
    },
    Locality: {
        type: String,
        required: true
    },
    StartDate: {
        type: String,
        enum: ["Immediately", "Within next 2 weeks", "Not sure, right now just checking prices"],
        required: true
    },
    SpecificRequirement: {
        type: String
    },
    PostIsVerifiedOrNot: {
        type: Boolean,
        default: false
    },
    Otp: {
        type: String
    },
    OtpExpiredDate: {
        type: Date,
        default: Date.now
    },
    StudentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    longitude: { // Corrected field name
        type: Number
    },
    latitude: { // Corrected field name
        type: Number
    },
    CommentByAdmin: [{
        Comment: {
            type: String
        },
        Date: {
            type: Date,
            default: Date.now
        }
    }],
    DealDone: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const TeacherRequest = mongoose.model('TeacherRequest', TeacherRequestSchema);

module.exports = TeacherRequest;
