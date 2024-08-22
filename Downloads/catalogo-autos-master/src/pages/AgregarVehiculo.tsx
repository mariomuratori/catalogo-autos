import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { TextField, Button, CircularProgress, Typography, Box, InputAdornment } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const AgregarVehiculo: React.FC = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [imageUploads, setImageUploads] = useState<File[]>([]);
  const [pdfUpload, setPdfUpload] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const storage = getStorage();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
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

      data.imagenes = imageUrls;

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
        data.fichaTecnica = await getDownloadURL(pdfUploadTask.snapshot.ref);
      }

      data.precio = parseFloat(data.precio.replace(/\./g, ''));

      await addDoc(collection(db, "vehicles"), data);
      enqueueSnackbar('Vehículo agregado correctamente.', { variant: 'success' });
      reset();
      navigate('/');
    } catch (error) {
      console.error("Error en el proceso de agregar vehículo:", error);
      enqueueSnackbar('Error al agregar el vehículo. Inténtalo de nuevo.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setValue('precio', formattedValue);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, maxWidth: 500, mx: 'auto', pb: 3 }}>
      <Typography variant="h4" gutterBottom>Agregar Vehículo</Typography>
      <TextField 
        {...register('marca')} 
        label="Marca" 
        required 
        fullWidth 
        margin="dense" 
        size="small" 
      />
      <TextField 
        {...register('modelo')} 
        label="Modelo" 
        required 
        fullWidth 
        margin="dense" 
        size="small" 
      />
      <TextField 
        {...register('año')} 
        label="Año" 
        type="number" 
        required 
        fullWidth 
        margin="dense" 
        size="small" 
      />
      <TextField
        {...register('precio')}
        label="Precio"
        required
        fullWidth
        margin="dense"
        size="small"
        onChange={handlePriceChange}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
      <TextField 
        {...register('detalles')} 
        label="Detalles del Vehículo" 
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
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
        Archivos permitidos: PDF
      </Typography>

      <Box sx={{ textAlign: 'center' }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 3 }}>
          {loading ? <CircularProgress size={24} /> : "Agregar Vehículo"}
        </Button>
      </Box>
    </Box>
  );
};

export default AgregarVehiculo;
