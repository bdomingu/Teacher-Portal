import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logout from './Logout';

function Students() {
    const [roster, setRoster] = useState([]);
    const [token] = useState((localStorage.getItem('token')))


    const getStudentRoster = async () => {
        try{
            const response = await axios.get('http://localhost:3100/students', {
                headers: {
                     Authorization: `Bearer ${token}`
                }
            });

            const students = await response.data
            setRoster(students)
        } catch(error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStudentRoster();
    }, [token]);

  return (
    <div>
    <Logout setRoster={setRoster}/>
        <h2>Student Name</h2>
        <div>
        {roster.map((student) => {
            
            return (
                <>
                <li>{student.FirstName} {student.LastName}</li>
                </>
            )
            
        })}
        </div>
    </div>
  )
}

export default Students