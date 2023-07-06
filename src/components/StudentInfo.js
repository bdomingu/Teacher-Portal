import Modal from 'react-modal';


Modal.setAppElement('#root');

function StudentInfo({isOpen, onRequestClose, selectedStudent}) {

  if (!selectedStudent) {
    return null;
  }

  const convertDateOfBirth = (dob) => {
    const choppedDateOfBirth = dob.slice(0,10);
    const newDateOfBirth = choppedDateOfBirth.substring(5) + "-" + choppedDateOfBirth.substring(0,4);
    return newDateOfBirth;
  }
  
  return (
  
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
    <h1>{selectedStudent.FirstName} {selectedStudent.LastName}</h1>
    <h4>Student Info</h4>
    <p>Email: {selectedStudent.Email}</p>
    <p>DOB: {convertDateOfBirth(selectedStudent.DateOfBirth)}</p>
    <p>Grade Level: {selectedStudent.GradeLevel}</p>
    <p>Gender: {selectedStudent.Gender}</p>
  
    <h4>Parent Info</h4>
    <p>Name: {selectedStudent.parentFirstName} {selectedStudent.parentLastName}</p>
    <p>Phone Number: {selectedStudent.PhoneNumber}</p>
    <p>Email: {selectedStudent.parentEmail}</p>
    <p>Address: {selectedStudent.Address}</p>
    <button onClick={onRequestClose}>close</button>
    </Modal>
  )
}

export default StudentInfo