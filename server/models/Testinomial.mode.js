const mongoose = require('mongoose');

// Define the Testimonial schema
const TestimonialSchema = new mongoose.Schema({
    Rating: {
        type: Number,
        min: 0,
        max: 5
    },
    userImage: {
        type: String,
    },
    Text: {
        type: String,
        required: true,
        trim: true
    },
    Name: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Create the Testimonial model
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

module.exports = Testimonial;
