const { default: mongoose } = require('mongoose');
const Uploaded = require('../models/uploadedfiles');
const { getUsername } = require('./getusername.js');
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


const uploadController = {
  upload:async (req, res) =>{
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'User not logged in' });
      }

      const tokenArray = authHeader.split(' ');
      const token = tokenArray[1];
      if (!token) {
        return res.status(401).json({ message: 'User not logged in' });
      }

      const username = await getUsername(token);
      if (!username) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      upload.array('files')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          
         
          return res.status(400).json({ message: 'Error uploading files' });
        } else if (err) {
          
          
          
          return res.status(500).json({ message: 'Server error' });
        }
        
        
        const files = req.files.map((file) => {
          
          return {
            data: file.buffer, 
            contentType: file.mimetype, 
            name: file.originalname,
            size: file.size 
          };
        });
        
        if (!files || files.length === 0) {
          return res.status(400).json({ message: 'No files uploaded' });
        }
         
        const Color = req.body.Color;
        const isReport = req.body.isReport;
        const department = req.body.dept;
        const newUpload = new Uploaded({
          username,
          files,
          Color,
          isReport,
          department
        });
        await newUpload.save();
        return res.status(201).json({ message: 'Uploaded successfully' });
      });
    } catch (error) {
     
      
      return res.status(500).json({ message: 'Server error' });
    }
  },
  retrieve: async(req,res)=>{
    try {
      const documents = await Uploaded.find({});
      return res.status(200).json({ documents });
    } catch (error) {
      
      return res.status(500).json({ message: 'Server error' });
    }
  },
  download: async (req, res) => {
    try {
      const fileId = req.params.id; 
      const document = await Uploaded.findById(fileId);
      
  
      if (!document) {
        
        return res.status(404).json({ message: 'Document not found' });
      }
  
      
      const fileIdToDownload = req.query.fileId;
      
      const file = document.files.find(f => f._id.toString() === fileIdToDownload);
  
      if (!file) {
        
        return res.status(404).json({ message: 'File not found' });
      }
  
      
      res.set('Content-Type', file.contentType);
      res.set('Content-Disposition', `attachment; filename="${file.name}"`);
      res.send(file.data);
    } catch (error) {
      
      res.status(500).json({ message: 'Server error' });
    }
  },
  delete: async(req,res) => {
    try {
    documentId = req.params.id;
    const updatedUploaded = await Uploaded.findByIdAndDelete(documentId);
    if (!updatedUploaded) {
      return res.status(404).json({ error: 'updatedUploaded not found' });
    }

    
  } catch (error) {
    
    res.status(500).json({ error: 'Server error' });
  }


  }

};

module.exports = uploadController;
