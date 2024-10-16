const SubjectTeacherRequest = require("../models/SubjectRequest");
const CatchAsync = require("../utils/CatchAsync");
const SendEmail = require("../utils/SendEmails");
const Teacher = require("../models/Teacher.model");
const ParticularTeacher = require("../models/Particular.model");
const Student = require('../models/Student.model');
const sendEmail = require("../utils/SendEmails");
const { info, ServerError, warn } = require('../utils/Logger');
exports.CreateRequestOfSubject = CatchAsync(async (req, res) => {
  try {
    const user = req.user.id

    // Step 1: Extract data from the request body
    const {
      Subject,
      Class: className,
      Location,
      Interested,
      HowManyClassYouWant,
      MinumBudegt,
      Maxmimu,
      specificrequirement,
      StartDate,
      TeaherGender,
      userconetcIfo, // corrected variable name
    } = req.body;

    // Validate the required fields
    // Step 2: Validate fields and provide specific error messages
    if (!Subject) {
      return res.status(400).json({
        status: "fail",
        message: "Subject is required.",
      });
    }
    if (!Location) {
      return res.status(400).json({
        status: "fail",
        message: "Location is required.",
      });
    }
    if (!Interested) {
      return res.status(400).json({
        status: "fail",
        message: "Interested field is required.",
      });
    }
    if (!HowManyClassYouWant) {
      return res.status(400).json({
        status: "fail",
        message: "How many classes you want is required.",
      });
    }
    if (Number(MinumBudegt) < 500) {
      return res.status(400).json({
        status: "fail",
        message: "Minimum budget must be at least 500.",
      });
    }
    if (Number(Maxmimu) <= Number(MinumBudegt)) {
      return res.status(400).json({
        status: "fail",
        message: "Maximum budget must be greater than minimum budget.",
      });
    }
    if (!StartDate) {
      return res.status(400).json({
        status: "fail",
        message: "Start date is required.",
      });
    }
    if (!TeaherGender) {
      return res.status(400).json({
        status: "fail",
        message: "Teacher gender preference is required.",
      });
    }
    if (!userconetcIfo || !userconetcIfo.email) {
      return res.status(400).json({
        status: "fail",
        message: "User contact information and email are required.",
      });
    }
    // Step 2: Create a new subject teacher request
    const newRequest = new SubjectTeacherRequest({
      subject: Subject,
      class: className || "subject",
      location: Location,
      interested: Interested,
      specificrequirement,
      howManyClassYouWant: HowManyClassYouWant,
      minimumBudget: MinumBudegt,
      maximumBudget: Maxmimu,
      startDate: StartDate,
      teacherGender: TeaherGender,
      studentId: user,
      userContactInfo: {
        name: userconetcIfo.Name,
        email: userconetcIfo.email,
        contactNumber: userconetcIfo.contactnumver,
      }, // corrected variable name
    });

    // Step 3: Save the request to the database
    await newRequest.save();

    // Step 4: Format the current date and time for the email
    const createdTime = new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // Step 5: Send a confirmation email to the user
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
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
                background-color: #fff;
                padding: 20px;
                text-align: center;
                box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }
            .header img {
                max-width: 100%;
                height: 100px;
                margin-bottom: 10px;
            }
            .header h1 {
                color: #0D0D0D;
                font-size: 24px;
                font-weight: 800;
                margin: 0;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content h1 {
                font-size: 22px;
                color: #000000;
                margin-bottom: 10px;
            }
            .content p {
                font-size: 18px;
                color: #777777;
                font-weight: 300;
                margin: 10px 0;
            }
            .content img {
                max-width: 100%;
                height: 300px;
                margin-top: 20px;
                margin-bottom: 20px;
                border-radius: 10px;
            }
            .content-text {
                font-size: 16px;
                color: #000000;
                line-height: 1.5;
                margin-top: 20px;
            }
            .content-text-bold {
                color: #0D0D0D;
                font-size: 24px;
                font-weight: 800;
                line-height: 1.5;
                margin-top: 20px;
            }
            .content-text strong {
                color: #3D3C3C;
            }
            .cta {
                text-align: center;
                padding: 20px;
            }
            .cta a {
                display: inline-block;
                padding: 10px 20px;
                background-color: #E21C1C;
                color: #ffffff;
                text-decoration: none;
                font-size: 16px;
                border-radius: 5px;
            }
            @media only screen and (max-width: 600px) {
                .email-container {
                    padding: 10px;
                }
                .content h1 {
                    font-size: 20px;
                }
                .content p {
                    font-size: 16px;
                }
                .content-text {
                    font-size: 14px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://i.ibb.co/zS0B0TQ/srtutor-removebg-preview.png" alt="Logo">
                <h1>Thanks For Raising Request</h1>
            </div>
            <div class="content">
                <h1>${Subject} Request Received!</h1>
                <img src="https://i.ibb.co/XjMTHP8/pngwing-com-9.png" alt="Main Image">
                <p class="content-text-bold">We Are Working On Your Request!</p>
                <p class="content-text">Hello, <strong>${userconetcIfo.Name}</strong>! We have received your request for a subject teacher. Our team is working on it, and we will get back to you shortly with the best matches.</p>
                <p class="content-text"><strong>Date:</strong> ${createdTime}</p>
                <p class="content-text"><strong>Class:</strong> ${className}</p>
                <p class="content-text"><strong>Location:</strong> ${Location}</p>
            </div>
            <div class="cta">
                <a href="http://localhost:3000/" target="_blank">Check Website</a>
            </div>
        </div>
    </body>
    </html>
    `;

    await SendEmail({
      email: userconetcIfo.email,
      subject: "Subject Teacher Request Confirmation",
      message: message,
    });

    // Step 6: Send a success response to the client
    res.status(201).json({
      status: "success",
      data: {
        request: newRequest,
      },
    });
  } catch (error) {
    // Handle any errors
    ServerError(`Error in CreateRequestOfSubject: ${error.message}`, 'Subject Controller', 'CreateRequestOfSubject');
    console.error(error); // Log the error for debugging
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

exports.addAdminComment = CatchAsync(async (req, res) => {
  try {
    const { requestId, comment } = req.body;

    const request = await SubjectTeacherRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        status: "error",
        message: "Request not found",
      });
    }

    await request.addComment(comment);

    res.status(200).json({
      status: "success",
      message: "Comment added and email sent to the student.",
    });
  } catch (error) {
    console.log(error);
    ServerError(`Error in addAdminComment: ${error.message}`, 'Subject Controller', 'addAdminComment')
    res.status(200).json({
      status: "failed",
      message: "Comment not added and email not be  sent to the student.",
    });
  }
});

exports.getAllRequestOfSubject = CatchAsync(async (req, res) => {
  try {
    //Show Request By Created time stamp  latest
    const AllRequest = await SubjectTeacherRequest.find().sort({
      createdAt: -1,
    });

    if (AllRequest.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No Request Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Data found",
      data: AllRequest,
    });
  } catch (error) {
    ServerError(`Error in getAllRequestOfSubject: ${error.message}`, 'Subject Controller', 'getAllRequestOfSubject')

  }
});

exports.toggleStatusOfRequest = CatchAsync(async (req, res) => {
  try {
    const { requestId, action } = req.params;

    // Attempt to find the request in SubjectTeacherRequest collection
    let request = await SubjectTeacherRequest.findById(requestId);

    if (!request) {
      // If not found, attempt to find the request in ParticularTeacher collection
      request = await ParticularTeacher.findById(requestId);

      if (!request) {
        // If still not found, return a 404 error response
        return res.status(404).json({
          success: false,
          message: "Request not found",
        });
      }
    }

    // Update the status of the found request
    request.statusOfRequest = action;
    await request.save();
    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      throw new Error('Redis client is not available.');
    }

    await redisClient.del('particularTeacherData');
    // Return a success response
    res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      data: request,
    });

  } catch (error) {
    ServerError(`Error in toggleStatusOfRequest: ${error.message}`, 'Subject Controller', 'toggleStatusOfRequest')

    console.error("Error updating request status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


exports.deleteRequest = CatchAsync(async (req, res) => {
  try {
    const { requestId } = req.params;

    // Attempt to find the request in SubjectTeacherRequest collection
    let request = await SubjectTeacherRequest.findByIdAndDelete(requestId);

    if (!request) {
      // If not found, attempt to find the request in ParticularTeacher collection
      request = await ParticularTeacher.findById(requestId);

      if (!request) {
        // If still not found, return a 404 error response
        return res.status(404).json({
          success: false,
          message: "Request not found",
        });
      }
    }

    // Update the status of the found request
   
    await request.save();
    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      throw new Error('Redis client is not available.');
    }

    await redisClient.del('particularTeacherData');
    // Return a success response
    res.status(200).json({
      success: true,
      message: "Request Delete  successfully",
      data: request,
    });

  } catch (error) {
    ServerError(`Error in Delete: ${error.message}`, 'Subject Controller', 'delete request')

    console.error("Error updating request status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


exports.ToggleDealDone = CatchAsync(async (req, res) => {
  try {
    const { requestId } = req.params;

    // Validate requestId
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    // Fetch the request
    const request = await ParticularTeacher.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check if the request status is 'Accept'
    if (request.statusOfRequest !== 'Accept') {
      return res.status(400).json({
        success: false,
        message: "The request is not yet accepted. Please ensure the request is marked as 'Accepted' before finalizing the deal.",
      });
    }


    // Fetch student and teacher info
    let StudentFind, getTeacherInfo;
    try {
      StudentFind = await Student.findById(request.studentId);
      getTeacherInfo = await Teacher.findById(request.teacherId);
    } catch (dbError) {
      return res.status(500).json({
        success: false,
        message: "Error fetching student or teacher data",
      });
    }

    if (!StudentFind) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!getTeacherInfo) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Check if the deal is already done
    if (request.isDealDone) {
      return res.status(400).json({
        success: false,
        message: "Deal is already done. Student subscribed successfully.",
      });
    }

    // Toggle the deal status
    request.isDealDone = !request.isDealDone;
    await request.save();

    // Prepare email content
    const createdTime = new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const message = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Congratulations</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
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
            background-color: #003873;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            color: #ffffff;
        }
        .header img {
            max-width: 80px;
            height: auto;
            margin-bottom: 10px;
        }
        .header h1 {
            font-size: 26px;
            margin: 0;
            font-weight: 700;
        }
        .content {
            padding: 20px;
            text-align: left;
            color: #333333;
        }
        .content h2 {
            font-size: 22px;
            color: #003873;
            margin-bottom: 10px;
            border-bottom: 2px solid #003873;
            padding-bottom: 5px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 10px 0;
        }
        .teacher-profile {
            background-color: #f0f8ff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .teacher-profile h3 {
            font-size: 20px;
            color: #003873;
            margin: 0 0 10px;
        }
        .teacher-profile p {
            font-size: 16px;
            margin: 5px 0;
        }
        .cta {
            text-align: center;
            padding: 20px;
            margin-top: 20px;
        }
        .cta a {
            display: inline-block;
            padding: 12px 25px;
            background-color: #e21c1c;
            color: #ffffff;
            text-decoration: none;
            font-size: 18px;
            border-radius: 5px;
            font-weight: 600;
        }
        @media only screen and (max-width: 600px) {
            .email-container {
                padding: 15px;
            }
            .content h2 {
                font-size: 20px;
            }
            .cta a {
                font-size: 16px;
                padding: 10px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://i.ibb.co/zS0B0TQ/srtutor-removebg-preview.png" alt="Logo">
            <h1>Congratulations!</h1>
        </div>
        <div class="content">
            <h2>You've Successfully Subscribed!</h2>
            <p>Dear <strong>${StudentFind.StudentName}</strong>,</p>
            <p>Congratulations! You have successfully subscribed to one of our renowned teachers. We are thrilled to have you on board and excited for the learning journey ahead.</p>
            <p><strong>Subscription Details:</strong></p>
            <ul style="list-style-type: none; padding: 0;">
                <li><strong>Date:</strong> ${createdTime}</li>
                <li><strong>Class:</strong> ${request.className}</li>
                <li><strong>Location:</strong> ${request.Location}</li>
            </ul>
            
            <div class="teacher-profile">
                <h3>Teacher Profile</h3>
                <p><strong>Name:</strong> ${getTeacherInfo.TeacherName}</p>
                <p><strong>Gender:</strong> ${getTeacherInfo.gender}</p>
                <p>Our esteemed teacher, <strong>${getTeacherInfo.TeacherName}</strong>, is looking forward to assisting you. With their extensive experience, you are set for an exceptional educational experience.</p>
            </div>

            <div class="cta">
                <a href="${process.env.FRONTEND_URL}" target="_blank">Explore More</a>
            </div>
        </div>
    </div>
</body>
</html>
`;

    // Send email
    try {
      await sendEmail({
        email: StudentFind.Email,
        subject: `${request.Subject} Request Received`,
        message
      });
    } catch (emailError) {
      ServerError(`Error in toggleStatusOfRequest: ${error.message}`, 'Subject Controller', 'toggleStatusOfRequest')

      return res.status(500).json({
        success: false,
        message: "Error sending email",
      });
    }

    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      throw new Error('Redis client is not available.');
    }

    await redisClient.del('particularTeacherData');

    res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      data: request,
    });
  } catch (error) {
    console.error('Error in ToggleDealDone:', error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
});
