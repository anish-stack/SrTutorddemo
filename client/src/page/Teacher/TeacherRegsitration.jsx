import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import toast from 'react-hot-toast'
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
const TeacherRegistration = () => {
    const navigate = useNavigate()
    const [resendButtonClick, setResendButtonClick] = useState(0);
    const [resendError, setResendError] = useState('');
    const maxResendAttempts = 3;
    const [formData, setFormData] = useState({
        TeacherName: '',
        PhoneNumber: '',
        Email: '',
        Password: '',
        DOB: '',
        Age: '',
        gender: '',
        DocumentType: 'Aadhaar',
        DocumentImage: null, // file for identity document
        QualificationDocument: null // file for qualification document
    });


    const [verifyData, setVerifyData] = useState({
        Email: '',
        otp: ''
    })


    const [modelOpen, setModelOpen] = useState(false)
    const handleClose = () => setModelOpen(false);


    const handleIdentityFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

            if (!validFileTypes.includes(file.type)) {
                toast.error('Invalid file type. Please upload a .jpg, .jpeg, .png, or .pdf file.');
                setFormData({ ...formData, DocumentImage: null });
                return;
            }
            setFormData({ ...formData, DocumentImage: file });
            toast.success('File Selected successfully!');
        }
    };

    const handleQualificationFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {

            const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];


            if (!validFileTypes.includes(file.type)) {
                toast.error('Invalid file type. Please upload a .jpg, .jpeg, .png, or .pdf file.');
                setFormData({ ...formData, QualificationDocument: null });
                return;
            }


            setFormData({ ...formData, QualificationDocument: file });
            toast.success('File Selected successfully!');
        }
    };


    const [Loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        if (name === 'Email') {
            setVerifyData((prevData) => ({
                ...prevData,
                Email: value
            }));
        }
    };
    useEffect(() => {
        const storedResendCount = localStorage.getItem('resendButtonClick');
        if (storedResendCount) {
            setResendButtonClick(Number(storedResendCount));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('resendButtonClick', resendButtonClick);
    }, [resendButtonClick]);

    const ResendOtp = async () => {
        if (resendButtonClick >= maxResendAttempts) {
            setResendError('Maximum resend attempts reached. You are blocked for 24 hours.');
            await handleBlockTeacher();
            return;
        }
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/teacher/resent-otp', verifyData);
            toast.success(response.data.message);
            setResendButtonClick(resendButtonClick + 1);
            setResendError('');
        } catch (error) {
            setResendError('You have been temporarily blocked from requesting OTP. Please try again later.')
            toast.error(error.response.data.message);
        }
    };


    const handleBlockTeacher = async () => {

        try {
            const res = await axios.post('https://api.srtutorsbureau.com/api/v1/teacher/block-teacher', {
                Email: verifyData.Email,
                HowManyRequest: resendButtonClick
            });
            console.log(res.data);
            setResendError('You have been blocked for 24 hours due to too many OTP requests.')
            toast.error('You have been blocked for 24 hours due to too many OTP requests.');
        } catch (error) {
            console.log(error);
        }

    };

    const handleVerifyChange = (e) => {
        const { name, value } = e.target;
        setVerifyData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const calculateAge = (dob) => {
        if (!dob) return '';
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleDOBChange = (e) => {
        const { value } = e.target;
        const calculatedAge = calculateAge(value);
        setFormData((prevData) => ({
            ...prevData,
            DOB: value,
            Age: calculatedAge
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault()
        const isFormValid = Object.values(formData).every(value => value !== '' && value !== undefined && value !== null);
        if (formData.PhoneNumber.length > 10) {
            toast.error('Phone number cannot exceed 10 digits.');
            return;
        }
        if (!isFormValid) {
            toast.error("Please fill all required fields.");
            return;
        }
        const data = new FormData();
        data.append('TeacherName', formData.TeacherName);
        data.append('PhoneNumber', formData.PhoneNumber);
        data.append('Email', formData.Email);
        data.append('Password', formData.Password);
        data.append('DOB', formData.DOB);
        data.append('gender', formData.gender);


        data.append('Document', formData.DocumentImage);
        data.append('Qualification', formData.QualificationDocument);
        data.append('DocumentType', formData.DocumentType);
        setLoading(true)
        try {
            const response = await axios.post(`https://api.srtutorsbureau.com/api/v1/teacher/Create-teacher?DocumentType=${formData.DocumentType}`, data)
            console.log(response.data.message)
            toast.success(response.data.message)
            setLoading(false)
            setModelOpen(true)

        } catch (error) {
            setLoading(false)
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
        }
    }

    // const ResendOtp = async () => {
    //     try {
    //         const response = await axios.post('https://api.srtutorsbureau.com/api/v1/teacher/resent-otp', verifyData)
    //         console.log(response.data)
    //         toast.success(response.data.message)
    //     } catch (error) {
    //         toast.error(error.response.data.message)
    //     }
    // }


    const VerifyOtp = async () => {
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/teacher/Verify-teacher', verifyData)

            toast.success("Tutor Verified Successful")
            const { token, user } = response.data;
            Cookies.set(`teacherToken`, token, { expires: 1 });
            Cookies.set(`teacherUser`, JSON.stringify(user), { expires: 1 });
            window.location.href = `/Complete-profile?token=${token}&encoded=${user._id}`;
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    if (Loading) {
        return <div className='loader-screen'><div class="lds-ripple"><div></div><div></div></div></div>
    }

    return (
        <>
            <div className="container-fluid py-5">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-12 col-xl-10">
                        <div className="card shadow-sm">
                            <div className="row g-0">
                                <div className="col-md-6 d-none d-md-block">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                                        alt="Sample photo"
                                        className="img-fluid  w-100 rounded-start"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body p-4">
                                        <h3 className="mb-4">
                                            <span className="text-danger">Tutor</span> Registration Form
                                        </h3>

                                        <form onSubmit={handleRegister}>
                                            <div className="mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="teacherName"
                                                        name="TeacherName"
                                                        value={formData.TeacherName}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Full Name"
                                                    />
                                                    <label htmlFor="teacherName">Full Name</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="mb-3 col-md-6">
                                                    <div className="form-floating">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="phoneNumber"
                                                            name="PhoneNumber"
                                                            value={formData.PhoneNumber}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="Phone Number"
                                                        />
                                                        <label htmlFor="phoneNumber">Phone Number</label>
                                                    </div>
                                                </div>
                                                <div className="mb-3  col-md-6">
                                                    <div className="form-floating">
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            name="Email"
                                                            value={formData.Email}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="Email"
                                                        />
                                                        <label htmlFor="email">Email</label>
                                                    </div>
                                                </div>
                                            </div>



                                            <div className="mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        name="Password"
                                                        value={formData.Password}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Password"
                                                    />
                                                    <label htmlFor="password">Password</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="mb-3 col-md-6">
                                                    <div className="form-floating">
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            id="dob"
                                                            name="DOB"
                                                            value={formData.DOB}
                                                            onChange={handleDOBChange}
                                                            placeholder="Date of Birth"
                                                        />
                                                        <label htmlFor="dob">Date of Birth</label>
                                                    </div>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <div className="form-floating">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="age"
                                                            name="Age"
                                                            value={formData.Age}
                                                            readOnly
                                                            placeholder="Age"
                                                        />
                                                        <label htmlFor="age">Age</label>
                                                    </div>
                                                </div>
                                            </div>

                                            {formData.Age && (
                                                <div className="alert alert-info mt-3" role="alert">
                                                    Your calculated age is: {formData.Age} years old.
                                                </div>
                                            )}

                                            <div className="mb-1">
                                                <label className="form-label">Gender</label>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="gender"
                                                                id="femaleGender"
                                                                value="Female"
                                                                checked={formData.gender === 'Female'}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <label className="form-check-label" htmlFor="femaleGender">
                                                                Female
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="gender"
                                                                id="maleGender"
                                                                value="Male"
                                                                checked={formData.gender === 'Male'}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <label className="form-check-label" htmlFor="maleGender">
                                                                Male
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="gender"
                                                                id="otherGender"
                                                                value="Other"
                                                                checked={formData.gender === 'Other'}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <label className="form-check-label" htmlFor="otherGender">
                                                                Other
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <Card className="p-3">
                                                    <h5>For Identical Verification</h5>
                                                    <Row className="mb-1">
                                                        <Col>
                                                            <Form.Check
                                                                type="radio"
                                                                label="Aadhaar"
                                                                name="documentType"
                                                                value="Aadhaar"
                                                                checked={formData.DocumentType === 'Aadhaar'}
                                                                onChange={(e) => setFormData({ ...formData, DocumentType: e.target.value })}
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <Form.Check
                                                                type="radio"
                                                                label="Passport"
                                                                name="documentType"
                                                                value="Passport"
                                                                checked={formData.DocumentType === 'Passport'}
                                                                onChange={(e) => setFormData({ ...formData, DocumentType: e.target.value })}
                                                            />
                                                        </Col>


                                                    </Row>

                                                    <Form.Group className="">
                                                        <Form.Label>Upload Identity Document </Form.Label>
                                                        <p>[Only .jpg, .jpeg, .png, .pdf files are accepted]</p>
                                                        <Form.Control
                                                            type="file"
                                                            accept=".jpg, .jpeg, .png, .pdf"
                                                            onChange={handleIdentityFileChange}
                                                        />
                                                    </Form.Group>
                                                </Card>

                                                <Card className="p-3">
                                                    <h5>Qualification Verification</h5>
                                                    <p>[Only .jpg, .jpeg, .png, .pdf files are accepted]</p>

                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Upload Your Higher Education Qualification Document</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept=".jpg, .jpeg, .png, .pdf"
                                                            onChange={handleQualificationFileChange}
                                                        />
                                                    </Form.Group>
                                                </Card>

                                            </div>

                                            <div className="d-flex justify-content-end">
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modelOpen && (
                <Modal show={modelOpen} onHide={handleClose} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <span className='text-danger'>Verification</span> With OTP
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Email"
                                    name="Email"
                                    value={verifyData.Email}
                                    onChange={handleVerifyChange}
                                    required
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="otp"
                                    name="otp"
                                    value={verifyData.otp}
                                    onChange={handleVerifyChange}
                                    required
                                    placeholder="OTP"
                                />
                                <label htmlFor="otp">Enter OTP</label>
                            </div>
                        </div>
                        <p className="text-success d-flex align-items-center">
                            <img src="https://i.ibb.co/C920JnT/whatsapp.png" width={20} alt="WhatsApp Icon" className="me-2" />
                            OTP is sent to your WhatsApp number
                        </p>

                        {resendButtonClick < maxResendAttempts ? (
                            <p className="text-danger">
                                You have {maxResendAttempts - resendButtonClick} OTP resend attempts left.
                            </p>
                        ) : (
                            <p className="text-danger">
                                {resendError}
                            </p>
                        )}
                    </Modal.Body>
                    <div className="mb-3">
                        {resendError && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <img src="https://i.ibb.co/C920JnT/error-icon.png" width={20} alt="Error Icon" className="me-2" />
                                <span>{resendError}</span>
                            </div>
                        )}
                    </div>

                    <Modal.Footer>
                        <Button
                            style={{ background: resendButtonClick >= maxResendAttempts ? "#d9534f" : "#111827" }}
                            onClick={ResendOtp}
                        // disabled={resendButtonClick >= maxResendAttempts}
                        >
                            Re-Send Otp
                        </Button>
                        <Button variant="primary" onClick={VerifyOtp}>
                            Verify Otp
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>

    );
};

export default TeacherRegistration;
