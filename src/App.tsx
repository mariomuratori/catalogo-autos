import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Home from './pages/Home';
import DetallesVehiculo from './pages/DetallesVehiculo';
import Favoritos from './pages/Favoritos';
import AgregarVehiculo from './pages/AgregarVehiculo';
import EditarVehiculo from './pages/EditarVehiculo'; // Importa el componente EditarVehiculo
import Layout from './components/Layout';
import { SnackbarProvider } from 'notistack';
import Login from './pages/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data()?.role || 'cliente');
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={user ? <Layout role={role}><Home role={role} /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/vehiculo/:id" 
            element={user ? <Layout role={role}><DetallesVehiculo role={role} /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/favoritos" 
            element={user ? <Layout role={role}><Favoritos role={role} /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/agregar-vehiculo" 
            element={user ? <Layout role={role}><AgregarVehiculo /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/editar-vehiculo/:id" 
            element={user && role === 'equipo' ? <Layout role={role}><EditarVehiculo /></Layout> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
