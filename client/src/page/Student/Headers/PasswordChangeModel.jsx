import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const PasswordChangeModel = ({ isOpen, onClose, Type }) => {
    const [formData, setFormData] = useState({
        Password: '',
        ConfirmPassword: '',
        StudentName: '',
        Email: '',
        PhoneNumber: ''
    });

    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const token = Cookies.get('studentToken') || false;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev); // Toggle the visibility state
    };

    const ChangePassword = async () => {
        if (Type === "Password") {
            if (!formData.Password || !formData.ConfirmPassword) {
                toast.error("Please fill in both password fields.");
                return;
            }
    
            // Check if the passwords match
            if (formData.Password !== formData.ConfirmPassword) {
                toast.error("The passwords you entered do not match. Please try again.");
                return;
            }

            try {
                const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/update-details', {
                    Password: formData.Password
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log(response.data);
                toast.success("Password changed successfully,Please re-login");

                Cookies.remove('studentToken')
                Cookies.remove('studentUser')
                window.location.href = '/';
                setFormData({
                    Password: '',
                    ConfirmPassword: '',
                    StudentName: '',
                    Email: '',
                    PhoneNumber: ''
                });
                
                onClose();
            } catch (error) {
                toast.error("Error changing password. Please try again.");
            }
        } else {

            try {
              
                if (!formData.StudentName && !formData.Email && !formData.PhoneNumber) {
                    toast.error("Please fill in at least one field.");
                    return;
                }
                const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/update-details', {
                    StudentName: formData.StudentName,
                    Email: formData.Email,
                    PhoneNumber: formData.PhoneNumber
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                toast.success("Details updated successfully, Please Login Now");
                Cookies.remove('studentToken')
                Cookies.remove('studentUser')
                setFormData({
                    Password: '',
                    ConfirmPassword: '',
                    StudentName: '',
                    Email: '',
                    PhoneNumber: ''
                });
                
                window.location.href = '/';

                onClose();
            } catch (error) {
                toast.error("Error updating details. Please try again.");
            }
        }
    };

    return (
        <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{Type === "Password" ? "Change Password" : "Update Details"}</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    {Type === "Password" ? (
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="Password">New Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            id="Password"
                                            name="Password"
                                            value={formData.Password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="input-group-append">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ConfirmPassword">Confirm Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            id="ConfirmPassword"
                                            name="ConfirmPassword"
                                            value={formData.ConfirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="input-group-append">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="StudentName">Name</label>
                                    <input
                                        type='text'
                                        className="form-control"
                                        id="StudentName"
                                        name="StudentName"
                                        value={formData.StudentName}
                                        onChange={handleChange}

                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Email">Email</label>
                                    <input
                                        type='email'
                                        className="form-control"
                                        id="Email"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleChange}

                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="PhoneNumber">Contact Number</label>
                                    <input
                                        type='text'
                                        className="form-control"
                                        id="PhoneNumber"
                                        name="PhoneNumber"
                                        value={formData.PhoneNumber}
                                        onChange={handleChange}

                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={ChangePassword}>
                            {Type === "Password" ? "Change Password" : "Update Details"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeModel;
