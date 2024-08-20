const express = require("express");
const {
  StudentRegister,
  StudentVerifyOtp,
  StudentResendOtp,
  StudentLogin,
  StudentPasswordChangeRequest,
  StudentVerifyPasswordOtp,
  StudentPasswordOtpResent,
  getAllStudents,
} = require("../controllers/Student.registration");
const StudentRouter = express.Router();
const isAdmin = require("../middlewares/admin");
const {
  MakeARequestForTeacher,
  GetPostByStudentId,
  VerifyPost,
  ShowAllPost,
  AddCommentOnPostByAdmin,
} = require("../controllers/Teacher.Request");
const Protect = require("../middlewares/Auth");
const {
  CreateRequestOfSubject,
  addAdminComment,
  getAllRequestOfSubject,
  toggleStatusOfRequest,
  UpdateComment,
} = require("../controllers/SubectRequestController");

//User Actions With
StudentRouter.post("/Create-Student", StudentRegister);
StudentRouter.post("/Verify-Student", StudentVerifyOtp);
StudentRouter.post("/resent-otp", StudentResendOtp);
StudentRouter.post("/login", StudentLogin);
StudentRouter.post(
  "/Student-Password-Change-Request",
  StudentPasswordChangeRequest
);
StudentRouter.post("/Student-Password-resend-otp", StudentPasswordOtpResent);
StudentRouter.post("/Student-Password-Verify-Otp", StudentVerifyPasswordOtp);
StudentRouter.get("/get-all-students", isAdmin, getAllStudents);

//Teacher Request

StudentRouter.post("/Make-A-Teacher-Request", Protect, MakeARequestForTeacher);
StudentRouter.post("/Verify-Teacher-Request", Protect, VerifyPost);

StudentRouter.get("/Get-My-Post", Protect, GetPostByStudentId);
StudentRouter.get("/Get-All-Post", ShowAllPost);

StudentRouter.post("/Add-Comment", AddCommentOnPostByAdmin);

//Subject Teacher Request

StudentRouter.post("/Subject-teacher-Request", CreateRequestOfSubject);
StudentRouter.post("/admin-make-comment", addAdminComment);
StudentRouter.get("/admin-teacher-Request", getAllRequestOfSubject);
StudentRouter.put("/admin-toggle-Request/:requestId", toggleStatusOfRequest);

module.exports = StudentRouter;
