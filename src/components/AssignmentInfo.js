import Modal from 'react-modal';
import axios from 'axios';


Modal.setAppElement('#root');

function AssignmentInfo({token, isOpen, onRequestClose, selectedAssignment, getStudentRoster}) {

  if (!selectedAssignment) {
    return null;
  }

  const convertDate = (dob) => {
    const choppedDateOfBirth = dob.slice(0,10);
    const newDateOfBirth = choppedDateOfBirth.substring(5) + "-" + choppedDateOfBirth.substring(0,4);
    return newDateOfBirth;
  }


  
  const deleteAssignment = async (e, assignmentId) => {
      e.preventDefault();
      try{
      const response = await axios.delete(`http://localhost:3100/remove-assignment/${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
          }
      });
      const status = response.status
      if(status === 200) {
        const deleteResponse = await axios.delete(`http://localhost:3100/delete-assignment/${assignmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const deleteStatus = deleteResponse.status
        if(deleteStatus === 200){
          onRequestClose()
          getStudentRoster()
        }
      }
      console.log(status);
      } catch(error){
          console.error(error)
      }
    }
  

  
  return (
  
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
    <h1>{selectedAssignment.shortName}</h1>
    <p>Details: {selectedAssignment.summary}</p>
    <p>Date Assigned: {convertDate(selectedAssignment.assignedDate)}</p>
    <p>Date Due: {convertDate(selectedAssignment.dueDate)}</p>
    <button onClick={onRequestClose}>close</button>
    <button onClick={(e) => deleteAssignment(e, selectedAssignment.assignmentId)}>Delete Assignment</button>
    </Modal>
  )
}

export default AssignmentInfo