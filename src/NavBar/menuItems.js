// menuItems.js
export const menuItems = {
    gerente: [
        { text: 'Cozinha', path: '/cozinha', icon: 'info' },
        { text: 'Bar', path: '/bar', icon: 'info' },
        { text: 'Churrasco', path: '/churrasco', icon: 'info' },
        { text: 'Produtos', path: '/lista-produtos', icon: 'home' },
        { text: 'Cadastrar Colaborador', path: '/cadastrar-colaborador', icon: 'info' },
        { text: 'Lista de Colaboradores', path: '/lista-colaboradores', icon: 'info' },
    ],
    garcom: [
        { text: 'Mesas', icon: 'tables', action: 'toggleCadastrarMesa' },
        { text: 'Pedidos', path: '/pedidos', icon: 'orders' },

    ],
    cozinha: [
        { text: 'Pedidos', path: '/pedidos', icon: 'orders' },
        { text: 'Ingredientes', path: '/ingredientes', icon: 'ingredients' },

    ],
};
