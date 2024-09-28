const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Teacher schema
const TeacherSchema = new mongoose.Schema({
    TeacherName: {
        type: String,
        required: true,
        trim: true
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    AltNumber: {
        type: String,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    Age: {
        type: String
    },
    DOB: {
        type: String
    },
    Password: {
        type: String,
        required: true,
        minlength: 4
    },
    gender: {
        type: String,
    },
    isTeacherVerified: {
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
    TeacherProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherProfile'
    },
    Reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    identityDocument: {
        DocumentType: {
            type: String,
            default: "Aadhaar",
            enum: ["Aadhaar", "Pan", "Voter Card", "Passport"]
        },
        DocumentImageUrl: {
            type: String,

        },
        DocumentPublicId: {
            type: String,

        }
    },
    isBlockForOtp: {
        type: Boolean,
        default: false
    },
    OtpBlockTime: {
        type: Date
    },
    QualificationDocument: {
        QualificationImageUrl: {
            type: String,

        },
        QualificationPublicId: {
            type: String,

        }
    },
    DocumentStatus: {
        type: Boolean,
        default: false
    },
    Role: {
        type: String,
        default: "Teacher"
    },
    isTopTeacher: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Hash password before saving
TeacherSchema.pre('save', async function (next) {
    if (this.isModified('Password')) {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
    }
    next();
});

// Create a method to compare passwords
TeacherSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.Password);
};

// Create the Student model
const Student = mongoose.model('Teacher', TeacherSchema);

module.exports = Student;
