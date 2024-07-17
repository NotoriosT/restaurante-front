import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import axios from '../axiosConfig';

const Login = () => {
    const [login, setLogin] = useState('');
    const [tipo, setTipo] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');

        try {
            const response = await axios.post('/auth/login', {
                login: login,
                senha: senha
            });

            if (response.status === 200) {
                const { token, expiresIn } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('expiresIn', expiresIn);

                switch (tipo) {
                    case 'GERENTE':
                        navigate('/gerente');
                        break;
                    case 'GARCOM':
                        navigate('/garcom');
                        break;
                    case 'COZINHA':
                        navigate('/cozinha');
                        break;
                    case 'BAR':
                        navigate('/bar');
                        break;
                    case 'CHURRASCO':
                        navigate('/churrasco');
                        break;
                    default:
                        navigate('/');
                }
            }
        } catch (error) {
            setError('Credenciais inválidas. Por favor, tente novamente.');
        }
    };

    return (
        <div className="container-fluid login-container">
            <div className="row w-100">
                <div className="col-md-6 login-left">
                    <h1>Sistema De Venda</h1>
                    <p>
                        "Potencia suas vendas, simplifica sua vida: Nosso sistema de vendas, seu sucesso garantido."
                    </p>
                </div>
                <div className="col-md-6 login-right">
                    <h2>Entrar</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="login">Login</label>
                            <input
                                type="text"
                                className="form-control"
                                id="login"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tipo">Tipo</label>
                            <select
                                className="form-control"
                                id="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                required
                            >
                                <option value="">Selecione um tipo</option>
                                <option value="GERENTE">GERENTE</option>
                                <option value="CAIXA">CAIXA</option>
                                <option value="GARCOM">GARÇOM</option>
                                <option value="COZINHA">COZINHA</option>
                                <option value="BAR">BAR</option>
                                <option value="CHURRASCO">CHURRASCO</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="senha">Senha</label>
                            <input
                                type="password"
                                className="form-control"
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <button type="submit" className="btn btn-primary btn-block">
                            ACEITAR
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
