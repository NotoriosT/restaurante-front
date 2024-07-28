import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Siderbar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/cozinha">Pedidos</Link></li>
                <li><button onClick={goBack} className="btn btn-secondary mt-3">Voltar</button></li>
                <li><Link to="/" className="btn btn-danger mt-3">Sair</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
