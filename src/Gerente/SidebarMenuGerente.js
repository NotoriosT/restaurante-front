import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import "./css/SidebarMenu.css";

const SidebarMenuGerente = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="flex-column sidebar">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="flex-column sidebar-nav">
                    <Nav.Item>
                        <Nav.Link as={Link} to="/cozinha">Cozinha</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/bar">Bar</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/churrasco">Churrasco</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/gerente">Produtos</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/cadastrar-colaborador">Cadastrar Colaborador</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/lista-colaboradores">Lista de Colaboradores</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mt-auto">
                        <Nav.Link as={Link} to="/" className="btn btn-danger btn-block">Sair</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default SidebarMenuGerente;
