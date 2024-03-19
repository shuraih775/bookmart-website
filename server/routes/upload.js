const express = require('express');
const uploadController = require('../controllers/upload');
const router = express.Router();

router.post('/post', uploadController.upload);
router.get('/get', uploadController.retrieve);
router.get('/download/:id', uploadController.download); // Update the route for downloading files
router.get('/delete/:id', uploadController.delete); // Update the route for downloading files

module.exports = router;
