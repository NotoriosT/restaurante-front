import React from 'react';
import SidebarMenuGerente from './SidebarMenuGerente'; // Importe o componente SidebarMenuGerente
import './css/Cozinha.css'; // Importe o CSS do componente Cozinha

const Cozinha = () => {
    // Simulação de dados de produtos
    const produtos = Array.from({ length: 120 }, (_, i) => ({
        id: i + 1,
        nome: `Produto ${i + 1}`,
        tipo: 'COZINHA',
    }));

    return (
        <div className="cozinha-container">
            <div className="row no-gutters">
                <div className="col-md-2 col-lg-2">
                    <SidebarMenuGerente />
                </div>
                <div className="col-md-10 col-lg-10">
                    <div className="content">
                        <h1 className="mb-4">Produtos da Cozinha</h1>
                        <div className="produtos-container">
                            {produtos.map((produto) => (
                                <div key={produto.id} className="produto-item">
                                    {produto.nome}
                                    <div className="produto-actions">
                                        <button className="btn btn-secondary">Indisponível</button>
                                        <button className="btn btn-danger">Excluir</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cozinha;
