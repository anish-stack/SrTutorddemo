const express = require('express');
const { CreateLead, getLead } = require('../controllers/JustDialController');
const router = express.Router();

router.post('/create-lead', CreateLead);
router.get('/get-lead/:id', getLead);
module.exports = router;
