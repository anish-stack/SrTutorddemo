const mongoose = require('mongoose');

// Define the Teacher Profile schema
const rangeSchema = new mongoose.Schema({
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
        }
    }
})


const TeacherProfileSchema = new mongoose.Schema({
    ProfilePic: {
        url: {
            type: String,

        },
        publicId: {
            type: String,
            // required: true,
        }
    },
    FullName: {
        type: String,
        required: true,
        trim: true
    },
    DOB: {
        type: String
    },
    Gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    ContactNumber: {
        type: String,
        // unique: true
    },
    AlternateContact: {
        type: String
    },
    PermanentAddress: {
        streetAddress: {
            type: String,
        },
        City: {
            type: String,

        },
        Area: {
            type: String,

        },
        LandMark: {
            type: String,
       
        },

        Pincode: {
            type: String,
         
        }
    },
    CurrentAddress: {
        streetAddress: {
            type: String,
        },
        City: {
            type: String,

        },
        Area: {
            type: String,

        },
     
        Pincode: {
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
        type: String
    },
    PostForHim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    },
    VehicleOwned: {
        type: Boolean,
        default: false
    },

    TeachingLocation: {
        State: {
            type: String,
        
        },
        City: {
            type: String,
           
        },
        Area: [String]
    },
   
    AcademicInformation: [{
        ClassId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        },
        className: String,
        SubjectNames: [String]
    }],
    latitude: {
        type: Number,

    },
    longitude: {
        type: Number,


    },
    RangeWhichWantToDoClasses: [
        rangeSchema
    ],

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
    },
    DocumentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    StudentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    Reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    srVerifiedTag: {
        type: Boolean,
        default: false
    },
    LeadIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeadSend'
    }],
    TeachingMode:{
        type: String,
       default: 'Online'
    }

}, { timestamps: true });

TeacherProfileSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    if (this.isNew) {
        this.createdAt = new Date();
    }
    next();
});

// Create the Teacher Profile model
TeacherProfileSchema.index({ 'RangeWhichWantToDoClasses.location': '2dsphere' })
const TeacherProfile = mongoose.model('TeacherProfile', TeacherProfileSchema);

module.exports = TeacherProfile;
