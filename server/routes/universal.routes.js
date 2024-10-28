const express = require('express')
const isAdmin = require('../middlewares/admin')
const Protect = require("../middlewares/Auth");
const { AcceptRequest, GetRequestFromTeacherId, getUniverSalRequestAccordingToQuery, getSingleUniverSalRequest, AddComment, getAllUniversalRequest, MakeTeacherVerified, DeleteComment, AddTeacherIdInThis, UpdateComment, dealDoneRequest, deleteUniverSalRequest, getAllCommentsOfRequest, PerformAdvancedSearch } = require('../controllers/ExtraController');
const { CreateContact, GetAllContact, DeleteContact } = require('../controllers/WebPage.controller');
const universal = express.Router()


universal.post('/Accept-Request', AcceptRequest)
universal.post('/deal-done-Request', dealDoneRequest)
universal.delete('/delete-Request/:requestId', deleteUniverSalRequest)
universal.get('/All-Comment-Request/:requestId', getAllCommentsOfRequest)

universal.post('/Add-Comment-Request', AddComment)
universal.post('/delete-Comment-Request', DeleteComment)
universal.post('/update-Comment-Request', UpdateComment)
universal.post('/Add-Teacher-in-Request', AddTeacherIdInThis)
universal.post('/Make-teacher-Verified', MakeTeacherVerified)
universal.get('/get-all-universal-Request', getAllUniversalRequest)
universal.get('/single-Request/:requestId', getSingleUniverSalRequest)
universal.get('/get-Request-by-query', getUniverSalRequestAccordingToQuery)
universal.get('/get-Request-teacher', GetRequestFromTeacherId)
universal.get('/perform-advance-search', PerformAdvancedSearch)


universal.post('/create-contact', CreateContact);
universal.get('/get-all-contacts', GetAllContact);
universal.delete('/delete-contact/:id', DeleteContact);





module.exports = universal