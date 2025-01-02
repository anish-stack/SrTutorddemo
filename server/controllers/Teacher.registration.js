const Teacher = require("../models/Teacher.model");
const TeacherProfile = require("../models/TeacherProfile.model");
const Class = require("../models/ClassModel");
const CatchAsync = require("../utils/CatchAsync");
const sendToken = require("../utils/SendToken");
const crypto = require("crypto");
const Mongoose = require('mongoose');
const Cloudinary = require('cloudinary').v2;
require('dotenv').config();
const streamifier = require('streamifier')
const Request = require("../models/UniversalSchema");
const SendWhatsAppMessage = require("../utils/SendWhatsappMeg");
const locality = require("../models/Locality.model")
const cron = require('node-cron');
// Configure Cloudinary
Cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});
//Teacher New Register
// exports.TeacherRegister = CatchAsync(async (req, res) => {
//   try {
//     const {
//       TeacherName,
//       PhoneNumber,
//       Email,
//       Password,
//       DOB,
//       Age,
//       gender,
//       AltNumber,
//       PermanentAddress,
//     } = req.body;

//     const address = JSON.parse(PermanentAddress);

//     const { DocumentType, isAddedByAdmin = false } = req.query;
//     const convertBoolean = Boolean(isAddedByAdmin)
//     console.log(DocumentType)
//     const preDefineTypes = ["Aadhaar", "Pan", "Voter Card", "Passport"];

//     if (!preDefineTypes.includes(DocumentType)) {
//       return res.status(400).json({
//         message: "Invalid Document Type. Please provide a valid type: Aadhaar, Pan, Voter Card, or Passport.",
//       });
//     }

//     const missingFields = [];
//     if (!TeacherName) missingFields.push("Teacher Name");
//     if (!PhoneNumber) missingFields.push("Phone Number");
//     if (!Email) missingFields.push("Email");
//     if (!Password) missingFields.push("Password");
//     if (!DOB) missingFields.push("Date of Birth");
//     if (!gender) missingFields.push("Gender");

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         message: "The following fields are missing: " + missingFields.join(", "),
//       });
//     }

//     const existingTeacher = await Teacher.findOne({
//       $or: [{ Email }, { PhoneNumber }]
//     });
//     if (existingTeacher) {
//       if (existingTeacher.isTeacherVerified) {
//         return res.status(400).json({ message: "Teacher with this email and Phone Number already exists" });
//       } else if (existingTeacher.isBlockForOtp === true) {
//         return res.status(400).json({ message: "You are blocked For 24 Hours ,Please retry After the 24 Hours" });
//       } else if (existingTeacher.hit >= 3) {
//         existingTeacher.isBlockForOtp = true
//         await existingTeacher.save()
//         return res.status(400).json({
//           message: "You are blocked For 24 Hours. Please retry after 24 hours."
//         });
//       }
//       else {
//         existingTeacher.PermanentAddress = address
//         existingTeacher.hit = (existingTeacher.hit || 0) + 1;
//         existingTeacher.Password = Password;
//         existingTeacher.SignInOtp = crypto.randomInt(100000, 999999);
//         existingTeacher.OtpExpiresTime = Date.now() + 2 * 60 * 1000;
//         await existingTeacher.save();

//         const Message = `Dear Teacher ${existingTeacher.TeacherName}, your OTP for verification is: ${existingTeacher.SignInOtp}. This OTP is valid for a limited time. If you did not request this OTP, please ignore this message. Best regards, S.R. Tutors.`;


//         await SendWhatsAppMessage(Message, PhoneNumber);

//         return res.status(200).json({
//           message: "You are already registered. OTP has been resent via WhatsApp. Please verify your contact number.",
//         });

//       }
//     }

//     const DocumentFile = req.files?.Document?.[0];

//     const QualificationFile = req.files?.Qualification?.[0];

//     if (!DocumentFile) {
//       return res.status(400).json({
//         message: "No Document file uploaded. Please upload an identity document.",
//       });
//     }

//     if (!QualificationFile) {
//       return res.status(400).json({
//         message: "No Qualification document uploaded. Please upload a qualification document.",
//       });
//     }

//     const uploadFromBuffer = (buffer) => {
//       return new Promise((resolve, reject) => {
//         let stream = Cloudinary.uploader.upload_stream((error, result) => {
//           if (error) {
//             console.error("Cloudinary upload error: ", error);
//             return reject(new Error("Failed to upload file to Cloudinary."));
//           }
//           resolve(result);
//         });
//         streamifier.createReadStream(buffer).pipe(stream);
//       });
//     };

//     let documentUploadResult;
//     try {
//       documentUploadResult = await uploadFromBuffer(DocumentFile.buffer);
//     } catch (error) {
//       console.error("Error uploading identity document: ", error);
//       return res.status(500).json({
//         message: "Error uploading identity document to Cloudinary.",
//         error: error.message,
//       });
//     }

