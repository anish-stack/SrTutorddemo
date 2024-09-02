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
  ParticularRequestForTeacher,
  getSubscribed,
  getParticularTeacherRequest,
  addAdminCommentOnParticular,
} = require("../controllers/Teacher.Request");
const Protect = require("../middlewares/Auth");
const {
  CreateRequestOfSubject,
  addAdminComment,
  getAllRequestOfSubject,
  toggleStatusOfRequest,
  UpdateComment,
  ToggleDealDone,
} = require("../controllers/SubectRequestController");
const { BrowseTutorsNearMe } = require("../controllers/Teacher.registration");

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
StudentRouter.get("/Get-My-Subscribed-Teacher", Protect, getSubscribed);

StudentRouter.get("/Get-All-Post", ShowAllPost);
StudentRouter.post("/Add-Comment", AddCommentOnPostByAdmin);
StudentRouter.post('/Make-Particular-request', Protect, ParticularRequestForTeacher)

//Subject Teacher Request

StudentRouter.post("/Subject-teacher-Request", Protect, CreateRequestOfSubject);
StudentRouter.post("/admin-make-comment", addAdminComment);
StudentRouter.get("/admin-teacher-Request", isAdmin, getAllRequestOfSubject);
StudentRouter.put("/admin-toggle-Request/:requestId/:action", isAdmin, toggleStatusOfRequest);
StudentRouter.get("/admin-particular-Request", getParticularTeacherRequest);
StudentRouter.post('/ToggleDealDone/:requestId',ToggleDealDone)
StudentRouter.post("/admin-do-comment", addAdminCommentOnParticular);


StudentRouter.get('/BrowseTutorsNearMe',BrowseTutorsNearMe)


module.exports = StudentRouter;
