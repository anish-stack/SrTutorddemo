const mongoose = require('mongoose');

const ClassRequestSchema = new mongoose.Schema({
    selectedClasses: {
        type: [String],  // Assuming selectedClasses is an array of strings
        default: []
    },
    teacherGender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],  // Add options based on your needs
        default: 'Other'
    },
    numberOfSessions: {
        type: [String],
        default: []
    },
    subjects: {
        type: [String],  // Assuming subjects is an array of strings
        default: []
    },
    minBudget: {
        type: Number,
        required: true  // Add validation if needed
    },
    maxBudget: {
        type: Number,
        required: true  // Add validation if needed
    },
    currentAddress: {
        type: String,
        required: true  // Add validation if needed
    },
    state: {
        type: String,
        required: true  // Add validation if needed
    },
    pincode: {
        type: String,
        required: true  // Add validation if needed
    },
    studentName: {
        type: String,
        required: true  // Add validation if needed
    },
    studentEmail: {
        type: String,
        required: true,

    },
    contactNumber: {
        type: String,
        required: true  // Add validation if needed
    },
    studentId: {  // Fixed typo from `studnetId` to `studentId`
        type: mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required: true  // Add validation if needed
    },
    allDetailsCorrect: {
        type: Boolean,
        default: false
    },
    isDealDone: {
        type: Boolean,
        default: false,
    },
    statusOfRequest: {
        type: String,
        default: "pending",
        enum: ["pending", "declined", "Accept"] // Changed to 'accepted' for consistency
    },
    commentByAdmin: [
        {
          comment: {
            type: String
           
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
});

module.exports = mongoose.model('ClassRequest', ClassRequestSchema);
