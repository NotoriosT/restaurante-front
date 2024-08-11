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

const Cozinha = () => {
    const [pedidos, setPedidos] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get('/api/pedidos/cozinha');
                setPedidos(response.data);
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
            }
        };

        fetchPedidos();

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/cozinha', (message) => {
                if (message.body) {
                    const novoPedido = JSON.parse(message.body);
                    setPedidos(prevPedidos => {
                        const existingPedido = prevPedidos.find(p => p.id === novoPedido.id);
                        if (existingPedido) {
                            return prevPedidos.map(p => p.id === novoPedido.id ? novoPedido : p).filter(p => p.status === 'PEDENTE' || p.status === 'PREPARANDO');
                        } else {
                            return [...prevPedidos, novoPedido].filter(p => p.status === 'PEDENTE' || p.status === 'PREPARANDO');
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
            setPedidos(prevPedidos => prevPedidos.map(pedido =>
                pedido.id === id ? { ...pedido, status: response.data.status } : pedido
            ).filter(p => p.status === 'PEDENTE' || p.status === 'PREPARANDO'));
        } catch (error) {
            console.error('Erro ao atualizar status do pedido:', error);
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
                userType="cozinha"
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
                        Pedidos
                    </Typography>
                    <Grid container spacing={3}>
                        {pedidos.map(pedido => (
                            <Grid item xs={12} sm={6} md={4} key={pedido.id}>
                                <Paper elevation={3} sx={{ p: 2, borderLeft: pedido.status === 'PREPARANDO' ? '5px solid #28a745' : 'none' }}>
                                    <Typography variant="h6">Mesa {pedido.mesaId}</Typography>
                                    <Typography>Status: {pedido.status}</Typography>
                                    <Box sx={{ my: 2 }}>
                                        {pedido.produtos && pedido.produtos.length > 0 ? (
                                            pedido.produtos.map((produtoPedido, index) => (
                                                <Box key={index} sx={{ mb: 1 }}>
                                                    <Typography>{produtoPedido.produto ? produtoPedido.produto.nome : 'Produto desconhecido'} - Quantidade: {produtoPedido.quantidade}</Typography>
                                                    <Typography>Observação: {produtoPedido.observacao}</Typography>
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
                                            onClick={() => iniciarPreparo(pedido.id)}
                                            disabled={pedido.status !== 'PEDENTE'}
                                            fullWidth
                                        >
                                            Iniciar Preparo
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: '#dc3545', color: '#fff', '&:hover': { backgroundColor: '#c82333' } }}
                                            onClick={() => finalizarPreparo(pedido.id)}
                                            disabled={pedido.status !== 'PREPARANDO'}
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
};

export default Cozinha;
