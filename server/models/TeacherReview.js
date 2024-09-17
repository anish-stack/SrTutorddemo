const mongoose = require('mongoose')

const TeacherReview = new mongoose.Schema({

    Review: {
        type: String,
    },
    Star: {
        type: Number,
        default: 5
    },
    Status: {
        type: Boolean,
        default: true
    },
    TeacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    TeacherProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherProfile'
    },
    Student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }


}, { timestamps: true })


const Review = mongoose.model('Review', TeacherReview);

module.exports = Review;