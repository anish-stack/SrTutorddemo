import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Cookies from "js-cookie";
import toast from 'react-hot-toast'
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
        PermanentAddress: {
            streetAddress: '',
            City: '',
            Area: '',
            // LandMark: '',
            Pincode: ''
        },
        // DocumentType: 'Aadhaar',
        // DocumentImage: null,
        // QualificationDocument: null
    });

    const fileInputRef = useRef(null);
    const qualificationRef = useRef(null);

    const [verifyData, setVerifyData] = useState({
        PhoneNumber: '',
        otp: ''
    })


    const [modelOpen, setModelOpen] = useState(false)
    const handleClose = () => setModelOpen(false);

    const handleIdentityFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png',];
            const maxSizeInMB = 10;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

            if (!validFileTypes.includes(file.type)) {
                toast.error('Invalid file type. Please upload a .jpg, .jpeg, .png file.');
                setFormData({ ...formData, DocumentImage: null });
                fileInputRef.current.value = '';
                return;
            }

            if (file.size > maxSizeInBytes) {
                toast.error('File size exceeds 10 MB. Please upload a smaller file.');
                setFormData({ ...formData, DocumentImage: null });
                fileInputRef.current.value = '';
                fileInputRef.current.nextElementSibling.textContent = "Choose file ";

                return;
            }

            setFormData({ ...formData, DocumentImage: file });
            fileInputRef.current.nextElementSibling.textContent = "Identity Document Selected";
            toast.success('File selected successfully!');
        }
    };


    const handleQualificationFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png',];
            const maxSizeInMB = 10;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

            if (!validFileTypes.includes(file.type)) {
                toast.error('Invalid file type. Please upload a .jpg, .jpeg, .png,  file.');
                setFormData({ ...formData, QualificationDocument: null });
                qualificationRef.current.value = '';
                return;
            }

            if (file.size > maxSizeInBytes) {
                toast.error('File size exceeds 10 MB. Please upload a smaller file.');
                setFormData({ ...formData, QualificationDocument: null });
                qualificationRef.current.value = '';
                qualificationRef.current.nextElementSibling.textContent = "Choose file ";
                return;
            }

            setFormData({ ...formData, QualificationDocument: file });
            qualificationRef.current.nextElementSibling.textContent = "Qualification Document Selected";
            toast.success('File selected successfully!');
        }
    };


    const [Loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        if (name === 'PhoneNumber') {
            setVerifyData((prevData) => ({
                ...prevData,
                PhoneNumber: value
            }));
        }
    };

    const handleNestedChange = (e, addressType) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [addressType]: {
                ...prevState[addressType],
                [name]: value
            }
        }));
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
            // setResendError('Maximum resend attempts reached. You are blocked for 24 hours.');
            await handleBlockTeacher();
            return;
        }
        console.log(verifyData)
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/teacher/resent-otp', { PhoneNumber: verifyData.PhoneNumber });
            console.log(response)
            toast.success(response.data.message);
            setResendButtonClick(resendButtonClick + 1);
            setResendError('');
        } catch (error) {
            console.log(error)
            setResendError(error?.response?.data.message)
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
        // const isFormValid = Object.values(formData).every(value => value !== '' && value !== undefined && value !== null);
        if (formData.PhoneNumber.length > 10) {
            toast.error('Phone number cannot exceed 10 digits.');
            return;
        }
        // if (!isFormValid) {
        //     toast.error("Please fill all required fields.");
        //     return;
        // }
        // const data = new FormData();
        // data.append('TeacherName', formData.TeacherName);
        // data.append('PhoneNumber', formData.PhoneNumber);
        // data.append('Email', formData.Email);
        // data.append('Password', formData.Password);
        // data.append('DOB', formData.DOB);
        // data.append('gender', formData.gender);
        // data.append('PermanentAddress', JSON.stringify(formData.PermanentAddress));


        // data.append('Document', formData.DocumentImage);
        // data.append('Qualification', formData.QualificationDocument);
        // data.append('DocumentType', formData.DocumentType);
        setLoading(true)
        try {
            const response = await axios.post(`https://api.srtutorsbureau.com/api/v1/teacher/Create-teacher?DocumentType=${formData.DocumentType}`, formData)
            console.log(response.data.message)
            toast.success(response.data.message)
            setLoading(false)
            setModelOpen(true)
            setVerifyData(prevData => ({
                ...prevData,
                PhoneNumber: formData.PhoneNumber
            }));
        } catch (error) {
            setLoading(false)
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
        }
    }

    const fetchLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const { data } = await axios.post('https://api.srtutorsbureau.com/Fetch-Current-Location', {
                            lat: latitude,
                            lng: longitude
                        });

                        const address = data?.data?.address;
                        console.log(address);
                        if (address) {
                            setFormData((prev) => ({
                                ...prev,
                                PermanentAddress: {
                                    streetAddress: address.completeAddress, // Full address
                                    Pincode: address.postalCode,           // Postal code
                                    City: address.city,                     // City
                                    Area: address.area                      // Area
                                },
                                location: {
                                    type: 'Point',
                                    coordinates: [address.lng, address.lat] // Ensure order is [lng, lat]
                                }
                            }));
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    };




    const VerifyOtp = async () => {
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/teacher/Verify-teacher', verifyData)

            toast.success("Tutor Verified Successful")
            const { token, user } = response.data;
            Cookies.set(`teacherToken`, token, { expires: 1 });
            Cookies.set(`teacherUser`, JSON.stringify(user), { expires: 1 });
            window.location.href = `/Complete-profile?token=${token}&encoded=${user._id}`;
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    if (Loading) {
        return <div className='loader-screen'><div class="lds-ripple"><div></div><div></div></div></div>
    }

    return (
        <>
            <Helmet>
                <title>Tutor Registration - SR Tutors Bureau</title>

                <meta
                    name="description"
                    content="Register as a tutor at SR Tutors Bureau and become part of our expert team. We are looking for passionate and qualified tutors to help students succeed in Delhi NCR. Fill out the registration form to join our network of dedicated educators."
                />

                <meta
                    name="keywords"
                    content="Tutor registration, SR Tutors Bureau, become a tutor, teaching jobs, tutoring services, education, Delhi NCR, tutor network, qualified tutors"
                />

                <link rel="canonical" href="https://www.srtutorsbureau.com/teacher-register?source=home" />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="SR Tutors Bureau" />
                <meta name="publisher" content="SR Tutors Bureau" />
            </Helmet>

            <div className="container-fluid md:py-5">
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
                                            <div className='col-md-12 mt-2 mb-3'>
                                                <button type='button' onClick={fetchLocation} className='btn md:w-100 btn-danger btn-sm'>Get Your Current Location <span className='ml-2'>🌍</span> </button>
                                            </div>
                                            <h6 className=" fw-bold">Permanent Address (*) </h6>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label" htmlFor="streetAddress">Street Address.</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control`}
                                                        name="streetAddress"
                                                        id="streetAddress"
                                                        placeholder="Enter Street Address"
                                                        required
                                                        value={formData.PermanentAddress.streetAddress}
                                                        onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label" htmlFor="Area">Area</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control }`}
                                                        name="Area"
                                                        id="Area"
                                                        placeholder="Enter Area"
                                                        required
                                                        value={formData.PermanentAddress.Area}
                                                        onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label" htmlFor="City">City</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control }`}
                                                        name="City"
                                                        id="City"
                                                        placeholder="Enter City"
                                                        required
                                                        value={formData.PermanentAddress.City}
                                                        onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                                                    />
                                                </div>


                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label" htmlFor="Pincode">Pincode</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control `}
                                                        name="Pincode"
                                                        id="Pincode"
                                                        placeholder="Enter Pincode"
                                                        required
                                                        value={formData.PermanentAddress.Pincode}
                                                        onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                                                    />

                                                </div>
                                                {/* <div className="col-md-12 mb-3">
                                                    <label className="form-label" htmlFor="LandMark">Landmark</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control }`}
                                                        name="LandMark"
                                                        id="LandMark"
                                                        placeholder="Enter Landmark"
                                                        required
                                                        value={formData.PermanentAddress.LandMark}
                                                        onChange={(e) => handleNestedChange(e, 'PermanentAddress')}
                                                    />
                                                </div> */}
                                            </div>


                                            {/* <div className="mb-4">
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

                                                    <Form.Group className="mb">
                                                        <Form.Label className="h5">
                                                            Upload Identity Document
                                                            <small className="text-muted"> Max size up to 10 MB</small>
                                                        </Form.Label>
                                                        <p className="text-muted mb-2">
                                                            [Only .jpg, .jpeg, .png, . files are accepted]
                                                        </p>

                                                        <div className="custom-file">
                                                            <Form.Control
                                                                type="file"
                                                                ref={fileInputRef}
                                                                accept=".jpg, .jpeg, .png"
                                                                onChange={handleIdentityFileChange}
                                                                className="custom-file-input"
                                                                id="identity"
                                                            />
                                                            <label className="custom-file-label" htmlFor="identity">
                                                                Choose file
                                                            </label>
                                                        </div>

                                                    </Form.Group>

                                                </Card>

                                                <Card className="px-4">
                                                    <Form.Label className="h5">
                                                        Upload Qualification Document
                                                        <small className="text-muted"> Max size up to 10 MB</small>
                                                    </Form.Label>
                                                    <p className="text-muted mb-4">[Only .jpg, .jpeg, .png,  files are accepted]</p>

                                                    <Form.Group className="mb-3">
                                                        <Form.Label>
                                                            Upload Your Higher Education Qualification Document

                                                        </Form.Label>
                                                        <div className="custom-file">
                                                            <Form.Control
                                                                type="file"
                                                                ref={qualificationRef}
                                                                accept=".jpg, .jpeg, .png, "
                                                                onChange={handleQualificationFileChange}
                                                                className="custom-file-input"
                                                                id="qualificationFile"
                                                            />
                                                            <label className="custom-file-label" htmlFor="qualificationFile">
                                                                Choose file
                                                            </label>
                                                        </div>

                                                    </Form.Group>
                                                </Card>


                                            </div> */}

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
                                    id="PhoneNumber"
                                    name="PhoneNumber"
                                    value={verifyData.PhoneNumber}
                                    onChange={handleVerifyChange}
                                    required
                                    placeholder="Phone Number"
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
