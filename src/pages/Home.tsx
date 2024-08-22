import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Grid, Typography, Card, CardContent, Skeleton, IconButton, Popover, TextField, Button, Box } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import TarjetaVehiculo from '../components/TarjetaVehiculo';

interface HomeProps {
  role: string | null;
}

const Home: React.FC<HomeProps> = ({ role }) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [yearRange, setYearRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });

  const fetchVehicles = async () => {
    const querySnapshot = await getDocs(collection(db, "vehicles"));
    const vehicleData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setVehicles(vehicleData);
    setFilteredVehicles(vehicleData);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleFilter = () => {
    let filtered = vehicles;

    if (yearRange.min || yearRange.max) {
      filtered = filtered.filter(vehicle => {
        const year = parseInt(vehicle.año);
        const minYear = yearRange.min ? parseInt(yearRange.min) : -Infinity;
        const maxYear = yearRange.max ? parseInt(yearRange.max) : Infinity;
        return year >= minYear && year <= maxYear;
      });
    }

    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(vehicle => {
        const price = parseInt(vehicle.precio.replace(/\./g, ''));
        const minPrice = priceRange.min ? parseInt(priceRange.min.replace(/\./g, '')) : -Infinity;
        const maxPrice = priceRange.max ? parseInt(priceRange.max.replace(/\./g, '')) : Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }

    setFilteredVehicles(filtered);
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Catálogo de Vehículos
      </Typography>

      <Box sx={{ mb: 2 }}>
        <IconButton onClick={handleClick}>
          <FilterListIcon />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>Filtrar Vehículos</Typography>
            <TextField
              label="Año Mínimo"
              value={yearRange.min}
              onChange={(e) => setYearRange({ ...yearRange, min: e.target.value })}
              fullWidth
              type="number"
              margin="normal"
            />
            <TextField
              label="Año Máximo"
              value={yearRange.max}
              onChange={(e) => setYearRange({ ...yearRange, max: e.target.value })}
              fullWidth
              type="number"
              margin="normal"
            />
            <TextField
              label="Precio Mínimo"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Precio Máximo"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleFilter} fullWidth>
              Aplicar Filtros
            </Button>
          </div>
        </Popover>
      </Box>

      <Grid container spacing={4}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Typography variant="h5" component="div">
                      <Skeleton width="60%" />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Skeleton width="80%" />
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Skeleton variant="rectangular" height={36} width="100%" />
                    <Skeleton variant="rectangular" height={36} width="100%" style={{ marginTop: 8 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : filteredVehicles.map(vehicle => (
              <Grid item key={vehicle.id} xs={12} sm={6} md={4}>
                <TarjetaVehiculo vehicle={vehicle} onDelete={fetchVehicles} role={role} />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

export default Home;
