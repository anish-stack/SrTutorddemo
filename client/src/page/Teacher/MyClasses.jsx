import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import { CiEdit } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import Cookies from 'js-cookie';
import EditClassModel from './EditClassModel';
import { MdDelete } from "react-icons/md";
import AddClassModel from './AddClassModel';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyClasses = ({ Class, Profile }) => {

    const [comeClass, setClass] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const token = Cookies.get('teacherToken');
    const [open, setOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const classesPerPage = 6; // Number of classes to display per page

    useEffect(() => {
        if (Class) {
            setClass(Class);
            setLoading(false);
        }
    }, [Class]);

    const [modalState, setModalState] = useState({
        open: false,
        selectedClass: null,
        ClassName: null,
        Subjects: null
    });

    const handleOpen = (classId, className, subject) => {
        setModalState({ open: true, selectedClass: classId, ClassName: className, Subjects: subject });
    };

    const handleClose = () => {
        setModalState({ open: false, selectedClass: null, ClassName: null, Subjects: null });
    };

    const handleDelete = async (id) => {
        try {
            setLoadingId(id); // Set the loading ID
            const response = await axios.delete('https://api.srtutorsbureau.com/api/v1/teacher/deleteClassOfTeacher', {
                data: { ClassId: id },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Delete response:', response.data);
            setClass(prevClasses => prevClasses.filter(cls => cls.classid !== id)); // Remove deleted class from state
            setLoadingId(null); // Clear loading ID
        } catch (error) {
            console.error('Error deleting class:', error);
            setError('Failed to delete class. Please try again.'); // Set error message
            setLoadingId(null); // Clear loading ID on error
        }
    };

    const handleDeleteSubject = async (id, Subject) => {
        try {
            const response = await axios.delete('https://api.srtutorsbureau.com/api/v1/teacher/delete-Subject', {
                data: { ClassID: id, subjectName: Subject },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data)
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
        }
    };

    const handleOpens = () => {
        setOpen(true)
    };
    const handleCloseAdd = () => {
        setOpen(false)
    };

    // Pagination calculation
    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    const currentClasses = comeClass.slice(indexOfFirstClass, indexOfLastClass);
    const totalPages = Math.ceil(comeClass.length / classesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>

            <div className="container myclass-bg px-5 py-2">
                {error && <Alert variant="danger">{error}</Alert>}
                <div className="mb-3 text-end addclass-btn-row">
                    <Button
                        variant="primary"
                        disabled={currentClasses.length > 0 ? false : true}
                        onClick={handleOpens}
                        className="btn btn-primary btn-sm myclass-adbtn"
                        style={{ padding: '8px 16px', borderRadius: '5px' }}
                    >
                        + Add Class
                    </Button>
                </div>

                <div className="row">
                    {loading ? (
                        <div className="no-requests-container text-center mt-5">
                            <div className="alert alert-info py-4">
                                <h4 className="alert-heading">No Class Found</h4>
                                <p className="mb-4">
                                    Currently, there are no Class available. Please Complete Your Profile
                                </p>

                            </div>
                        </div>
                    ) : currentClasses.length > 0 ? (
                        currentClasses.map((item, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <Card className="glass border-0 h-100 ">
                                    <Card.Body className="d-flex flex-column justify-content-between">
                                        <div>
                                            <Card.Title className="h6 mb-2">{item.className}</Card.Title>
                                            <Card.Subtitle className="text-muted mb-3 small">Subjects</Card.Subtitle>
                                            <ul className="list-group list-group-flush mb-3">
                                                {item.subjects.length === 0 ? (
                                                    <li className="list-group-item text-center">
                                                        No subjects available. Please add subjects.
                                                    </li>
                                                ) : (
                                                    item.subjects.map((subject, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="list-group-item d-flex justify-content-between gap-5 align-items-center p-2"
                                                            style={{ fontSize: "0.85rem" }}
                                                        >
                                                            <span>{subject}</span>
                                                            <button
                                                                onClick={() => handleDeleteSubject(item.classid, subject)}
                                                                className="btn-outline-danger"
                                                                title="Delete Subject"
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>

                                        <div className="text-end">
                                            {item.subjects.length > 0 ? (
                                                <>
                                                    <Button
                                                        variant="outline-primary"
                                                        className="me-2 btn-sm"
                                                        style={{ padding: '5px 12px' }}
                                                        onClick={() => handleOpen(item.classid, item.className, item.subjects)}
                                                    >
                                                        <CiEdit /> Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        className="btn-sm"
                                                        style={{ padding: '5px 12px' }}
                                                        onClick={() => handleDelete(item.classid)}
                                                        disabled={loadingId === item.classid}
                                                    >
                                                        {loadingId === item.classid ? (
                                                            <>
                                                                <Spinner animation="border" size="sm" /> Deleting
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaTrash /> Delete
                                                            </>
                                                        )}
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="outline-primary"
                                                    className="me-2 btn-sm"
                                                    style={{ padding: '5px 12px' }}
                                                    onClick={() => handleOpen(item.classid, item.className, item.subjects)}
                                                >
                                                    <CiEdit /> Add Class
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div>No classes available.</div>
                    )}
                </div>

                {comeClass.length > classesPerPage && (
                    <div className="pagination">
                        {[...Array(totalPages)].map((_, index) => (
                            <Button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                variant={index + 1 === currentPage ? 'primary' : 'outline-primary'}
                                className="me-2"
                            >
                                {index + 1}
                            </Button>
                        ))}
                    </div>
                )}

                <EditClassModel
                    ClassId={modalState.selectedClass}
                    Subjects={modalState.Subjects}
                    ClassName={modalState.ClassName}
                    isOpen={modalState.open}
                    onClose={handleClose}
                />
                <AddClassModel
                    isOpen={open}
                    onClose={handleCloseAdd}
                />
            </div>


        </>
    );

};

export default MyClasses;
