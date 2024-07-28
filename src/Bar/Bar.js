import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Importa a instância configurada do axios
import Sidebar from '../Cozinha/Sidebar'; // Importe o componente Sidebar
import './Bar.css'; // Crie um arquivo CSS para o Bar
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Bar = () => {
    const [bebidas, setBebidas] = useState([]);

    useEffect(() => {
        const fetchBebidas = async () => {
            try {
                const response = await axios.get('/api/bebidas');
                setBebidas(response.data);
            } catch (error) {
                console.error('Erro ao buscar bebidas:', error);
            }
        };

        fetchBebidas();

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/bebidas', (message) => {
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
            const response = await axios.put(`/api/bebidas/${id}/status`, null, { params: { status } });
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

    return (
        <div className="bar-container row no-gutters">
            <div className="bar-sidebar col-md-3 col-lg-3">
                <Sidebar />
            </div>
            <div className="bar-main col-md-9 col-lg-9 ml-auto">
                <div className="cala">
                    <h1 className="mb-4">Bebidas</h1>
                    <div className="bebidas-container">
                        {bebidas.map(bebida => (
                            <div key={bebida.id} className={`bebida-card ${bebida.status === 'PREPARANDO' ? 'border-success' : ''}`}>
                                <h3>{bebida.nome}</h3>
                                <p>Status: {bebida.status}</p>
                                <div className="produtos-lista">
                                    {bebida.produtos && bebida.produtos.length > 0 ? (
                                        bebida.produtos.map((produtoBebida, index) => (
                                            <div key={index} className="produto-item">
                                                <p>{produtoBebida.produto ? produtoBebida.produto.nome : 'Produto desconhecido'} - Quantidade: {produtoBebida.quantidade}</p>
                                                <p>Observação: {produtoBebida.observacao}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Nenhum produto adicionado.</p>
                                    )}
                                </div>
                                <div className="btn-container">
                                    <button
                                        className={`btn ${bebida.status === 'PEDENTE' ? 'btn-warning' : 'btn-success'}`}
                                        onClick={() => iniciarPreparo(bebida.id)}
                                        disabled={bebida.status !== 'PEDENTE'}
                                    >
                                        Iniciar Preparo
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => finalizarPreparo(bebida.id)}
                                        disabled={bebida.status !== 'PREPARANDO'}
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

export default Bar;
