import React, { useState } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import toast from 'react-hot-toast';

const StudentCardForTeacher = ({ result }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
   
    const handleShow = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    const handleContact = ()=>{
        toast.success("Contact Admin For This Student 📖📝")
    }
    const handleClose = () => setShowModal(false);
    const maskContactNumber = (contactNumber) => {
        if (!contactNumber) return '';
        const cutFirstTwo = contactNumber.split('');
        return `${cutFirstTwo[0]}${cutFirstTwo[1]}XXXXXX${cutFirstTwo[8]}${cutFirstTwo[9]}`;
    };

    return (
        <div className="container-fluid mx-auto my-4">
            <div className="row mx-auto " style={{gap:0}}>
                {result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
.map((student, index) => (

                    <div key={index} className='py-2 col-lg-3 position-relative col-md-4 hs mb-2 mr-1 gap-1 col-12 position-relative gap-0 hs  px-1 glass'>

                        <div style={{ cursor: 'pointer' }} className="profile-section py-1 ">
                            <div className="book-img text-end">
                                <img src="https://vcards.infyom.com/assets/img/vcard24/book.png" alt="book" loading="lazy" />
                            </div>
                            <div className="card position-relative ">
                                <div className="card-img text-center">
                                    <img
                                        src={student?.ProfilePic?.url || "https://i.ibb.co/jzXNG7z/graduated.png"}
                                        className="img-fluid shadow-sm p-2 border border-black border-3 rounded-circle"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                </div>
                               


                            </div>
                        </div>
                        <div className="contact-section px-2 pb-20">

                            <div className="row">

                                <div className="col-sm-12 mb-12">
                                    <div className="contact-box d-flex justify-content-start gap-2 align-items-center">
                                        <div className="contact-icon justify-content-center align-items-center">
                                            <i className="fas fa-phone-alt text-yellow-500" style={{ fontSize: '18px' }}></i>
                                        </div>
                                        <div className="contact-desc">
                                            <a href="tel: 9811382915 " className="text-black fw-5">
                                                I Want {student.teacherGenderPreference} Teacher
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 mb-sm-0 mb-20">
                                    <div className="contact-box justify-content-start gap-2 d-flex align-items-center">
                                        <div className="contact-icon d-flex justify-content-center align-items-center">
                                            <i className="fas fa-calendar-day text-orange-500" style={{ fontSize: '18px' }}></i>
                                        </div>
                                        <div className="contact-desc">
                                            <p className="mb-0 text-black fw-5">
                                               For Class {student.className}
                                            </p>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className="col-sm-12 mb-sm-0 mb-20">
                                    <div className="contact-box justify-content-start gap-2 d-flex align-items-center">
                                        <div className="contact-icon d-flex justify-content-center align-items-center">
                                            <i className="fas fa-location text-orange-500" style={{ fontSize: '18px' }}></i>
                                        </div>
                                        <div className="contact-desc">
                                            <p className="mb-0 text-black fw-5">
                                           Location: {student.locality || "Not Disclosed"}
                                            </p>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className="col-sm-12 mb-sm-0 mb-20">
                                    <div className="contact-box justify-content-start gap-2 d-flex align-items-center">
                                        <div className="contact-icon d-flex justify-content-center align-items-center">
                                            <i className="fas fa-school text-orange-500" style={{ fontSize: '18px' }}></i>
                                        </div>
                                        <div className="contact-desc">
                                            <p className="mb-0 text-black fw-5">
                                           Mode: {student.interestedInTypeOfClass || "Not Disclosed"}
                                            </p>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="contact-box justify-content-start gap-2 d-flex align-items-center">
                                        <div className="contact-icon d-flex justify-content-center mt-2 align-items-center">
                                            <i className="fas fa-book text-blue-500" style={{ fontSize: '20px' }}></i>
                                        </div>
                                        <div className="contact-desc">
                                            I Want to learn
                                            <p className="mb-0 text-black fw-5">
                                                <ul>
                                                    {student.subjects.map(subject => (
                                                        <li >{subject}</li>
                                                    ))}
                                                </ul>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='student-tag'>
                            <span>Student</span>
                        </div>
                        <div className='col-12 d-flex gap-2 align-item-center w-100 prs'>
                            <button style={{ whiteSpace: 'nowrap' }} onClick={() => handleShow(student)} class="btn-shine w-75 buttonsss ">
                                <span>View More Details</span>
                            </button>
                            <button style={{ whiteSpace: 'nowrap' }} onClick={handleContact} class="btn-shine w-75 buttonsss ">
                                <span>Contact Now</span>
                            </button>
                        </div>
                    </div>




                ))}
            </div>

            {selectedStudent && (
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedStudent.studentName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Class:</strong> {selectedStudent.className}</p>
                        <p><strong>Subjects:</strong></p>
                        <ul>
                            {selectedStudent.subjects.map(subject => (
                                <li key={subject._id}>{subject}</li>
                            ))}
                        </ul>
                        <p><strong>Interested In:</strong> {selectedStudent.interestedInTypeOfClass}</p>
                        <p><strong>Teacher Preference:</strong> {selectedStudent.teacherGenderPreference}</p>
                        <p><strong>Number of Sessions:</strong> {selectedStudent.numberOfSessions}</p>
                        <p><strong>Budget:</strong> {selectedStudent.minBudget} - {selectedStudent.maxBudget}</p>
                        <p><strong>Locality:</strong> {selectedStudent.locality}</p>
                        <p><strong>Start Date:</strong> {selectedStudent.startDate}</p>

                        {/* <p><strong>Post Verified:</strong> {selectedStudent.PostIsVerifiedOrNot ? 'Yes' : 'No'}</p> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default StudentCardForTeacher;
