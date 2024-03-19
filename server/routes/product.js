const express = require('express');
const productController = require('../controllers/product');
const router = express.Router();

router.post('/add',productController.add);
router.get('/fetch',productController.fetch);
router.get('/fetchavail',productController.fetchavail);
router.get('/downloadimg/:productName', productController.downloadimg);
router.put('/update/:product_id', productController.update);

module.exports = router;