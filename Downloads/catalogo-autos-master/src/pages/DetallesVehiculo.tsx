import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Container, Typography, Grid, Button, Card, CardMedia, CardContent, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, CircularProgress, TextField, MenuItem, Box, Tooltip, IconButton, Fab, Divider, Paper
} from '@mui/material';
import mercadoPagoLogo from '../assets/images/mercado-pago.svg';
import cardLogo from '../assets/images/card.svg';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface DetallesVehiculoProps {
  role: string | null;
}

const DetallesVehiculo: React.FC<DetallesVehiculoProps> = ({ role }) => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConsultModal, setOpenConsultModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      const docRef = doc(db, "vehicles", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVehicle(docSnap.data());
      } else {
        console.log("No existe el documento!");
      }
    };
    fetchVehicle();
  }, [id]);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Pago realizado con éxito. Unidad reservada.");
      setOpenDialog(false);
    }, 2000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado al portapapeles");
  };

  const handleConsult = () => {
    setOpenConsultModal(true);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!vehicle) return <CircularProgress />;

  return (
    <Container sx={{ mt: 4, position: 'relative' }}>
      <Box sx={{ mt: 2, mb: 3 }}>
        <Button 
          variant="outlined" 
          startIcon={<ChevronLeftIcon />} 
          onClick={handleBackToHome}
        >
          Volver
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card sx={{ boxShadow: 4 }}>
            <CardMedia
              component="img"
              height="500"
              image={vehicle.imagenes && vehicle.imagenes.length > 0 ? vehicle.imagenes[0] : "https://via.placeholder.com/500"}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              sx={{ borderRadius: 2 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {vehicle.marca} {vehicle.modelo}
            </Typography>
            <Typography variant="h5" color="textSecondary" gutterBottom>
              Año: {vehicle.año}
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              Precio: ${vehicle.precio.toLocaleString()}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" paragraph>
              {vehicle.detalles}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              {vehicle.fichaTecnica && (
                <Button
                  variant="outlined"
                  color="secondary"
                  href={vehicle.fichaTecnica}
                  target="_blank"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Ver Ficha Técnica
                </Button>
              )}
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                sx={{ py: 1.5 }}
                onClick={handleConsult}
              >
                Consultar Unidad
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                fullWidth
                sx={{ py: 1.5 }}
                onClick={() => setOpenDialog(true)}
              >
                Reservar Unidad
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Reserva</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de reservar la unidad {vehicle.marca} {vehicle.modelo}. Por favor, completa la información de pago.
          </DialogContentText>
          <TextField
            select
            label="Método de Pago"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <MenuItem value="credit_card">Tarjeta de Crédito</MenuItem>
            <MenuItem value="bank_transfer">Transferencia Bancaria</MenuItem>
            <MenuItem value="mercadopago">Mercado Pago</MenuItem>
          </TextField>
          {paymentMethod === 'credit_card' && (
            <>
              <TextField
                label="Número de Tarjeta"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Nombre del Titular"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Fecha de Expiración"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="CVV"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<img src={cardLogo} alt="Tarjeta de Crédito" style={{ width: '24px' }} />}
                fullWidth
                onClick={handlePayment}
              >
                Pagar Ahora
              </Button>
            </>
          )}
          {paymentMethod === 'bank_transfer' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">CUIL: 20-12345678-9</Typography>
              <Typography variant="body1">CBU: 1234567890123456789012</Typography>
              <Typography variant="body1">ALIAS: ALIASDEAUTA</Typography>
              <Tooltip title="Copiar CBU">
                <IconButton onClick={() => handleCopy("1234567890123456789012")}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          {paymentMethod === 'mercadopago' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<img src={mercadoPagoLogo} alt="Mercado Pago" style={{ width: '24px' }} />}
              fullWidth
              onClick={undefined}
              sx={{ mt: 2 }}
            >
              Pagar con Mercado Pago
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConsultModal} onClose={() => setOpenConsultModal(false)}>
        <DialogTitle>Consultar Unidad</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Completa el formulario a continuación para consultar sobre esta unidad.
          </DialogContentText>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              label="Nombre y Apellido"
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="Teléfono"
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="Mensaje"
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConsultModal(false)} color="secondary">
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={() => setOpenConsultModal(false)}>
            Consultar Unidad
          </Button>
        </DialogActions>
      </Dialog>

      {role === 'admin' && (
        <Fab
          color="secondary"
          aria-label="edit"
          component={RouterLink}
          to={`/editar-vehiculo/${id}`}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
        >
          <EditIcon />
        </Fab>
      )}
    </Container>
  );
};

export default DetallesVehiculo;
