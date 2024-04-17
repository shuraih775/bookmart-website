import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NN() {
  const [expanded, setExpanded] = useState(false);

  const handleLinkClick = () => {
    setExpanded(false); 
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" expanded={expanded}>
      <Container>
        <Navbar.Brand href="#home">College Bookmart-Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* <Link className="nav-link" to="/" onClick={handleLinkClick}>
              Home
            </Link> */}
            <Link className="nav-link" to="/stationery" onClick={handleLinkClick}>
              Stationery
            </Link>
            <Link className="nav-link" to="/printout" onClick={handleLinkClick}>
              Printout
            </Link>
            <Link className="nav-link" to="/orders" onClick={handleLinkClick}>
              Orders
            </Link>
            <Link className="nav-link" to="/transaction" onClick={handleLinkClick}>
              Transaction
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NN;
