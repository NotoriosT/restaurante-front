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

const ListaColaboradores = () => {
    const [colaboradores, setColaboradores] = useState([]);
    const [filteredColaboradores, setFilteredColaboradores] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [selectedColaborador, setSelectedColaborador] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchColaboradores = async () => {
            try {
                const response = await axios.get('/api/colaboradores');
                setColaboradores(response.data);
                setFilteredColaboradores(response.data);
            } catch (error) {
                console.error('Erro ao buscar colaboradores:', error);
            }
        };

        fetchColaboradores();
    }, []);

    useEffect(() => {
        setFilteredColaboradores(
            colaboradores.filter(colaborador =>
                colaborador.login.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setCurrentPage(0);
    }, [searchTerm, colaboradores]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/colaboradores/${selectedColaborador.id}`);
            setColaboradores(colaboradores.filter(c => c.id !== selectedColaborador.id));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Erro ao deletar colaborador:', error);
        }
    };

    const handleBlock = async () => {
        try {
            await axios.post(`/api/colaboradores/${selectedColaborador.id}/block`);
            setColaboradores(colaboradores.map(c => c.id === selectedColaborador.id ? { ...c, blocked: true } : c));
            setShowBlockModal(false);
        } catch (error) {
            console.error('Erro ao bloquear colaborador:', error);
        }
    };

    const handleShowDeleteModal = (colaborador) => {
        setSelectedColaborador(colaborador);
        setShowDeleteModal(true);
    };

    const handleShowBlockModal = (colaborador) => {
        setSelectedColaborador(colaborador);
        setShowBlockModal(true);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < filteredColaboradores.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = currentPage * itemsPerPage;
    const currentItems = filteredColaboradores.slice(startIndex, startIndex + itemsPerPage);

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
                        <Table aria-label="colaboradores table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Login</TableCell>
                                    <TableCell>Tipo de Funcionário</TableCell>
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.map((colaborador) => (
                                    <TableRow key={colaborador.id}>
                                        <TableCell>{colaborador.login}</TableCell>
                                        <TableCell>{colaborador.tipoFuncionario}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleShowDeleteModal(colaborador)}
                                                sx={{ mr: 2, width: '100px' }}
                                            >
                                                Deletar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                onClick={() => handleShowBlockModal(colaborador)}
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
                            disabled={(currentPage + 1) * itemsPerPage >= filteredColaboradores.length}
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
                                Tem certeza que deseja deletar este colaborador?
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
                                Tem certeza que deseja bloquear este colaborador?
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

export default ListaColaboradores;
