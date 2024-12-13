const express = require('express')
const { TeacherRegister, TeacherVerifyOtp, TeacherResendOtp, TeacherPasswordChangeRequest, TeacherPasswordOtpResent, TeacherVerifyPasswordOtp, TeacherLogin, AddProfileDetailsOfVerifiedTeacher, TeacherProfileResendOtp, TeacherVerifyProfileOtp, updateTeacherProfile, GetTeacherProfileId, GetAllTeacherProfile, GetAllTeacher, AdvancedQueryForFindingTeacher, SearchByMinimumCondition, SingleTeacher, getMyClass, deleteClassOfTeacher, addMyClassMore, SubjectDelete, deleteSubjectOfTeacher, AddProfilePic, AddDocument, MarkDocumentStatus, teacherBlockForOtp, AddLocations, GetTeacherWithLead, AddProfileDetailsOfVerifiedTeacherByAdmin } = require('../controllers/Teacher.registration')
const Protect = require('../middlewares/Auth')
const TeacherRouter = express.Router()
const multer = require('multer');
const { UploadXlsxFileAndExtractData, UploadXlsxFileAndExtractDataStudent, UploadLocality } = require('../controllers/TeacherUpload');
const { singleUploadImage, UploadViaFieldName } = require('../middlewares/multer');
const upload = multer({ dest: 'files/' });
//User Actions With 
TeacherRouter.post('/Create-teacher', TeacherRegister)

// TeacherRouter.post('/Create-teacher', UploadViaFieldName([{ name: 'Document', maxLength: '1' }, { name: 'Qualification', maxLength: '1' }]), TeacherRegister)
TeacherRouter.post('/Verify-teacher', TeacherVerifyOtp)
TeacherRouter.post('/resent-otp', TeacherResendOtp)
TeacherRouter.post('/Teacher-Login', TeacherLogin)
TeacherRouter.get('/Teacher-details/:id', SingleTeacher)

TeacherRouter.post('/block-teacher', teacherBlockForOtp)

TeacherRouter.post('/teacher-Password-Change-Request', TeacherPasswordChangeRequest)
TeacherRouter.post('/teacher-Password-resend-otp', TeacherPasswordOtpResent)
TeacherRouter.post('/teacher-Password-Verify-Otp', TeacherVerifyPasswordOtp)
TeacherRouter.post('/teacher-profile', Protect, AddProfileDetailsOfVerifiedTeacher)
TeacherRouter.post('/teacher-profile-By-Admin', AddProfileDetailsOfVerifiedTeacherByAdmin)

TeacherRouter.post('/teacher-profile-pic/:teacherId', singleUploadImage, AddProfilePic)
TeacherRouter.post('/teacher-document/:teacherId', UploadViaFieldName([{ name: 'Document', maxLength: '1' }, { name: 'Qualification', maxLength: '1' }]), AddDocument)
TeacherRouter.post('/Add-location', Protect, AddLocations)


TeacherRouter.post('/profile-otp', Protect, TeacherProfileResendOtp)
TeacherRouter.post('/Verify-profile-otp', Protect, TeacherVerifyProfileOtp)
TeacherRouter.put('/update-profile-details', Protect, updateTeacherProfile)
TeacherRouter.get('/Get-Teacher/:id', Protect, GetTeacherProfileId)
TeacherRouter.get('/Get-My-Classes', Protect, getMyClass)

TeacherRouter.get('/Get-Teacher-Profile', Protect, GetAllTeacherProfile)
TeacherRouter.get('/Get-Teacher-By-Profile', GetAllTeacherProfile)

TeacherRouter.get('/Get-Teacher', Protect, GetAllTeacher)
TeacherRouter.get('/Get-Teacher-With-Lead', GetTeacherWithLead)

TeacherRouter.post('/Make-Document-verified', MarkDocumentStatus)

TeacherRouter.post('/Add-Class-Subject', Protect, addMyClassMore)
TeacherRouter.delete('/delete-Subject', Protect, deleteSubjectOfTeacher)


TeacherRouter.post('/Get-Advanced-search', AdvancedQueryForFindingTeacher)
TeacherRouter.get('/Get-Min-search/:ClassId/:Subject', SearchByMinimumCondition)

TeacherRouter.delete('/deleteClassOfTeacher', Protect, deleteClassOfTeacher)


TeacherRouter.post('/upload-xlsx', upload.single('file'), UploadXlsxFileAndExtractData)


TeacherRouter.post('/upload-xlsxs', upload.single('file'), UploadXlsxFileAndExtractDataStudent)

TeacherRouter.post('/crearte' ,upload.single('file'), UploadLocality)








module.exports = TeacherRouter