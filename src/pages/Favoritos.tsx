import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';
import TarjetaVehiculo from '../components/TarjetaVehiculo';

interface FavoritosProps {
  role: string | null;
}

const Favoritos: React.FC<FavoritosProps> = ({ role }) => {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const uniqueFavorites = storedFavorites.reduce((acc: any[], current: any) => {
      if (!acc.some(vehicle => vehicle.id === current.id)) {
        acc.push(current);
      }
      return acc;
    }, []);
    setFavoritos(uniqueFavorites);
    localStorage.setItem('favorites', JSON.stringify(uniqueFavorites)); // Actualiza el almacenamiento local para mantener solo elementos únicos
  }, []);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div>
      {/* Botón para volver a la Home */}
      <Box sx={{ mt: 2, mb: 3 }}>
        <Button 
          variant="outlined" 
          startIcon={<ChevronLeftIcon />} 
          onClick={handleBackToHome}
        >
          Volver
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Mis Favoritos
      </Typography>
      
      <Grid container spacing={4}>
        {favoritos.map((vehicle, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <TarjetaVehiculo vehicle={vehicle} onDelete={() => {}} role={role} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Favoritos;
