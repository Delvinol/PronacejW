import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowProducts = () => {
    const findAllUrl = 'http://181.176.172.117:8081/api/v1/auth/findAllUser';
    const registerUrl = 'http://181.176.172.117:8081/api/v1/auth/register';
    const editUrl = 'http://181.176.172.117:8081/api/v1/auth/edit/';
    const deleteUrl = 'http://181.176.172.117:8081/api/v1/auth/delete/';
    const approveUrl = 'http://181.176.172.117:8081/api/v1/auth/approve?userId=';

    const [users, setUsers] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dni, setDni] = useState('');

    const [password, setPassword] = useState('');
    const [entity, setEntity] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [state, setState] = useState('');

    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);
    const tableRef = useRef(null);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get(findAllUrl);
            const sortedUsers = response.data.sort((a, b) => a.id - b.id); // Ordenar usuarios por ID
            setUsers(sortedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const openModal = (op, id = '', name = '', lastName = '', email = '', dni = '', entity = '') => {
        setId(id);
        setName(name);
        setLastName(lastName);
        setEmail(email);
        setDni(dni);

        setEntity(entity);

        setPassword('');
        setOperation(op);

        if (op === 1) {
            setTitle('Registrar Usuario');
        } else if (op === 2) {
            setTitle('Editar Usuario');
        }

        setTimeout(() => {
            document.getElementById('nombre').focus();
        }, 500);
    }

    const handleScroll = () => {
        if (tableRef.current) {
            setScrollPosition(tableRef.current.scrollTop);
        }
    }

    const restoreScrollPosition = () => {
        if (tableRef.current) {
            tableRef.current.scrollTop = scrollPosition;
        }
    }

    const validar = async () => {
        handleScroll();

        if (name.trim() === '') {
            show_alerta('Escribe el nombre del usuario', 'warning');
        } else if (lastName.trim() === '') {
            show_alerta('Escribe el apellido del usuario', 'warning');
        } else if (email.trim() === '') {
            show_alerta('Escribe el email del usuario', 'warning');
        } else if (dni.trim() === '') {
            show_alerta('Escribe el DNI del usuario', 'warning');
        } else if (entity.trim() === '') {
            show_alerta('Escribe la entidad del usuario', 'warning');
        } else {
            let parametros;
            if (operation === 1) {
                parametros = {
                    typeUserId: 1,
                    name: name.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    dni: dni.trim(),

                    entity: entity.trim()
                };
                await enviarSolicitud('POST', parametros, registerUrl);
            } else {
                parametros = {
                    name: name.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    dni: dni.trim(),

                    entity: entity.trim()
                };
                if (password.trim() !== '') {
                    parametros.password = password.trim();
                }
                await enviarSolicitud('PUT', parametros, editUrl + id);
            }

            restoreScrollPosition();
        }
        getUsers();
    }

    const enviarSolicitud = async (metodo, parametros, endpointUrl) => {
        try {
            const response = await axios({
                method: metodo,
                url: endpointUrl,
                data: parametros
            });
            const tipo = response.data[0];
            const msj = response.data[1];
            show_alerta(msj, tipo);
            if (tipo === 'success') {
                document.getElementById('btnCerrar').click();
                getUsers();
            }
        } catch (error) {
            show_alerta('Error en la solicitud', 'error');
            console.error('Error:', error);
        }
    }

    const deleteUser = async (id, name) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el usuario ' + name + ' ?',
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(deleteUrl + id);
                    show_alerta('Usuario eliminado correctamente', 'success');
                    getUsers();
                } catch (error) {
                    show_alerta('Error al eliminar el usuario', 'error');
                    console.error('Error:', error);
                }
            } else {
                show_alerta('El usuario NO fue eliminado', 'info');
            }
        });
    }

    const habilitarUsuario = async (userId) => {
        try {
            const response = await axios.post(approveUrl + userId);
            show_alerta('Usuario habilitado correctamente', 'success');
            getUsers();
        } catch (error) {
            show_alerta('Error al habilitar el usuario', 'error');
            console.error('Error:', error);
        }
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr><th>#</th><th>NOMBRE</th><th>APELLIDO</th><th>EMAIL</th><th>DNI</th><th>ENTIDAD</th><th>HABILITADO</th><th>ACCIONES</th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {users.map((user, i) => (
                                        <tr key={user.id}>
                                            <td>{(i + 1)}</td>
                                            <td>{user.name}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.dni}</td>

                                            <td>{user.entity}</td>
                                            <td>
                                                {user.state === 1 ? 'Sí' : (
                                                    <button onClick={() => habilitarUsuario(user.id)} className='btn btn-success'>
                                                        Habilitar
                                                    </button>
                                                )}
                                            </td>
                                            <td>
                                                <button onClick={() => openModal(2, user.id, user.name, user.lastName, user.email,user.dni, user.entity)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteUser(user.id, user.name)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalUsers' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='apellido' className='form-control' placeholder='Apellido' value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                                <input type='text' id='email' className='form-control' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                                <input type='text' id='dni' className='form-control' placeholder='DNI' value={dni} onChange={(e) => setDni(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                                <input type='text' id='entity' className='form-control' placeholder='Entidad' value={entity} onChange={(e) => setEntity(e.target.value)}></input>
                            </div>
                            {operation === 2 && (
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'><i className='fa-solid fa-lock'></i></span>
                                    <input type='password' id='password' className='form-control' placeholder='Solo si se quiere cambiar' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                                </div>
                            )}
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowProducts;
