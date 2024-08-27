import SubjectModel from "./SubjectModel";
import ClassModel from "./ClassModel";
const SubjectRequestModel = ({ showModal, handleClose, subject }) => {
  const { Class, Subjects = [], isClass, id } = subject; // Default Subjects to an empty array if it's not an array
 
  return (
    <>
      {isClass ? (
        <ClassModel showModal={showModal} subject={subject} handleClose={handleClose} />
      ) : (
        <SubjectModel showModal={showModal} subject={subject} handleClose={handleClose} />
      )}
   
    </>
  );
};

export default SubjectRequestModel;
