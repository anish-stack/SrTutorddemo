const Teacher = require("../models/Teacher.model");
const TeacherProfile = require("../models/TeacherProfile.model");
const Class = require("../models/ClassModel");
const CatchAsync = require("../utils/CatchAsync");
const sendToken = require("../utils/SendToken");
const sendEmail = require("../utils/SendEmails");
const crypto = require("crypto");
const Mongoose = require('mongoose');
const DocumentSchema = require("../models/Document.model");
const Cloudinary = require('cloudinary').v2;
require('dotenv').config();
const streamifier = require('streamifier')
const SubjectTeacherRequest = require('../models/SubjectRequest')
const TeacherRequest = require('../models/TeacherRequest.model')
const ClassRequest = require('../models/ClassRequest')
const axios = require('axios');
const Request = require("../models/UniversalSchema");
const SendWhatsAppMessage = require("../utils/SendWhatsappMeg");
const cron = require('node-cron');
// Configure Cloudinary
Cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});
//Teacher New Register
exports.TeacherRegister = CatchAsync(async (req, res) => {
  try {
    const {
      TeacherName,
      PhoneNumber,
      Email,
      Password,
      DOB,
      Age,
      gender,
      AltNumber,
    } = req.body;

    const { DocumentType } = req.query;

    const preDefineTypes = ["Aadhaar", "Pan", "Voter Card", "Passport"];

    if (!preDefineTypes.includes(DocumentType)) {
      return res.status(400).json({
        message: "Invalid Document Type. Please provide a valid type: Aadhaar, Pan, Voter Card, or Passport.",
      });
    }

    const missingFields = [];
    if (!TeacherName) missingFields.push("Teacher Name");
    if (!PhoneNumber) missingFields.push("Phone Number");
    if (!Email) missingFields.push("Email");
    if (!Password) missingFields.push("Password");
    if (!DOB) missingFields.push("Date of Birth");
    if (!gender) missingFields.push("Gender");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "The following fields are missing: " + missingFields.join(", "),
      });
    }

    const existingTeacher = await Teacher.findOne({
      $or: [{ Email }, { PhoneNumber }]
    });
    if (existingTeacher) {
      if (existingTeacher.isTeacherVerified) {
        return res.status(400).json({ message: "Teacher with this email and Phone Number already exists" });
      } else {
        existingTeacher.Password = Password;
        existingTeacher.SignInOtp = crypto.randomInt(100000, 999999);
        existingTeacher.OtpExpiresTime = Date.now() + 2 * 60 * 1000;
        await existingTeacher.save();

        const Message = `Dear ${existingTeacher.TeacherName},\nYour OTP for verification is: ${existingTeacher.SignInOtp}.\nThis OTP is valid for a limited time.\nIf you did not request this OTP, please ignore this message.\nBest regards,\nS R Tutors`;


        await SendWhatsAppMessage(Message, PhoneNumber);

        return res.status(200).json({
          message: "OTP resent. Please verify your Contact Number.",
        });
      }
    }

    const DocumentFile = req.files?.Document?.[0];

    const QualificationFile = req.files?.Qualification?.[0];

    if (!DocumentFile) {
      return res.status(400).json({
        message: "No Document file uploaded. Please upload an identity document.",
      });
    }

    if (!QualificationFile) {
      return res.status(400).json({
        message: "No Qualification document uploaded. Please upload a qualification document.",
      });
    }

    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        let stream = Cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            console.error("Cloudinary upload error: ", error);
            return reject(new Error("Failed to upload file to Cloudinary."));
          }
          resolve(result);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    let documentUploadResult;
    try {
      documentUploadResult = await uploadFromBuffer(DocumentFile.buffer);
    } catch (error) {
      console.error("Error uploading identity document: ", error);
      return res.status(500).json({
        message: "Error uploading identity document to Cloudinary.",
        error: error.message,
      });
    }

    let qualificationUploadResult;
    try {
      qualificationUploadResult = await uploadFromBuffer(QualificationFile.buffer);
    } catch (error) {
      console.error("Error uploading qualification document: ", error);
      return res.status(500).json({
        message: "Error uploading qualification document to Cloudinary.",
        error: error.message,
      });
    }

    const otp = crypto.randomInt(100000, 999999);
    const otpExpiresTime = Date.now() + 2 * 60 * 1000;

    const newTeacher = await Teacher.create({
      TeacherName,
      PhoneNumber,
      Email,
      Password,
      Age,
      gender,
      AltNumber,
      DOB,
      identityDocument: {
        DocumentType,
        DocumentImageUrl: documentUploadResult.secure_url,
        DocumentPublicId: documentUploadResult.public_id,
      },
      QualificationDocument: {
        QualificationImageUrl: qualificationUploadResult?.secure_url,
        QualificationPublicId: qualificationUploadResult?.public_id,
      },
      isTeacherVerified: false,
      SignInOtp: otp,
      OtpExpiresTime: otpExpiresTime,
    });

    const NewMessage = `Dear ${newTeacher.TeacherName},\nYour OTP for verification is: ${newTeacher.SignInOtp}.\nThis OTP is valid for a limited time.\nIf you did not request this OTP, please ignore this message.\nBest regards,\nS R Tutors`;


    await SendWhatsAppMessage(NewMessage, PhoneNumber);
    // console.log("newTeacher", newTeacher)

    res.status(201).json({
      message: "Teacher registered successfully. Please verify your Contact Number.",
    });
  } catch (error) {
    console.error("Registration error: ", error);
    res.status(500).json({
      message: "Error occurred during registration.",
      error: error.message,
    });
  }
});


