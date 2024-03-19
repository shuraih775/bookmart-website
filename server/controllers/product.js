const Product = require('../models/products');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    
    cb(null, Date.now() + '-' + file.originalname) 
  }
});
const upload = multer({
  storage: multer.memoryStorage(), 
  limits: { fileSize: 25 * 1024 * 1024 } 
});

const productController = {
  add: async (req, res) => {

    try {
      
      
      upload.single('img')(req, res, async (err) => {
        try {
          if (err instanceof multer.MulterError) {
            
            console.error(err);
            return res.status(400).json({ message: 'Error uploading files' });
          } else if (err) {
            
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
          }

          
          
          
          const { name, availability, price } = req.body;

          
          const img = {
            data: req.file.buffer,
            size: req.file.size,
            name: req.file.originalname
          };

          // Create a new product instance
          const newProduct = new Product({
            name,
            img,
            availability,
            price
          });

          
          await newProduct.save();

          
          res.status(201).json({ success: true, message: 'Product added successfully', product: newProduct });
        } catch (error) {
          console.error('Error adding product:', error);
          res.status(500).json({ success: false, message: 'Failed to add product' });
        }
      });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ success: false, message: 'Failed to handle file upload' });
    }
  },
  fetch:async (req, res) => {
    try {
      // Fetch all products from the database
      const products = await Product.find();

      // Respond with the fetched products
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  fetchavail: async (req, res) => {
    try {
      // Fetch products with availability set to true
      const products = await Product.find({ availability: true });
  
      // Respond with the fetched products
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  downloadimg: async (req, res) => {
    try {
      const productName = req.params.productName; 
      const product = await Product.findOne({ name: productName });

      if (!product || !product.img || !product.img.data) {
        return res.status(404).json({ message: 'Image not found' });
      }

      
      res.setHeader('Content-Type', 'image/jpeg');

      
      res.send(product.img.data);
    } catch (error) {
      console.error('Error downloading image:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  update: async (req, res) => {
    const id = req.params.product_id;
    
    
    const { name, price, availability } = req.body;

    try {
       
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name: name,
            price: price,
            availability: availability
        }, { new: true }); // 
        
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

  
};

module.exports = productController;
