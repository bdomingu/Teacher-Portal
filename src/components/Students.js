import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Logout from './Logout';
import StudentInfo from './StudentInfo';
import AssignmentForm from './AssignmentForm';
import { v4 as uuidv4 } from 'uuid';
import AssignmentInfo from './AssignmentInfo';
import { set } from 'lodash';


function Students() {
    const [roster, setRoster] = useState([]);
    const [token] = useState((localStorage.getItem('token')))
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const [assignmentPopUp, setAssignmentPopUp] = useState(false);
    const [savedAssignments, setSavedAssignments] = useState([]);
    const [grades, setGrades] = useState({});
    const [savedGrades, setSavedGrades] = useState({});
    


    const handleStudentClick = useCallback((student) => {
        setSelectedStudent(student);
        setShowPopUp(true);
    }, [])

    const handleAssignmentClick = useCallback((assignment) => {
        setSelectedAssignment(assignment);
        setAssignmentPopUp(true);
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
    }, [token, grades]);
  
// Return the assignments specific to the Teacher who is logged in //
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
    }, [savedAssignments]);


    const getGrades = async () => {
        try {
            const response = await axios.get('http://localhost:3100/grades', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const gradesData = await response.data
           
            const grades = {};
    
            gradesData.forEach(grade => {
                const key = `${grade.StudentId}-${grade.assignmentId}`;
                grades[key] = {
                    gradeValue:grade.gradeValue,
                    gradeId: grade.gradeId
                }
            });
           
            setSavedGrades(grades);
            
        } catch (error) {
            console.error(error);
        }
        };
    
    
        useEffect(() => {
            getGrades();
        }, [grades])
    
        

    const postGrade = async (e, studentId, assignmentId) => {   
    e.preventDefault();
    const key = `${studentId}-${assignmentId}`;
    if(key in savedGrades){
       updateGrade(e, savedGrades[`${studentId}-${assignmentId}`]?.gradeId, studentId, assignmentId)
    } else {
  
    const gradeData = {
        gradeId: uuidv4(),
        gradeValue: grades[`${studentId}-${assignmentId}`],
        studentId: studentId,
        assignmentId: assignmentId
    }
    try{
        const response = await axios.post('http://localhost:3100/post-grade', gradeData, {
            headers: {
            Authorization: `Bearer ${token}`
        }
     })
     const status = response.status
     if(status === 200) {
        getStudentRoster()
     }
     
    } catch(error) {
        console.error(error)
    }
    }
    }


  

    const updateGrade = async (e, gradeId, studentId, assignmentId) => {
    e.preventDefault();
    console.log(studentId);
    console.log(assignmentId)
    console.log(gradeId)
    const updatedValue = {
        gradeValue: grades[`${studentId}-${assignmentId}`]
    }
    try {
        const response = await axios.put(`http://localhost:3100/update-grade/${gradeId}`, updatedValue, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        })

     const updateGrade = response.data;
    console.log(updateGrade)
    } catch(error) {
        console.error(error)
    }

    }




  return (
    <>
        <div>
            <Logout setRoster={setRoster} />
        </div>
        <table>
            <thead>
            <tr>
                <th>Student Name</th>
                <th>Grade Average</th>
              <> 
              {savedAssignments.map((assignment) => {
                return (
                    <>
                    <th onClick={() => handleAssignmentClick(assignment)}>{assignment.shortName}</th>
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
                            {student.averageGrade === null ? <td></td> : <td>{Math.round(student.averageGrade)}</td>}
                            
                            {savedAssignments.map((assignment) => {
                        
                            const handleGradeChange = (e, studentId, assignmentId) => {
                               const key = `${studentId}-${assignmentId}`;
                                setGrades(prevGrades => ({
                                ...prevGrades,
                                [key]: e.target.value
                                }));
                            }
                                return <td key={assignment.assignment}>
                                <form onSubmit={(e) => postGrade(e, student.StudentId, assignment.assignmentId)}>
                                <input
                                type="text"
                                defaultValue={savedGrades[`${student.StudentId}-${assignment.assignmentId}`]?.gradeValue || ''}
                                onChange={(e) => handleGradeChange(e, student.StudentId, assignment.assignmentId)}
                                 />
                                 </form>
                                </td>
                            })}
                            
                        </tr>  
                    </tbody> 
                      </>
                  );
              })}
            </>
        </table>
        <div>
        </div>
    <StudentInfo
        isOpen={selectedStudent && showPopUp}
        onRequestClose={() => setShowPopUp(false)}
        selectedStudent={selectedStudent} />
    <AssignmentForm token={token} />
    <AssignmentInfo 
        isOpen={selectedAssignment && assignmentPopUp}
        onRequestClose={() => setAssignmentPopUp(false)}
        selectedAssignment={selectedAssignment}
    />
    </>

  )
}

export default Students