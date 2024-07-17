import React from 'react';
import SidebarMenuGerente from './SidebarMenuGerente'; // Importe o componente SidebarMenuGerente
import './css/Cozinha.css'; // Reutilize o CSS do componente Cozinha

const Bar = () => {
    // Simulação de dados de bebidas
    const bebidas = Array.from({ length: 80 }, (_, i) => ({
        id: i + 1,
        nome: `Bebida ${i + 1}`,
        tipo: 'BAR',
    }));

    return (
        <div className="cozinha-container"> {/* Mantém o mesmo estilo */}
            <div className="row no-gutters">
                <div className="col-md-2 col-lg-2">
                    <SidebarMenuGerente />
                </div>
                <div className="col-md-10 col-lg-10">
                    <div className="content">
                        <h1 className="mb-4">Bebidas Disponíveis</h1>
                        <div className="produtos-container">
                            {bebidas.map((bebida) => (
                                <div key={bebida.id} className="produto-item">
                                    {bebida.nome}
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

export default Bar;
