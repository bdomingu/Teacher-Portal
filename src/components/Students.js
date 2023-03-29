import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Logout from './Logout';
import StudentInfo from './StudentInfo';
import AssignmentForm from './AssignmentForm';
import { v4 as uuidv4 } from 'uuid';


function Students() {
    const [roster, setRoster] = useState([]);
    const [token] = useState((localStorage.getItem('token')))
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const [savedAssignments, setSavedAssignments] = useState([]);
    const [grade, setGrade] = useState();
    const [grades, setGrades] = useState({});
    


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

const postGrade = async (event, studentId, assignmentId) => {
    event.preventDefault();
    const gradeData = {
        gradeId: uuidv4(),
        gradeValue: grade,
        studentId: studentId,
        assignmentId: assignmentId
    }
    try{
        const response = await axios.post('http://localhost:3100/post-grade', gradeData, {
            headers: {
            Authorization: `Bearer ${token}`
        }
     })
     const gradeValue = response.data
     setGrade(gradeValue);
    } catch(error) {
        console.error(error)
    }
}

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


       
        setGrades(grades);
        
    } catch (error) {
        console.error(error);
    }
};


useEffect(() => {
    getGrades();
}, [])


const updateGrade = async (e, gradeId) => {
    e.preventDefault();
    console.log(gradeId)
    const updatedValue = {
        gradeValue: grade
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

const calculateAverage = (student) => {
    let total = 0;
    let count = 0;

    savedAssignments.forEach((assignment) => {
        const gradeKey = `${student.StudentId}-${assignment.assignmentId}`;
        const existingGrade = grades[gradeKey]?.gradeValue;
      
        if (existingGrade !== undefined) {
            total += existingGrade;
            count++;
        }
    });
    const average = count > 0 ? Math.round(total / count) : "";
    return average
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
                            <td>{calculateAverage(student)}</td>
                            {savedAssignments.map((assignment) => {
                                const gradeKey = `${student.StudentId}-${assignment.assignmentId}`;
                                const existingGrade = grades[gradeKey]?.gradeValue;
                                const gradeId = grades[gradeKey]?.gradeId

                                return <td key={assignment.assignment}>
                                <input
                                defaultValue={existingGrade}
                                onChange={(e) => setGrade(e.target.value)}
                                onBlur = {(e) => {
                                     e.preventDefault();
                                     if (existingGrade) {
                                        updateGrade(e, gradeId)
                                     } else {
                                        postGrade(e, student.StudentId, assignment.assignmentId);
                                     }
                                 }} 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                     e.preventDefault();
                                     if (existingGrade) {
                                        updateGrade(e, gradeId)
                                     } else {
                                        postGrade(e, student.StudentId, assignment.assignmentId);
                                     }
                                     
                                     }
                                 }} 
                                 type='text'
                                 />
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
    </>
   
  )
}

export default Students