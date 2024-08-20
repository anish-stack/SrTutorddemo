const SubjectTeacherRequest = require("../models/SubjectRequest");
const CatchAsync = require("../utils/CatchAsync");
const SendEmail = require("../utils/SendEmails");

exports.CreateRequestOfSubject = CatchAsync(async (req, res) => {
  try {
    // Step 1: Extract data from the request body
    const {
      subject,
      class: className,
      location,
      interested,
      howManyClassYouWant,
      minimumBudget,
      maximumBudget,
      startDate,
      teacherGender,
      userContactInfo,
    } = req.body;

    // Step 2: Create a new subject teacher request
    const newRequest = new SubjectTeacherRequest({
      subject,
      class: className,
      location,
      interested,
      howManyClassYouWant,
      minimumBudget,
      maximumBudget,
      startDate,
      teacherGender,
      userContactInfo,
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
                <h1>${subject} Request Received!</h1>
                <img src="https://i.ibb.co/XjMTHP8/pngwing-com-9.png" alt="Main Image">
                <p class="content-text-bold">We Are Working On Your Request!</p>
                <p class="content-text">Hello, <strong>${userContactInfo.name}</strong>! We have received your request for a subject teacher. Our team is working on it, and we will get back to you shortly with the best matches.</p>
                <p class="content-text"><strong>Date:</strong> ${createdTime}</p>
                <p class="content-text"><strong>Class:</strong> ${className}</p>
                <p class="content-text"><strong>Location:</strong> ${location}</p>
            </div>
            <div class="cta">
                <a href="http://localhost:3000/" target="_blank">Check Website</a>
            </div>
        </div>
    </body>
    </html>
    `;

    await SendEmail({
      email: userContactInfo.email,
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
  } catch (error) {}
});

exports.toggleStatusOfRequest = CatchAsync(async (req, res) => {
  try {
    const { requestId } = req.params; // Extract request ID from params

    // Find the request by ID and toggle its status
    const request = await SubjectTeacherRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    request.statusOfRequest = !request.statusOfRequest; // Toggle the status
    await request.save(); // Save the updated request

    res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
