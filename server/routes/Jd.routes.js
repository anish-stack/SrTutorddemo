const express = require('express');
const { CreateLead, getLead, getAllLead } = require('../controllers/JustDialController');
const { UploadLocality,getLocalities,getStates,getCitiesByState,getAreasByCity, GetAllAreas } = require('../controllers/TeacherUpload');
const router = express.Router();

router.post('/create-lead', CreateLead);
router.get('/get-lead/:id', getLead);
router.get('/get-Alllead',getAllLead );
router.post('/crearte',UploadLocality)
router.get('/getLocalities',getLocalities)
router.get('/getStates',getStates)
router.get('/getCitiesByState',getCitiesByState)
router.get('/getAreasByCity',getAreasByCity)
router.get('/GetAllAreas',GetAllAreas)





  

module.exports = router;
