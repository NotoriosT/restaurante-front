// Gerente.js
import React, { useState } from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Menu } from '@mui/icons-material';
import Sidebar from '../NavBar/SidebarMenu'; // Atualize o import para a nova Sidebar
import './css/Gerente.css';
import axios from '../axiosConfig'; // Importa a instância configurada do axios
import { Modal, Button, Form } from 'react-bootstrap';


const Gerente = () => {
    const [produto, setProduto] = useState({
        nome: '',
        preco: '',
        disponivel: false,
        tipo: ''
    });
    const [imagem, setImagem] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduto({ ...produto, [name]: value });
    };

    const handleImageChange = (event) => {
        setImagem(event.target.files[0]);
    };

    const handleCheckboxChange = (event) => {
        setProduto({ ...produto, disponivel: event.target.checked });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowConfirmation(true);
    };

    const confirmSubmit = async () => {
        setShowConfirmation(false);
        const formData = new FormData();
        formData.append('produto', new Blob([JSON.stringify(produto)], { type: 'application/json' }));
        formData.append('file', imagem);

        try {
            const response = await axios.post('/api/produtos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Produto cadastrado:', response.data);
            setShowSuccess(true);
            // Limpa o formulário
            setProduto({
                nome: '',
                preco: '',
                disponivel: false,
                tipo: ''
            });
            setImagem(null);
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            // Adicione a lógica de erro aqui, como exibir uma mensagem de erro
        }
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
                            Gerente
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            <Sidebar
                open={sidebarOpen}
                onClose={handleDrawerToggle}
                userType="gerente" // Definindo o tipo de usuário como "garcom"
            />
            <main style={{ flexGrow: 1, padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: isMobile ? theme.mixins.toolbar.minHeight : 0 }}>
                <div className="container form-container d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', height: '100%' }}>
                    <div className="col-12 col-md-8 col-lg-6">
                        <h1 className="form-title mb-4 text-center">Cadastrar Produto</h1>
                        <form onSubmit={handleSubmit} className="form-content">
                            <Form.Group>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" name="nome" value={produto.nome} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Preço</Form.Label>
                                <Form.Control type="text" name="preco" value={produto.preco} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Imagem do Produto</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Tipo</Form.Label>
                                <Form.Control as="select" name="tipo" value={produto.tipo} onChange={handleChange} required>
                                    <option value="">Selecione...</option>
                                    <option value="CHURRASCO">Churrasco</option>
                                    <option value="BEBIDA">Bebida</option>
                                    <option value="COZINHA">Cozinha</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Check type="checkbox" id="productAvailable" label="Disponível" checked={produto.disponivel} onChange={handleCheckboxChange} />
                            </Form.Group>
                            <div className="text-center mt-4">
                                <Button type="submit" variant="primary" className="custom-button">Cadastrar</Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Modal de Confirmação */}
                <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar Cadastro</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Tem certeza de que deseja cadastrar o produto com as seguintes informações?</p>
                        <p><strong>Nome:</strong> {produto.nome}</p>
                        <p><strong>Preço:</strong> {produto.preco}</p>
                        <p><strong>Tipo:</strong> {produto.tipo}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={confirmSubmit}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal de Sucesso */}
                <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Sucesso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Produto cadastrado com sucesso!</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setShowSuccess(false)}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
}

export default Gerente;
