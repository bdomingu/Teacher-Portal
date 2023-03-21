import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Logout from './Logout';
import StudentInfo from './StudentInfo';

/* Need to add data to the parents table
    Need to display the parents data. MAybe look into having a join query when selecting the students
    Need to look into creating and posting an assignment 
*/
function Students() {
    const [roster, setRoster] = useState([]);
    const [token] = useState((localStorage.getItem('token')))
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);

    const handleStudentClick = useCallback((student) => {
        setSelectedStudent(student)
        setShowPopUp(true)
    }, [])

    const getStudentRoster = async () => {
        try{
            const response = await axios.get('http://localhost:3100/students', {
                headers: {
                     Authorization: `Bearer ${token}`
                }
            });

            const students = await response.data
            console.log(students)
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
                <ul>
                <li key={student.StudentId} onClick={() => handleStudentClick(student)}>
                {student.FirstName} {student.LastName}</li>
                </ul>
                </>
            )
            
        })}
        </div>
        <StudentInfo 
            isOpen = {selectedStudent && showPopUp}
            onClose = {() => setShowPopUp(false)}
            selectedStudent={selectedStudent}
        />
    </div>
  )
}

export default Students