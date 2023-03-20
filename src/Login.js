import {useState} from 'react'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    
  return (
    <div>
        <h1>Login</h1>
        <form>
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
                    type='text'
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button>Login</button>
        </form>
    </div>
  )
}

export default Login