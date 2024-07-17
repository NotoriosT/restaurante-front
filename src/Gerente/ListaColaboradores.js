import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Importa a instância configurada do axios
import SidebarMenuGerente from './SidebarMenuGerente';
import { Modal, Button, Form } from 'react-bootstrap';
import './css/ListaColaboradores.css';

const ListaColaboradores = () => {
    const [colaboradores, setColaboradores] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedColaborador, setSelectedColaborador] = useState({
        id: '',
        login: '',
        senha: ''
    });

    useEffect(() => {
        const fetchColaboradores = async () => {
            try {
                const response = await axios.get('/api/colaboradores');
                setColaboradores(response.data);
            } catch (error) {
                console.error('Erro ao buscar colaboradores:', error);
            }
        };

        fetchColaboradores();
    }, []);

    const handleEditClick = (colaborador) => {
        setSelectedColaborador(colaborador);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`/api/colaboradores/${selectedColaborador.id}`, selectedColaborador);
            console.log('Colaborador atualizado:', response.data);
            setShowEditModal(false);
            // Atualizar a lista de colaboradores
            const updatedColaboradores = colaboradores.map((colaborador) =>
                colaborador.id === selectedColaborador.id ? response.data : colaborador
            );
            setColaboradores(updatedColaboradores);
        } catch (error) {
            console.error('Erro ao atualizar colaborador:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedColaborador({ ...selectedColaborador, [name]: value });
    };

    return (
        <div className="d-flex">
            <SidebarMenuGerente />
            <div className="content-container">
                <h1 className="mb-4 text-center">Lista de Colaboradores</h1>
                <div className="table-responsive d-flex justify-content-center">
                    <table className="table table-striped w-75">
                        <thead>
                        <tr>
                            <th>Login</th>
                            <th>Tipo</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {colaboradores.map(colaborador => (
                            <tr key={colaborador.id}>
                                <td>{colaborador.login}</td>
                                <td>{colaborador.tipoFuncionario}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEditClick(colaborador)}>
                                        Editar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Edição */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Colaborador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formLogin">
                            <Form.Label>Login</Form.Label>
                            <Form.Control
                                type="text"
                                name="login"
                                value={selectedColaborador.login}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formSenha">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                name="senha"
                                value={selectedColaborador.senha}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListaColaboradores;