//     let qualificationUploadResult;
//     try {
//       qualificationUploadResult = await uploadFromBuffer(QualificationFile.buffer);
//     } catch (error) {
//       console.error("Error uploading qualification document: ", error);
//       return res.status(500).json({
//         message: "Error uploading qualification document to Cloudinary.",
//         error: error.message,
//       });
//     }
//     if (convertBoolean === true) {
//       const newTeacherByAdmin = await Teacher.create({
//         TeacherName,
//         PhoneNumber,
//         Email,
//         Password,
//         Age,
//         gender,
//         AltNumber,
//         isAddedByAdmin: true,
//         DOB,
//         hit: 1,
//         PermanentAddress: address,
//         identityDocument: {
//           DocumentType,
//           DocumentImageUrl: documentUploadResult.secure_url,
//           DocumentPublicId: documentUploadResult.public_id,
//         },
//         QualificationDocument: {
//           QualificationImageUrl: qualificationUploadResult?.secure_url,
//           QualificationPublicId: qualificationUploadResult?.public_id,
//         },
//         isTeacherVerified: true,

//       });
//       await newTeacherByAdmin.save()
//       res.status(201).json({
//         message: "Teacher registered successfully by admin.",
//         teacher: newTeacherByAdmin,
//       });
//     } else {

//       const otp = crypto.randomInt(100000, 999999);
//       const otpExpiresTime = Date.now() + 2 * 60 * 1000;

//       const newTeacher = await Teacher.create({
//         TeacherName,
//         PhoneNumber,
//         Email,
//         Password,
//         Age,
//         gender,
//         AltNumber,
//         DOB,
//         hit: 1,
//         PermanentAddress: address,
//         identityDocument: {
//           DocumentType,
//           DocumentImageUrl: documentUploadResult.secure_url,
//           DocumentPublicId: documentUploadResult.public_id,
//         },
//         QualificationDocument: {
//           QualificationImageUrl: qualificationUploadResult?.secure_url,
//           QualificationPublicId: qualificationUploadResult?.public_id,
//         },
//         isTeacherVerified: false,
//         SignInOtp: otp,
//         OtpExpiresTime: otpExpiresTime,
//       });

//       const NewMessage = `Dear Teacher ${newTeacher.TeacherName}, your OTP for verification is: ${newTeacher.SignInOtp}. This OTP is valid for a limited time. If you did not request this OTP, please ignore this message. Best regards, S.R. Tutors.`;


//       await SendWhatsAppMessage(NewMessage, PhoneNumber);
//       res.status(201).json({
//         message: "Teacher registered successfully. Please verify your Contact Number.",
//       });

//     }

//   } catch (error) {
//     console.error("Registration error: ", error);
//     res.status(500).json({
//       message: "Error occurred during registration.",
//       error: error.message,
//     });
//   }
// });

//code ad on 13 dec 2024 
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
      PermanentAddress,
    } = req.body;
    console.log(req.body)
    const address = PermanentAddress

    const { isAddedByAdmin = false } = req.query;
    const convertBoolean = Boolean(isAddedByAdmin)



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
      } else if (existingTeacher.isBlockForOtp === true) {
        return res.status(400).json({ message: "You are blocked For 24 Hours ,Please retry After the 24 Hours" });
      } else if (existingTeacher.hit >= 3) {
        existingTeacher.isBlockForOtp = true
        await existingTeacher.save()
        return res.status(400).json({
          message: "You are blocked For 24 Hours. Please retry after 24 hours."
        });
      }
      else {
        existingTeacher.PermanentAddress = address
        existingTeacher.hit = (existingTeacher.hit || 0) + 1;
        existingTeacher.Password = Password;
        existingTeacher.SignInOtp = crypto.randomInt(100000, 999999);
        existingTeacher.OtpExpiresTime = Date.now() + 2 * 60 * 1000;
        await existingTeacher.save();

        const Message = `Dear Teacher ${existingTeacher.TeacherName}, your OTP for verification is: ${existingTeacher.SignInOtp}. This OTP is valid for a limited time. If you did not request this OTP, please ignore this message. Best regards, S.R. Tutors.`;


        await SendWhatsAppMessage(Message, PhoneNumber);

        return res.status(200).json({
          message: "You are already registered. OTP has been resent via WhatsApp. Please verify your contact number.",
        });

      }
    }




    if (convertBoolean === true) {
      const newTeacherByAdmin = await Teacher.create({
        TeacherName,
        PhoneNumber,
        Email,
        Password,
        Age,
        gender,
        AltNumber,
        isAddedByAdmin: true,
        DOB,
        hit: 1,
        PermanentAddress: address,

        isTeacherVerified: true,

      });
      await newTeacherByAdmin.save()
      res.status(201).json({
        message: "Teacher registered successfully by admin.",
        teacher: newTeacherByAdmin,
      });
    } else {

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
        hit: 1,
        PermanentAddress: address,

        isTeacherVerified: false,
        SignInOtp: otp,
        OtpExpiresTime: otpExpiresTime,
      });

      const NewMessage = `Dear Teacher ${newTeacher.TeacherName}, your OTP for verification is: ${newTeacher.SignInOtp}. This OTP is valid for a limited time. If you did not request this OTP, please ignore this message. Best regards, S.R. Tutors.`;


      await SendWhatsAppMessage(NewMessage, PhoneNumber);
      res.status(201).json({
        message: "Teacher registered successfully. Please verify your Contact Number.",
      });

    }

  } catch (error) {
    console.error("Registration error: ", error);
    res.status(500).json({
      message: "Error occurred during registration.",
      error: error.message,
    });
  }
});

