import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { TextField, Button, CircularProgress, Box } from '@mui/material';
import { useSnackbar } from 'notistack';

const EditarVehiculo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchVehicle = async () => {
      const docRef = doc(db, 'vehicles', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVehicle(docSnap.data());
      } else {
        enqueueSnackbar('Vehículo no encontrado.', { variant: 'error' });
        navigate('/');
      }
    };
    fetchVehicle();
  }, [id, navigate, enqueueSnackbar]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'vehicles', id as string), vehicle);
      enqueueSnackbar('Vehículo actualizado correctamente.', { variant: 'success' });
      navigate('/');
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
      enqueueSnackbar('Error al actualizar el vehículo. Inténtalo de nuevo.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={handleUpdate} sx={{ mt: 3 }}>
      <TextField
        label="Marca"
        value={vehicle.marca}
        onChange={(e) => setVehicle({ ...vehicle, marca: e.target.value })}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Modelo"
        value={vehicle.modelo}
        onChange={(e) => setVehicle({ ...vehicle, modelo: e.target.value })}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Año"
        value={vehicle.año}
        onChange={(e) => setVehicle({ ...vehicle, año: e.target.value })}
        type="number"
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Precio"
        value={vehicle.precio}
        onChange={(e) => setVehicle({ ...vehicle, precio: e.target.value })}
        type="number"
        required
        fullWidth
        margin="normal"
      />
      {}
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Actualizar Vehículo'}
      </Button>
    </Box>
  );
};

export default EditarVehiculo;
