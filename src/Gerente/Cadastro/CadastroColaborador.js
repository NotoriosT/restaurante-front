import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from '../../axiosConfig'; // Importa a instância configurada do axios
import '../css/CadastroColaborador.css';
import SidebarMenuGerente from "../SidebarMenuGerente";

const CadastroColaborador = () => {
    const [login, setLogin] = useState('');
    const [tipoFuncionario, setTipoFuncionario] = useState('COZINHA');  // Inicializando com um valor da enum
    const [senha, setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const colaborador = { login, senha, tipoFuncionario }; // Mapeia corretamente para tipoFuncionario

        try {
            console.log('Enviando dados do colaborador:', colaborador);

            const response = await axios.post('/api/colaboradores', colaborador);

            if (response.status === 200 || response.status === 201) {
                console.log('Colaborador cadastrado com sucesso:', response.data);
                // Limpar os campos do formulário após o sucesso
                setLogin('');
                setTipoFuncionario('COZINHA');
                setSenha('');
            } else {
                console.error('Erro ao cadastrar colaborador:', response.data);
            }
        } catch (error) {
            console.error('Erro ao cadastrar colaborador:', error);
        }
    };

    return (
        <div className="d-flex">
            <SidebarMenuGerente />
            <div className="cadastro-colaborador-container">
                <h2>Cadastro de Colaborador</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formLogin">
                        <Form.Label>Login</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formTipoFuncionario">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                            as="select"
                            value={tipoFuncionario}
                            onChange={(e) => setTipoFuncionario(e.target.value)}
                            required
                        >
                            <option value="COZINHA">Cozinha</option>
                            <option value="BAR">Bar</option>
                            <option value="CHURRASCO">Churrasco</option>
                            <option value="CAIXA">Caixa</option>
                            <option value="GARCOM">Garçom</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formSenha">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Digite a senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Cadastrar
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default CadastroColaborador;
