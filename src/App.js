import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Students from './components/Students';

function App() {
  return (
    <Router>
      <Routes>
          <Route exact path = '/' element={<Login/>}/>
          <Route path = '/students' element={<Students/>} />
      </Routes>
    </Router>
  
  );
}

export default App;
