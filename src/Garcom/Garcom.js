import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Garcom.css';
import GarcomSidebarMenu from "../NavBar/SidebarMenu";
import Mesas from "../Factory/Mesas";

const Garcom = () => {
    return (
        <div className="d-flex">
            <GarcomSidebarMenu className="sidebar-menu" />
            <div className="content-garçom">
                <Mesas />
            </div>
        </div>
    );
}

export default Garcom;
