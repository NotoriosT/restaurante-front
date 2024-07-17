import React from 'react';
import SidebarMenuGerente from './SidebarMenuGerente'; // Importe o componente SidebarMenuGerente
import './css/Cozinha.css'; // Reutilize o CSS do componente Cozinha

const Churrasco = () => {
    // Simulação de dados de produtos de churrasco
    const churrascos = Array.from({ length: 60 }, (_, i) => ({
        id: i + 1,
        nome: `Churrasco ${i + 1}`,
        tipo: 'CHURRASCO',
    }));

    return (
        <div className="cozinha-container"> {/* Mantém o mesmo estilo */}
            <div className="row no-gutters">
                <div className="col-md-2 col-lg-2">
                    <SidebarMenuGerente />
                </div>
                <div className="col-md-10 col-lg-10">
                    <div className="content">
                        <h1 className="mb-4">Produtos de Churrasco</h1>
                        <div className="produtos-container">
                            {churrascos.map((churrasco) => (
                                <div key={churrasco.id} className="produto-item">
                                    {churrasco.nome}
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

export default Churrasco;
