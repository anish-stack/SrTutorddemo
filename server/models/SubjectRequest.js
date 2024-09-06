const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const SendEmail = require("../utils/SendEmails");

const subjectTeacherRequestSchema = new mongoose.Schema(
  {
    subject: [
      {
        type: String,
        required: true,
        trim: true,
        set: (v) => sanitizeHtml(v),
      }
    ],
    class: {
      type: String,
      trim: true,
      default: "",
      set: (v) => sanitizeHtml(v),
    },
    location: {
      type: String,
      required: true,
      trim: true,
      set: (v) => sanitizeHtml(v),
    },
    interested: {
      type: String,
      enum: [
        "Home Tuition at My Home",
        
        "Willing to Travel to Teacher's Home",
        "Require Teacher to Travel to My Home",
        "Online Class"
      ],
      required: true,
    },
    howManyClassYouWant: {
      type: String,
      required: true,
    },
    minimumBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    maximumBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    teacherGender: {
      type: String,
      enum: ["Male", "Female", "Any"],
      required: true,
    },
    userContactInfo: {
      name: {
        type: String,
        required: true,
        trim: true,
        set: (v) => sanitizeHtml(v),
      },
      email: {
        type: String,
        required: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
        set: (v) => sanitizeHtml(v),
      },
      contactNumber: {
        type: String,
        required: true,
        trim: true,
 
        set: (v) => sanitizeHtml(v),
      },
    },
    specificrequirement: {
      type: String,
      trim: true,
      set: (v) => sanitizeHtml(v),
    },
    isDealDone:{
      type: Boolean,
      default: false,
    },
    statusOfRequest: {
      type: String,
      default: "pending",
      enum: ["pending", "declined", "Accept"] // Changed to 'accepted' for consistency
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    commentByAdmin: [
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
  },
  { timestamps: true }
);

// Add Comment Method
subjectTeacherRequestSchema.methods.addComment = async function (adminComment) {
  try {
    // Log the admin comment for debugging purposes
    console.log(adminComment);

    // Add the new comment to the commentByAdmin array
    this.commentByAdmin.push({ comment: adminComment });

    // Save the updated document
    await this.save();

    // Prepare the email message
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Comment</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px;
                box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
                background-color: #fff;
                color: #000;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: bold;
            }
            .logo {
                margin-bottom: 10px;
            }
            .content {
                padding: 20px;
                text-align: left;
            }
            .content p {
                font-size: 16px;
                color: #333333;
            }
            .content strong {
                font-weight: bold;
            }
            .cta-button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #E21C1C;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .footer {
                margin-top: 30px;
                padding: 20px;
                background-color: #E21C1C;
                color: #ffffff;
                text-align: center;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://i.ibb.co/zS0B0TQ/srtutor-removebg-preview.png" alt="Sr Tutors Logo" class="logo" />
                <h1>New Comment from Sr Tutors On Your Request</h1>
            </div>
            <div class="content">
                <p>Hello, <strong>${this.userContactInfo.name}</strong>,</p>
                <p>The Sr Tutors has left a comment on your request for <strong>${this.subject}</strong>:</p>
                <p><strong>${adminComment}</strong></p>
                <p>To view more details, click the button below:</p>
                <a href="http://localhost:3000/student/request/${this._id}" class="cta-button">Check Your Request</a>
                <p>Best regards,</p>
                <p>Your Tutoring Service</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Sr Tutors. All rights reserved.</p>
                <p><a href="http://localhost:3000" style="color: #ffffff; text-decoration: underline;">Visit our website</a></p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Send the email
    await SendEmail({
      email: this.userContactInfo.email,
      subject: "New Comment on Your Request",
      message,
    });
  } catch (error) {
    console.error("Error adding comment and sending email:", error);
    throw new Error("Failed to add comment or send email.");
  }
};

// Model definition
const SubjectTeacherRequest = mongoose.model("SubjectTeacherRequest", subjectTeacherRequestSchema);

module.exports = SubjectTeacherRequest;
