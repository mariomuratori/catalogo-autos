import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { TextField, Button, CircularProgress, Box, Typography, InputAdornment } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSnackbar } from 'notistack';

const EditarVehiculo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploads, setImageUploads] = useState<File[]>([]);
  const [pdfUpload, setPdfUpload] = useState<File | null>(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const storage = getStorage();

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
      // Subir nuevas imágenes si se seleccionaron
      const imageUrls = await Promise.all(
        imageUploads.map(async (image) => {
          const storageRef = ref(storage, `vehicles/${image.name}`);
          const uploadTask = uploadBytesResumable(storageRef, image);
          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              null,
              (error) => reject(error),
              () => resolve(getDownloadURL(uploadTask.snapshot.ref))
            );
          });
          return await getDownloadURL(uploadTask.snapshot.ref);
        })
      );

      // Subir nuevo PDF si se seleccionó
      if (pdfUpload) {
        const pdfRef = ref(storage, `pdfs/${pdfUpload.name}`);
        const pdfUploadTask = uploadBytesResumable(pdfRef, pdfUpload);
        await new Promise((resolve, reject) => {
          pdfUploadTask.on(
            'state_changed',
            null,
            (error) => reject(error),
            () => resolve(getDownloadURL(pdfUploadTask.snapshot.ref))
          );
        });
        vehicle.fichaTecnica = await getDownloadURL(pdfUploadTask.snapshot.ref);
      }

      if (imageUrls.length > 0) {
        vehicle.imagenes = imageUrls;
      }

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setVehicle({ ...vehicle, precio: formattedValue });
  };

  if (!vehicle) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={handleUpdate} sx={{ mt: 3, maxWidth: 500, mx: 'auto', pb: 3 }}>
      <Typography variant="h4" gutterBottom>Editar Vehículo</Typography>
      <TextField
        label="Marca"
        value={vehicle.marca}
        onChange={(e) => setVehicle({ ...vehicle, marca: e.target.value })}
        required
        fullWidth
        margin="dense"
        size="small"
      />
      <TextField
        label="Modelo"
        value={vehicle.modelo}
        onChange={(e) => setVehicle({ ...vehicle, modelo: e.target.value })}
        required
        fullWidth
        margin="dense"
        size="small"
      />
      <TextField
        label="Año"
        value={vehicle.año}
        onChange={(e) => setVehicle({ ...vehicle, año: e.target.value })}
        type="number"
        required
        fullWidth
        margin="dense"
        size="small"
      />
      <TextField
        label="Precio"
        value={vehicle.precio}
        onChange={handlePriceChange}
        type="text"
        required
        fullWidth
        margin="dense"
        size="small"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
      <TextField
        label="Detalles del Vehículo"
        value={vehicle.detalles}
        onChange={(e) => setVehicle({ ...vehicle, detalles: e.target.value })}
        required
        fullWidth
        multiline
        rows={3}
        margin="dense"
        size="small"
      />

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          component="label"
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{ mb: 2, maxWidth: 300 }}
        >
          Subir fotos
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => setImageUploads(e.target.files ? Array.from(e.target.files) : [])}
          />
        </Button>

        <Button
          component="label"
          variant="contained"
          color="secondary"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{ mb: 2, maxWidth: 300 }}
        >
          Subir ficha técnica (PDF)
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => setPdfUpload(e.target.files ? e.target.files[0] : null)}
          />
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 3 }}>
          {loading ? <CircularProgress size={24} /> : 'Actualizar Vehículo'}
        </Button>
      </Box>
    </Box>
  );
};

export default EditarVehiculo;
