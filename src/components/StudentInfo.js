import Modal from 'react-modal';


Modal.setAppElement('#root');

function StudentInfo({isOpen, onClose, selectedStudent}) {

  if (!selectedStudent) {
    return null;
  }

  const convertDateOfBirth = (dob) => {
    const choppedDateOfBirth = dob.slice(0,10);
    const newDateOfBirth = choppedDateOfBirth.substring(5) + "-" + choppedDateOfBirth.substring(0,4);
    return newDateOfBirth;
    
}
  
  return (
  
    <Modal isOpen={isOpen} onClose={onClose}>
    <h1>{selectedStudent.FirstName} {selectedStudent.LastName}</h1>
    <h4>Email: {selectedStudent.Email}</h4>
    <h4>DOB: {convertDateOfBirth(selectedStudent.DateOfBirth)}</h4>
    <h4>Grade Level: {selectedStudent.GradeLevel}</h4>
    <h4>Gender: {selectedStudent.Gender}</h4>
    <button onClick={onClose}>close</button>
    </Modal>
  )
}

export default StudentInfo