exports.TeacherRegisterByAdmin = CatchAsync(async (req, res) => {
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
      PermanentAddress,
    } = req.body;

    const address = JSON.parse(PermanentAddress)

    const { DocumentType, isAddedByAdmin = false } = req.query;
    const convertBoolean = Boolean(isAddedByAdmin)

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
      } else if (existingTeacher.isBlockForOtp === true) {
        return res.status(400).json({ message: "You are blocked For 24 Hours ,Please retry After the 24 Hours" });
      } else if (existingTeacher.hit >= 3) {
        existingTeacher.isBlockForOtp = true
        await existingTeacher.save()
        return res.status(400).json({
          message: "You are blocked For 24 Hours. Please retry after 24 hours."
        });
      }
      else {
        existingTeacher.PermanentAddress = address
        existingTeacher.hit = (existingTeacher.hit || 0) + 1;
        existingTeacher.Password = Password;
        existingTeacher.SignInOtp = crypto.randomInt(100000, 999999);
        existingTeacher.OtpExpiresTime = Date.now() + 2 * 60 * 1000;
        await existingTeacher.save();

        const Message = `Dear Teacher ${existingTeacher.TeacherName}, your OTP for verification is: ${existingTeacher.SignInOtp}. This OTP is valid for a limited time. If you did not request this OTP, please ignore this message. Best regards, S.R. Tutors.`;


        await SendWhatsAppMessage(Message, PhoneNumber);

        return res.status(200).json({
          message: "You are already registered. OTP has been resent via WhatsApp. Please verify your contact number.",
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


    if (convertBoolean === true) {
      const newTeacherByAdmin = await Teacher.create({
        TeacherName,
        PhoneNumber,
        Email,
        Password,
        Age,
        gender,
        AltNumber,
        isAddedByAdmin: true,
        DOB,
        hit: 1,
        PermanentAddress: address,
        identityDocument: {
          DocumentType,
          DocumentImageUrl: documentUploadResult.secure_url,
          DocumentPublicId: documentUploadResult.public_id,
        },
        QualificationDocument: {
          QualificationImageUrl: qualificationUploadResult?.secure_url,
          QualificationPublicId: qualificationUploadResult?.public_id,
        },
        isTeacherVerified: true,

      });
      await newTeacherByAdmin.save()
      res.status(201).json({
        message: "Teacher registered successfully by admin.",
        teacher: newTeacherByAdmin,
      });
    } else {

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
        hit: 1,
        PermanentAddress: address,
        isTeacherVerified: false,
        SignInOtp: otp,
        OtpExpiresTime: otpExpiresTime,
      });

      const NewMessage = `Dear Teacher ${newTeacher.TeacherName}, your OTP for verification is: ${newTeacher.SignInOtp}. This OTP is valid for a limited time. If you did not request this OTP, please ignore this message. Best regards, S.R. Tutors.`;


      await SendWhatsAppMessage(NewMessage, PhoneNumber);
      res.status(201).json({
        message: "Teacher registered successfully. Please verify your Contact Number.",
      });

    }

  } catch (error) {
    console.error("Registration error: ", error);
    res.status(500).json({
      message: "Error occurred during registration.",
      error: error.message,
    });
  }
});

exports.UpdateTeacherByAdmin = CatchAsync(async (req, res) => {
  try {
    const { id } = req.params; 
    const {
      TeacherName,
      PhoneNumber,
      Email,
      Password,
      DOB,
      Age,
      gender,
      AltNumber,
      PermanentAddress,
    } = req.body;

    // Find the teacher by ID
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found. Please provide a valid ID.",
      });
    }

    // Update the fields if they are provided
    if (TeacherName) teacher.TeacherName = TeacherName;
    if (PhoneNumber) teacher.PhoneNumber = PhoneNumber;
    if (Email) teacher.Email = Email;
    if (Password) teacher.Password = Password;
    if (DOB) teacher.DOB = DOB;
    if (Age) teacher.Age = Age;
    if (gender) teacher.gender = gender;
    if (AltNumber) teacher.AltNumber = AltNumber;
    if (PermanentAddress) teacher.PermanentAddress =PermanentAddress ;

    // Save the updated teacher document
    await teacher.save();

    res.status(200).json({
      message: "Teacher details updated successfully.",
      teacher,
    });
  } catch (error) {
    console.error("Update error: ", error);
    res.status(500).json({
      message: "Error occurred while updating teacher details.",
      error: error.message,
    });
  }
});



