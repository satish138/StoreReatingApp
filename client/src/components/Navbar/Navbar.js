import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavbarComponent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          🌟 RateMyStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {user?.role === 'System Administrator' && (
              <>
                <Nav.Link as={NavLink} to="/admin/dashboard">Admin Dashboard</Nav.Link>
                <Nav.Link as={NavLink} to="/store/create">Create Store</Nav.Link>
                <Nav.Link as={NavLink} to="/stores">View Stores</Nav.Link>
              </>
            )}

            {user?.role === 'Store Owner' && (
              <>
                <Nav.Link as={NavLink} to="/owner/dashboard">My Stores</Nav.Link>
                <Nav.Link as={NavLink} to="/store/create">Create Store</Nav.Link>
              </>
            )}

            {user?.role === 'Normal User' && (
              <>
                <Nav.Link as={NavLink} to="/rating">Rate Store</Nav.Link>
              </>
            )}

            {(user?.role === 'System Administrator' || user?.role === 'Store Owner' || user?.role === 'Normal User') && (
              <Nav.Link as={NavLink} to="/rating/submit">Submit Rating</Nav.Link>
            )}
          </Nav>

          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">Signed in as: <strong>{user.name}</strong></Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
