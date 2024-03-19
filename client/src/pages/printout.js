import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function PrintoutPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [queueStatus, setQueueStatus] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    const files = fileInputRef.current.files;

    if (files.length === 0) {
      setQueueStatus('Please select PDF files to upload.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    let token = null;
    try{
      token = JSON.parse(sessionStorage.getItem('token'));
      if (!token) {
        throw new Error('Invalid token');
    }}
    catch{
      console.log(token);
      navigate('/login');
      return;
    }
    

    // Use Axios instead of fetch
    axios.post('http://127.0.0.1:5000/api/upload/post', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        if (response.status === 201) { // Check the status code here
          setQueueStatus('Upload successful!');
        } else if (response.status === 401) {
          navigate('/login');
        } else {
          setQueueStatus('Upload failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setQueueStatus('Upload failed. Please try again.');
      });
  };

  return (
    <section className="content">
      <form id="uploadForm" onSubmit={handleUpload} >
        <label htmlFor="pdfFiles">Select PDF Files:</label>
        <input type="file" id="files" name="files" accept=".pdf" multiple ref={fileInputRef} />
        <button type="submit">Upload</button>
      </form>
      <div id="queueStatus">{queueStatus}</div>
    </section>
  );
};

export default PrintoutPage;