//Teacher Verify Otp
exports.TeacherVerifyOtp = CatchAsync(async (req, res) => {
  try {
    const { PhoneNumber, Email, otp } = req.body;

    // Find teacher by phone number or email
    const existingTeacher = await Teacher.findOne({
      $or: [{ PhoneNumber }, { Email }],
    });

    console.log("Found Teacher", existingTeacher)
    if (!existingTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Validate OTP and check expiration
    const isOtpValid = existingTeacher.SignInOtp === otp;
    const isOtpExpired = existingTeacher.OtpExpiresTime < Date.now();

    if (!isOtpValid || isOtpExpired) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update teacher verification status
    existingTeacher.isTeacherVerified = true;
    existingTeacher.isBlockForOtp = false;
    existingTeacher.OtpBlockTime = null;
    existingTeacher.SignInOtp = undefined;
    existingTeacher.hit = 0;
    existingTeacher.OtpExpiresTime = undefined;

    await existingTeacher.save();

    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      return res.status(500).json({ message: "Redis client is not available." });
    }

    // Invalidate cached teacher data
    await redisClient.del(`Teacher`);

    // Send token upon successful verification
    await sendToken(existingTeacher, res, 201);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

exports.TeacherResendOtp = CatchAsync(async (req, res) => {
  try {
    const { Email, PhoneNumber } = req.body;
    console.log("i am", req.body)
    const Teachers = await Teacher.findOne({
      $or: [{ PhoneNumber }, { Email }],
    });

    if (!Teachers) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (Teachers.isTeacherVerified) {
      return res.status(400).json({ message: "Teacher already verified" });
    }

    // Check if the teacher is blocked
    if (Teachers.isBlockForOtp) {

      return res.status(429).json({
        message: "You have been temporarily blocked from requesting OTP. Please try again later.",
      });
    }

    const now = Date.now();

    // Check if the teacher hit the limit of OTP requests
    if (Teachers.hit >= 3) { // Block if hit is 3 or more
      Teachers.isBlockForOtp = true;
      await Teachers.save();
      return res.status(400).json({
        message: "You are blocked for 24 hours. Please retry after 24 hours.",
      });
    }

    // Ensure OTP is only sent if previous OTP has expired
    if (Teachers.OtpExpiresTime && now < Teachers.OtpExpiresTime - 1 * 60 * 1000) {
      const remainingTimeInMs = Teachers.OtpExpiresTime - 1 * 60 * 1000 - now;
      const remainingSeconds = Math.ceil(remainingTimeInMs / 1000);

      return res.status(429).json({
        message: `OTP already sent recently. Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
      });
    }

    // Generate and set new OTP
    Teachers.SignInOtp = crypto.randomInt(100000, 999999);
    Teachers.OtpExpiresTime = now + 2 * 60 * 1000;
    Teachers.hit += 1; // Increment hit counter after each OTP sent
    await Teachers.save();

    const NewMessage = `Dear Teacher ${Teachers.TeacherName}, your OTP for verification is: ${Teachers.SignInOtp}. This OTP is valid for a limited time. If you did not request this OTP, please ignore this message. Best regards, S.R. Tutors.`;

    try {
      await SendWhatsAppMessage(NewMessage, Teachers.PhoneNumber);
      console.log("Message send", NewMessage)
    } catch (error) {
      return res.status(500).json({
        message: "Failed to send OTP. Please try again later.",
        error: error.message,
      });
    }

    res.status(200).json({ message: "OTP resent successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
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

    // Check if OTP requests are blocked
    if (teacher.isBlockForOtp === true) {
      return res.status(429).json({ message: "You are temporarily blocked from requesting OTP. Please try again later." });
    }

    // Check if the teacher has exceeded the allowed OTP requests (hit >= 3)
    if (teacher.hit >= 3) {
      return res.status(429).json({ message: "You have exceeded the maximum OTP requests. Please try again after 24 hours." });
    }

    // Generate OTP and set expiration time
    teacher.ForgetPasswordOtp = crypto.randomInt(100000, 999999);
    teacher.OtpExpiresTime = Date.now() + 2 * 60 * 1000; // 2 minutes OTP validity
    teacher.hit += 1; // Increment the hit counter

    await teacher.save();

    // Create WhatsApp message
    const NewMessage = `Dear Teacher ${teacher.TeacherName}, we have generated an OTP for your password change request: ${teacher.ForgetPasswordOtp}. Please use this OTP to complete your password change process. This OTP is valid for a limited time. If you did not request this, please ignore this message. Best regards, S.R. Tutors.`;

    // Send OTP via WhatsApp
    const sent = await SendWhatsAppMessage(NewMessage, teacher.PhoneNumber);
    if (!sent.success) {
      return res.status(500).json({ message: "Failed to send OTP. Please try again later." });
    }

    // Success response
    res.status(200).json({ message: "Password reset OTP has been successfully sent to your registered phone number." });
  } catch (err) {
    console.error("Error in TeacherPasswordChangeRequest:", err.message);
    res.status(500).json({ message: "An error occurred while processing your request. Please try again later." });
  }
});


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
    teacher.hit = 0
    await teacher.save();

    res.status(200).json({ message: "Password changed successfully. You can now log in with your new password." });
  } catch (err) {
    console.error("Error in TeacherVerifyPasswordOtp:", err.message);
    res.status(500).json({ message: "An error occurred while processing your request. Please try again later." });
  }
});

//Teacher Resent Password Otp
exports.TeacherPasswordOtpResent = CatchAsync(async (req, res) => {
  const { Email, howManyHit } = req.body;

  // Find teacher by email
  const teacher = await Teacher.findOne({ Email });
  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found." });
  }

  // Check if teacher is blocked from requesting OTP
  if (teacher.isBlockForOtp === true) {
    return res.status(429).json({ message: "You have been temporarily blocked from requesting OTP. Please try again later." });
  }

  // Define the current time
  const now = Date.now();

  // Check if OTP was sent recently (subtract 1 minute from expiration time)
  if (teacher.OtpExpiresTime && now < teacher.OtpExpiresTime - 1 * 60 * 1000) {
    const remainingTimeInMs = teacher.OtpExpiresTime - 1 * 60 * 1000 - now;
    const remainingSeconds = Math.ceil(remainingTimeInMs / 1000);

    return res.status(429).json({
      message: `OTP already sent recently. Please wait ${remainingSeconds} seconds before requesting a new OTP.`
    });
  }

  // Check if hit limit is exceeded (either from DB or request body)
  if (teacher.hit >= 3 || (howManyHit && howManyHit >= 3)) {
    teacher.isBlockForOtp = true;
    teacher.OtpBlockTime = new Date();  // Track when the block was set
    teacher.hit += 1;
    await teacher.save();

    return res.status(403).json({ message: "You are blocked from requesting OTP until the end of the day." });
  }

  // Increment hit count and generate new OTP
  teacher.hit += 1;
  teacher.ForgetPasswordOtp = crypto.randomInt(100000, 999999);  // Generate a 6-digit OTP
  teacher.OtpExpiresTime = now + 2 * 60 * 1000;  // Set expiration time to 2 minutes from now
  await teacher.save();

  // Prepare the WhatsApp message
  const Message = `Dear Teacher ${teacher.TeacherName}, your OTP for password change verification is: ${teacher.ForgetPasswordOtp}. Please use this OTP to complete your password change process. This OTP is valid for a limited time, so please proceed without delay. If you did not request this, please ignore this message. Best regards, S.R. Tutors.`;

  try {
    // Send OTP via WhatsApp
    await SendWhatsAppMessage(Message, teacher.PhoneNumber);
    res.status(200).json({ message: "OTP resent successfully." });
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
    const FetchProfileExist = await TeacherProfile.findOne({
      TeacherUserId: userId,
    });
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
      TeachingLocation,
      TeachingExperience,
      ExpectedFees,
      VehicleOwned,
      TeachingMode,
      AcademicInformation,
      latitude,
      longitude,
      RangeWhichWantToDoClasses,

    } = req.body;


    const RangeableData = req.body.TeachingLocation
    console.log(RangeableData)
    const MakeRangebaleData = RangeableData.Area && RangeableData.Area.length > 0 ?
      RangeableData.Area.map(item => ({
        location: {
          type: 'Point',
          coordinates: [item.lng, item.lat]
        }
      })) : [];
    // console.log(MakeRangebaleData)

    const emptyFields = [];

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

    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: `Please complete the following required fields: ${emptyFields.join(', ')}`,
      });
    }


    const requiredAddressFields = [
      "streetAddress",
      "City",
    
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

    const SubmitOtp = crypto.randomInt(100000, 999999);
    const OtpExpiresTime = Date.now() + 2 * 60 * 1000;

    const TeachingLocations = {
      State: RangeableData.State,
      City: RangeableData.City,
      Area: RangeableData.Area.map(item => item.placename)
    };

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
      TeachingLocation: TeachingLocations,
      VehicleOwned,
      TeachingMode,
      AcademicInformation,
      latitude,
      longitude,
      RangeWhichWantToDoClasses: MakeRangebaleData,
      SubmitOtp,
      OtpExpired: OtpExpiresTime,
      isAllDetailVerified: true, // Assuming profile is not verified yet
    });
    CheckTeacher.TeacherProfile = teacherProfile._id;


    const Message = `Dear Teacher ${teacherProfile?.FullName}, congratulations on successfully completing your onboarding process at S.R. Tutors! We are thrilled to have you join our team. Summary of Your Details: Teaching Experience: **${teacherProfile?.TeachingExperience}**, Expected Fee: **₹${teacherProfile?.ExpectedFees}**, Teaching Mode: **${teacherProfile?.TeachingMode}**. We are committed to supporting you every step of the way. If you have any questions or need help, our support team is here for you. Best regards, S.R. Tutors. Mobile: +91 98113 82915.`;

    if (!CheckTeacher.DOB) {
      CheckTeacher.DOB = teacherProfile.DOB
    }
    await teacherProfile.save();
    const save = await CheckTeacher.save();
    if (save) {
      await SendWhatsAppMessage(Message, CheckTeacher.PhoneNumber);
    }

    const redisClient = req.app.locals.redis;
    if (!redisClient) {
      return res.status(402).json({
        success: false,
        message: "Redis No Found"
      })
    }

    await redisClient.del('Teacher')

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

exports.AddProfileDetailsOfVerifiedTeacherByAdmin = CatchAsync(async (req, res) => {
  try {
    const userId = req.query.id;

    const CheckTeacher = await Teacher.findById(userId);
    if (!CheckTeacher) {
      return res.status(403).json({
        success: false,
        message: "Unauthorised ACtion Performed",
      });
    }

    const FetchProfileExist = await TeacherProfile.findOne({
      TeacherUserId: userId,
    });
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
      TeachingLocation,
      TeachingExperience,
      ExpectedFees,
      VehicleOwned,
      TeachingMode,
      AcademicInformation,
      latitude,
      longitude,
      RangeWhichWantToDoClasses,

    } = req.body;


    const RangeableData = req.body.TeachingLocation

    const MakeRangebaleData = RangeableData.Area && RangeableData.Area.length > 0 ?
      RangeableData.Area.map(item => ({
        location: {
          type: 'Point',
          coordinates: [item.lng, item.lat]
        }
      })) : [];


    const emptyFields = [];

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

    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: `Please complete the following required fields: ${emptyFields.join(', ')}`,
      });
    }

console.log('teacher-profile-By-Admin')
    const requiredAddressFields = [
      "streetAddress",
      "City",
      
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

    const SubmitOtp = crypto.randomInt(100000, 999999);
    const OtpExpiresTime = Date.now() + 2 * 60 * 1000;

    const TeachingLocations = {
      State: RangeableData.State,
      City: RangeableData.City,
      Area: RangeableData.Area.map(item => item.placename)
    };

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
      TeachingLocation: TeachingLocations,
      VehicleOwned,
      TeachingMode,
      AcademicInformation,
      latitude,
      longitude,
      RangeWhichWantToDoClasses: MakeRangebaleData,
      SubmitOtp,
      OtpExpired: OtpExpiresTime,
      isAllDetailVerified: true, // Assuming profile is not verified yet
    });
    CheckTeacher.TeacherProfile = teacherProfile._id;


    const Message = `Dear Teacher ${teacherProfile?.FullName}, congratulations on successfully completing your onboarding process at S.R. Tutors! We are thrilled to have you join our team. Summary of Your Details: Teaching Experience: **${teacherProfile?.TeachingExperience}**, Expected Fee: **₹${teacherProfile?.ExpectedFees}**, Teaching Mode: **${teacherProfile?.TeachingMode}**. We are committed to supporting you every step of the way. If you have any questions or need help, our support team is here for you. Best regards, S.R. Tutors. Mobile: +91 98113 82915.`;

    if (!CheckTeacher.DOB) {
      CheckTeacher.DOB = teacherProfile.DOB
      CheckTeacher.isTeacherVerified = true;
    }
    await teacherProfile.save();
    const save = await CheckTeacher.save();
    if (save) {
      await SendWhatsAppMessage(Message, CheckTeacher.PhoneNumber);
    }

    const redisClient = req.app.locals.redis;
    if (!redisClient) {
      return res.status(402).json({
        success: false,
        message: "Redis No Found"
      })
    }

    await redisClient.del('Teacher')

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

    const Message = `Successful Onboarding at S.R. Tutors as a Teacher

Dear ${Teachers?.FullName},

Congratulations on successfully completing your onboarding process at S.R. Tutors! We are thrilled to have you join our team.

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
    console.log("Hey, I am hit by you");

    // Get Teacher Profile Details
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

    if (!teacherProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Fetch class names and combine with the academic info
    const updatedAcademicInformation = await Promise.all(
      teacherProfile.AcademicInformation.map(async (info) => {
        try {
          // Check if the class exists directly
          let classExists = await Class.findById(info.ClassId);
          console.log('classExists by ClassId:', classExists);  // Debugging log

          // If the ClassId is not found, try finding it within InnerClasses
          if (!classExists) {
            classExists = await Class.findOne({
              "InnerClasses._id": info.ClassId,
            });
            console.log('classExists by InnerClasses:', classExists);  // Debugging log
          }

          // If class is still not found, return a default message
          if (!classExists) {
            console.warn(`ClassId ${info.ClassId} not found.`);
            return {
              ...info,
              className: `ClassId ${info.ClassId} not found.`,
            };
          }

          // Check if ClassId belongs to an InnerClass
          let className = classExists.Class;
          const innerClassMatch = classExists.InnerClasses.find(innerClass =>
            innerClass._id.toString() === info.ClassId
          );

          if (innerClassMatch) {
            className = innerClassMatch.InnerClass;
          }

          // Validate subject names against the class' subjects
          const classSubjects = classExists.Subjects.map((subject) => subject.SubjectName);
          console.log('classSubjects:', classSubjects);  // Debugging log

          const allSubjectsValid = info.SubjectNames.every((subject) =>
            classSubjects.some((classSubject) =>
              classSubject.toLowerCase().includes(subject.toLowerCase())
            )
          );

          if (!allSubjectsValid) {
            console.warn(`Invalid subjects for ClassId ${info.ClassId}`);
            return {
              ...info,
              className: className,
              subjectsValidationResult: `Invalid subjects for ClassId ${info.ClassId}`,
            };
          }

          return {
            ...info,  // Spread the original academic information
            className: className,  // Add the fetched class name
            subjectsValidationResult: 'All subjects valid',  // Add subject validation result
          };

        } catch (error) {
          console.error(`Error fetching class detail for ClassId ${info.ClassId}:`, error);
          return {
            ...info,  // Spread the original academic information
            className: 'Unknown Class',  // Default value in case of an error
            subjectsValidationResult: 'Error occurred',  // Error message
          };
        }
      })
    );

    // Return the response with updated AcademicInformation
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully from DB",
      data: {
        ...teacherProfile.toObject()
      },
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

    // Fetch Teacher from database and sort by createdAt descending
    const teacher = await Teacher.find()
      .populate('TeacherProfile')
      .sort({ createdAt: -1 })  // Ensures that the data is always sorted
      .exec();

    if (!teacher || teacher.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No teachers available",
      });
    }

    // Cache the teacher data with a unique key for future use (e.g., using teacher's ID or a dynamic key)
    await redisClient.set(`Teacher`, JSON.stringify(teacher), "EX", 3600); // Cache for 1 hour

    res.status(200).json({
      success: true,
      message: "Teacher fetched successfully from DB",
      data: teacher,  // Send the sorted data directly
    });
  } catch (error) {
    console.error(error);  // Added for better debugging
    res.status(500).json({
      success: false,
      message: "Error fetching teacher",
      error: error.message,
    });
  }
});


exports.GetTeacherWithLead = CatchAsync(async (req, res) => {
  try {
    const teachers = await TeacherProfile.find({}).populate('LeadIds').sort({ "updatedAt": 1 });

    const teachersWithLeads = teachers.filter(teacher => teacher.LeadIds.length > 0);

    if (teachersWithLeads.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No teachers with leads found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teachers with leads fetched successfully from DB",
      data: teachersWithLeads.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teachers",
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
    const { ClassId, Subject } = req.params;
    const { role, ClassNameValue, locationParam, result } = req.query;

    // Parse the 'result' parameter as JSON and destructure address details
    const ParsedResult = JSON.parse(result);
    const { city, area, district, lat, lng, completeAddress } = ParsedResult.addressDetails;
    console.log("Parsed Address Details:", completeAddress);

    // Validate required parameters
    if (!ClassId || !Subject) {
      return res.status(400).json({ message: 'ClassId and Subject are required.' });
    }

    // Convert ClassId to a Mongoose ObjectId for querying
    const objectClass = new Mongoose.Types.ObjectId(ClassId);
    let finalResults = [];

    if (role === 'student') {
      // Initial query based on city, district, and area
      const locationResults = await TeacherProfile.find({
        'TeachingLocation.State': city,
        'TeachingLocation.City': { $regex: district, $options: 'i' },
        'TeachingLocation.Area': { $in: [area] },
      });

      // Filter based on AcademicInformation within each teacher's profile
      finalResults = locationResults.filter(profile => {
        const academicInfo = profile.AcademicInformation || [];

        return academicInfo.some(item => {
          return item.ClassId instanceof Mongoose.Types.ObjectId
            ? item.ClassId.equals(objectClass) && item.SubjectNames.includes(Subject)
            : false;
        });
      });

      console.log("Filtered Final Results:", finalResults);

      if (finalResults.length === 0) {


        const addressKeywords = completeAddress
          .split(',')
          .map(part => part.trim())
          .filter(Boolean) // Remove empty elements
          .join('|');

        console.log(addressKeywords)

        const fallbackResults = await TeacherProfile.find({
          'TeachingLocation.State': city,
          'TeachingLocation.City': { $regex: district, $options: 'i' },
          // 'TeachingLocation.Area': { $regex: new RegExp(`\\b(${addressKeywords})\\b`, 'i') },
          'TeachingLocation.Area': { $regex: new RegExp(`\\b(${addressKeywords})\\b`, 'i') },
        });
        console.log("Fallback completeAddress results:", fallbackResults);

        finalResults = fallbackResults.filter(profile => {
          const academicInfo = profile.AcademicInformation || [];

          return academicInfo.some(item => {
            return item.ClassId instanceof Mongoose.Types.ObjectId
              ? item.ClassId.equals(objectClass) && item.SubjectNames.includes(Subject)
              : false;
          });
        });
      }
    }

    // Respond with the filtered results
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
      Subject, Experience, ModeOfTuition, Gender, currentCity, panSearch
    } = req.query;

    console.log(req.query);

    // Check for required latitude and longitude
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    // Parse and validate Page
    const page = parseInt(Page, 10);
    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: 'Invalid Page value.' });
    }

    // Create a point object from latitude and longitude
    const userLocation = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)]
    };

    let locationResults;

    // Fetch teachers based on panSearch
    if (panSearch === "Current City Teachers") {
      locationResults = await TeacherProfile.find({
        'PermanentAddress.City': currentCity
      });
      // console.log("locationResults - Current",locationResults)
    } else if (panSearch === "Pan India Teacher" || panSearch === "Both") {
      locationResults = await TeacherProfile.find();
    } else {
      locationResults = await TeacherProfile.find({
        'RangeWhichWantToDoClasses.location': {
          $near: {
            $geometry: userLocation,
            $maxDistance: 10000 // 10km radius in meters
          }
        }
      });
    }

    // Additional filters
    if (Gender) {
      locationResults = locationResults.filter(teacher => teacher.Gender === Gender);
    }

    if (ModeOfTuition && ModeOfTuition !== "All") {
      locationResults = locationResults.filter(teacher => teacher.TeachingMode === ModeOfTuition);
    }

    if (verified) {
      const isVerified = verified === 'true';
      if (verified !== 'Both') {
        locationResults = locationResults.filter(teacher => teacher.srVerifiedTag === isVerified);
      }
    }

    if (Subject && Array.isArray(Subject) && Subject.length > 0) {
      locationResults = locationResults.filter(teacher =>
        teacher.AcademicInformation.some(item =>
          // Check if teacher has all selected subjects
          Subject.every(selectedSubject =>
            item.SubjectNames.map(subjectName => subjectName.toLowerCase()).includes(selectedSubject.toLowerCase())
          )
        )
      );
    }

    if (Experience !== undefined && Experience > 0) {
      locationResults = locationResults.filter(teacher => teacher.TeachingExperience >= Experience);
    }

    // Implement maxRange and minRange logic if required
    if (maxRange && minRange) {
      const maxRangeValue = parseFloat(maxRange);
      const minRangeValue = parseFloat(minRange);
      locationResults = locationResults.filter(teacher =>
        teacher.ExpectedFees >= minRangeValue && teacher.ExpectedFees <= maxRangeValue
      );
    }

    const count = locationResults.length;

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

exports.AddLocations = CatchAsync(async (req, res) => {
  try {
    // Get the teacher ID from the authenticated user (assuming JWT or session-based authentication)
    const teacherId = req.user.id;
    console.log(teacherId);

    // Find the teacher's profile by their ID
    const findProfile = await TeacherProfile.findById(teacherId);
    if (!findProfile) {
      return res.status(404).json({ message: "Teacher profile not found." });
    }

    // Get the range of locations the teacher wants to do classes
    const { RangeWhichWantToDoClasses } = req.body;
    if (!RangeWhichWantToDoClasses || !Array.isArray(RangeWhichWantToDoClasses)) {
      return res.status(400).json({ message: "Invalid range data." });
    }

    // Flatten and format the range data to create geoJSON points
    const formattedRanges = RangeWhichWantToDoClasses.flatMap((range) => ({
      location: {
        type: 'Point',
        coordinates: [range.lng, range.lat]
      }
    }));

    // Update the profile with the new range data
    findProfile.RangeWhichWantToDoClasses = formattedRanges;

    // Save the updated profile
    await findProfile.save();

    // Return a success response
    return res.status(200).json({
      message: "Locations added successfully.",
      data: findProfile
    });
  } catch (error) {
    // Handle any errors and return a server error response
    console.error("Error adding locations:", error);
    return res.status(500).json({ message: "An error occurred while adding locations." });
  }
});


exports.SingleTeacher = CatchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id).select('-Password');
    // console.log(teacher)

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
    console.log("Cron job running at:", new Date());

    // Get all blocked teachers
    const blockedTeachers = await Teacher.find({ isBlockForOtp: true });

    // Loop through each blocked teacher and unblock them
    for (const teacher of blockedTeachers) {
      teacher.isBlockForOtp = false;  // Unblock the teacher
      teacher.OtpBlockTime = null;     // Clear the block time
      teacher.hit = 0;                  // Reset hit count (if applicable)

      await teacher.save();             // Save changes to the database
      console.log(`Unblocked teacher: ${teacher.Email}`);  // Log the unblocked teacher's email
    }
  } catch (error) {
    console.error("Error in cron job for unblocking teachers:", error);
  }
});