import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PrintoutPage() {
  const [pdfFiles, setPdfFiles] = useState([]);

  useEffect(() => {
    // Fetch PDF files from backend API endpoint
    const fetchPdfFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/upload/get');
        const documents = response.data.documents; // Access the documents array

        // Extract the files array from each document and add parent document ID to each file
        const allFiles = documents.flatMap(document => 
          document.files.map(file => ({
            ...file,
            parentId: document._id,
            username: document.username // Add parent document ID to each file
          }))
        ); 
        setPdfFiles(allFiles);
      } catch (error) {
        console.error('Error fetching PDF files:', error);
      }
    };

    fetchPdfFiles();
  }, []);

  const removeFile = async (fileToRemove) => {
    // Filter out the selected file from the pdfFiles state array
    try{
    const updatedFiles = pdfFiles.filter(file => file !== fileToRemove);
    setPdfFiles(updatedFiles);
    const response = await axios.get(`http://localhost:5000/api/upload/delete/${fileToRemove.parentId}`, {
        
        params: {
          fileId: fileToRemove._id // Pass the file ID as a query parameter
        }
      });
    
    window.location.reload();
  }
    catch(err)
      {
        console.error('Error removing file:', err);
    }
  };

  const downloadFile = async (file) => {
    try {
      // Fetch the file data from the backend
      const response = await axios.get(`http://localhost:5000/api/upload/download/${file.parentId}`, {
        responseType: 'blob', // Set the response type to 'blob' to handle binary data
        params: {
          fileId: file._id // Pass the file ID as a query parameter
        }
      });
      const blob = response.data;
  
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      
      // Trigger the click event to start the download
      link.click();
      
      // Clean up by removing the temporary elements
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div>
      <h1>Printout Page</h1>
      <div>
        {/* Display PDF files sequentially if pdfFiles is not undefined */}
        {pdfFiles && pdfFiles.map((file, index) => (
          <div key={index} className='print'>
            {/* Display PDF file */}
            <p>{file.username}</p>
            <button onClick={() => downloadFile(file)}>Download {file.name} </button>
            
            {/* Checkbox to mark file as done */}
            <div>
              <input type="checkbox" id={`checkbox-${index}`} />
              <label htmlFor={`checkbox-${index}`}>Mark as Done</label>
              <button onClick={() => removeFile(file)}>Done</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrintoutPage;
