// Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { pathPROD } from '../utils/config';
import toyShop_Logo_pn from '../assets/logosimbolo.png';  
import './css/Navbar.css';

const CustomNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar el token de autenticación del almacenamiento local
    localStorage.removeItem('authToken');
    // Redirigir al usuario a la página de inicio de sesión
    navigate(pathPROD);
  };

  return (
    <Navbar bg="info" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={pathPROD + '/home'}>
          <img src={toyShop_Logo_pn} alt="Logo de la marca" style={{ width: '100px', height: 'auto' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={pathPROD + '/products'}>Usuarios</Nav.Link>
            <Nav.Link as={Link} to={pathPROD + '/indicators'}>Indicadores</Nav.Link>
            <Nav.Link as={Link} to={pathPROD + '/processes'}>Procesos</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>Cerrar Sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

