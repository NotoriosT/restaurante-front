import React, { useState, useEffect } from 'react';
import Mesa from './Mesa';
import './Mesas.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../axiosConfig';

const Mesas = () => {
    const [mesas, setMesas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMesas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/mesas', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMesas(response.data);
            } catch (error) {
                console.error('Erro ao buscar mesas:', error);
                setError('Erro ao buscar mesas');
            }
        };

        fetchMesas();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {mesas.map((mesa, index) => (
                    <div key={mesa.id || index} className="col">
                        <Mesa mesa={mesa} />
                    </div>
                ))}
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
}

export default Mesas;
