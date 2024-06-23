import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import toyShop_Logo_png from '../assets/logopronacej.png';  // Ajusta la ruta a tu logo
import { pathPROD } from '../utils/config';


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (email.trim() === '' || password.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Todos los campos son obligatorios'
            });
            return;
        }

        const loginUrl = 'http://181.176.172.117:8081/api/v1/auth/authenticate';
        const payload = { email: email.trim(), password: password.trim() };

        try {
            const response = await axios.post(loginUrl, payload);
            const { token, typeUserId } = response.data;

            if (typeUserId !== 1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: 'No tienes permisos para acceder a esta aplicación'
                });
                return;
            }

            // Guardar el token en el almacenamiento local
            localStorage.setItem('authToken', token);

            // Redirigir a la página de productos
            navigate(`${pathPROD}/products`);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error en el inicio de sesión. Verifique sus credenciales'
            });
            console.log(error);
        }
    };

    return (
        <div className="row">
            <div className="offset-md-4 col-md-4 offset-md-4 mt-5 mb-5 pb-5">
                <div className="card">
                    <div className="card-header pt-5 pb-5">
                        <div className="rounded block ml-auto mr-auto center">
                            <img
                                src={toyShop_Logo_png}
                                style={{ maxHeight: "50%", maxWidth: "50%", marginLeft: "25%" }}
                                className="mb-3 rounded center"
                                alt="Toy Shop Logo"
                            />
                        </div>
                        <h1 className="text-primary text-center">Login de Administrador</h1>
                        <br />
                        <br />
                        <div className="offset-1 col-10 offset-1 form-group">
                            <input
                                className="form-control"
                                placeholder="Por favor, introduzca su correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                            />
                        </div>
                        <div className="offset-1 col-10 offset-1 form-group mt-2">
                            <input
                                className="form-control"
                                placeholder="Por favor, introduzca su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                            />
                        </div>
                        <div className="d-flex justify-content-center form-group mt-5">
                            <div className="btn btn-primary" onClick={handleLogin}>
                                <h4>Iniciar Sesión</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
};

export default Login;
