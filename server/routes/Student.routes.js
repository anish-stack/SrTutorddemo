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
  getSingleStudent,
  CheckNumber,
  studentDeleteById,
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
const {
  CreateClassRequest,
  getAllClassRequest,
  getClassRequestByStudentId,
  DeleteClassRequest,
  toggleClassDone,
  toggleClassRequest,
  addAdminComments,
  getCommentsForRequest,

} = require('../controllers/ClassRequestController');
const Protect = require("../middlewares/Auth");
const {
  CreateRequestOfSubject,
  addAdminComment,
  getAllRequestOfSubject,
  toggleStatusOfRequest,
  UpdateComment,
  ToggleDealDone,
  deleteRequest,
} = require("../controllers/SubectRequestController");
const { BrowseTutorsNearMe, AllData, SingleAllData } = require("../controllers/Teacher.registration");
const { CreateUniversalRequest } = require("../controllers/ExtraController");

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
StudentRouter.get('/get-single-student/:id', getSingleStudent)

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
StudentRouter.delete("/admin-delete-Request/:requestId", deleteRequest);
StudentRouter.get("/admin-particular-Request", getParticularTeacherRequest);
StudentRouter.post('/ToggleDealDone/:requestId', ToggleDealDone)
StudentRouter.post("/admin-do-comment", addAdminCommentOnParticular);




// Create a new class request
StudentRouter.post('/Class-Teacher-Request', Protect,CreateClassRequest);
StudentRouter.get('/Class-Teacher-Request', getAllClassRequest);
StudentRouter.get('/Class-Request-By-StudnetId/:studentId', getClassRequestByStudentId);
StudentRouter.delete('/Class-Delete-Request/:requestId', DeleteClassRequest);
StudentRouter.post('/Class-status-Request/:requestId', toggleClassDone);
StudentRouter.post('/Class-Accept-Request/:requestId/:action', toggleClassRequest);
StudentRouter.post('/Class-comment-Request', addAdminComments);
StudentRouter.get('/Class-Get-Comments/:id', getCommentsForRequest);

StudentRouter.get('/AllData', AllData)
StudentRouter.get('/SingleAllData/:id', SingleAllData)

StudentRouter.post('/universal-request',Protect, CreateUniversalRequest)
StudentRouter.post('/checkNumber-request', CheckNumber)

StudentRouter.delete('/studentDelete/:id',studentDeleteById)




StudentRouter.get('/BrowseTutorsNearMe', BrowseTutorsNearMe)


module.exports = StudentRouter;
