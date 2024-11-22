const express = require('express');
const { createPage,getAllPages,getPageBySeoUrl, deletePage, updatePage } = require('../controllers/Seo.controller');
const router = express.Router();

router.post('/Create-page',createPage)
router.get('/get-all-page',getAllPages)
router.get('/get-page/:seoFrendilyUrl',getPageBySeoUrl)
router.delete('/delete-page/:id',deletePage)
router.post('/update-page',updatePage)

module.exports = router;
