const express = require('express');
const { CreateLead, getLead, getAllLead } = require('../controllers/JustDialController');
const router = express.Router();

router.post('/create-lead', CreateLead);
router.get('/get-lead/:id', getLead);
router.get('/get-Alllead',getAllLead );


module.exports = router;
