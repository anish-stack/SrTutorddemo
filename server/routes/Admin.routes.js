const express = require('express')
const { singleUploadImage } = require('../middlewares/multer')
const { CreateClass, EditClassName, EditSubjectName, deleteAnySubject, deleteClass, GetAllClass, GetSubjectsWithClassIds, AddSubjectInClass, GetUniqueAllSubjects } = require('../controllers/ClassController')
const isAdmin = require('../middlewares/admin')
const { AddTestimonial, GetAllActiveTestimonial, ToggleTestimonialStatus, DeleteTestimonial, UpdateTestimonial, AdminLogin } = require('../controllers/Student.registration')
const { createBlog, DeleteBlog, UpdateBlog, getAllBlog, getSingleBlog } = require('../controllers/Blog.controller')
const { createBanner, getAllBanner, deleteBanner, ChangePosition, updateBanner, AnalyticalData } = require('../controllers/WebPage.controller')
const { createCity, getAllCities, deleteCity, updateCity, AddNewArea } = require('../controllers/City.Controller')
const { GetTopTeacher, UpdateTeacherByAdmin } = require('../controllers/Teacher.registration')
const { JoinNewsLetter, getAllSubscriptions, updateSubscription, deleteSubscription, sendEmailsInBatches, getAllTemplates, editTemplate, deleteTemplate, CreateTemplate } = require('../controllers/Newsletter.controller')
const { MakeSearch, NewSearchMethod } = require('../controllers/SearchTeacher')
const { IAmUpdateFunction } = require('../controllers/Seo.controller')
const AdminRouter = express.Router()


AdminRouter.post('/Admin-login', AdminLogin)



//Routes For Only Admin Class Controllers
AdminRouter.post('/Create-Class', isAdmin, CreateClass)
AdminRouter.put('/Edit-Class/:ClassId', isAdmin, EditClassName)
AdminRouter.post('/Edit-Subject/:ClassId', isAdmin, EditSubjectName)
AdminRouter.delete('/delete-Class/:ClassId/:SubjectId', isAdmin, deleteAnySubject)
AdminRouter.delete('/delete-Class/:ClassId', isAdmin, deleteClass)
AdminRouter.put('/Add-Subjects/:ClassId', isAdmin, AddSubjectInClass)

//Routes For Only Admin Testimonial Controllers
AdminRouter.post('/Toggle-Testimonial-Status/:id', isAdmin, ToggleTestimonialStatus)
AdminRouter.delete('/Delete-Testimonial/:id', isAdmin, DeleteTestimonial)
AdminRouter.put('/update-Testimonial/:id', isAdmin, UpdateTestimonial)

AdminRouter.put('/update', IAmUpdateFunction)


//Routes For Only Admin Blog Controllers
AdminRouter.post('/Create-Blog', isAdmin, singleUploadImage, createBlog)
AdminRouter.delete('/Delete-Blog/:id', isAdmin, DeleteBlog)
AdminRouter.put('/update-Blog/:id', isAdmin, singleUploadImage, UpdateBlog)


//For Offer Banners
AdminRouter.post('/Create-Banner', isAdmin, singleUploadImage, createBanner)
AdminRouter.get('/get-Banner', getAllBanner)
AdminRouter.delete('/delete-Banner/:id', deleteBanner)
AdminRouter.post('/Change-Position/:id', isAdmin, ChangePosition)
AdminRouter.put('/update-Banner/:id', isAdmin, singleUploadImage, updateBanner)

//For City Banners
AdminRouter.post('/Create-City', singleUploadImage, createCity)
AdminRouter.get('/get-City', getAllCities)
AdminRouter.post('/AddNewArea', AddNewArea)


AdminRouter.delete('/delete-City/:id', deleteCity)
AdminRouter.put('/update-City/:id', singleUploadImage, updateCity)


//Routes For All user,teacher,Student And Admin For Blogs
AdminRouter.get('/Get-Blogs', getAllBlog)
AdminRouter.get('/Get-Blog/:id', getSingleBlog)





//Routes For All user,teacher,Student And Admin
AdminRouter.get('/Get-Classes', GetAllClass)
AdminRouter.get('/Get-Class-Subject/:ClassId', GetSubjectsWithClassIds)
AdminRouter.get('/Get-All-Subject', GetUniqueAllSubjects)
//Routes For All User,Teacher,Admin For Testimonials
AdminRouter.post('/Add-Review', singleUploadImage, AddTestimonial)
AdminRouter.get('/Get-All-Active-Testimonials', GetAllActiveTestimonial)
AdminRouter.get('/Get-top-teacher', GetTopTeacher)
AdminRouter.get('/Get-Dashboard', AnalyticalData)





AdminRouter.post('/join-newsletter', JoinNewsLetter);
AdminRouter.get('/get-all-subscribe-newsletter-email', getAllSubscriptions);
AdminRouter.put('/update-newsletter-email/:id', updateSubscription);
AdminRouter.delete('/delete-newsletter-email/:id', deleteSubscription);
AdminRouter.post('/send-emails-in-batches', sendEmailsInBatches);
AdminRouter.post('/add-template', CreateTemplate);
AdminRouter.get('/get-all-templates', getAllTemplates);
AdminRouter.put('/edit-template/:id', editTemplate);
AdminRouter.delete('/delete-template/:id', deleteTemplate);


// AdminRouter.post('/make-search', MakeSearch);
AdminRouter.post('/make-search', NewSearchMethod);

AdminRouter.post('/Update-Teacher/:id', UpdateTeacherByAdmin)







module.exports = AdminRouter