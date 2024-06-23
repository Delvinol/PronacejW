import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowIndicators = () => {
    const findAllUrl = 'http://181.176.172.117:8081/pronacej/v1/indicator/findAllIndicator';
    const deleteUrl = 'http://181.176.172.117:8081/pronacej/v1/indicator/delete/';
    const registerUrl = 'http://181.176.172.117:8081/pronacej/v1/indicator/register';
    const editUrl = 'http://181.176.172.117:8081/pronacej/v1/indicator/edit/';

    const [indicators, setIndicators] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [nameSectionRecord, setNamesectionrecord] = useState('');
    const [sectionRecordId, setSectionRecordId] = useState('');
    const [state, setState] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const tableRef = useRef(null);

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

    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        getIndicators();
    }, []);

    const getIndicators = async () => {
        try {
            const response = await axios.get(findAllUrl);
            const sortedIndicators = response.data.sort((a, b) => a.id - b.id);
            setIndicators(sortedIndicators);
        } catch (error) {
            console.error('Error fetching indicators:', error);
        }
    }

    const deleteIndicator = async (id, name) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: `¿Seguro de eliminar el indicador ${name}?`,
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => { // Añade async aquí para usar await dentro del bloque then
            if (result.isConfirmed) {
                try {
                    await axios.delete(deleteUrl + id);
                    show_alerta('Indicador eliminado correctamente', 'success');
                    // Actualiza la lista de indicadores después de eliminar uno
                    await getIndicators();
                } catch (error) {
                    show_alerta('Error al eliminar el indicador', 'error');
                    console.error('Error:', error);
                }
            } else {
                show_alerta('El indicador NO fue eliminado', 'info');
            }
        });
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
                getIndicators();
            }
        } catch (error) {
            show_alerta('Error en la solicitud', 'error');
            console.error('Error:', error);
        }
    }

    const registrarIndicador = async () => {
        // Buscar el nameSectionRecord en la lista de indicadores
        const existingIndicator = indicators.find(indicator => indicator.nameSectionRecord === nameSectionRecord);
        
        // Determinar el sectionRecordId
        let sectionId;
        if (existingIndicator) {
            // Si ya existe, tomar el sectionRecordId existente
            sectionId = existingIndicator.sectionRecordId;
        } else {
            // Si no existe, crear un nuevo ID (podrías implementar lógica para generar el nuevo ID)
            sectionId = generateNewSectionId(); // Aquí deberías implementar la lógica para generar el nuevo ID
        }
    
        // Construir los parámetros con el sectionRecordId determinado
        const parametros = {
            sectionRecordId: sectionId,
            name: name.trim(),
            state: null
        };
    
        // Enviar la solicitud al servidor
        await enviarSolicitud('POST', parametros, registerUrl);
    }
    
    // Función para generar un nuevo ID para la sección
    const generateNewSectionId = () => {
        // Implementa aquí la lógica para generar un nuevo ID único
        // Por ejemplo, podrías contar cuántos indicadores hay y agregarle 1
        return indicators.length + 1;
    }

    const openModal = (op, id = '', nameSectionRecord = '', sectionRecordId = '', name = '') => {
        setId(id);
        setName(name);
        setNamesectionrecord(nameSectionRecord);
        setSectionRecordId(sectionRecordId);
        setOperation(op);

        if (op === 1) {
            setTitle('Registrar Indicador');
        } else if (op === 2) {
            setTitle('Editar Indicador');
        }

        setTimeout(() => {
            document.getElementById('nombre').focus();
        }, 500);
    }

    const validar = async () => {
        handleScroll();
    
        if (name.trim() === '') {
            show_alerta('Escribe el nombre del indicador', 'warning');
        } else if (nameSectionRecord.trim() === '') {
            show_alerta('Escribe el nombre de la sección', 'warning');
        } else {
            let parametros;
            let existingIndicator = indicators.find(indicator => indicator.nameSectionRecord === nameSectionRecord);
    
            if (operation === 1) {
                if (existingIndicator) {
                    // Si ya existe, tomar el sectionRecordId existente
                    parametros = {
                        name: name.trim(),
                        sectionRecordId: existingIndicator.sectionRecordId,
                    };
                } else {
                    // Si no existe, permitir al usuario ingresar un nuevo nameSectionRecord
                    const newSectionRecordId = generateNewSectionId();
                    parametros = {
                        name: name.trim(),
                        sectionRecordId: newSectionRecordId,
                    };
                }
                await enviarSolicitud('POST', parametros, registerUrl);
            } else {
                if (existingIndicator) {
                    parametros = {
                        sectionRecordId: existingIndicator.sectionRecordId,
                        name: name.trim(),
                    };
                } else {
                    // Si no existe el nameSectionRecord, mostrar un error
                    show_alerta('La sección no existe', 'warning');
                    return;
                }
                await enviarSolicitud('PUT', parametros, editUrl + id);
            }
    
            // Restaurar la posición del scroll después de la actualización
            restoreScrollPosition();
        }
        getIndicators();
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
                    <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>SECCIÓN RECORD ID</th>
                                        <th>NOMBRE</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {indicators.map((indicator, i) => (
                                        <tr key={indicator.id}>
                                            <td>{i + 1}</td>
                                            <td>{indicator.nameSectionRecord}</td>
                                            <td>{indicator.name}</td>
                                        
                                            <td>
                                                <button onClick={() => openModal(2, indicator.id, indicator.nameSectionRecord, indicator.sectionRecordId, indicator.name)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteIndicator(indicator.id, indicator.name)} className='btn btn-danger'>
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
                                <input type='text' id='nameSectionRecord' className='form-control' placeholder='nameSectionRecord' value={nameSectionRecord} onChange={(e) => setNamesectionrecord(e.target.value)}></input>
                            </div>
                            
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

export default ShowIndicators;
