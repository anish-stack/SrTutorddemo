import axios from 'axios';
import React, { useState } from 'react';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import ip from './ip.jpg'
import LoginModal from '../../Components/LoginModel';
const StudentRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        StudentName: '',
        PhoneNumber: '',

        Email: '',
        Password: ''
    });
    const [verifyData, setVerifyData] = useState({
        PhoneNumber: '',
        otp: ''
    });
    const [showModel, setShowModal] = useState(false)
    const [modelOpen, setModelOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = () => setModelOpen(false);
    const loginModelClose = () => setShowModal(false)
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
    const handleVerifyChange = (e) => {
        const { name, value } = e.target;
        setVerifyData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const isFormValid = Object.values(formData).every(value => value.trim() !== '');

        if (!isFormValid) {
            toast.error("Please fill all required fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:7000/api/v1/student/Create-Student', formData);
            toast.success(response.data.message);
            setLoading(false);
            setModelOpen(true);
            setVerifyData(prevData => ({
                ...prevData,
                PhoneNumber: formData.PhoneNumber // Copy phone number to verifyData
            }));
            console.log('Verifying OTP with:', verifyData);
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const resendOtp = async () => {
        setLoading(true);
        console.log('Verifying OTP with:', verifyData);
        try {
            const response = await axios.post('http://localhost:7000/api/v1/student/resent-otp', { PhoneNumber: verifyData.PhoneNumber });
            toast.success(response.data.message);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:7000/api/v1/student/Verify-Student', verifyData);
            toast.success("Student Verified Successfully");
            const { token, user } = response.data;
            console.log(response.data)
            Cookies.set('studentToken', token, { expires: 1 });
            Cookies.set('studentUser', JSON.stringify(user), { expires: 1 });
            window.location.href = "/"
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    if (loading) {
        return <div className='loader-screen'><div className="lds-ripple"><div></div><div></div></div></div>
    }

    return (
        <>
            <div className="container-fluid vh-100 d-flex flex-column justify-content-center">
                <div className="row justify-content-center align-items-center flex-grow-1">
                    <div className="col-lg-8 col-xl-10">
                        <div className="card ">
                            <div className="row g-0">
                                <div className="col-md-6 d-none d-md-block">
                                    <img
                                        src={ip}
                                        alt="Sample"
                                        className="img-fluid "
                                    />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body p-4">
                                        <h3 className="mb-4">
                                            <span className="svg-icon text-danger" id="svg-3">
                                                Student
                                            </span> Registration Form
                                        </h3>

                                        <form onSubmit={handleRegister}>
                                            <div className="mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="StudentName"
                                                        name="StudentName"
                                                        value={formData.StudentName}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Full Name"
                                                    />
                                                    <label htmlFor="StudentName">Full Name</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="mb-3 col-md-12">
                                                    <div className="form-floating">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="PhoneNumber"
                                                            name="PhoneNumber"
                                                            value={formData.PhoneNumber}
                                                            onChange={handleChange}
                                                            required
                                                            placeholder="Phone Number"
                                                        />
                                                        <label htmlFor="PhoneNumber">Phone Number</label>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="Email"
                                                        name="Email"
                                                        value={formData.Email}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Email"
                                                    />
                                                    <label htmlFor="Email">Email</label>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="Password"
                                                        name="Password"
                                                        value={formData.Password}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Password"
                                                    />
                                                    <label htmlFor="Password">Password</label>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end mt-5">
                                                <button type="submit" className="btn w-100 btn-primary">Submit</button>
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
                        <Modal.Title><span className='text-danger'>Verification</span> With OTP</Modal.Title>
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
                                    placeholder="PhoneNumber"
                                />
                                <label htmlFor="PhoneNumber">Phone Number</label>
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
                                <label htmlFor="otp">OTP</label>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ background: "#111827" }} onClick={resendOtp}>
                            Re-Send OTP
                        </Button>
                        <Button variant="primary" onClick={verifyOtp}>
                            Verify OTP
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            <LoginModal isOpen={showModel} onClose={handleClose} modalType={"student"} />

        </>
    );
};

export default StudentRegistration;