//Teacher Verify Otp
exports.TeacherVerifyOtp = CatchAsync(async (req, res) => {
  try {
    const { Email, otp } = req.body;

    const ExistTeacher = await Teacher.findOne({ Email });
    if (!ExistTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (
      ExistTeacher.SignInOtp !== otp ||
      ExistTeacher.OtpExpiresTime < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    ExistTeacher.isTeacherVerified = true;
    ExistTeacher.isBlockForOtp = false
    ExistTeacher.OtpBlockTime = null
    ExistTeacher.SignInOtp = undefined;
    ExistTeacher.OtpExpiresTime = undefined;
    await ExistTeacher.save();
    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      throw new Error("Redis client is not available.");
    }

    // Check if Teacher is cached
    await redisClient.del(`Teacher`);
    await sendToken(ExistTeacher, res, 201);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//Teacher Resent Otp
exports.TeacherResendOtp = CatchAsync(async (req, res) => {
  const { Email } = req.body;
  console.log(req.body)
  const Teachers = await Teacher.findOne({ Email });
  if (!Teachers) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  if (Teachers.isTeacherVerified) {
    return res.status(400).json({ message: "Teacher already verified" });
  }



  if (Teachers.isBlockForOtp === true) {
    return res.status(429).json({ message: "You have been temporarily blocked from requesting OTP. Please try again later." });
  }

  const now = Date.now();

  if (Teachers.OtpExpiresTime && now < Teachers.OtpExpiresTime - 1 * 60 * 1000) {
    const remainingTimeInMs = Teachers.OtpExpiresTime - 1 * 60 * 1000 - now;
    const remainingSeconds = Math.ceil(remainingTimeInMs / 1000);

    return res.status(429).json({
      message: `OTP already sent recently. Please wait ${remainingSeconds} seconds before requesting a new OTP.`
    });
  }

  Teachers.SignInOtp = crypto.randomInt(100000, 999999);
  Teachers.OtpExpiresTime = now + 2 * 60 * 1000;
  await Teachers.save();

  const NewMessage = `Dear ${Teachers.TeacherName},\nYour OTP for verification is: ${Teachers.SignInOtp}.\nThis OTP is valid for a limited time.\nIf you did not request this OTP, please ignore this message.\nBest regards,\nS R Tutors`;
  try {
    await SendWhatsAppMessage(NewMessage, Teachers.PhoneNumber);
  } catch (error) {
    return res.status(500).json({ message: "Failed to send OTP. Please try again later." });
  }
  res.status(200).json({ message: "OTP resent successfully" });
});


exports.teacherBlockForOtp = CatchAsync(async (req, res) => {
  try {
    const { Email, id, HowManyRequest } = req.body;
    const Teachers = await Teacher.findOne({
      $or: [
        { _id: id },      // Assuming 'id' is defined
        { Email: Email }  // Assuming 'email' is defined
      ]
    });
    console.log(Teachers)

    if (!Teachers) {
      return res.status(404).json({ message: "Teacher not found" });
    }


    if (HowManyRequest === 3) {
      Teachers.isBlockForOtp = true;
      Teachers.OtpBlockTime = new Date();
      await Teachers.save();
      return res.status(200).json({ message: "Yout Are  blocked from requesting OTP for End Of The day" });
    }
    console.log(Teacher)
    res.status(200).json({ message: "Teacher request within limit" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});


//Teacher And Teacher Login
exports.TeacherLogin = CatchAsync(async (req, res) => {
  try {
    const { anyPhoneAndEmail, Password } = req.body;
    // console.log(req.body)
    if (!anyPhoneAndEmail || !Password) {
      return res.status(403).json({
        Success: false,
        message: "Please fill all required fields",
      });
    }

    const CheckUser = await Teacher.findOne({
      $or: [{ Email: anyPhoneAndEmail }, { PhoneNumber: anyPhoneAndEmail }]
    });
    if (!CheckUser) {
      return res.status(403).json({
        Success: false,
        message: "User not found",
      });
    }

    // Determine user type and compare password
    if (CheckUser.Role === "Teacher") {
      const isPasswordMatch = await CheckUser.comparePassword(Password);
      if (!isPasswordMatch) {
        return res.status(403).json({
          Success: false,
          message: "Invalid password",
        });
      }
      CheckUser.Password = undefined;
      await sendToken(CheckUser, res, 201);
    } else {
      return res.status(403).json({
        Success: false,
        message: "Invalid role",
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

//Teacher Password Change Request
exports.TeacherPasswordChangeRequest = CatchAsync(async (req, res) => {
  try {
    const { Email } = req.body;

    // Find the teacher by email
    const teacher = await Teacher.findOne({ Email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found. Please check the email address and try again." });
    }

    // Generate OTP and set expiration time
    teacher.ForgetPasswordOtp = crypto.randomInt(100000, 999999);
    teacher.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // 10 minutes
    await teacher.save();

    // Create WhatsApp message
    const NewMessage = `Password Change Request OTP Verification\nDear ${teacher.TeacherName},\nWe have generated an OTP for your password change request: ${teacher.ForgetPasswordOtp}.\nPlease use this OTP to complete your password change process. This OTP is valid for a limited time.\nIf you did not request this, please ignore this message.\nBest regards,\nS R Tutors`;

    // Send OTP via WhatsApp
    const sent = await SendWhatsAppMessage(NewMessage, teacher.PhoneNumber);
    if (sent.success === false) {
      return res.status(500).json({ message: "Failed to send OTP. Please try again later." });
    }

    // Success response
    res.status(200).json({ message: "Password reset OTP has been successfully sent to your registered phone number." });
  } catch (err) {
    console.error("Error in TeacherPasswordChangeRequest:", err.message);
    res.status(500).json({ message: "An error occurred while processing your request. Please try again later." });
  }
});
;

// Teacher Verify Password OTP
exports.TeacherVerifyPasswordOtp = CatchAsync(async (req, res) => {
  try {
    const { Email, otp, newPassword } = req.body;

    // Find the teacher by email
    const teacher = await Teacher.findOne({ Email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found. Please check the email address and try again." });
    }

    // Check if the OTP is valid and not expired
    if (
      teacher.ForgetPasswordOtp !== otp ||
      teacher.OtpExpiresTime < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP. Please request a new OTP and try again." });
    }

    // Update the password and clear the OTP fields
    teacher.Password = newPassword;
    teacher.ForgetPasswordOtp = undefined;
    teacher.OtpExpiresTime = undefined;
    await teacher.save();

    // Success response
    res.status(200).json({ message: "Password changed successfully. You can now log in with your new password." });
  } catch (err) {
    console.error("Error in TeacherVerifyPasswordOtp:", err.message);
    res.status(500).json({ message: "An error occurred while processing your request. Please try again later." });
  }
});

//Teacher Resent Password Otp
exports.TeacherPasswordOtpResent = CatchAsync(async (req, res) => {
  const { Email, howManyHit } = req.body;

  const Teachers = await Teacher.findOne({ Email });
  if (!Teachers) {
    return res.status(404).json({ message: "Teacher not found" });
  }
  if (Teachers.isBlockForOtp === true) {
    return res.status(429).json({ message: "You have been temporarily blocked from requesting OTP. Please try again later." });
  }

  // Define the current time
  const now = Date.now();

  // Check if the previous OTP is still valid
  if (Teachers.OtpExpiresTime && now < Teachers.OtpExpiresTime - 1 * 60 * 1000) {
    const remainingTimeInMs = Teachers.OtpExpiresTime - 1 * 60 * 1000 - now;
    const remainingSeconds = Math.ceil(remainingTimeInMs / 1000);

    return res.status(429).json({
      message: `OTP already sent recently. Please wait ${remainingSeconds} seconds before requesting a new OTP.`
    });
  }

  // If the hit count exceeds the limit, block the teacher from requesting OTP
  if (howManyHit >= 3) {
    Teachers.isBlockForOtp = true;
    Teachers.OtpBlockTime = new Date();
    await Teachers.save();

    return res.status(403).json({ message: "You are blocked from requesting OTP for the end of the day." });
  }

  // Generate a new OTP and set its expiration time
  Teachers.ForgetPasswordOtp = crypto.randomInt(100000, 999999);
  Teachers.OtpExpiresTime = Date.now() + 2 * 60 * 1000; // OTP expires in 10 minutes
  await Teachers.save();

  // Prepare the message for WhatsApp
  const Message = `Password Change Request Resend OTP Verification\nDear ${Teachers.TeacherName},\nYour OTP for password change verification is: ${Teachers.ForgetPasswordOtp}.\nPlease use this OTP to complete your password change process. This OTP is valid for a limited time, so please proceed without delay.\nIf you did not request this, please ignore this message.\nBest regards,\nS R Tutors`;

  try {
    // Send OTP via WhatsApp
    await SendWhatsAppMessage(Message, Teachers.PhoneNumber);
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    // Handle WhatsApp message sending error
    console.error('Failed to send WhatsApp message:', error);
    res.status(500).json({ message: "Failed to send OTP. Please try again later." });
  }
});


//Add Profile Details Of Verified Teacher
exports.AddProfileDetailsOfVerifiedTeacher = CatchAsync(async (req, res) => {
  try {
    const userId = req.user.id;

    const CheckTeacher = await Teacher.findById(userId);
    if (!CheckTeacher) {
      return res.status(403).json({
        success: false,
        message: "Unauthorised ACtion Performed",
      });
    }
    // console.log(userId)
    const FetchProfileExist = await TeacherProfile.findOne({
      TeacherUserId: userId,
    });
    // console.log(FetchProfileExist)
    if (FetchProfileExist) {
      return res.status(403).json({
        success: false,
        message: "Profile Already Updated",
      });
    }

    const {
      FullName,
      DOB,
      Gender,
      ContactNumber,
      AlternateContact,
      PermanentAddress,
      CurrentAddress,
      isAddressSame,
      Qualification,
      TeachingExperience,
      ExpectedFees,
      VehicleOwned,
      TeachingMode,
      AcademicInformation,
      latitude,
      longitude,
      RangeWhichWantToDoClasses,

    } = req.body;
    const ranges = RangeWhichWantToDoClasses.flatMap((range) => range)
    console.log(ranges)
    const emptyFields = [];

    // Validate that all required fields are present and not empty
    if (!FullName) emptyFields.push('FullName');
    if (!DOB) emptyFields.push('DOB');
    if (!Gender) emptyFields.push('Gender');
    if (!ContactNumber) emptyFields.push('ContactNumber');
    if (!PermanentAddress) emptyFields.push('PermanentAddress');
    if (!CurrentAddress) emptyFields.push('CurrentAddress');
    if (!Qualification) emptyFields.push('Qualification');
    if (!TeachingExperience) emptyFields.push('TeachingExperience');
    if (!ExpectedFees) emptyFields.push('ExpectedFees');
    if (!TeachingMode) emptyFields.push('TeachingMode');
    if (!AcademicInformation) emptyFields.push('AcademicInformation');
    if (!RangeWhichWantToDoClasses) emptyFields.push('RangeWhichWantToDoClasses');

    // If there are any missing fields, return an error
    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: `Please complete the following required fields: ${emptyFields.join(', ')}`,
      });
    }
    // Validate that PermanentAddress and CurrentAddress contain required sub-fields
    const requiredAddressFields = [
      "streetAddress",
      "City",
      "LandMark",
      "Area",
      "Pincode",
    ];

    let missingFields = [];

    for (const field of requiredAddressFields) {
      if (!PermanentAddress[field]) {
        missingFields.push(`Permanent Address: ${field}`);
      }
      if (!CurrentAddress[field]) {
        missingFields.push(`Current Address: ${field}`);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "The following address fields are missing or incomplete",
        missingFields: missingFields
      });
    }





    for (const element of AcademicInformation) {
      let classExists = await Class.findById(element.ClassId);
      if (!classExists) {
        // Check if the class ID exists in inner classes
        const classInInnerClasses = await Class.findOne({
          "InnerClasses._id": element.ClassId,
        });
        if (!classInInnerClasses) {
          return res.status(400).json({
            message: `Class with ID ${element.ClassId} does not exist`,
          });
        }
        classExists = classInInnerClasses;
      }

      // Extract subject names from the found class
      const classSubjects = classExists.Subjects.map(
        (subject) => subject.SubjectName
      );

      // Check if all subjects in AcademicInformation are included in classSubjects
      const allSubjectsValid = element.SubjectNames.every((subject) =>
        classSubjects.some((classSubject) =>
          classSubject.toLowerCase().includes(subject.toLowerCase())
        )
      );

      if (!allSubjectsValid) {
        return res.status(400).json({
          message: "Some subjects in Academic Information are invalid",
        });
      }
    }

    // Generate OTP and its expiration time
    const SubmitOtp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    const OtpExpiresTime = Date.now() + 2 * 60 * 1000; // OTP valid for 10 minutes
    const formattedRanges = ranges.map(range => ({
      location: {
        type: 'Point',
        coordinates: [range.lng, range.lat] // GeoJSON format requires [longitude, latitude]
      }
    }));
    // Save or update teacher profile details
    const teacherProfile = new TeacherProfile({
      TeacherUserId: userId,
      FullName,
      DOB,
      Gender,
      ContactNumber,
      AlternateContact,
      PermanentAddress,
      CurrentAddress,
      isAddressSame,
      Qualification,
      TeachingExperience,
      ExpectedFees,
      VehicleOwned,
      TeachingMode,
      AcademicInformation,
      latitude,
      longitude,
      RangeWhichWantToDoClasses: formattedRanges,
      SubmitOtp,
      OtpExpired: OtpExpiresTime,
      isAllDetailVerified: false, // Assuming profile is not verified yet
    });
    CheckTeacher.TeacherProfile = teacherProfile._id;
    // Send OTP via email
    const Email = req.user.id.Email;
    // console.log(Email);
    const Message = `OTP Verification\nDear ${FullName},\nWe are excited to proceed with your verification process. Please use the One-Time Password (OTP) provided below to continue:\n${SubmitOtp}\nThis OTP is valid for the next 2 minutes. Please complete your verification within this time frame.\nIf you did not request this OTP, please disregard this message. For assistance, feel free to reach out to our support team.\nBest regards,\nS R Tutors\nEmail: support@srtutors.com`;
    await SendWhatsAppMessage(Message, CheckTeacher.PhoneNumber);
    if (!CheckTeacher.DOB) {
      CheckTeacher.DOB = teacherProfile.DOB
    }
    await teacherProfile.save();
    const save = await CheckTeacher.save();

    const redisClient = req.app.locals.redis;
    if (!redisClient) {
      return res.status(402).json({
        success: false,
        message: "Redis No Found"
      })
    }
    // console.log(teacherProfile)
    await redisClient.del('Teacher')
    // await SendWhatsAppMessage(Message, ContactNumber);

    // Respond with success message
    res.status(200).json({
      success: true,
      data: teacherProfile,
      message:
        "Profile details Saved successfully. OTP has been Sent to Your Contact Number.",
    });
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(400).json({
        success: false,
        message: "Duplicate value error. Please ensure all fields are unique.",
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Add Profile Pic

exports.AddProfilePic = async (req, res) => {
  try {
    const { teacherId } = req.params;  // Get teacherId from params
    if (!teacherId) {
      return res.status(403).json({
        message: "No Teacher Available",
      });
    }

    // Adjust query to find by TeacherUserId, not by _id
    const TeacherFind = await TeacherProfile.findOne({ TeacherUserId: teacherId });  // Use findOne and pass the correct field
    if (!TeacherFind) {
      return res.status(403).json({
        message: "No Teacher Found",
      });
    }


    const ProfilePic = req.file;

    if (!ProfilePic) {
      return res.status(403).json({
        message: "No file uploaded",
      });
    }


    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        let stream = Cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const uploadResult = await uploadFromBuffer(ProfilePic.buffer);
    const ProfilePicUrl = uploadResult.url;
    const ProfilePicPublicId = uploadResult.public_id;

    // Update the teacher's profile pic
    TeacherFind.ProfilePic = {
      url: ProfilePicUrl,
      publicId: ProfilePicPublicId
    };

    await TeacherFind.save();
    res.status(201).json({
      message: "Profile Pic Updated",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Internal server error",
    });
  }
};


exports.AddDocument = async (req, res) => {
  try {
    // Get parameters from the request
    const { teacherId } = req.params;
    const { DocumentType } = req.query;


    // Predefined valid document types
    const preDefineTypes = ["Aadhaar", "Pan", "Passport"];

    // Check if the document type is valid
    if (!preDefineTypes.includes(DocumentType)) {
      return res.status(400).json({
        message: "Invalid Document Type. Please provide a valid type: Aadhaar, Pan, Voter Card, or Passport.",
      });
    }

    // Check if teacher ID is provided
    if (!teacherId) {
      return res.status(400).json({
        message: "Teacher ID is required.",
      });
    }

    // Find the teacher profile
    const TeacherFind = await Teacher.findById(teacherId);
    if (!TeacherFind) {
      return res.status(404).json({
        message: "No Teacher found with the provided ID.",
      });
    }

    // Handle Document file upload
    const DocumentFile = req.files?.Document?.[0];
    if (!DocumentFile) {
      return res.status(400).json({
        message: "No Document file uploaded. Please upload an identity document.",
      });
    }

    // Handle Qualification file upload
    const QualificationFile = req.files?.Qualification?.[0];
    if (!QualificationFile) {
      return res.status(400).json({
        message: "No Qualification document uploaded. Please upload a qualification document.",
      });
    }

    // Function to upload a file from buffer to Cloudinary
    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        let stream = Cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            console.error("Cloudinary upload error: ", error);
            return reject(new Error("Failed to upload file to Cloudinary."));
          }
          resolve(result);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    // Upload Document to Cloudinary
    let documentUploadResult;
    try {
      documentUploadResult = await uploadFromBuffer(DocumentFile.buffer);
    } catch (error) {
      console.error("Error uploading identity document: ", error);
      return res.status(500).json({
        message: "Error uploading identity document to Cloudinary.",
        error: error.message,
      });
    }

    // Upload Qualification to Cloudinary
    let qualificationUploadResult;
    try {
      qualificationUploadResult = await uploadFromBuffer(QualificationFile.buffer);
    } catch (error) {
      console.error("Error uploading qualification document: ", error);
      return res.status(500).json({
        message: "Error uploading qualification document to Cloudinary.",
        error: error.message,
      });
    }
    console.log(qualificationUploadResult)
    // Create new document entry
    TeacherFind.identityDocument = {
      DocumentType: DocumentType,
      DocumentImageUrl: documentUploadResult.secure_url, // Use secure_url from Cloudinary
      DocumentPublicId: documentUploadResult.public_id,
    },
      TeacherFind.QualificationDocument = {
        QualificationImageUrl: qualificationUploadResult?.secure_url,
        QualificationPublicId: qualificationUploadResult?.public_id,
      }



    await TeacherFind.save();

    res.status(201).json({
      message: "Documents uploaded successfully, and teacher profile updated.",
      document: TeacherFind,
    });
    console.log("Documents uploaded successfully, and teacher profile updated.")
  } catch (error) {
    console.error("Error uploading documents: ", error);
    res.status(500).json({
      message: "Server error occurred while uploading documents.",
      error: error.message,
    });
  }
};




//Verify Otp Given By Teacher
exports.TeacherVerifyProfileOtp = CatchAsync(async (req, res) => {
  try {
    const { otp } = req.body;
    const userEmail = req.user.id.Email;
    const Teachers = await TeacherProfile.findOne({
      TeacherUserId: req.user.id._id,
    });

    if (!Teachers) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (Teachers.SubmitOtp !== otp || Teachers.OtpExpired < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    Teachers.isAllDetailVerified = true;
    Teachers.SubmitOtp = undefined;
    Teachers.OtpExpired = undefined;

    // Retrieve class names for all academic information entries
    const classNames = await Promise.all(
      Teachers.AcademicInformation.map(async (info) => {
        const classDetail = await Class.findById(info.ClassId);
        return classDetail ? `Class ${classDetail.Class}` : "Unknown Class";
      })
    );

    const Message = `Successful Onboarding at SR Tutors as a Teacher

Dear ${Teachers?.FullName},

Congratulations on successfully completing your onboarding process at SR Tutors! We are thrilled to have you join our team.

Summary of Your Details:

Teaching Experience: ${Teachers?.TeachingExperience}
Expected Fee: ₹${Teachers?.ExpectedFees}
Teaching Mode: ${Teachers?.TeachingMode}



Current Address:
Street Address: ${Teachers?.CurrentAddress.streetAddress}
Landmark: ${Teachers?.CurrentAddress.LandMark}
Area: ${Teachers?.CurrentAddress.Area}
Pincode: ${Teachers?.CurrentAddress.Pincode}

We are committed to supporting you every step of the way. If you have any questions or need help, our support team is here for you.

Best regards,
S R Tutors
Email: support@srtutors.com`;

    console.log(Teachers?.ContactNumber);

    try {
      const messageSent = await SendWhatsAppMessage(Message, Teachers?.ContactNumber);
      console.log('WhatsApp message sent:', messageSent);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }


    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      return res.status(500).json({
        success: false,
        message: "Redis client is not available.",
      });
    }
    await redisClient.del("Teacher");
    await redisClient.del("Top-Teacher");
    Teachers.isBlockForOtp = false;
    Teachers.OtpBlockTime = null;
    await Teachers.save();

    res.status(200).json({ message: "Profile details saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Resend Verify Otp Given By Teacher
exports.TeacherProfileResendOtp = CatchAsync(async (req, res) => {
  const userId = req.user.id._id;
  const { HowManyRequest } = req.body;

  if (typeof HowManyRequest !== 'number') {
    return res.status(400).json({ message: "HowManyRequest must be a number." });
  }


  const Teachers = await TeacherProfile.findOne({ TeacherUserId: userId });

  if (!Teachers) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  if (Teachers.isBlockForOtp) {
    return res.status(403).json({ message: "Your account is blocked for OTP requests. Please contact support." });
  }

  const now = Date.now();

  if (HowManyRequest >= 3) {
    Teachers.isBlockForOtp = true;
    Teachers.OtpBlockTime = new Date();
    await Teachers.save();
    return res.status(200).json({ message: "You are blocked from requesting OTP for the rest of the day." });
  }

  // Check if the OTP has expired and the request is made within the cooldown period
  if (Teachers.OtpExpired && now < Teachers.OtpExpired - 1 * 60 * 1000) {
    const remainingTimeInMs = Teachers.OtpExpired - 1 * 60 * 1000 - now;
    const remainingSeconds = Math.ceil(remainingTimeInMs / 1000);

    return res.status(429).json({
      message: `OTP already sent recently. Please wait ${remainingSeconds} seconds before requesting a new OTP.`
    });
  }

  // Generate a new OTP and set its expiration time
  Teachers.SubmitOtp = crypto.randomInt(100000, 999999);
  Teachers.OtpExpired = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes

  try {
    await Teachers.save();

    const Message = `Profile Details Verification OTP Resent Successfully\n\nDear ${Teachers?.FullName},\n\nWe have successfully resent your OTP for profile verification. Please use the OTP provided below to complete your profile verification process:\n\nOTP: ${Teachers.SubmitOtp}\n\nThis OTP is valid for the next 10 minutes. Please make sure to enter it within this timeframe to avoid expiration.\n\nIf you did not request this OTP, please disregard this message. For any assistance, feel free to contact our support team.\n\nBest regards,\nS R Tutors\nEmail: support@srtutors.com`;

    await SendWhatsAppMessage(Message, Teachers.ContactNumber);
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to resend OTP. Please try again." });
  }
});

exports.updateTeacherProfile = CatchAsync(async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;


    const teacher = await TeacherProfile.findOne({ TeacherUserId: userId });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          // Handle nested objects
          if (teacher[key] && typeof teacher[key] === 'object') {
            // Merge nested objects
            teacher[key] = { ...teacher[key], ...updates[key] };
          } else {
            teacher[key] = updates[key];
          }
        } else if (Array.isArray(updates[key])) {
          // Handle arrays
          teacher[key] = updates[key];
        } else {
          // Handle primitive fields
          teacher[key] = updates[key];
        }
      }
    });

    // Check and update additional fields in TeachersMain
    const { FullName, Gender, ContactNumber, AlternateContact } = updates;
    if (FullName || Gender || ContactNumber || AlternateContact) {
      const TeachersMain = await Teacher.findById(userId);

      if (TeachersMain) {
        if (FullName !== undefined) TeachersMain.TeacherName = FullName;
        if (Gender !== undefined) TeachersMain.gender = Gender;
        if (ContactNumber !== undefined) TeachersMain.PhoneNumber = ContactNumber;
        if (AlternateContact !== undefined) TeachersMain.AltNumber = AlternateContact;

        await TeachersMain.save();
      }
    }

    // Save the updated profile
    await teacher.save();

    res.status(200).json({ message: "Profile updated successfully", data: teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Get Teacher Profile Details
exports.GetTeacherProfileId = CatchAsync(async (req, res) => {
  try {
    const TeacherId = req.params.id;

    if (!TeacherId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a Teacher ID",
      });
    }


    // Fetch profile from database
    const teacherProfile = await TeacherProfile.findOne({
      TeacherUserId: TeacherId,
    }).populate('TeacherUserId');


    console.log(teacherProfile)

    if (!teacherProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Fetch class details
    const classNames = await Promise.all(
      teacherProfile.AcademicInformation.map(async (info) => {
        try {
          const classDetail = await Class.findById(info.ClassId);
          return classDetail ? `Class ${classDetail.Class}` : "Unknown Class";
        } catch (error) {
          console.error(
            `Error fetching class detail for ClassId ${info.ClassId}:`,
            error
          );
          return "Unknown Class";
        }
      })
    );

    // Cache the profile data


    res.status(200).json({
      success: true,
      message: "Profile fetched successfully from DB",
      data: { ...teacherProfile.toObject(), classNames }, // Include class names in response
    });
  } catch (error) {
    console.error("Error fetching teacher profile:", error); // Log the full error for debugging
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
});

//Get Teacher Profile Details
exports.GetAllTeacherProfile = CatchAsync(async (req, res) => {
  try {
    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      throw new Error("Redis client is not available.");
    }

    // Check if profile is cached
    const cachedProfile = await redisClient.get(`TeacherProfile`);
    if (cachedProfile) {
      return res.status(200).json({
        success: true,
        message: "Profile fetched from cache",
        data: JSON.parse(cachedProfile),
      });
    }

    // Fetch profile from database
    const teacherProfile = await TeacherProfile.find().populate({
      path: "AcademicInformation.ClassId",  // Populating the ClassId inside the AcademicInformation array
    });

    if (!teacherProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile is not available",
      });
    }

    // Cache the profile data
    await redisClient.set(
      `TeacherProfile`,
      JSON.stringify(teacherProfile),
      "EX",
      3600
    ); // Cache for 1 hour

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully From Db",
      data: teacherProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
});

exports.GetAllTeacher = CatchAsync(async (req, res) => {
  try {
    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      throw new Error("Redis client is not available.");
    }

    // Check if Teacher is cached
    const cachedTeacher = await redisClient.get(`Teacher`);
    if (cachedTeacher) {
      return res.status(200).json({
        success: true,
        message: "Teacher fetched from cache",
        data: JSON.parse(cachedTeacher),
      });
    }

    // Fetch Teacher from database
    const teacher = await Teacher.find().populate('TeacherProfile');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "teacher is not available",
      });
    }

    // Cache the teacher data
    await redisClient.set(`Teacher`, JSON.stringify(teacher), "EX", 3600); // Cache for 1 hour

    res.status(200).json({
      success: true,
      message: "teacher fetched successfully From Db",
      data: teacher.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teacher",
      error: error.message,
    });
  }
});

exports.MarkDocumentStatus = CatchAsync(async (req, res) => {
  try {
    const { teacherId, status } = req.body;

    // Find the teacher by ID
    const findTeacher = await Teacher.findById(teacherId);

    // If teacher is not found, return a 404 error
    if (!findTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Update the teacher's document status
    findTeacher.DocumentStatus = status;

    // Save the changes
    await findTeacher.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: "Document status updated successfully",
      teacher: findTeacher,
    });
  } catch (error) {
    // Catch and handle any error that occurs during the process
    res.status(500).json({
      success: false,
      message: "An error occurred while updating document status",
      error: error.message,
    });
  }
});

exports.GetTopTeacher = CatchAsync(async (req, res) => {
  try {
    // Fetching top teachers with a populated TeacherProfile
    const teachers = await Teacher.find({
      isTopTeacher: true,
      TeacherProfile: { $exists: true } // Ensures TeacherProfile is not null or undefined
    }).populate('TeacherProfile'); // Populate the associated TeacherProfile model

    // If no teachers found, send a 404 response
    if (!teachers || teachers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No top teachers available",
      });
    }

    // Randomly select up to 12 teachers
    const randomTeachers = teachers
      .sort(() => 0.5 - Math.random())
      .slice(0, 12);

    // Send the selected teachers in the response
    res.status(200).json({
      success: true,
      message: "Teachers fetched successfully from DB",
      data: randomTeachers,
    });
  } catch (error) {
    // Handle any errors during fetching
    res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      error: error.message,
    });
  }
});


exports.AdvancedQueryForFindingTeacher = CatchAsync(async (req, res) => {
  try {
    const query = req.body;
    let results = [];
    // console.log(query)
    // 1. Filter by Gender
    if (query.Gender) {
      const genderQuery = new RegExp(`^${query.Gender}$`, "i");
      console.log("Gender Query:", genderQuery);

      results = await TeacherProfile.find({ Gender: genderQuery });
      console.log("Gender Results:", results);
    }

    // 2. Filter by Teaching Experience
    if (query.TeachingExperience && results.length > 0) {
      const experienceQuery = parseInt(query.TeachingExperience, 10);
      console.log("Teaching Experience Query:", experienceQuery);

      results = results.filter((teacher) => {
        const dbExperience = parseInt(
          teacher.TeachingExperience.match(/\d+/)[0],
          10
        ); // Extract the numeric part
        return dbExperience >= experienceQuery;
      });

      console.log("Teaching Experience Results:", results);
    }

    // 3. Filter by Vehicle Owned
    if (query.VehicleOwned && results.length > 0) {
      const vehicleOwnedQuery = query.VehicleOwned.toLowerCase() === "yes";
      console.log("VehicleOwned Query:", vehicleOwnedQuery);

      results = results.filter(
        (teacher) => teacher.VehicleOwned === vehicleOwnedQuery
      );
      console.log("VehicleOwned Results:", results);
    }

    // 4. Filter by Teaching Mode
    if (query.TeachingMode && results.length > 0) {
      const teachingModeQuery = new RegExp(`^${query.TeachingMode}$`, "i");
      console.log("Teaching Mode Query:", teachingModeQuery);

      results = results.filter((teacher) =>
        teachingModeQuery.test(teacher.TeachingMode)
      );
      console.log("Teaching Mode Results:", results);
    }

    if (query.Location) {
      // Split location into parts to match any part of it
      const locationParts = query.Location.split(",").map((part) =>
        part.trim()
      );
      const locationRegex = new RegExp(locationParts.join("|"), "gi");
      console.log("Location Query Regex:", locationRegex);

      let locationResults = results.filter(
        (teacher) =>
          locationRegex.test(teacher.PermanentAddress.LandMark) ||
          locationRegex.test(teacher.CurrentAddress.LandMark) ||
          locationRegex.test(teacher.PermanentAddress.District) ||
          locationRegex.test(teacher.CurrentAddress.District) ||
          locationRegex.test(teacher.PermanentAddress.Pincode) ||
          locationRegex.test(teacher.CurrentAddress.Pincode)
      );

      console.log("Location Results:", locationResults);
      results = locationResults;
    }

    // 6. Filter by Subject
    if (query.Subject && query.Subject.length > 0 && results.length > 0) {
      const subjectRegex = new RegExp(query.Subject.join("|"), "i"); // Create a regex from the array of subjects
      console.log("Subject Regex:", subjectRegex);

      results = results.filter((teacher) => {
        const subjects = teacher.AcademicInformation.map(
          (item) => item.SubjectNames
        );

        // Filter subjects using regex
        const filteredSubjects = subjects.filter((subject) =>
          subjectRegex.test(subject)
        );

        console.log("Filtered Subjects:", filteredSubjects);

        // Return true only if there's a match
        return filteredSubjects.length > 0;
      });

      console.log("Subject Results:", results);
    }

    // 7. Filter by Expected Fees
    if (query.MinRange && query.MaxRange && results.length > 0) {
      const feeQuery = {
        $gte: parseInt(query.MinRange, 10),
        $lte: parseInt(query.MaxRange, 10),
      };
      console.log("Expected Fees Query:", feeQuery);

      results = results.filter(
        (teacher) =>
          teacher.ExpectedFees >= feeQuery.$gte &&
          teacher.ExpectedFees <= feeQuery.$lte
      );
      console.log("Expected Fees Results:", results);
    }

    // 9. Filter by Range of Tutor
    if (query.RangeOftutor && results.length > 0) {
      const rangeQuery = { $lte: parseInt(query.RangeOftutor, 10) };
      console.log("Range of Tutor Query:", rangeQuery);

      results = results.filter(
        (teacher) => teacher.RangeWhichWantToDoClasses >= rangeQuery.$lte
      );
      console.log("Range of Tutor Results:", results);
    }

    // Return the final filtered results
    res.status(200).json({
      status: "success",
      results: results.length,
      data: {
        results,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

exports.SearchByMinimumCondition = CatchAsync(async (req, res) => {
  try {
    const { lat, lng, SearchPlaceLat, SearchPlaceLng, role, ClassNameValue, } = req.query;

    // Validate latitude and longitude
    if (!lat || !lng || !SearchPlaceLat || !SearchPlaceLng) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchPlaceLat = parseFloat(SearchPlaceLat);
    const searchPlaceLng = parseFloat(SearchPlaceLng);

    // if (isNaN(userLat) || isNaN(userLng) || isNaN(searchPlaceLat) || isNaN(searchPlaceLng)) {
    //   return res.status(400).json({ message: 'Valid latitude and longitude are required.' });
    // }

    const { ClassId, Subject } = req.params
    if (!ClassId || !Subject) {
      return res.status(400).json({ message: 'ClassId and Subject are required.' });
    }

    const objectClass = new Mongoose.Types.ObjectId(ClassId);

    const userLocation = {
      type: 'Point',
      coordinates: [searchPlaceLng, searchPlaceLat]
    };

    let finalResults = [];

    if (role === 'student') {
      // Fetch teacher profiles within the specified range
      const locationResults = await TeacherProfile.find({
        'RangeWhichWantToDoClasses.location': {
          $near: {
            $geometry: userLocation,
            $maxDistance: 5000
          }
        }
      });

      // Flatten the AcademicInformation array and filter based on ClassId and Subject
      finalResults = locationResults.filter(profile => {
        const academicInfo = profile.AcademicInformation || [];
        return academicInfo.some(item => {
          return item.ClassId instanceof Mongoose.Types.ObjectId
            ? item.ClassId.equals(objectClass) && item.SubjectNames.includes(Subject)
            : false;
        });
      });
    } else if (role === 'tutor') {

      try {
        const { data } = await axios.get('https://api.srtutorsbureau.com/api/v1/uni/get-all-universal-Request')
        const CombinedData = data?.data
        const findTeacherRequest = CombinedData.filter(item => item.className === ClassNameValue && item.subjects.includes(Subject))


        if (findTeacherRequest.length === 0) {
          return res.status(404).json({ message: 'No teachers found.' });
        }
        // console.log("findTeacherRequest", findTeacherRequest)
        finalResults = findTeacherRequest;
      } catch (error) {
        return res.status(403).json({
          success: false,
          message: "No Request Found For This LocationOops! Something went wrong"
        })
      }

    } else {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    // Return results
    res.status(200).json({
      success: true,
      count: finalResults.length,
      results: finalResults,
    });
  } catch (error) {
    console.error("Error in SearchByMinimumCondition:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
});

exports.BrowseTutorsNearMe = CatchAsync(async (req, res) => {
  try {
    const {
      lat, lng, Page = 1, verified, maxRange, minRange,
      Subject, Experience, ModeOfTuition, Gender
    } = req.query;
    // console.log(req.query)
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    // Parse and validate ResultLimit and Page

    const page = parseInt(Page, 10);



    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: 'Invalid Page value.' });
    }

    // Create a point object from latitude and longitude
    const userLocation = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)]
    };

    // Find teachers within the given radius
    let locationResults = await TeacherProfile.find({
      'RangeWhichWantToDoClasses.location': {
        $near: {
          $geometry: userLocation,
          $maxDistance: 10000 // 10km radius in meters
        }
      }
    })


      .exec(); // Execute the query
    // Apply additional filters
    console.log(Experience)
    if (Gender) {
      locationResults = locationResults.filter(teacher => teacher.Gender === Gender);
    }



    if (ModeOfTuition) {
      locationResults = locationResults.filter(teacher => teacher.TeachingMode === ModeOfTuition);
    }

    if (verified) {
      if (verified === 'Both') {
        // No filtering needed for "Both"
      } else {
        const isVerified = verified === 'true';
        locationResults = locationResults.filter(teacher => teacher.srVerifiedTag === isVerified);
      }
    }

    if (Subject) {
      const subjectFilter = locationResults.filter(teacher =>
        teacher.AcademicInformation.some(item =>
          item.SubjectNames.map(subjectName => subjectName.toLowerCase()).includes(Subject.toLowerCase())
        )
      );
      locationResults = subjectFilter
    }

    if (Experience !== undefined && Experience !== null) {
      // If Experience is greater than 0, apply the filter
      if (Experience > 0) {
        locationResults = locationResults.filter(teacher => teacher.TeachingExperience >= Experience);
      }
      // // If Experience is 0, show all teachers (no need to filter)
      // console.log(locationResults);
    }

    // if (maxRange && minRange) {
    //   locationResults = locationResults.filter(teacher => {
    //     const maxRangeValue = parseFloat(maxRange);
    //     const minRangeValue = parseFloat(minRange);
    //     // Implement the range logic according to your requirements
    //     return teacher.ExpectedFees >= minRangeValue && teacher.ExpectedFees <= maxRangeValue;
    //   });
    // }

    const count = locationResults.length;
    // console.log(count)

    // Respond with the filtered results and count
    return res.status(200).json({
      success: true,
      count: count,
      results: locationResults,
    });

  } catch (error) {
    console.error("Error in BrowseTutorsNearMe:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
});




exports.SingleTeacher = CatchAsync(async (req, res) => {
  try {
    const { id } = req.params;



    // Fetch Teacher from database
    const teacher = await Teacher.findById(id).select('-Password');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher fetched successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Error fetching teacher",
      error: error.message,
    });
  }
});



exports.getMyClass = CatchAsync(async (req, res) => {
  try {
    const id = req.user.id;
    // Fetch AcademicInformation from the teacher's profile
    const teacherProfile = await TeacherProfile.findOne({ TeacherUserId: id }).select('AcademicInformation');

    if (!teacherProfile) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const academicInfo = teacherProfile.AcademicInformation;

    // Process each academic info entry
    const allClasses = await Promise.all(
      academicInfo.map(async (info) => {
        try {

          let classInfo = await Class.findOne({ _id: info.ClassId }).lean();

          if (classInfo) {
            // If class is found, filter subjects based on AcademicInformation
            return {
              classid: classInfo._id,
              className: classInfo.Class,
              subjects: info.SubjectNames // Use info.SubjectNames directly
            };
          } else {
            // If class is not found, check in InnerClasses array
            classInfo = await Class.findOne({ "InnerClasses._id": info.ClassId }).lean();

            if (classInfo) {
              // Find the specific inner class
              const innerClass = classInfo.InnerClasses.find(inner => inner._id.toString() === info.ClassId.toString());

              if (innerClass) {
                const filteredSubjects = classInfo.Subjects
                  .filter(sub => info.SubjectNames.includes(sub.SubjectName))
                  .map(sub => sub.SubjectName);

                return {
                  classid: innerClass._id,
                  className: innerClass.InnerClass,  // Only return the inner class name
                  subjects: filteredSubjects  // Only subjects present in AcademicInformation
                };
              }
            }
          }

          // If no matches are found, return null
          return null;
        } catch (err) {
          console.error('Error processing class info:', err);
          return null;
        }
      })
    );

    // Filter out null or empty results
    const validClasses = allClasses.filter(cls => cls !== null && cls.classid && cls.className);

    // Send a response with the class information
    res.status(200).json({
      status: 'success',
      data: {
        classes: validClasses
      }
    });

  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});



exports.addMyClassMore = CatchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { classId, Subjects } = req.body;

  // Basic validation
  if (!classId || !Subjects || !Array.isArray(Subjects)) {
    return res.status(400).json({ message: "Invalid classId or Subjects format" });
  }

  // Fetch teacher profile
  const teacherProfile = await TeacherProfile.findOne({ TeacherUserId: teacherId }).select('AcademicInformation');

  if (!teacherProfile) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  // New entry to push
  const newEntry = {
    ClassId: classId,
    SubjectNames: Subjects
  };

  // Update the teacher's academic information
  const updatedProfile = await TeacherProfile.findOneAndUpdate(
    { TeacherUserId: teacherId },
    { $push: { AcademicInformation: newEntry } },
    { new: true } // This returns the updated document
  );

  if (!updatedProfile) {
    return res.status(500).json({ message: "Failed to update teacher profile" });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Class and subjects added successfully',
    updatedProfile // Optionally return the updated profile if needed
  });
});




exports.deleteSubjectOfTeacher = CatchAsync(async (req, res) => {
  try {
    const { ClassID, subjectName } = req.body;
    const TeacherId = req.user.id;

    const teacherProfile = await TeacherProfile.findOne({ TeacherUserId: TeacherId }).select('AcademicInformation');

    if (!teacherProfile) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const academicInfo = teacherProfile.AcademicInformation;

    const filterClass = academicInfo.find((item) => item.ClassId.toString() === ClassID.toString() && item.SubjectNames.includes(subjectName));

    if (!filterClass) {
      return res.status(404).json({ message: 'Class or Subject not found' });
    }

    filterClass.SubjectNames = filterClass.SubjectNames.filter(subject => subject !== subjectName);

    await teacherProfile.save();

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: 'Subject deleted Error'
    });

  }
});


exports.deleteClassOfTeacher = CatchAsync(async (req, res) => {
  try {

    const { ClassId } = req.body;
    const TeacherId = req.user.id; // Assuming TeacherId is provided in params

    if (!ClassId) {
      return res.status(403).json({
        success: false,
        message: 'Please provide Class Id'
      });
    }

    const teacherProfile = await TeacherProfile.findOne({ TeacherUserId: TeacherId }).select('AcademicInformation');
    if (!teacherProfile) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const academicInfo = teacherProfile.AcademicInformation;

    // Find the index of the class that needs to be deleted
    const classIndex = academicInfo.findIndex(info => info.ClassId.toString() === ClassId);

    if (classIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Class not found in teacher profile'
      });
    }

    // Remove the class entry
    academicInfo.splice(classIndex, 1);

    // Save the updated teacher profile
    await teacherProfile.save();

    res.status(200).json({
      success: true,
      message: "Class and associated subjects deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleting class of teacher:", error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
});


exports.AllData = CatchAsync(async (req, res) => {
  try {
    // Fetch data from all models
    const subjectRequests = await Request.find();

    // Send response
    res.status(200).json({ success: true, data: subjectRequests });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
});


exports.SingleAllData = CatchAsync(async (req, res) => {
  try {
    // Fetch data from all models
    const { id } = req.params
    const subjectRequests = await Request.findById(id);

    // Send response
    res.status(200).json({ success: true, data: subjectRequests });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
});





cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const blockedTeachers = await Teacher.find({ isBlockForOtp: true });

    blockedTeachers.forEach(async (teacher) => {
      const blockTime = teacher.OtpBlockTime;
      const timeDifference = now - blockTime;


      if (timeDifference >= 24 * 60 * 60 * 1000) {
        teacher.isBlockForOtp = false;
        teacher.OtpBlockTime = null;
        await teacher.save();
        console.log(`Unblocked teacher: ${teacher.Email}`);
      }
    });
  } catch (error) {
    console.error("Error in cron job for unblocking teachers:", error);
  }
});