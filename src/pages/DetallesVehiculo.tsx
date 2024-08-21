import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  Container, Typography, Grid, Button, Card, CardMedia, CardContent, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, CircularProgress, TextField, MenuItem, Box, Tooltip, IconButton
} from '@mui/material';
import mercadoPagoLogo from '../assets/images/mercado-pago.svg'; // Importar el SVG de Mercado Pago
import cardLogo from '../assets/images/card.svg'; // Importar el SVG de tarjeta de crédito
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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

  if (!vehicle) return <div>Cargando...</div>;

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={vehicle.imagenes && vehicle.imagenes.length > 0 ? vehicle.imagenes[0] : "https://via.placeholder.com/300"}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {vehicle.marca} {vehicle.modelo}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Año: {vehicle.año}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              Precio: ${vehicle.precio}
            </Typography>
            <Typography variant="body1" paragraph>
              {vehicle.detalles}
            </Typography>
            {vehicle.fichaTecnica && (
              <Button
                variant="outlined"
                color="secondary"
                href={vehicle.fichaTecnica}
                target="_blank"
                sx={{ mt: 2 }}
              >
                Ver Ficha Técnica
              </Button>
            )}
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ mt: 2 }}
              onClick={handleConsult}
            >
              Consultar Unidad
            </Button>
          </CardContent>
        </Grid>
      </Grid>

      {/* Botón Reservar Unidad más abajo */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => setOpenDialog(true)}
        >
          Reservar Unidad
        </Button>
      </Box>

      {/* Dialogo de la pasarela de pago */}
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
              onClick={undefined} // No hace nada cuando se selecciona Mercado Pago
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

      {/* Dialogo de consulta */}
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
    </Container>
  );
};

export default DetallesVehiculo;
