import React from 'react';
import { AppBar, Toolbar, Container, Box, Button } from '@mui/material';
import { Favorite, Add, Logout } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

interface LayoutProps {
  children: React.ReactNode;
  role: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img 
              src="https://www.auta.com.ar/static/media/logo-auta.1ad353ae5985c99b7417.png" 
              alt="AUTA Logo" 
              style={{ height: '40px' }} 
            />
          </Link>
          <Box sx={{ flexGrow: 1 }} /> { }
          <Box>
            <Button 
              component={Link} 
              to="/favoritos" 
              startIcon={<Favorite />} 
              color="inherit"
              sx={{ marginLeft: 2 }}
            >
              Favoritos
            </Button>
            {role === 'admin' && (
              <Button 
                component={Link} 
                to="/agregar-vehiculo" 
                startIcon={<Add />} 
                color="inherit"
                sx={{ marginLeft: 2 }}
              >
                Agregar Vehículo
              </Button>
            )}
            <Button 
              startIcon={<Logout />} 
              color="inherit"
              onClick={handleLogout}
              sx={{ marginLeft: 2 }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container>
        {children}
      </Container>
    </>
  );
};

export default Layout;
