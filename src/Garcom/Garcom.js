// Garcom.js
import React, { useState, useEffect } from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Menu } from '@mui/icons-material';
import Sidebar from '../NavBar/SidebarMenu'; // Atualize o import para a nova Sidebar
import 'bootstrap/dist/css/bootstrap.min.css';
import './Garcom.css';
import Mesas from '../Factory/Mesas';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa a instância configurada do axios


const Garcom = () => {
    const [showCadastrarMesa, setShowCadastrarMesa] = useState(false);
    const [numero, setNumero] = useState('');
    const [status, setStatus] = useState('Livre');
    const [mesas, setMesas] = useState([]);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    useEffect(() => {
        fetchMesas();
    }, []);

    const toggleCadastrarMesa = () => {
        setShowCadastrarMesa(!showCadastrarMesa);
    };

    const handleNumeroChange = (e) => {
        setNumero(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const novaMesa = { numero, status };

        try {
            const response = await axios.post('/api/mesas', novaMesa);
            console.log('Mesa cadastrada com sucesso:', response.data);
            setNumero('');
            setStatus('Livre');
            fetchMesas(); // Atualiza a lista de mesas após o cadastro
            toggleCadastrarMesa(); // Fecha o modal após o cadastro
        } catch (error) {
            console.error('Erro ao cadastrar mesa:', error);
        }
    };

    const handleDrawerToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const actions = {
        toggleCadastrarMesa
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
                            Garçom
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            <Sidebar
                open={sidebarOpen}
                onClose={handleDrawerToggle}
                userType="garcom" // Definindo o tipo de usuário como "garcom"
                actions={actions} // Passando as ações para a Sidebar
            />
            <main  className="tam" style={{  justifyContent: 'center', alignItems: 'center' }}>

                        <Mesas mesas={mesas} />



                <Modal show={showCadastrarMesa} onHide={toggleCadastrarMesa} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Cadastrar Mesa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="numeroMesa">
                                <Form.Label>Número da Mesa</Form.Label>
                                <Form.Control type="text" value={numero} onChange={handleNumeroChange} required />
                            </Form.Group>
                            <Form.Group controlId="statusMesa">
                                <Form.Label>Status</Form.Label>
                                <Form.Control as="select" value={status} onChange={handleStatusChange}>
                                    <option value="Livre">Livre</option>
                                    <option value="Ocupada">Ocupada</option>
                                    <option value="Reservada">Reservada</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3">Cadastrar</Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={toggleCadastrarMesa}>Cancelar</Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
}

export default Garcom;
