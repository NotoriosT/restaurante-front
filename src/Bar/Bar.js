import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Sidebar from '../NavBar/SidebarMenu';
import {
    Box,
    Button,
    Typography,
    Container,
    CssBaseline,
    Toolbar,
    useTheme,
    useMediaQuery,
    Paper,
    Grid
} from '@mui/material';

const drawerWidth = 240;

const Bar = () => {
    const [bebidas, setBebidas] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchBebidas = async () => {
            try {
                const response = await axios.get('/api/pedidos/bar');
                setBebidas(response.data);
            } catch (error) {
                console.error('Erro ao buscar bebidas:', error);
            }
        };

        fetchBebidas();

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/bar', (message) => {
                if (message.body) {
                    const novaBebida = JSON.parse(message.body);
                    setBebidas(prevBebidas => {
                        const existingBebida = prevBebidas.find(b => b.id === novaBebida.id);
                        if (existingBebida) {
                            return prevBebidas.map(b => b.id === novaBebida.id ? novaBebida : b).filter(b => b.status === 'PEDENTE' || b.status === 'PREPARANDO');
                        } else {
                            return [...prevBebidas, novaBebida].filter(b => b.status === 'PEDENTE' || b.status === 'PREPARANDO');
                        }
                    });
                }
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const response = await axios.put(`/api/pedidos/${id}/status`, null, { params: { status } });
            setBebidas(prevBebidas => prevBebidas.map(bebida =>
                bebida.id === id ? { ...bebida, status: response.data.status } : bebida
            ).filter(b => b.status === 'PEDENTE' || b.status === 'PREPARANDO'));
        } catch (error) {
            console.error('Erro ao atualizar status da bebida:', error);
        }
    };

    const iniciarPreparo = (id) => {
        updateStatus(id, 'PREPARANDO');
    };

    const finalizarPreparo = (id) => {
        updateStatus(id, 'PRONTO');
    };

    const handleDrawerToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <CssBaseline />
            <Sidebar
                userType="bar"
                open={sidebarOpen}
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
                    <Typography variant="h4" gutterBottom>
                        Bebidas
                    </Typography>
                    <Grid container spacing={3}>
                        {bebidas.map(bebida => (
                            <Grid item xs={12} sm={6} md={4} key={bebida.id}>
                                <Paper elevation={3} sx={{ p: 2, borderLeft: bebida.status === 'PREPARANDO' ? '5px solid #28a745' : 'none' }}>
                                    <Typography variant="h6">{bebida.nome}</Typography>
                                    <Typography>Status: {bebida.status}</Typography>
                                    <Box sx={{ my: 2 }}>
                                        {bebida.produtos && bebida.produtos.length > 0 ? (
                                            bebida.produtos.map((produtoBebida, index) => (
                                                <Box key={index} sx={{ mb: 1 }}>
                                                    <Typography>{produtoBebida.produto ? produtoBebida.produto.nome : 'Produto desconhecido'} - Quantidade: {produtoBebida.quantidade}</Typography>
                                                    <Typography>Observação: {produtoBebida.observacao}</Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography>Nenhum produto adicionado.</Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: '#ffc107', color: '#fff', '&:hover': { backgroundColor: '#e0a800' } }}
                                            onClick={() => iniciarPreparo(bebida.id)}
                                            disabled={bebida.status !== 'PEDENTE'}
                                            fullWidth
                                        >
                                            Iniciar Preparo
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: '#dc3545', color: '#fff', '&:hover': { backgroundColor: '#c82333' } }}
                                            onClick={() => finalizarPreparo(bebida.id)}
                                            disabled={bebida.status !== 'PREPARANDO'}
                                            fullWidth
                                        >
                                            Finalizar Preparo
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}

export default Bar;
