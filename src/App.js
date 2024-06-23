// App.js
import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import ShowProducts from './components/ShowProducts';
import Login from './components/Login';
import ShowIndicators from './components/ShowIndicators';
import ShowProcesses from './components/ShowProcesses'; // Importa el nuevo componente
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import { pathPROD } from './utils/config';

function App() {

  const PrivateRoute = ({ children }) => {
    const authToken = localStorage.getItem('authToken');
    return authToken ? children : <Navigate to={pathPROD} />;
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path={pathPROD} element={<Login />} />
        <Route
          path={pathPROD + '/products'} 
          element={
            <PrivateRoute>
              <div>
                <Navbar />
                <ShowProducts />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path={pathPROD + '/indicators'}
          element={
            <PrivateRoute>
              <div>
                <Navbar />
                <ShowIndicators />
              </div>
            </PrivateRoute>
          }
        />
        <Route // Agrega una ruta para ShowProcesses
          path={pathPROD + '/processes'}
          element={
            <PrivateRoute>
              <div>
                <Navbar />
                <ShowProcesses />
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
