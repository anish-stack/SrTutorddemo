import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { ClassSearch } from "../../Slices/Class.slice";
import toast from "react-hot-toast";


const AddClassModel = ({ isOpen, onClose }) => {
    const [classSubjects, setClassSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [concatenatedData, setConcatenatedData] = useState([]);
    const token = Cookies.get('teacherToken');
    const { data } = useSelector((state) => state.Class);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(ClassSearch());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            const filterOutClasses = ['I-V', 'VI-X', 'X-XII'];
            const filteredClasses = data
                .filter(item => !filterOutClasses.includes(item.Class))
                .map(item => ({ class: item.Class, id: item._id }));

            const rangeClasses = data
                .filter(item => item.InnerClasses && item.InnerClasses.length > 0)
                .flatMap(item => item.InnerClasses.map(innerClass => ({
                    class: innerClass.InnerClass,
                    id: innerClass._id
                })));

            const concatenatedData = rangeClasses.concat(filteredClasses);
            setConcatenatedData(concatenatedData);
        }
    }, [data]);

    const fetchSubjects = useCallback(async (classId) => {
        try {
            const response = await axios.get(
                `https://api.srtutorsbureau.com/api/v1/admin/Get-Class-Subject/${classId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubjects(response.data.data.Subjects || []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            setError("Failed to fetch subjects.");
        }
    }, [token]);

    useEffect(() => {
        if (isOpen && selectedClass) {
            fetchSubjects(selectedClass);
        }
    }, [isOpen, selectedClass, fetchSubjects]);

    const handleClassChange = (event) => {
        const classId = event.target.value;
        setSelectedClass(classId);
    };

    const handleSelectChange = (selectedOptions) => {
        setSelectedSubjects(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const payload = {
                classId: selectedClass,
                Subjects: selectedSubjects
            };
          
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/teacher/Add-Class-Subject', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success("Class has been successfully added!");
            setTimeout(() => {
                window.location.reload()
                onClose()
            }, 1000);
        } catch (error) {
            console.error('Error submitting data:', error);
            setError('Failed to add class. Please try again.');
            toast.success("Failed to add class. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const options = subjects.map(subject => ({
        value: subject.SubjectName,
        label: subject.SubjectName
    }));

    return (
        <Modal
            show={isOpen}
            onHide={onClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Class
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Class Name</Form.Label>
                        <Form.Control
                            as="select"
                            onChange={handleClassChange}
                            value={selectedClass}
                        >
                            <option value="" disabled>Select Class...</option>
                            {concatenatedData.map((classItem) => (
                                <option key={classItem.id} value={classItem.id}>
                                    {classItem.class}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            The name of the class being edited.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Select Subjects</Form.Label>
                        <Select
                            isMulti
                            options={options}
                            onChange={handleSelectChange}
                            value={options.filter(option => selectedSubjects.includes(option.value))}
                        />
                        <Form.Text className="text-muted">
                            Choose the subjects you want to assign to this class. You can select multiple subjects.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Please tick if you confirm with the selected subjects."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddClassModel;
