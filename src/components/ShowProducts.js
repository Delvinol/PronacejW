import React, {useEffect,useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowProducts = () => {
    const url='http://181.176.172.117:8081/api/v1/auth/findAllUser';
    const [users,setUsers]= useState([]);
    const [id,setId]= useState('');
    const [name,setName]= useState('');
    const [lastname,setLastname]= useState('');
    const [email,setEmail]= useState('');
    const [state,setState]= useState('');

    const [description,setDescription]= useState('');
    const [price,setPrice]= useState('');
    const [operation,setOperation]= useState(1);
    const [title,setTitle]= useState('');

    useEffect( ()=>{
        getUsers();
    },[]);

    const getUsers = async () => {
        const respuesta = await axios.get(url);
        setUsers(respuesta.data);
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir

                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className='modal fade'>
            
        </div>


    </div>
  )
}

export default ShowProducts