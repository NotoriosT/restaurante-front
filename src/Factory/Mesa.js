import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa a instância configurada do axios
import './Mesa.css';

const Mesa = ({ mesa }) => {
    const [pedidoAtual, setPedidoAtual] = useState({
        produto: '',
        quantidade: 1,
        total: 0,
        observacao: ''
    });
    const [produtosNoPedido, setProdutosNoPedido] = useState([]);
    const [pedidosEnviados, setPedidosEnviados] = useState([]);
    const [mostrarFormPedido, setMostrarFormPedido] = useState(false);
    const [mostrarResumoPedidos, setMostrarResumoPedidos] = useState(false);
    const [status, setStatus] = useState(mesa.status);
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [totalGasto, setTotalGasto] = useState(0);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await axios.get('/api/produtos');
                setProdutos(response.data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchProdutos();
    }, []);

    const abrirFormPedido = () => {
        setMostrarFormPedido(true);
    };

    const fecharFormPedido = () => {
        setMostrarFormPedido(false);
    };

    const abrirResumoPedidos = () => {
        setMostrarResumoPedidos(true);
    };

    const fecharResumoPedidos = () => {
        setMostrarResumoPedidos(false);
    };

    const handleProdutoChange = (e) => {
        const id = e.target.value;
        const produto = produtos.find(p => p.id === id);
        if (produto) {
            setPedidoAtual({
                ...pedidoAtual,
                produto: produto,
                total: produto.preco * pedidoAtual.quantidade
            });
            setProdutoSelecionado(produto.nome);
        } else {
            setProdutoSelecionado('');
        }
    };

    const handleQuantidadeChange = (e) => {
        const qtd = parseInt(e.target.value, 10);
        setPedidoAtual({
            ...pedidoAtual,
            quantidade: qtd,
            total: pedidoAtual.produto ? pedidoAtual.produto.preco * qtd : 0
        });
    };

    const handleObservacaoChange = (e) => {
        setPedidoAtual({
            ...pedidoAtual,
            observacao: e.target.value
        });
    };

    const adicionarProduto = () => {
        if (pedidoAtual.produto) {
            setProdutosNoPedido([...produtosNoPedido, {
                produto: pedidoAtual.produto,
                quantidade: pedidoAtual.quantidade,
                total: pedidoAtual.total,
                observacao: pedidoAtual.observacao
            }]);
            setPedidoAtual({ produto: '', quantidade: 1, total: 0, observacao: '' });
            setProdutoSelecionado('');
        }
    };

    const enviarPedidos = async () => {
        try {
            const pedidoParaEnviar = {
                mesaId: mesa.numero,
                produtos: produtosNoPedido,
                status: 'pendente'
            };

            const response = await axios.post('/api/pedidos', pedidoParaEnviar);
            console.log('Pedidos enviados:', response.data);

            setPedidosEnviados([...pedidosEnviados, pedidoParaEnviar]);
            setProdutosNoPedido([]);
            fecharFormPedido();
            setStatus('ocupada');
        } catch (error) {
            console.error('Erro ao enviar pedidos:', error);
        }
    };

    const calcularTotal = () => {
        const totalProdutosNoPedido = produtosNoPedido.reduce((acc, produto) => acc + produto.total, 0);
        const totalPedidosEnviados = pedidosEnviados.reduce((total, pedido) => {
            return total + pedido.produtos.reduce((subtotal, produto) => {
                return subtotal + produto.total;
            }, 0);
        }, 0);

        return totalProdutosNoPedido + totalPedidosEnviados;
    };

    const fecharConta = async () => {
        try {
            const response = await axios.get(`/api/mesas/${mesa.numero}/total-gasto`);
            setTotalGasto(response.data);
            abrirResumoPedidos();
        } catch (error) {
            console.error('Erro ao calcular total gasto:', error);
        }
    };

    const confirmarFecharConta = () => {
        setStatus('disponível');
        setProdutosNoPedido([]);
        setPedidosEnviados([]);
        fecharResumoPedidos();
    };

    return (
        <div className="card mesa-card text-white mb-3">
            <div className="card-body">
                <h5 className="card-title">Mesa {mesa.numero}</h5>
                <h5 className="card-title">Status: {status}</h5>
                <button onClick={abrirFormPedido} className="btn btn-primary small-btn">Fazer Pedido</button>
                <button onClick={fecharConta} className="btn btn-secondary small-btn">Fechar Conta</button>

                <Modal show={mostrarFormPedido} onHide={fecharFormPedido} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Fazer Pedido</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Produto</Form.Label>
                                <Form.Control as="select" onChange={handleProdutoChange} value={pedidoAtual.produto.id || ''}>
                                    <option value="">Selecione um produto</option>
                                    {produtos.map(prod => (
                                        <option key={prod.id} value={prod.id}>{prod.nome} - R${prod.preco.toFixed(2)}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            {produtoSelecionado && (
                                <p>Produto selecionado: {produtoSelecionado}</p>
                            )}
                            <Form.Group>
                                <Form.Label>Quantidade</Form.Label>
                                <Form.Control type="number" value={pedidoAtual.quantidade} onChange={handleQuantidadeChange} min="1" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Observação</Form.Label>
                                <Form.Control as="textarea" value={pedidoAtual.observacao} onChange={handleObservacaoChange} rows="3" />
                            </Form.Group>
                            <p>Total: R${pedidoAtual.total.toFixed(2)}</p>
                            <Button variant="success" className="small-btn" onClick={adicionarProduto}>Adicionar Produto</Button>
                            <hr />
                            <h5>Produtos Adicionados:</h5>
                            <ul>
                                {produtosNoPedido.map((produto, index) => (
                                    <li key={index}>
                                        {produto.quantidade}x {produto.produto.nome} - R${produto.total.toFixed(2)}
                                        <br />
                                        <small>Observação: {produto.observacao}</small>
                                    </li>
                                ))}
                            </ul>
                            <h5>Total até agora: R${produtosNoPedido.reduce((acc, produto) => acc + produto.total, 0).toFixed(2)}</h5>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className="small-btn" onClick={fecharFormPedido}>Cancelar</Button>
                        <Button variant="primary" className="small-btn" onClick={enviarPedidos}>Enviar Pedido</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={mostrarResumoPedidos} onHide={fecharResumoPedidos} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Resumo de Pedidos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul>
                            {pedidosEnviados.map((pedido, index) => (
                                <li key={index}>
                                    {pedido.produtos.map((produto, idx) => (
                                        <div key={idx}>
                                            {produto.quantidade}x {produto.produto.nome} - R${produto.total.toFixed(2)}
                                            <br />
                                            <small>Observação: {produto.observacao}</small>
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                        <h5>Total: R${totalGasto.toFixed(2)}</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className="small-btn" onClick={fecharResumoPedidos}>Cancelar</Button>
                        <Button variant="primary" className="small-btn" onClick={confirmarFecharConta}>Confirmar Fechamento</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Mesa;
