import { createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    primary: {
      main: '#864bfa', // Mantiene el color principal en #864bfa
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        startIcon: {
          color: '#864bfa', // Cambia el color del icono de los botones a #864bfa
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#864bfa', // Cambia el color de los IconButton a #864bfa
        },
      },
    },
  },
});

export default darkTheme;
