import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Button,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CssBaseline,
    Container,
    useTheme,
    useMediaQuery,
    Divider,
    TextField,
} from '@mui/material';
import { Menu, Home, Info, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../NavBar/SidebarMenu'; // Import the Sidebar component

const drawerWidth = 240;

const ListaProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [filteredProdutos, setFilteredProdutos] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [selectedProduto, setSelectedProduto] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await axios.get('/api/produtos');
                setProdutos(response.data);
                setFilteredProdutos(response.data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchProdutos();
    }, []);

    useEffect(() => {
        setFilteredProdutos(
            produtos.filter(produto =>
                produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setCurrentPage(0);
    }, [searchTerm, produtos]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/produtos/${selectedProduto.id}`);
            setProdutos(produtos.filter(p => p.id !== selectedProduto.id));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
        }
    };

    const handleBlock = async () => {
        try {
            await axios.post(`/api/produtos/${selectedProduto.id}/block`);
            setProdutos(produtos.map(p => p.id === selectedProduto.id ? { ...p, blocked: true } : p));
            setShowBlockModal(false);
        } catch (error) {
            console.error('Erro ao bloquear produto:', error);
        }
    };

    const handleShowDeleteModal = (produto) => {
        setSelectedProduto(produto);
        setShowDeleteModal(true);
    };

    const handleShowBlockModal = (produto) => {
        setSelectedProduto(produto);
        setShowBlockModal(true);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < filteredProdutos.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = currentPage * itemsPerPage;
    const currentItems = filteredProdutos.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <CssBaseline />
            <Sidebar
                userType="gerente"
                open={mobileOpen}
                onClose={handleDrawerToggle}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg">
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextField
                            label="Buscar"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Box>
                    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
                        <Table aria-label="produtos table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Preço</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Imagem</TableCell>
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.map((produto) => (
                                    <TableRow key={produto.id}>
                                        <TableCell>{produto.nome}</TableCell>
                                        <TableCell>{produto.preco}</TableCell>
                                        <TableCell>{produto.tipo}</TableCell>
                                        <TableCell>
                                            {produto.imagem && <img src={`data:image/jpeg;base64,${produto.imagem}`} alt={produto.nome} style={{ width: '50px', height: '50px' }} />}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleShowDeleteModal(produto)}
                                                sx={{ mr: 2, width: '100px' }}
                                            >
                                                Deletar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                onClick={() => handleShowBlockModal(produto)}
                                                sx={{ width: '100px' }}
                                            >
                                                Bloquear
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                        >
                            Anterior
                        </Button>
                        <Typography>Page {currentPage + 1}</Typography>
                        <Button
                            variant="contained"
                            onClick={handleNextPage}
                            disabled={(currentPage + 1) * itemsPerPage >= filteredProdutos.length}
                        >
                            Próximo
                        </Button>
                    </Box>

                    <Modal
                        open={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        aria-labelledby="delete-modal-title"
                        aria-describedby="delete-modal-description"
                    >
                        <Box sx={modalStyle}>
                            <Typography id="delete-modal-title" variant="h6" component="h2">
                                Confirmar Deleção
                            </Typography>
                            <Typography id="delete-modal-description" sx={{ mt: 2 }}>
                                Tem certeza que deseja deletar este produto?
                            </Typography>
                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <Button variant="contained" onClick={() => setShowDeleteModal(false)} sx={{ mr: 2 }}>
                                    Cancelar
                                </Button>
                                <Button variant="contained" color="error" onClick={handleDelete}>
                                    Deletar
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    <Modal
                        open={showBlockModal}
                        onClose={() => setShowBlockModal(false)}
                        aria-labelledby="block-modal-title"
                        aria-describedby="block-modal-description"
                    >
                        <Box sx={modalStyle}>
                            <Typography id="block-modal-title" variant="h6" component="h2">
                                Confirmar Bloqueio
                            </Typography>
                            <Typography id="block-modal-description" sx={{ mt: 2 }}>
                                Tem certeza que deseja bloquear este produto?
                            </Typography>
                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <Button variant="contained" onClick={() => setShowBlockModal(false)} sx={{ mr: 2 }}>
                                    Cancelar
                                </Button>
                                <Button variant="contained" color="warning" onClick={handleBlock}>
                                    Bloquear
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </Container>
            </Box>
        </Box>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default ListaProdutos;
