import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const teacherLogin = async (e) => {
        e.preventDefault()
        try {
            const teacher = {
                username: username, 
                password: password
            }

            const response = await axios.post('http://localhost:3100/login', teacher)
            const token = response.data.token
            console.log(token)
            localStorage.setItem('token', token);

            if (response.status === 200) {
                navigate('/students')
            }
            console.log(response)
            
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={teacherLogin}>
            <label>Username:
                <input
                    type='text'
                    placeholder='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <label>Username:
                <input
                    type='password'
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button type='submit'>Login</button>
        </form>
    </div>
  )
}

export default Login