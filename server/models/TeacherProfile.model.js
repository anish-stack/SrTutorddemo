const mongoose = require('mongoose');

// Define the Teacher Profile schema
const TeacherProfileSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true,
        trim: true
    },
    DOB: {
        type: Date,
        required: true
    },
    Gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    AlternateContact: {
        type: String,
        unique: true
    },
    PermanentAddress: {
        HouseNo: {
            type: String,
            required: true
        },
        LandMark: {
            type: String,
            required: true
        },
        District: {
            type: String,
            required: true
        },
        Pincode: {
            type: String,
            required: true
        }
    },
    CurrentAddress: {
        HouseNo: {
            type: String,
            required: true
        },
        LandMark: {
            type: String,
            required: true
        },
        District: {
            type: String,
            required: true
        },
        Pincode: {
            type: String,
            required: true
        }
    },
    isAddressSame: {
        type: Boolean,
        default: false
    },
    Qualification: {
        type: String,
        required: true
    },
    TeachingExperience: {
        type: String,
        required: true
    },
    ExpectedFees: {
        type: Number,
        required: true
    },
    VehicleOwned: {
        type: Boolean,
        default: false
    },
    
    TeachingMode: {
        type: String,
        enum: [
            'Home Tuition at Student\'s Home',
            'Home Tuition at Your Home',
            'Institute or Group Tuition'
        ],
        required: true
    },
    AcademicInformation: [{
        ClassId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        },
        SubjectNames: [String]
    }],
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true,

    },
    RangeWhichWantToDoClasses: {
        type: Number,
        required: true,
        default: 5  //in km 
    },

    TeacherUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    SubmitOtp: {
        type: String
    },
    OtpExpired: {
        type: Date
    },
    isAllDetailVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Create the Teacher Profile model
const TeacherProfile = mongoose.model('TeacherProfile', TeacherProfileSchema);

module.exports = TeacherProfile;
