import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Importe o componente Sidebar
import './Cozinha.css';

const Cozinha = () => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/pedidos'); // Altere para o endpoint correto do seu backend
                setPedidos(response.data);
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);

    const iniciarPreparo = (id) => {
        const novosPedidos = pedidos.map(pedido =>
            pedido.id === id ? { ...pedido, status: 'Em Preparo' } : pedido
        );
        setPedidos(novosPedidos);
    };

    const finalizarPreparo = (id) => {
        const novosPedidos = pedidos.map(pedido =>
            pedido.id === id ? { ...pedido, status: 'Pronto' } : pedido
        );
        setPedidos(novosPedidos);
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
                            <div key={pedido.id} className="pedido-card">
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
                                        className={`btn ${pedido.status === 'Aguardando' ? 'btn-warning' : 'btn-success'}`}
                                        onClick={() => iniciarPreparo(pedido.id)}
                                        disabled={pedido.status !== 'Aguardando'}
                                    >
                                        Iniciar Preparo
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => finalizarPreparo(pedido.id)}
                                        disabled={pedido.status !== 'Em Preparo'}
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
