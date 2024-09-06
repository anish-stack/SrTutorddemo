import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import Cookies from 'js-cookie';
import toast from "react-hot-toast";

const EditClassModel = ({ isOpen, onClose, ClassId, ClassName, Subjects }) => {
    const [ClassSubjects, setClassSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const token = Cookies.get('teacherToken');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `https://www.sr.apnipaathshaala.in/api/v1/admin/Get-Class-Subject/${ClassId}`
            );
            const filteredSubjects = data.data.Subjects.filter(
                (subject) => !Subjects.includes(subject.SubjectName)
            );

            setClassSubjects(filteredSubjects);
            setError("");
        } catch (error) {
            console.error(
                "Error fetching subjects:",
                error.response ? error.response.data : error.message
            );
            setError("Error in Fetching Subjects");
        } finally {
            setLoading(false);
        }
    }, [ClassId]);

    useEffect(() => {
        if (isOpen && ClassId) {
            fetchData();
        }
    }, [isOpen, ClassId, fetchData]);

    const handleSelectChange = (selectedOptions) => {
        setSelectedSubjects(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                classId: ClassId,
                Subjects: selectedSubjects
            };
            // console.log(payload)
            const response = await axios.post('https://www.sr.apnipaathshaala.in/api/v1/teacher/Add-Class-Subject', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success("Subject has been successfully added!");
            setTimeout(() => {
                window.location.reload()
                onClose()
            }, 1000);


        } catch (error) {
            console.error("Error updating class:", error.response ? error.response.data : error.message);
            setError('Failed to update class. Please try again.');
        }
    };

    const options = ClassSubjects.map(subject => ({
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
                    Edit Class {ClassName} - {ClassId}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Class Name</Form.Label>
                        <Form.Control value={ClassName} type="text" readOnly />
                        <Form.Text className="text-muted">
                            The name of the class being edited.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicSubjects">
                        <Form.Label>Select Subjects</Form.Label>
                        <Select
                            options={options}
                            isMulti
                            onChange={handleSelectChange}
                            placeholder="Select subjects for this class..."
                        />
                        <Form.Text className="text-muted">
                            Choose the subjects you want to assign to this class. You can select multiple subjects.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
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

export default EditClassModel;
