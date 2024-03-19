import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from 'react-bootstrap/NavDropdown';


function CollapsibleExample() {
  const [username, setUsername] = useState('');  
  const navigate = useNavigate();
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Storage event fired!");
      const storedUsername = sessionStorage.getItem('username');
      
      setUsername(storedUsername || '');
    };
    handleStorageChange();
  }, []);

 

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    setUsername('');
    navigate('/login');
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">College Bookmart</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" to="/">
              Home
            </Link>
            <Link className="nav-link" to="/stationery">
              Stationery
            </Link>
            <Link className="nav-link" to="/printout">
              Printout
            </Link>
            <Link className="nav-link" to="/cart">
              Cart
            </Link>
            <Link className="nav-link" to="/orders">
              Orders
            </Link>
            {username ? (
              <NavDropdown title={username} id="username-dropdown">
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Link className="nav-link" to="/login">
                Login
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;
