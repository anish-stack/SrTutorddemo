import axios from 'axios';
import React, { useState } from 'react';
import Cookies from "js-cookie";
import toast from 'react-hot-toast'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
const TeacherRegistration = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        TeacherName: '',
        PhoneNumber: '',
        Email: '',
        Password: '',
        DOB: '',
        Age: '',
        gender: '',
        AltNumber: '',
    });
    const [verifyData, setVerifyData] = useState({
        Email: '',
        otp: ''
    })
    const [modelOpen, setModelOpen] = useState(false)
    const handleClose = () => setModelOpen(false);

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

        if (!isFormValid) {
            toast.error("Please fill all required fields.");
            return;
        }
        setLoading(true)
        try {
            const response = await axios.post('http://localhost:7000/api/v1/teacher/Create-teacher', formData)
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

    const ResendOtp = async () => {
        try {
            const response = await axios.post('http://localhost:7000/api/v1/teacher/resent-otp', verifyData)
            console.log(response.data)
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    const VerifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:7000/api/v1/teacher/Verify-teacher', verifyData)
            // console.log(response.data)
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
            <div className="container py-5">
                <div className="row justify-content-center align-items-center">
                    <div className="col-lg-8 col-xl-10">
                        <div className="card">
                            <div className="row g-0">
                                <div className="col-md-6 d-none d-md-block">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                                        alt="Sample photo"
                                        className="img-fluid rounded-start"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body p-4">
                                        <h3 className="mb-4">
                                            <span
                                                className="svg-icon text-danger"
                                                id="svg-3"
                                                data-svg-icon="assets/img/icons/title_shape.svg"
                                            >
                                                Tutor
                                            </span>{" "}Registration Form</h3>

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
                                            <div className='row'>
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
                                                <div className="mb-3 col-md-6">
                                                    <div className="form-floating">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="altNumber"
                                                            name="AltNumber"
                                                            value={formData.AltNumber}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="Alternate Number"
                                                        />
                                                        <label htmlFor="altNumber">Alternate Number</label>
                                                    </div>
                                                </div>

                                            </div>


                                            <div className="mb-3">
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
                                            <div className='row'>
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


                                            <div className="mb-4">
                                                <label className="form-label">Gender</label>
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



            </div >

            {modelOpen ? (
                <>


                    <Modal show={modelOpen} onHide={handleClose} animation={false}>
                        <Modal.Header closeButton>
                            <Modal.Title><span className='text-danger'>Verification</span> With Otp</Modal.Title>
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
                                    {/* <label htmlFor="Email">Email</label> */}
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
                                        placeholder="otp"
                                    />
                                    <label htmlFor="teacherName">Otp</label>
                                </div>

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button style={{ background: "#111827" }} onClick={ResendOtp}>
                                Re-Send Otp
                            </Button>
                            <Button variant="primary" onClick={VerifyOtp}>
                                Verify Otp
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : null}
        </>
    );
};

export default TeacherRegistration;
