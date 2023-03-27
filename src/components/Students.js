import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Logout from './Logout';
import StudentInfo from './StudentInfo';
import AssignmentForm from './AssignmentForm';

/* 
*/
function Students() {
    const [roster, setRoster] = useState([]);
    const [token] = useState((localStorage.getItem('token')))
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const [savedAssignments, setSavedAssignments] = useState([]);

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
            setRoster(students)
        } catch(error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStudentRoster();
    }, [token]);

const getAssignments = async () => {
    try {
        const response = await axios.get('http://localhost:3100/assignments', {
            headers: {
                Authorization: `Bearer ${token}`
           }
        });

        const assignments = await response.data
        setSavedAssignments(assignments)

    } catch(error) {
        console.error(error)
    }
}

useEffect(() => {
    getAssignments();
});


   
  
  return (
    <>
        <div>
            <Logout setRoster={setRoster} />
        </div>
        <table>
            <thead>
            <tr>
                <th>Student Name</th>
              <> 
              {savedAssignments.map((assignment) => {
                return (
                    <>
                    <th>{assignment.shortName}</th>
                    </>
                )
              })}
                
            </> 
            </tr>
            </thead>
            <>
              {roster.map((student) => {
                  return (
                      <> 
                      <tbody>                          
                        <tr>
                            <td key={student.StudentId} onClick={() => handleStudentClick(student)}>{student.FirstName} {student.LastName}</td>
                            <td><input type='text'/></td>
                        </tr>  
                    </tbody> 
                      </>
                  );
              })}
            </>
        </table>
    <StudentInfo
        isOpen={selectedStudent && showPopUp}
        onRequestClose={() => setShowPopUp(false)}
        selectedStudent={selectedStudent} />
    <AssignmentForm token={token} />
    </>
   
  )
}

export default Students