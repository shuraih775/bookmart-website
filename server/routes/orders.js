const express = require('express');
const orderController = require('../controllers/orders');
const router = express.Router();
const multer = require('multer');

// Set up storage using multer.diskStorage if needed
const storage = multer.diskStorage({
  // Specify destination and filename options if needed
});

// Initialize multer middleware
const upload = multer({ storage: storage });


router.post('/',upload.none(), orderController.createOrder);
router.get('/retrieve',orderController.retrieve);
router.get('/retriever/:status',orderController.retrieveAll);
router.put('/markAsComplete/:orderId',orderController.mark);
router.put('/markAsReady/:orderId',orderController.markasreadytopick);

module.exports = router;
