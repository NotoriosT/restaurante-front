import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./SidebarMenu.css";

const GarcomSidebarMenu = () => {
    return (
        <div className="sidebar">
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/garcom/cadastrar-mesa" className="nav-link">Cadastrar Mesa</Link>
                </li>
                <li className="nav-item">
                    <Link to="/garcom/pedidos" className="nav-link">Pedidos</Link>
                </li>
            </ul>
            <div className="sidebar-bottom">
                <Link to="/" className="btn btn-danger mt-3 btn-block">Sair</Link>
            </div>
        </div>
    );
}

export default GarcomSidebarMenu;
