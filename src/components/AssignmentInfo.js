import Modal from 'react-modal';


Modal.setAppElement('#root');

function AssignmentInfo({isOpen, onRequestClose, selectedAssignment}) {

  if (!selectedAssignment) {
    return null;
  }

  const convertDate = (dob) => {
    const choppedDateOfBirth = dob.slice(0,10);
    const newDateOfBirth = choppedDateOfBirth.substring(5) + "-" + choppedDateOfBirth.substring(0,4);
    return newDateOfBirth;
  }

  const deleteAssignment = (assignmentId) => {

  }

  
  return (
  
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
    <h1>{selectedAssignment.shortName}</h1>
    <p>Details: {selectedAssignment.summary}</p>
    <p>Date Assigned: {convertDate(selectedAssignment.assignedDate)}</p>
    <p>Date Due: {convertDate(selectedAssignment.dueDate)}</p>
    <button onClick={onRequestClose}>close</button>
    <button onClick={deleteAssignment(selectedAssignment.assignmentId)}>Delete Assignment</button>
    </Modal>
  )
}

export default AssignmentInfo