import React from 'react';
import { Link } from 'react-router-dom';
import './Siderbar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/cozinha">Pedidos</Link></li>
                <li><Link to="/" className="btn btn-danger mt-3">Sair</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
