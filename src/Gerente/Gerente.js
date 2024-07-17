import React, { useState } from 'react';
import SidebarMenuGerente from './SidebarMenuGerente'; // Importe o componente SidebarMenuGerente
import './css/Gerente.css'; // Importe o CSS do componente Gerente
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const Gerente = () => {
    const [tipo, setTipo] = useState('');
    const [produto, setProduto] = useState({
        nome: '',
        preco: '',
        disponivel: false
    });
    const [imagem, setImagem] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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
            const response = await axios.post('http://localhost:8080/api/produtos', formData, {
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
                disponivel: false
            });
            setImagem(null);
            setTipo('');
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            // Adicione a lógica de erro aqui, como exibir uma mensagem de erro
        }
    };

    const handleClose = () => {
        setShowConfirmation(false);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
    };

    return (
        <div className="gerente-container">
            <div className="sidebar">
                <SidebarMenuGerente />
            </div>
            <div className="form-container">
                <div className="content">
                    <h1 className="form-title mb-4">Cadastrar Produto</h1>
                    <form onSubmit={handleSubmit} className="form-content">
                        <div className="form-group">
                            <label htmlFor="productName">Nome</label>
                            <input type="text" className="form-control" id="productName" name="nome" value={produto.nome} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="productPrice">Preço</label>
                            <input type="text" className="form-control" id="productPrice" name="preco" value={produto.preco} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="productImage">Imagem do Produto</label>
                            <input type="file" className="form-control-file" id="productImage" accept="image/*" onChange={handleImageChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="productType">Tipo</label>
                            <select id="productType" className="form-control" name="tipo" value={tipo} onChange={(e) => { handleChange(e); setTipo(e.target.value); }} required>
                                <option value="">Selecione...</option>
                                <option value="CHURRASCO">Churrasco</option>
                                <option value="BEBIDA">Bebida</option>
                                <option value="COZINHA">Cozinha</option>
                            </select>
                        </div>
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="productAvailable" checked={produto.disponivel} onChange={handleCheckboxChange} />
                            <label className="form-check-label" htmlFor="productAvailable">Disponível</label>
                        </div>
                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-primary custom-button">Cadastrar</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal de Confirmação */}
            <Modal show={showConfirmation} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Cadastro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tem certeza de que deseja cadastrar o produto com as seguintes informações?</p>
                    <p><strong>Nome:</strong> {produto.nome}</p>
                    <p><strong>Preço:</strong> {produto.preco}</p>
                    <p><strong>Tipo:</strong> {tipo}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={confirmSubmit}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Sucesso */}
            <Modal show={showSuccess} onHide={handleSuccessClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sucesso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Produto cadastrado com sucesso!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSuccessClose}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Gerente;
