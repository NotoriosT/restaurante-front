// Sidebar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import { Home, Info, TableChart, ShoppingCart, ExitToApp, Menu } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './SidebarMenu.css'; // Importa o CSS personalizado
import { menuItems } from './menuItems'; // Importa a configuração do menu

const drawerWidth = 240;

const Sidebar = ({ open, onClose, userType, actions }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'admin': return <Home />;
            case 'register': return <Info />;
            case 'employees': return <Info />;
            case 'tables': return <TableChart />;
            case 'orders': return <ShoppingCart />;
            case 'ingredients': return <Info />;
            case 'signOut': return <ExitToApp />;
            default: return null;
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const items = menuItems[userType] || [];

    const drawer = (
        <div>
            <Box sx={{ height: theme.mixins.toolbar.minHeight }} /> {/* Espaço para a barra de ferramentas */}
            <List>
                {items.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => item.path ? handleNavigation(item.path) : actions[item.action] && actions[item.action]()}
                        id={`sidebar-item-${item.text.replace(/\s+/g, '-').toLowerCase()}`}
                        className="sidebar-item"
                    >
                        <ListItemIcon>
                            {getIcon(item.icon)}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Box sx={{ flexGrow: 1 }} />
            <List>
                <ListItem button onClick={() => handleNavigation('/logout')} id="sidebar-item-signout" className="sidebar-item">
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {isMobile && (
                <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, backgroundColor: '#1976d2' }} id="appbar">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Responsive Drawer
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                anchor="left"
                open={isMobile ? mobileOpen : true}
                onClose={isMobile ? handleDrawerToggle : onClose}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff', // Cor de fundo branca
                        color: '#000000', // Cor do texto
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra personalizada
                        borderRight: '1px solid #ccc', // Borda direita personalizada
                    },
                }}
                ModalProps={{
                    keepMounted: true, // Melhor para desempenho em telas móveis
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
