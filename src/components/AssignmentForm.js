import {useState} from 'react';
import Modal from 'react-modal';
import axios from 'axios';

function AssignmentForm({token}) {
    const [openAssignmentForm, setOpenAssignmentForm] = useState(false);
    const [type, setType] = useState('Daily');
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentSummary, setAssignmentSummary] = useState('');
    const [assignedDate, setAssignedDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    

    const addAssignment = () => {
        setOpenAssignmentForm(true)
    }

    const handleAssignmentClose = () => {
        setOpenAssignmentForm(false)
    }

    const saveAssignment = async() => {

        const assignment = {
            type: type,
            shortName: assignmentName,
            summary: assignmentSummary,
            assignedDate: assignedDate,
            dueDate: dueDate
        };
        try{
        const response = await axios.post('http://localhost:3100/assignments', assignment, {
            headers: {
                Authorization: `Bearer ${token}`
           }
        })
        if (response.status === 200){
            setOpenAssignmentForm(false)
        }
        } catch(error) {
            console.error(error)
        }
    }
    
  return (
    <>
        <Modal isOpen={openAssignmentForm}>
            <form>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Daily">Daily</option>
                    <option value="Exam">Exam</option>
                </select>
                <input
                    type='text'
                    placeholder='Short Name'
                    value={assignmentName}
                    onChange={(e) => setAssignmentName(e.target.value)}
                />
                  <input
                    type='text'
                    placeholder='Summary'
                    value={assignmentSummary}
                    onChange={(e) => setAssignmentSummary(e.target.value)}
                   
                />
                <label>Assigned Date:
                    <input
                    type='date'
                    value={assignedDate}
                    onChange={(e) => setAssignedDate(e.target.value)}
                     />
                </label>
                 <label>Due Date:
                    <input
                    type='date'
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    />
                 </label>
            </form>
            <button onClick={() => saveAssignment()}>Save</button>
            <button onClick={() => handleAssignmentClose()}>Close</button>
        </Modal>
        <div>
            <button onClick={() => addAssignment()}>Add Assignment</button>
        </div>
    </>
  )
}

export default AssignmentForm