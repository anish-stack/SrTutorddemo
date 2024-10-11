const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const SendEmail = require("../utils/SendEmails");

// Define the unified Request schema
const RequestSchema = new mongoose.Schema(
    {
        ClassLangUage: {
            type: String,
        },
        requestId: {
            type: String,
        },
        requestType: {
            type: String,
            required: true
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },
        VehicleOwned: {
            type: String,
        },
        className: {
            type: String,
            trim: true,
            set: (v) => sanitizeHtml(v),
         
        },
        subjects: [String],
        interestedInTypeOfClass: {
            type: String,
           
        },
        studentInfo: {
            studentName: {
                type: String,
                // required: true,
                trim: true,
                set: (v) => sanitizeHtml(v),
            },
            contactNumber: {
                type: String,
                // required: true,
                trim: true,
                set: (v) => sanitizeHtml(v),
            },
            emailAddress: {
                type: String,
              
                trim: true,
               
                set: (v) => sanitizeHtml(v),
            },
        },
        teacherGenderPreference: {
            type: String,
            enum: ["Male", "Female", "Any"],
            // required: true,
        },
        numberOfSessions: {
            type: String,
            // required: true,
        },
        experienceRequired: {
            type: Number,
            default: 0,
        },
        minBudget: {
            type: Number,
            // required: true,
            min: 0,
        },
        maxBudget: {
            type: Number,
            // required: true,
            min: 0,
        },
        locality: {
            type: String,
            trim: true,
            set: (v) => sanitizeHtml(v),
            // required: true,
        },
        startDate: {
            type: String,

            // required: true,
        },
        isTeacherEmailSend: {
            type: Boolean,
            default: false,
        },
        isStudentEmailSend: {
            type: Boolean,
            default: false,
        },
        specificRequirement: {
            type: String,
            trim: true,
            set: (v) => sanitizeHtml(v),
        },
        otp: {
            type: String,
            // required: true,
        },
        otpExpiryDate: {
            type: Date,
            default: Date.now,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: "2dsphere",
            },
        },
        teacherAcceptThis: {
            type: String,
            default: "pending",
            enum: ["pending", "declined", "accepted"]
        },
        commentsByAdmin: [
            {
                comment: {
                    type: String,
                    set: (v) => sanitizeHtml(v),
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        dealDone: {
            type: Boolean,
            default: false,
        },
        statusOfRequest: {
            type: String,
            default: "pending",
            enum: ["pending", "declined", "accepted"],
        },
        postVerified: {
            type: Boolean,
            default: false,
        },
        IsShowAtSlider: {
            type: Boolean,
            default: false
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TeacherProfile',
        },
    },
    { timestamps: true }
);

// Add a method to handle admin comments and send emails
RequestSchema.methods.addAdminComment = async function (adminComment) {
    this.commentsByAdmin.push({ comment: adminComment });
    await this.save();

    const message = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Admin Comment</title>
    <style> /* Your email styles here */ </style>
  </head>
  <body>
    <div>
      <h1>New Comment on Your Request</h1>
      <p>Hello, <strong>${this.studentInfo.studentName}</strong></p>
      <p>There is a new comment on your request:</p>
      <p><strong>${adminComment}</strong></p>
    </div>
  </body>
  </html>
  `;

    await SendEmail({
        email: this.studentInfo.emailAddress,
        subject: "New Comment on Your Request",
        message,
    });
};

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
