import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Importa a instância configurada do axios
import Sidebar from './Sidebar'; // Importe o componente Sidebar
import './Cozinha.css';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Cozinha = () => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get('/api/pedidos');
                setPedidos(response.data);
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
            }
        };

        fetchPedidos();

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/pedidos', (message) => {
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

    return (
        <div className="cozinha-container row no-gutters">
            <div className="cozinha-sidebar col-md-3 col-lg-3">
                <Sidebar />
            </div>
            <div className="cozinha-main col-md-9 col-lg-9 ml-auto">
                <div className="cala">
                    <h1 className="mb-4">Pedidos</h1>
                    <div className="pedidos-container">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className={`pedido-card ${pedido.status === 'PREPARANDO' ? 'border-success' : ''}`}>
                                <h3>Mesa {pedido.mesaId}</h3>
                                <p>Status: {pedido.status}</p>
                                <div className="produtos-lista">
                                    {pedido.produtos && pedido.produtos.length > 0 ? (
                                        pedido.produtos.map((produtoPedido, index) => (
                                            <div key={index} className="produto-item">
                                                <p>{produtoPedido.produto ? produtoPedido.produto.nome : 'Produto desconhecido'} - Quantidade: {produtoPedido.quantidade}</p>
                                                <p>Observação: {produtoPedido.observacao}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Nenhum produto adicionado.</p>
                                    )}
                                </div>
                                <div className="btn-container">
                                    <button
                                        className={`btn ${pedido.status === 'PEDENTE' ? 'btn-warning' : 'btn-success'}`}
                                        onClick={() => iniciarPreparo(pedido.id)}
                                        disabled={pedido.status !== 'PEDENTE'}
                                    >
                                        Iniciar Preparo
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => finalizarPreparo(pedido.id)}
                                        disabled={pedido.status !== 'PREPARANDO'}
                                    >
                                        Finalizar Preparo
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cozinha;
