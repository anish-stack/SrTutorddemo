const Teacher = require("../models/Teacher.model");
const TeacherProfile = require("../models/TeacherProfile.model");
const Class = require("../models/ClassModel");
const CatchAsync = require("../utils/CatchAsync");
const sendToken = require("../utils/SendToken");
const sendEmail = require("../utils/SendEmails");
const crypto = require("crypto");

//Teacher New Register
exports.TeacherRegister = CatchAsync(async (req, res) => {
  try {
    const { TeacherName, PhoneNumber, Email, Password } = req.body;

    // Check for missing fields
    const missingFields = [];
    if (!TeacherName) missingFields.push("Teacher Name");
    if (!PhoneNumber) missingFields.push("Phone Number");
    if (!Email) missingFields.push("Email");
    if (!Password) missingFields.push("Password");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message:
          "The following fields are missing: " + missingFields.join(", "),
      });
    }

    // Check if the Teacher already exists
    const existingTeacher = await Teacher.findOne({ Email });
    if (existingTeacher) {
      // Check if the Teacher is verified
      if (existingTeacher.isTeacherVerified) {
        return res
          .status(400)
          .json({ message: "Teacher with this email already exists" });
      } else {
        // If not verified, resend the OTP
        existingTeacher.Password = Password;
        existingTeacher.SignInOtp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
        existingTeacher.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
        await existingTeacher.save();

        const Options = {
          email: Email,
          subject: "OTP Verification",
          message: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #000000; border: 1px solid #E21C1C;">
                                <h2 style="color: #E21C1C; text-align: center;">OTP Verification</h2>
                                <p>Dear ${existingTeacher.TeacherName}</p>
                                <p>We are pleased to inform you that your OTP for verification is:</p>
                                <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                                    ${existingTeacher.SignInOtp}
                                </p>
                                <p>Please use this OTP to complete your verification process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                                <p>If you did not request this OTP, please disregard this message.</p>
                                <p>Best regards,</p>
                                <p><strong>S R Tutors</strong></p>
                                <hr style="border: 0; height: 1px; background-color: #E21C1C;">
                                <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                            </div>`,
        };

        await sendEmail(Options);

        return res
          .status(200)
          .json({ message: "OTP resent. Please verify your email." });
      }
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999);
    const otpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Create a new Teacher
    const newTeacher = await Teacher.create({
      TeacherName,
      PhoneNumber,
      Email,
      Password,
      isTeacherVerified: false,
      SignInOtp: otp,
      OtpExpiresTime: otpExpiresTime,
    });

    const Options = {
      email: Email,
      subject: "OTP Verification",
      message: `<div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
                        <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E21C1C;">
                        <h2 style="color: #E21C1C; text-align: center; margin-top: 0;">OTP Verification</h2>
                        <p>Dear ${newTeacher.TeacherName},</p>
                        <p>We are pleased to inform you that your OTP for verification is:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                            ${newTeacher.SignInOtp}
                        </p>
                        <p>Please use this OTP to complete your verification process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                        <p>If you did not request this OTP, please disregard this message.</p>
                        <p>Best regards,</p>
                        <p><strong>S R Tutors</strong></p>
                        <hr style="border: 0; height: 1px; background-color: #E21C1C; margin: 20px 0;">
                        <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                        </div>
                        </div>
                                `,
    };

    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      throw new Error("Redis client is not available.");
    }

    // Check if Teacher is cached
    await redisClient.del(`Teacher`);
    await sendEmail(Options);
    res.status(201).json({
      success: true,
      message: "Please verify Otp For Complete Registration",
      data: newTeacher,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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

  const Teachers = await Teacher.findOne({ Email });
  if (!Teachers) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  if (Teachers.isTeacherVerified) {
    return res.status(400).json({ message: "Teacher already verified" });
  }

  Teachers.SignInOtp = crypto.randomInt(100000, 999999);
  Teachers.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  await Teachers.save();
  const Options = {
    email: Email,
    subject: "Resent OTP For Verification",
    message: `<div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E21C1C;">
                    <h2 style="color: #E21C1C; text-align: center; margin-top: 0;">OTP Verification</h2>
                    <p>Dear ${Teachers.TeacherName},</p>
                    <p>We are pleased to inform you that your OTP for verification is:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                        ${Teachers.SignInOtp}
                    </p>
                    <p>Please use this OTP to complete your verification process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                    <p>If you did not request this OTP, please disregard this message.</p>
                    <p>Best regards,</p>
                    <p><strong>S R Tutors</strong></p>
                    <hr style="border: 0; height: 1px; background-color: #E21C1C; margin: 20px 0;">
                    <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                    </div>
                    </div>
                            `,
  };
  await sendEmail(Options);
  res.status(200).json({ message: "OTP resent Successful" });
});

//Teacher And Teacher Login
exports.TeacherLogin = CatchAsync(async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(403).json({
        Success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if user exists (either Teacher or Teacher)
    const CheckUser = await Teacher.findOne({ Email });
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
  const { Email } = req.body;

  const Teachers = await Teacher.findOne({ Email });
  if (!Teachers) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  Teachers.ForgetPasswordOtp = crypto.randomInt(100000, 999999);
  Teachers.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  await Teachers.save();

  const Options = {
    email: Email,
    subject: "Password Change Request Otp Verification",
    message: `<div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E21C1C;">
                    <h2 style="color: #E21C1C; text-align: center; margin-top: 0;">OTP Verification For Password Change</h2>
                    <p>Dear ${Teachers.TeacherName},</p>
                    <p>We are pleased to inform you that your OTP for verification is:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                        ${Teachers.ForgetPasswordOtp}
                    </p>
                    <p>Please use this OTP to complete your Password change process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                    <p>If you did not request this OTP, please disregard this message.</p>
                    <p>Best regards,</p>
                    <p><strong>S R Tutors</strong></p>
                    <hr style="border: 0; height: 1px; background-color: #E21C1C; margin: 20px 0;">
                    <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                    </div>
                    </div>
                            `,
  };

  await sendEmail(Options);
  res.status(200).json({ message: "Password reset OTP sent" });
});

//Teacher Verify Password Otp
exports.TeacherVerifyPasswordOtp = CatchAsync(async (req, res) => {
  const { Email, otp, newPassword } = req.body;

  const Teachers = await Teacher.findOne({ Email });
  if (!Teachers) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  if (
    Teachers.ForgetPasswordOtp !== otp ||
    Teachers.OtpExpiresTime < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  Teachers.Password = newPassword;
  Teachers.ForgetPasswordOtp = undefined;
  Teachers.OtpExpiresTime = undefined;
  await Teachers.save();

  res.status(200).json({ message: "Password changed successfully" });
});

//Teacher Resent Password Otp
exports.TeacherPasswordOtpResent = CatchAsync(async (req, res) => {
  const { Email } = req.body;

  const Teachers = await Teacher.findOne({ Email });
  if (!Teachers) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  Teachers.ForgetPasswordOtp = crypto.randomInt(100000, 999999);
  Teachers.OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  await Teachers.save();
  const Options = {
    email: Email,
    subject: "Password Change Request Resend Otp Verification",
    message: `<div style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E21C1C;">
                    <h2 style="color: #E21C1C; text-align: center; margin-top: 0;">OTP Verification For Password Change</h2>
                    <p>Dear ${Teachers.TeacherName},</p>
                    <p>We are pleased to inform you that your OTP for verification is:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #E21C1C; text-align: center; margin: 20px 0;">
                        ${Teachers.ForgetPasswordOtp}
                    </p>
                    <p>Please use this OTP to complete your Password change process. This OTP is valid for a limited time, so kindly proceed without delay.</p>
                    <p>If you did not request this OTP, please disregard this message.</p>
                    <p>Best regards,</p>
                    <p><strong>S R Tutors</strong></p>
                    <hr style="border: 0; height: 1px; background-color: #E21C1C; margin: 20px 0;">
                    <p style="font-size: 12px; color: #000000; text-align: center;">This is an automated message. Please do not reply.</p>
                    </div>
                    </div>
                            `,
  };
  await sendEmail(Options);
  res.status(200).json({ message: "OTP resent Successful" });
});

//Add Profile Details Of Verified Teacher
exports.AddProfileDetailsOfVerifiedTeacher = CatchAsync(async (req, res) => {
  try {
    const userId = req.user.id;
    //check with this id teacher exist or not
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

    // Validate that all required fields are present and not empty
    if (
      !FullName ||
      !DOB ||
      !Gender ||
      !AlternateContact ||
      !PermanentAddress ||
      !CurrentAddress ||
      !Qualification ||
      !TeachingExperience ||
      !ExpectedFees ||
      !TeachingMode ||
      !AcademicInformation ||
      !latitude ||
      !longitude ||
      !RangeWhichWantToDoClasses
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required and must not be empty" });
    }

    // Validate that PermanentAddress and CurrentAddress contain required sub-fields
    const requiredAddressFields = [
      "HouseNo",
      "LandMark",
      "District",
      "Pincode",
    ];
    for (const field of requiredAddressFields) {
      if (!PermanentAddress[field] || !CurrentAddress[field]) {
        return res
          .status(400)
          .json({ message: "Address fields are missing or incomplete" });
      }
    }

    // Additional validation for ExpectedFees and RangeWhichWantToDoClasses
    if (typeof ExpectedFees !== "number" || ExpectedFees <= 0) {
      return res
        .status(400)
        .json({ message: "Expected Fees must be a positive number" });
    }

    if (
      typeof RangeWhichWantToDoClasses !== "number" ||
      RangeWhichWantToDoClasses <= 0
    ) {
      return res.status(400).json({
        message: "Range Which Want To Do Classes must be a positive number",
      });
    }

    // Validate AcademicInformation
   // Validate AcademicInformation
// Validate AcademicInformation
for (const element of AcademicInformation) {
  let classExists = await Class.findById(element.ClassId);
  if (!classExists) {
    // Check if the class ID exists in inner classes
    const classInInnerClasses = await Class.findOne({ 'InnerClasses._id': element.ClassId });
    if (!classInInnerClasses) {
      return res.status(400).json({ message: `Class with ID ${element.ClassId} does not exist` });
    }
    classExists = classInInnerClasses;
  }

  // Extract subject names from the found class
  const classSubjects = classExists.Subjects.map(subject => subject.SubjectName);

  // Check if all subjects in AcademicInformation are included in classSubjects
  const allSubjectsValid = element.SubjectNames.every(subject => 
    classSubjects.some(classSubject => classSubject.toLowerCase().includes(subject.toLowerCase()))
  );

  if (!allSubjectsValid) {
    return res.status(400).json({ message: "Some subjects in Academic Information are invalid" });
  }
}


    // Generate OTP and its expiration time
    const SubmitOtp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    const OtpExpiresTime = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save or update teacher profile details
    const teacherProfile = new TeacherProfile({
      TeacherUserId: userId,
      FullName,
      DOB,
      Gender,
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
      SubmitOtp,
      OtpExpired: OtpExpiresTime,
      isAllDetailVerified: false, // Assuming profile is not verified yet
    });
    CheckTeacher.TeacherProfile = teacherProfile._id;
    // Send OTP via email
    const Email = req.user.id.Email;
    console.log(Email);
    const emailOptions = {
      email: Email,
      subject: "OTP Verification",
      message: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teacher Verification OTP</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; border: 1px solid #ddd; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <header style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #4CAF50; margin: 0;">S R Tutors</h1>
            <p style="color: #555; margin: 5px 0;">Teacher Verification</p>
        </header>
        <main>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
                Dear ${FullName},
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
                We are excited to proceed with your verification process. To continue, please use the One-Time Password (OTP) provided below:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 30px; font-weight: bold; color: #4CAF50; border: 2px solid #4CAF50; padding: 15px 25px; border-radius: 5px; display: inline-block;">
                    ${SubmitOtp}
                </span>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
                This OTP is valid for the next 10 minutes. Please make sure to complete your verification within this time frame.
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
                If you did not request this OTP, please disregard this email. For any assistance, feel free to reach out to our support team.
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
                Best regards,<br>
                <strong>S R Tutors</strong>
            </p>
        </main>
        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #777;">
                This is an automated message. Please do not reply directly to this email. For any queries, contact our support team at support@srtutors.com.
            </p>
        </footer>
    </div>
</body>
</html>
`,
    };

    await sendEmail(emailOptions);
    await teacherProfile.save();
    await CheckTeacher.save();

    // Respond with success message
    res.status(200).json({
      success: true,
      data: teacherProfile,
      message:
        "Profile details Saved successfully. OTP has been sent to your email.",
    });
  } catch (error) {
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

//Verify Otp Given By Teacher
exports.TeacherVerifyProfileOtp = CatchAsync(async (req, res) => {
  try {
    const { otp } = req.body;
    const userEmail = req.user.id.Email;
    const Teachers = await TeacherProfile.findOne({
      TeacherUserId: req.user.id,
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

    const emailOptions = {
      email: userEmail,
      subject: "Successful Onboarding at SR Tutors as a Teacher",
      message: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Successful Onboarding as a Teacher</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; border: 1px solid #ddd; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <header style="text-align: center; padding-bottom: 20px;">
        <h1 style="color: #4CAF50; margin: 0;">Welcome to SR Tutors!</h1>
        <p style="color: #555; margin: 5px 0;">We are thrilled to have you join us as a new teacher.</p>
    </header>
    <main style="padding: 20px;">
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
            Dear ${Teachers.FullName},
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
            Congratulations on successfully completing your onboarding process at SR Tutors! We are excited to have you join our team. Here is a summary of the details we have recorded for you:
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
            You are a highly qualified teacher with a <strong>${
              Teachers.TeachingExperience
            }</strong> teaching experience and an expected fee of ₹${
        Teachers.ExpectedFees
      }. You will be providing <strong>${
        Teachers.TeachingMode
      }</strong> and are available for classes within a <strong>${
        Teachers.RangeWhichWantToDoClasses
      } km</strong> radius. 
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
            Your academic qualifications include:
            <ul>
                ${Teachers.AcademicInformation.map(
                  (info, index) =>
                    `<li><strong>${
                      classNames[index]
                    }</strong>: ${info.SubjectNames.join(", ")}</li>`
                ).join("")}
            </ul>
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
            Additionally, your current address is:
            <br>
            <strong>House No:</strong> ${Teachers.CurrentAddress.HouseNo}
            <br>
            <strong>Landmark:</strong> ${Teachers.CurrentAddress.LandMark}
            <br>
            <strong>District:</strong> ${Teachers.CurrentAddress.District}
            <br>
            <strong>Pincode:</strong> ${Teachers.CurrentAddress.Pincode}
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
            We are committed to supporting you every step of the way. Your journey with us is just beginning, and we believe you'll make a significant impact on our students. If you have any questions or need any help, our support team is here for you.
        </p>
    </main>
    <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #777;">
            This is an automated message. Please do not reply directly to this email. For any queries, contact our support team at support@srtutors.com.
        </p>
    </footer>
</div>
</body>
</html>
`,
    };
    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      return res.status(500).json({
        success: false,
        message: "Redis client is not available.",
      });
    }
    await redisClient.del("Teacher");
    await sendEmail(emailOptions);
    await Teachers.save();
    res.status(200).json({ message: "Profile details saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Resend Verify Otp Given By Teacher
exports.TeacherProfileResendOtp = CatchAsync(async (req, res) => {
  const userEmail = req.user.id.Email;
  console.log(userEmail);
  const Teachers = await TeacherProfile.findOne({ TeacherUserId: req.user.id });
  if (!Teachers) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  Teachers.SubmitOtp = crypto.randomInt(100000, 999999);
  Teachers.OtpExpired = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  await Teachers.save();
  const Options = {
    email: userEmail,
    subject: "Profile Details Verification OTP Resent Successfully",
    message: `
            <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
                <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #4CAF50;">
                    <h2 style="color: #4CAF50; text-align: center; margin-top: 0;">Profile Details Verification OTP Resent Successfully</h2>
                    <p>Dear ${Teachers.TeacherName},</p>
                    <p>We have successfully resent your OTP for profile verification. Please use the OTP provided below to complete your profile verification process:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 28px; font-weight: bold; color: #4CAF50; border: 2px solid #4CAF50; padding: 15px 25px; border-radius: 5px; display: inline-block;">
                            ${Teachers.SubmitOtp}
                        </span>
                    </div>
                    <p>This OTP is valid for the next 10 minutes. Please make sure to enter it within this timeframe to avoid expiration.</p>
                    <p>If you did not request this OTP, please disregard this email. For any assistance, feel free to contact our support team.</p>
                    <p>Best regards,<br><strong>S R Tutors</strong></p>
                    <hr style="border: 0; height: 1px; background-color: #4CAF50; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777; text-align: center;">This is an automated message. Please do not reply directly to this email. For assistance, contact support@srtutors.com.</p>
                </div>
            </div>
        `,
  };

  await sendEmail(Options);
  res.status(200).json({ message: "OTP resent Successful" });
});

//Update Teacher Profile Details
exports.updateTeacherProfile = CatchAsync(async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Fetch the current profile details
    const teacher = await TeacherProfile.findOne({ TeacherUserId: userId });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Update only the fields that are present in the request body
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && teacher[key] !== undefined) {
        teacher[key] = updates[key];
      }
    });

    // Save the updated profile
    await teacher.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully", data: teacher });
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

    const redisClient = req.app.locals.redis;

    if (!redisClient) {
      return res.status(500).json({
        success: false,
        message: "Redis client is not available.",
      });
    }

    // Check if profile is cached
    const cachedProfile = await redisClient.get(`TeacherProfile:${TeacherId}`);
    if (cachedProfile) {
      return res.status(200).json({
        success: true,
        message: "Profile fetched from cache",
        data: JSON.parse(cachedProfile),
      });
    }

    // Fetch profile from database
    const teacherProfile = await TeacherProfile.findOne({
      TeacherUserId: TeacherId,
    });
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
    await redisClient.set(
      `TeacherProfile:${TeacherId}`,
      JSON.stringify(teacherProfile),
      "EX",
      3600
    ); // Cache for 1 hour

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
    const teacherProfile = await TeacherProfile.find();

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
    const teacher = await Teacher.find();

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

exports.AdvancedQueryForFindingTeacher = CatchAsync(async (req, res) => {
  try {
    const query = req.body; // Extract the query from the request body
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
    const { Location, ClassId, Subject } = req.params;
    // console.log(req.params)
    // Fetch all teachers
    const AllTeacher = await TeacherProfile.find();

    // Split location and create a regex pattern for matching
    const locationParts = Location.split("-").map((part) => part.trim());
    const locationRegex = new RegExp(locationParts.join("|"), "gi");

    // console.log("Location Query:", Location);
    // console.log("Location Regex:", locationRegex);

    // Filter teachers by location
    let locationResults = AllTeacher.filter((teacher) => {
      return (
        locationRegex.test(teacher.PermanentAddress.LandMark) ||
        locationRegex.test(teacher.CurrentAddress.LandMark) ||
        locationRegex.test(teacher.PermanentAddress.Pincode) ||
        locationRegex.test(teacher.CurrentAddress.Pincode)
      );
    });

    // console.log("Location Results:", locationResults);

    let finalResults = locationResults.filter((teacher) => {
      // Check if teacher has AcademicInformation
      const academicInfo = teacher.AcademicInformation;
      console.log("academicInfo", academicInfo);
      // Check if ClassId matches
      const classMatches = academicInfo.some(
        (info) => info.ClassId.toString() === ClassId
      );

      // If ClassId matches, then check if Subject is in SubjectNames
      if (classMatches) {
        return academicInfo.some((info) => info.SubjectNames.includes(Subject));
      }

      return false;
    });

    console.log("Final Results:", finalResults);

    // Calculate the count of the filtered results
    const count = finalResults.length;

    // Respond with the filtered results and count
    res.status(200).json({
      success: true,
      count: count,
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
