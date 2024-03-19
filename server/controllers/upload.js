const { default: mongoose } = require('mongoose');
const Uploaded = require('../models/uploadedfiles');
const { getUsername } = require('./getusername.js');
const multer = require('multer');

// Set up storage using multer.diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination directory where uploaded files will be stored
    cb(null, 'uploads/') // This will store the files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Specify the filename for uploaded files
    cb(null, Date.now() + '-' + file.originalname) // This will add a timestamp to the filename to make it unique
  }
});

// Initialize multer with the storage options
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage
  limits: { fileSize: 25 * 1024 * 1024 } // Set maximum file size to 25 MB
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

      // Use multer middleware to handle file uploads
      upload.array('files')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading
          console.error(err);
          return res.status(400).json({ message: 'Error uploading files' });
        } else if (err) {
          // An unknown error occurred
          console.error(err);
          console.log(9);
          return res.status(500).json({ message: 'Server error' });
        }
        
        console.log(req.files); // Check if req.files contains the uploaded files
        const files = req.files.map((file) => {
          console.log(file); // Log each file to inspect its properties
          return {
            data: file.buffer, // Store the file buffer
            contentType: file.mimetype, // Store the MIME type
            name: file.originalname,
            size: file.size // Store the file size
          };
        });
        
        if (!files || files.length === 0) {
          return res.status(400).json({ message: 'No files uploaded' });
        }
         

        const newUpload = new Uploaded({
          username,
          files,
        });
        await newUpload.save();
        return res.status(201).json({ message: 'Uploaded successfully' });
      });
    } catch (error) {
      console.error(error);
      console.log(3);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  retrieve: async(req,res)=>{
    try {
      const documents = await Uploaded.find({});
      return res.status(200).json({ documents });
    } catch (error) {
      console.error('Error retrieving documents:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  download: async (req, res) => {
    try {
      const fileId = req.params.id; // ID of the document
      const document = await Uploaded.findById(fileId);
      console.log(fileId);
  
      if (!document) {
        console.log(8);
        return res.status(404).json({ message: 'Document not found' });
      }
  
      // Check if the file ID is provided in the request query
      const fileIdToDownload = req.query.fileId;
      console.log(fileIdToDownload);
      const file = document.files.find(f => f._id.toString() === fileIdToDownload);
  
      if (!file) {
        console.log(9);
        return res.status(404).json({ message: 'File not found' });
      }
  
      // Assuming file.data contains the binary data of the file
      res.set('Content-Type', file.contentType);
      res.set('Content-Disposition', `attachment; filename="${file.name}"`);
      res.send(file.data);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  delete: async(req,res) => {
    try {
    documentId = req.params.id;
    fileid = req.query.fileId;
    const updatedUploaded = await Uploaded.findByIdAndUpdate(documentId, {
      $pull: { files: { _id: fileid } }
    }, { new: true });
    if (!updatedUploaded) {
      return res.status(404).json({ error: 'updatedUploaded not found' });
    }

    // res.json(updatedUploaded);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }


  }

};

module.exports = uploadController;
