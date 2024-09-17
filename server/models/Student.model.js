const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Student schema
const StudentSchema = new mongoose.Schema({
    sid: {
        type: String,
    },
    StudentName: {
        type: String,
        required: true,
        trim: true
    },
    PhoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    AltPhoneNumber: {
        type: String,
    },
    Email: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true,
        trim: true,

    },

    Password: {
        type: String,
        required: true,
        minlength: 6
    },
    isStudentVerified: {
        type: Boolean,
        default: false
    },
    SignInOtp: {
        type: String
    },
    ForgetPasswordOtp: {
        type: String
    },
    OtpExpiresTime: {
        type: Date
    },
    Role: {
        type: String,
        default: "Student"
    },
    profilePic: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    }
}, { timestamps: true });

// Hash password before saving
StudentSchema.pre('save', async function (next) {
    if (this.isModified('Password')) {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
    }
    next();
});

// Create a method to compare passwords
StudentSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.Password);
};

// Create the Student model
const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
