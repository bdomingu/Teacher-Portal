import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout({setRoster}) {
    const navigate = useNavigate();

    const logout = async () => {
        localStorage.removeItem('token');
        console.log('hi')
        const response = await axios.post('http://localhost:3100/logout')
        if (response.status === 200){
            setRoster([]);
            navigate('/');
        }
    }
  return (
    <div>
        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Logout