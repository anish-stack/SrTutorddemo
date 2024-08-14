const express = require('express')
const { TeacherRegister, TeacherVerifyOtp, TeacherResendOtp, TeacherPasswordChangeRequest, TeacherPasswordOtpResent, TeacherVerifyPasswordOtp, TeacherLogin, AddProfileDetailsOfVerifiedTeacher, TeacherProfileResendOtp, TeacherVerifyProfileOtp, updateTeacherProfile, GetTeacherProfileId, GetAllTeacherProfile, GetAllTeacher, AdvancedQueryForFindingTeacher } = require('../controllers/Teacher.registration')
const Protect = require('../middlewares/Auth')
const TeacherRouter = express.Router()


//User Actions With 
TeacherRouter.post('/Create-teacher', TeacherRegister)
TeacherRouter.post('/Verify-teacher', TeacherVerifyOtp)
TeacherRouter.post('/resent-otp', TeacherResendOtp)
TeacherRouter.post('/Teacher-Login', TeacherLogin)
TeacherRouter.post('/teacher-Password-Change-Request', TeacherPasswordChangeRequest)
TeacherRouter.post('/teacher-Password-resend-otp', TeacherPasswordOtpResent)
TeacherRouter.post('/teacher-Password-Verify-Otp', TeacherVerifyPasswordOtp)
TeacherRouter.post('/teacher-profile', Protect, AddProfileDetailsOfVerifiedTeacher)
TeacherRouter.post('/profile-otp', Protect, TeacherProfileResendOtp)
TeacherRouter.post('/Verify-profile-otp', Protect, TeacherVerifyProfileOtp)
TeacherRouter.put('/update-profile-details', Protect, updateTeacherProfile)
TeacherRouter.get('/Get-Teacher/:id', Protect, GetTeacherProfileId)
TeacherRouter.get('/Get-Teacher-Profile', Protect, GetAllTeacherProfile)
TeacherRouter.get('/Get-Teacher', Protect, GetAllTeacher)
TeacherRouter.post('/Get-Advanced-search', AdvancedQueryForFindingTeacher)











module.exports = TeacherRouter