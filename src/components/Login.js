import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import toyShop_Logo_png from '../assets/logopronacej.png';
import toyShop_Logo_pn from '../assets/logosimbolo.png';

import { pathPROD } from '../utils/config';
import './css/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [entity, setEntity] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
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

            localStorage.setItem('authToken', token);
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

    const handleRegister = async (e) => {
        e.preventDefault();
        if (name.trim() === '' || lastName.trim() === '' || email.trim() === '' || entity.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Todos los campos son obligatorios'
            });
            return;
        }
        const registerUrl = 'http://181.176.172.117:8081/api/v1/auth/register';
        const payload = {
            typeUserId: 1,
            name: name.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            entity: entity.trim()
        };

        try {
            const response = await axios.post(registerUrl, payload);
            Swal.fire({
                icon: 'success',
                title: 'Registro Exitoso',
                text: 'Usuario registrado correctamente'
            });
            setIsLogin(true);  // Cambiar a la pestaña de inicio de sesión después de registrar
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error en el registro. Intente nuevamente'
            });
            console.log(error);
        }
    };

    return (
        <section>
            <div className="wrapper">
                <div className="logo">
                    <img src={toyShop_Logo_png} alt="Toy Shop Logo" />
                </div>
                <div className="text-center mt-4 name">
                    {isLogin ? 'Login de Administrador' : 'Registrar Usuario'}
                </div>
                {isLogin ? (
                    <form className="p-3 mt-3" onSubmit={handleLogin}>
                        <div className="form-field d-flex align-items-center">
                            <span className="far fa-user"></span>
                            <input
                                type="email"
                                name="userName"
                                id="userName"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-field d-flex align-items-center">
                            <span className="fas fa-key"></span>
                            <input
                                type="password"
                                name="password"
                                id="pwd"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="btn mt-3" type="submit">Iniciar Sesión</button>
                    </form>
                ) : (
                    <form className="p-3 mt-1" onSubmit={handleRegister}>
                        <div className="form-field d-flex align-items-center">
                            <span className="fas fa-user"></span>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-field d-flex align-items-center">
                            <span className="fas fa-user"></span>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder="Apellido"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="form-field d-flex align-items-center">
                            <span className="far fa-envelope"></span>
                            <input
                                type="email"
                                name="email"
                                id="registerEmail"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-field d-flex align-items-center">
                            <span className="fas fa-building"></span>
                            <input
                                type="text"
                                name="entity"
                                id="entity"
                                placeholder="Entidad"
                                value={entity}
                                onChange={(e) => setEntity(e.target.value)}
                            />
                        </div>
                        <button className="btn mt-1" type="submit">Registrar</button>
                    </form>
                )}
                <div className="text-center mt-1">
                    <button className="btn btn-link" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia Sesión'}
                    </button>
                </div>
            </div>
            <div className='wave wave1'></div>
            <div className='wave wave2'></div>
            <div className='wave wave3'></div>
            <div className='wave wave4'></div>
        </section>
    );
};

export default Login;
