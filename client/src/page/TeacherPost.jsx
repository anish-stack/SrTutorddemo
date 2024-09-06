import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import Select from 'react-select';
import LoginModal from '../Components/LoginModel';
import Cookies from 'js-cookie'
const TeacherPost = ({ item, isOpen, OnClose }) => {
    const token = Cookies.get('studentToken') || false
    const [formData, setFormData] = useState({
        selectedClasses: [],
        teacherGender: '',
        numberOfSessions: [],
        subjects: [],
        minBudget: '',
        maxBudget: '',
        currentAddress: '',
        state: '',
        pincode: '',
        studentName: '',
        studentEmail: '',
        contactNumber: '',
        allDetailsCorrect: false,
    });
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const classOptions = item?.InnerClasses?.map(cls => ({
        value: cls.InnerClass,
        label: cls.InnerClass,
    }));

    const subjectOptions = item?.Subjects?.map(subject => ({
        value: subject.SubjectName,
        label: subject.SubjectName,
    }));

    const handleSelectChange = (selectedOption, { name }) => {
        setFormData({
            ...formData,
            [name]: selectedOption,
        });
        setErrors({
            ...errors,
            [name]: '', // Clear error on change
        });
    };
    const closeLoginModal = () => {
        setIsLoginModalOpen(false);

    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '', // Clear error on change
        });
    };

    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            allDetailsCorrect: e.target.checked,
        });
        setErrors({
            ...errors,
            allDetailsCorrect: '', // Clear error on change
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.selectedClasses.length) newErrors.selectedClasses = 'Please select at least one class.';
            if (!formData.teacherGender) newErrors.teacherGender = 'Please select a gender.';
            if (!formData.numberOfSessions.length) newErrors.numberOfSessions = 'Please select the number of sessions.';
            if (!formData.subjects.length) newErrors.subjects = 'Please select at least one subject.';
        } else if (step === 2) {
            if (!formData.minBudget) newErrors.minBudget = 'Minimum budget is required.';
            if (!formData.maxBudget) newErrors.maxBudget = 'Maximum budget is required.';
            if (!formData.currentAddress) newErrors.currentAddress = 'Current address is required.';
            if (!formData.state) newErrors.state = 'State is required.';
            if (!formData.pincode) newErrors.pincode = 'Pincode is required.';
        } else if (step === 3) {
            if (!formData.studentName) newErrors.studentName = 'Student name is required.';
            if (!formData.studentEmail) newErrors.studentEmail = 'Student email is required.';
            if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required.';
            if (!formData.allDetailsCorrect) newErrors.allDetailsCorrect = 'You must confirm that all details are correct.';
        }

        // Set errors and return validation result
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleStepChange = (direction) => {
        if (direction === 1 && step < 3) {
            if (validateForm()) {
                setStep(step + direction);
            }
        } else if (direction === -1 && step > 1) {
            setStep(step + direction);
        }
    };

    const ClasessOptions = [
        { value: 'Two Classes a Week', label: 'Two Classes a Week' },
        { value: 'Three Classes a Week', label: 'Three Classes a Week' },
        { value: 'Four Classes a Week', label: 'Four Classes a Week' },
        { value: 'Five Classes a Week', label: 'Five Classes a Week' },
        { value: 'Six Classes a Week', label: 'Six Classes a Week' },
    ];



    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});
        if (token) {
            try {

                // Submit the form data to the backend API
                const response = await fetch('https://www.sr.apnipaathshaala.in/api/v1/student/Class-Teacher-Request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Form submitted successfully');
                    console.log(response)
                    window.location.href="/thankyou"
                    OnClose(); // Close the modal on successful submission
                } else {
                    const errorData = await response.json();
                    setErrors({ submit: errorData.message || 'Something went wrong. Please try again.' });
                }
            } catch (error) {
                console.error('Error during form submission:', error);
                setErrors({ submit: 'Failed to submit. Please try again later.' });
            } finally {
                setLoading(false);
            }
        }
        else {
            setIsLoginModalOpen(true)
        }

    };


    return (
        <Modal show={isOpen} onHide={OnClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Request For Tutor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 && (
                    <Form>
                        <Form.Group>
                            <Form.Label className="mb-0">Interested Classes:</Form.Label>
                            <Select
                                name="selectedClasses"
                                options={classOptions}
                                onChange={handleSelectChange}
                                isMulti
                                placeholder="Select Classes"
                            />
                            {errors.selectedClasses && <Alert variant="danger">{errors.selectedClasses}</Alert>}
                        </Form.Group>

                        <Form.Group className="mt-1">
                            <Form.Label className="mb-0">Subjects:</Form.Label>
                            <Select
                                name="subjects"
                                options={subjectOptions}
                                onChange={handleSelectChange}
                                isMulti
                                placeholder="Select Subjects"
                            />
                            {errors.subjects && <Alert variant="danger">{errors.subjects}</Alert>}
                        </Form.Group>

                        <Form.Group className="mt-1">
                            <Form.Label className="mb-0">Teacher's Gender:</Form.Label>
                            <Form.Control
                                as="select"
                                name="teacherGender"
                                onChange={handleInputChange}
                                isInvalid={!!errors.teacherGender}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Control>
                            {errors.teacherGender && <Form.Control.Feedback type="invalid">{errors.teacherGender}</Form.Control.Feedback>}
                        </Form.Group>

                        <Form.Group className="mt-1">
                            <Form.Label className="mb-0">Number of Sessions per Week:</Form.Label>
                            <Select
                                name="numberOfSessions"
                                options={ClasessOptions}
                                onChange={handleSelectChange}
                                isMulti
                                placeholder="Number Of Sessions"
                            />
                            {errors.numberOfSessions && <Alert variant="danger">{errors.numberOfSessions}</Alert>}
                        </Form.Group>
                    </Form>
                )}

                {step === 2 && (
                    <Form>
                        <Form.Group>
                            <Form.Label className="mb-0">Minimum Budget:</Form.Label>
                            <Form.Control
                                type="number"
                                name="minBudget"
                                value={formData.minBudget}
                                onChange={handleInputChange}
                                isInvalid={!!errors.minBudget}
                            />
                            {errors.minBudget && <Form.Control.Feedback type="invalid">{errors.minBudget}</Form.Control.Feedback>}
                        </Form.Group>

                        <Form.Group className="mt-1">
                            <Form.Label className="mb-0">Maximum Budget:</Form.Label>
                            <Form.Control
                                type="number"
                                name="maxBudget"
                                value={formData.maxBudget}
                                onChange={handleInputChange}
                                isInvalid={!!errors.maxBudget}
                            />
                            {errors.maxBudget && <Form.Control.Feedback type="invalid">{errors.maxBudget}</Form.Control.Feedback>}
                        </Form.Group>

                        <Form.Group className="mt-1">
                            <Form.Label className="mb-0">Current Address:</Form.Label>
                            <Form.Control
                                type="text"
                                name="currentAddress"
                                value={formData.currentAddress}
                                onChange={handleInputChange}
                                isInvalid={!!errors.currentAddress}
                            />
                            {errors.currentAddress && <Form.Control.Feedback type="invalid">{errors.currentAddress}</Form.Control.Feedback>}
                        </Form.Group>

                        <Form.Group className="mt-1">
                            <Form.Label className="mb-0">State:</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                isInvalid={!!errors.state}
                            />
                            {errors.state && <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>}
                        </Form.Group>

                        <Form.Group className="mt-1">
                            <Form.Label className="mb-0">Pincode:</Form.Label>
                            <Form.Control
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                isInvalid={!!errors.pincode}
                            />
                            {errors.pincode && <Form.Control.Feedback type="invalid">{errors.pincode}</Form.Control.Feedback>}
                        </Form.Group>
                    </Form>
                )}

                {step === 3 && (
                    <Form>
                        <Form.Group>
                            <Form.Label className="mb-0">Student Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleInputChange}
                                isInvalid={!!errors.studentName}
                            />
                            {errors.studentName && <Form.Control.Feedback type="invalid">{errors.studentName}</Form.Control.Feedback>}
                        </Form.Group>

                        <Form.Group className="mt-1">
                            <Form.Label className="mb-0">Student Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="studentEmail"
                                value={formData.studentEmail}
                                onChange={handleInputChange}
                                isInvalid={!!errors.studentEmail}
                            />
                            {errors.studentEmail && <Form.Control.Feedback type="invalid">{errors.studentEmail}</Form.Control.Feedback>}
                        </Form.Group>

                        <Form.Group className="mt-1">
                            <Form.Label className="mb-0">Contact Number:</Form.Label>
                            <Form.Control
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                isInvalid={!!errors.contactNumber}
                            />
                            {errors.contactNumber && <Form.Control.Feedback type="invalid">{errors.contactNumber}</Form.Control.Feedback>}
                        </Form.Group>

                        <Form.Group className="mt-1">
                            <Form.Check
                                type="checkbox"
                                label="I confirm that all details are correct"
                                name="allDetailsCorrect"
                                checked={formData.allDetailsCorrect}
                                onChange={handleCheckboxChange}
                                isInvalid={!!errors.allDetailsCorrect}
                            />
                            {errors.allDetailsCorrect && <Alert variant="danger">{errors.allDetailsCorrect}</Alert>}
                        </Form.Group>
                    </Form>
                )}

                {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
            </Modal.Body>
            <Modal.Footer>
                {step > 1 && (
                    <Button variant="secondary" onClick={() => handleStepChange(-1)}>
                        Previous
                    </Button>
                )}
                {step < 3 ? (
                    <Button
                        variant="primary"
                        onClick={() => handleStepChange(1)}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                )}
            </Modal.Footer>


            <LoginModal
                isOpen={isLoginModalOpen}
                modalType="student"
                onClose={closeLoginModal}
            />
        </Modal>
    );
};

export default TeacherPost;
