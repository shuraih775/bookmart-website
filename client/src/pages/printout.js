import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Popup from './popup';

function PrintoutPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [doRedirect, setDoRedirect] = useState(false);
  const [selectedColor, setSelectedColor] = useState('black and white');
  const [isReport, setIsReport] = useState(false);
  
  const DepartmentDropdown = () => {
    const [department, setDepartment] = useState('');
  
    const handleDepartmentChange = (e) => {
      setDepartment(e.target.value);
    };

    return (
      <div >
        <label htmlFor="department">Select Department:</label>
        <select id="department" value={department} onChange={handleDepartmentChange}>
          <option value="">Select Department</option>
          <option value="cse">Computer Science and Engineering (CSE)</option>
          <option value="eee">Electrical and Electronics Engineering (EEE)</option>
          <option value="ece">Electronics and Communication Engineering (ECE)</option>
          <option value="aiml">Artificial Intelligence and Machine Learning (AIML)</option>
          <option value="aids">Artificial Intelligence and Data Science (AIDS)</option>
          <option value="mech">Mechanical Engineering</option>
          <option value="civil">Civil Engineering</option>
          <option value="iot">Internet of Things (IoT)</option>
          <option value="iem">Industrial Engineering and Management (IEM)</option>
        </select>
      </div>
    );
  };

  const handleClosePopup = (doRedirect) => {
    setShowPopup(false);
    if (doRedirect) {
      navigate('/login');
    }
  };
  
  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const files = fileInputRef.current.files;
    if(files.length === 0){
      setMsg('Select atleast one file to upload!');
      setStatus(false);
      setDoRedirect(false);
      setShowPopup(true);
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
      }
    } catch {
      console.log(token);
      navigate('/login');
      return;
    }

    axios.post('http://localhost:5000/api/upload/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        if (response.status === 201) { 
          setMsg('Upload successful!');
          setStatus(true);
          setDoRedirect(false);
          setShowPopup(true);
        } else if (response.status === 401) {
          setMsg("Please login to order. Navigating to Login Page...")
          setStatus(false);
          setDoRedirect(true);
          setShowPopup(true);
        } else {
          setMsg('Upload failed. Please try again.');
          setStatus(false);
          setDoRedirect(false);
          setShowPopup(true);
        }
      })
      .catch((error) => {
        setMsg('Upload failed. Please try again.');
        setStatus(false);
        setDoRedirect(false);
        setShowPopup(true);
      });
  };

  return (
    <section className="content">
      <form id="uploadForm" onSubmit={handleUpload} >
        <label htmlFor="pdfFiles">Select PDF Files To Upload:</label>
        <input  type="file" id="files" name="files" accept=".pdf" multiple ref={fileInputRef} />
        
        <div className='print-div'>
          <label>Color:</label>
          <label>
            <input 
              type="radio"
              value="Color"
              checked={selectedColor === 'Color'}
              onChange={handleColorChange}
            />
            Colored 
          </label>
          <label>
            <input 
              type="radio"
              value="black and white"
              checked={selectedColor === 'black and white'}
              onChange={handleColorChange}
            />
            Black n White
          </label>
        </div>
        <div className='print-div'>
          <label>Report:</label>
          <label>
            <input 
              type="radio"
              value="Color"
              checked={isReport === true}
              onChange={()=>{
                setIsReport(true);
              }} 
            />
            Yes
          </label>
          <label>
            <input 
              type="radio"
              value="black and white"
              checked={isReport === false}
              onChange={()=>{
                setIsReport(false);
              }}
            />
            No
          </label>
        </div>
        {isReport && <DepartmentDropdown />}
        <button className='btn-1' type="submit">Upload</button>
      </form>
     
      {showPopup && (
        <Popup
          message={msg}
          onClose={handleClosePopup}
          status={status}
          doRedirect={doRedirect}
        />
      )}
    </section>
  );
};

export default PrintoutPage;
