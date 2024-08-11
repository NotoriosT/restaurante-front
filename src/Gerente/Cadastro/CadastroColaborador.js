import React, { useState } from 'react';
import { Form, Button, Modal, Container } from 'react-bootstrap';
import axios from '../../axiosConfig'; // Importa a instância configurada do axios
import Sidebar from "../../NavBar/SidebarMenu";
import { Box, CssBaseline, useMediaQuery, useTheme, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Menu } from '@mui/icons-material';
import '../css/CadastroColaborador.css';

const CadastroColaborador = () => {
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [tipoFuncionario, setTipoFuncionario] = useState('COZINHA');  // Inicializando com um valor da enum
    const [senha, setSenha] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const confirmSubmit = async () => {
        setShowConfirmation(false);
        const colaborador = { login, email, senha, tipoFuncionario };

        try {
            console.log('Enviando dados do colaborador:', colaborador);
            const response = await axios.post('/api/colaboradores', colaborador);
            if (response.status === 200 || response.status === 201) {
                console.log('Colaborador cadastrado com sucesso:', response.data);
                setShowSuccess(true);
                setLogin('');
                setEmail('');
                setTipoFuncionario('COZINHA');
                setSenha('');
            } else {
                console.error('Erro ao cadastrar colaborador:', response.data);
            }
        } catch (error) {
            console.error('Erro ao cadastrar colaborador:', error);
        }
    };

    const handleClose = () => {
        setShowConfirmation(false);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
    };

    const handleDrawerToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <CssBaseline />
            {isMobile && (
                <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Cadastro de Colaborador
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}
            <Sidebar
                open={sidebarOpen}
                onClose={handleDrawerToggle}
                userType="gerente"
            />
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: isMobile ? theme.mixins.toolbar.minHeight : 0 }}>
                <Container className="form-container">
                    <Box className="form-content" sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3, border: '1px solid #ccc', borderRadius: 2, boxShadow: 1, backgroundColor: '#fff' }}>
                        <Typography variant="h4" component="h2" className="form-title" sx={{ textAlign: 'center', mb: 4 }}>
                            Cadastro de Colaborador
                        </Typography>
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

                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Digite o email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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

                            <div className="text-center mt-4">
                                <Button variant="primary" type="submit" className="custom-button">
                                    Cadastrar
                                </Button>
                            </div>
                        </Form>
                    </Box>
                </Container>
                <Modal show={showConfirmation} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar Cadastro</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Tem certeza de que deseja cadastrar o colaborador com as seguintes informações?</p>
                        <p><strong>Login:</strong> {login}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Tipo:</strong> {tipoFuncionario}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={confirmSubmit}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showSuccess} onHide={handleSuccessClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sucesso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Colaborador cadastrado com sucesso!</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleSuccessClose}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Box>
        </div>
    );
};

export default CadastroColaborador;
