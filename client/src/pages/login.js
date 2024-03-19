import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
async function fetchData() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      console.log(2);
      throw new Error('Failed to fetch data');
    }
    
    try{
      const {token} = await response.json();
    sessionStorage.setItem('token', JSON.stringify(token));
    
      if (token) {
        const res = await axios.get('http://localhost:5000/api/auth/fetchusername', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const fetchedUsername = res.data.username;
        const x = sessionStorage.getItem('username') || '' ;
        sessionStorage.setItem('username', fetchedUsername);
        if (x!==fetchedUsername){
          window.location.href = '/';
        }
      }

      navigate('/');
    console.log(token);
    }
  
    catch{
      const redirectUrl = response.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
      }
    }
   catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
fetchData();
  
  };

  return (
    <div>
      <h2>Login</h2>
      
      <form onSubmit={handleSubmit} className='container'>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <div>
      <p> Create new Account?<Link className="nav-link"  to="/signup">Signup</Link>
      </p>
      
      
     </div>
    </div>
    
  );
};

export default LoginForm;
