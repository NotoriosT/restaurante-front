import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Menu/Login";
import Gerente from "./Gerente/Gerente";
import Garcom from "./Garcom/Garcom";
import Cozinha from "./Cozinha/Cozinha";
import CadastroColaborador from "./Gerente/Cadastro/CadastroColaborador";
import ListaColaboradores from "./Gerente/ListaColaboradores";
import Bar from "./Bar/Bar"; // Importe o componente Bar

import './axiosConfig';
import ListaProdutos from "./Gerente/ListaProdutos";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/gerente" element={<Gerente />} />
                <Route path="/garcom" element={<Garcom />} />
                <Route path="/cozinha" element={<Cozinha />} />
                <Route path="/bar" element={<Bar />} /> {/* Adicione a rota para o Bar */}
                <Route path="/cadastrar-colaborador" element={<CadastroColaborador />} />
                <Route path="/lista-colaboradores" element={<ListaColaboradores />} />
                <Route path="/lista-produtos" element={<ListaProdutos />} />
            </Routes>
        </Router>
    );
};

export default App;
