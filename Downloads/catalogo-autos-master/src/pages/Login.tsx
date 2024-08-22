import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const auth = getAuth();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Verifica tus credenciales.');
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'rgba(0, 0, 0, .8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#fff',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar Sesión
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
              <TextField
                {...register('email')}
                label="Correo electrónico"
                fullWidth
                margin="normal"
                required
                InputProps={{
                  style: { color: '#fff' },
                }}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
              />
              <TextField
                {...register('password')}
                label="Contraseña"
                type="password"
                fullWidth
                margin="normal"
                required
                InputProps={{
                  style: { color: '#fff' },
                }}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Recordar usuario"
                sx={{ color: '#fff' }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar Sesión
              </Button>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ color: '#fff', mt: 5 }}>
            {'Copyright © Mario Muratori - Catálogo de Vehículos '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
