import React from 'react';
import Mesa from './Mesa';
import './Mesas.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Mesas = ({ mesas }) => {
    return (
        <div className="container mt-5">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {mesas.map((mesa, index) => (
                    <div key={mesa.id || index} className="col">
                        <Mesa mesa={mesa} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Mesas;
