import React from 'react';
import { Navigate } from 'react-router-dom';
import { pathPROD } from '../utils/config';


const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? children : <Navigate to={pathPROD} />;
};

export default PrivateRoute;
