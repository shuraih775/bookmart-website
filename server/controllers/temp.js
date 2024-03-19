const UploadedFiles = require('../models/uploadedfiles');

const getFileById = async (fileId) => {
  try {
    // Query the database to find the document by its ID
    const file = await UploadedFiles.findById(fileId);

    // If the file is not found, return an error or handle it appropriately
    if (!file) {
      throw new Error('File not found');
    }

    // Access the files array that contains the uploaded files
    const filesArray = file.files;

    // Return the files array
    return filesArray;
  } catch (error) {
    // Handle errors
    console.error('Error retrieving file:', error.message);
    throw error; // Propagate the error to the caller
  }
};

module.exports = { getFileById };
