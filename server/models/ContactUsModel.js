const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,

        trim: true,
        lowercase: true, // Convert to lowercase

    },
    Phone: {
        type: String,
        required: true,
        trim: true,

    },
    Subject: {
        type: String,

        trim: true
    },
    Message: {
        type: String,
        trim: true
    },
    QueryType: {
        type: String,
        default: 'General'
    },
    StudentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    TeacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Export the model
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
