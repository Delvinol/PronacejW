import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowProcesses = () => {
    const findAllUrl = 'http://181.176.172.117:8081/pronacej/v1/process/findAllProcess';
    const registerUrl = 'http://181.176.172.117:8081/pronacej/v1/process/register';

    const [processes, setProcesses] = useState([]);
    const [newProcess, setNewProcess] = useState({
        amount: 0,
        message: '',
        status: 'Archivo Procesado Exitosamente'
    });
    const [showAlert, setShowAlert] = useState(false); // Estado para controlar la visibilidad del alert

    useEffect(() => {
        getProcesses();
    }, []);

    const getProcesses = async () => {
        try {
            const response = await axios.get(findAllUrl);
            setProcesses(response.data);
        } catch (error) {
            console.error('Error fetching processes:', error);
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewProcess({ ...newProcess, [name]: value });
    };

    const addProcess = async () => {
        try {
            await axios.post(registerUrl, {
                typeProcessHeaderId: 2,
                ...newProcess,
                start_time: Date.now(),
                end_time: Date.now(),
                state: 1
            });
            // Refrescar la lista de procesos después de agregar uno nuevo
            getProcesses();
            // Limpiar el formulario
            setNewProcess({
                amount: 0,
                message: '',
                status: 'Archivo Procesado Exitosamente'
            });
            // Mostrar el alert
            setShowAlert(true);
            // Ocultar el alert después de 3 segundos
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } catch (error) {
            console.error('Error adding process:', error);
        }
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            {/* Botón para abrir el formulario o modal */}
                            <button className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalAddProcess'>
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
                                    <tr>
                                        <th>#</th>
                                        <th>Filas</th>
                                        <th>Mensaje</th>
                                        <th>Estado</th>
                                        <th>Hora de Inicio</th>
                                        <th>Hora de Fin</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {processes.map((process, index) => (
                                        <tr key={process.id}>
                                            <td>{index + 1}</td>
                                            <td>{process.amount}</td>
                                            <td>{process.message}</td>
                                            <td>{process.status}</td>
                                            <td>{new Date(process.start_time).toLocaleString()}</td>
                                            <td>{new Date(process.end_time).toLocaleString()}</td>
                                            <td>
                                                <button className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalEditProcess'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button className='btn btn-danger'>
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

            {/* Formulario o modal para agregar un nuevo proceso */}
            <div className='modal fade' id='modalAddProcess' tabIndex='-1' aria-labelledby='modalAddProcessLabel' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='modalAddProcessLabel'>Añadir Proceso</h5>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <div className='mb-3'>
                                <label htmlFor='amount' className='form-label'>Amount</label>
                                <input type='number' className='form-control' id='amount' name='amount' value={newProcess.amount} onChange={handleInputChange} />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='message' className='form-label'>Mensaje</label>
                                <input type='text' className='form-control' id='message' name='message' value={newProcess.message} onChange={handleInputChange} />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='status' className='form-label'>Estado</label>
                                <input type='text' className='form-control' id='status' name='status' value={newProcess.status} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                            <button type='button' className='btn btn-primary' onClick={addProcess}>Añadir</button>
                        </div>
                    </div>
                </div>
            </div>
            {showAlert && (
                <div className='alert alert-success alert-dismissible fade show' role='alert'>
                    Proceso añadido correctamente.
                    <button type='button' className='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
                </div>
            )}
        </div>
    );
}

export default ShowProcesses;
