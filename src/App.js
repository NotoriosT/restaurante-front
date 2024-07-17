import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Menu/Login";
import Gerente from "./Gerente/Gerente";
import Garcom from "./Garcom/Garcom";
import Cozinha from "./Cozinha/Cozinha";
import CadastroColaborador from "./Gerente/Cadastro/CadastroColaborador";
import ListaColaboradores from "./Gerente/ListaColaboradores";

import './axiosConfig';


const App = () => {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/gerente" element={<Gerente />} />
                <Route path="/garcom" element={<Garcom />} />
                <Route path="/cozinha" element={<Cozinha/>}/>
                <Route path="/cadastrar-colaborador" element={<CadastroColaborador />}/>
                <Route path="/lista-colaboradores" element={<ListaColaboradores />} />


            </Routes>
        </Router>
    );
};

export default App;
