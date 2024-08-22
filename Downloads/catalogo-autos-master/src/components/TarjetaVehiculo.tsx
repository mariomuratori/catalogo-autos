import * as React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useSnackbar } from 'notistack';

interface TarjetaVehiculoProps {
  vehicle: any;
  onDelete: () => void;
  role: string | null;
}

const TarjetaVehiculo: React.FC<TarjetaVehiculoProps> = ({ vehicle, onDelete, role }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'vehicles', vehicle.id));
      enqueueSnackbar('Vehículo eliminado correctamente.', { variant: 'success' });
      onDelete();
    } catch (error) {
      console.error("Error eliminando el vehículo:", error);
      enqueueSnackbar('Error al eliminar el vehículo.', { variant: 'error' });
    } finally {
      setOpenDialog(false);
    }
  };

  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.find((fav: any) => fav.id === vehicle.id)) {
      favorites.push(vehicle);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      enqueueSnackbar('Vehículo agregado a favoritos.', { variant: 'success' });
    } else {
      enqueueSnackbar('Este vehículo ya está en tus favoritos.', { variant: 'info' });
    }
  };

  return (
    <>
      <Card>
        <CardMedia
          component="img"
          height="140"
          image={vehicle.imagenes && vehicle.imagenes.length > 0 ? vehicle.imagenes[0] : "https://via.placeholder.com/300"}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          style={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {vehicle.marca} {vehicle.modelo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Año: {vehicle.año} | Precio: ${vehicle.precio}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" color="primary" component={Link} to={`/vehiculo/${vehicle.id}`}>
            Ver más
          </Button>
          <IconButton color="secondary" onClick={handleAddToFavorites}>
            <FavoriteIcon />
          </IconButton>
          {role === 'admin' && (
            <IconButton color="primary" component={Link} to={`/editar-vehiculo/${vehicle.id}`}>
              <EditIcon />
            </IconButton>
          )}
          {role === 'admin' && (
            <IconButton color="error" onClick={() => setOpenDialog(true)}>
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TarjetaVehiculo;
