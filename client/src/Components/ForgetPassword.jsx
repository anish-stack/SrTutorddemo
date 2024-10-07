import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';


const ForgetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const WindowLocation = new URLSearchParams(window.location.search);
    const SearchType = WindowLocation.get('type');

    const [formData, setFormData] = useState({
        Email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });

    const [step, setStep] = useState(1); 
    const [isEmailVerified, setIsEmailVerified] = useState(false); 
    const [isOtpResendDisabled, setOtpResendDisabled] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const [timer, setTimer] = useState(120); 

    useEffect(() => {
        let interval;
        if (isOtpResendDisabled) {
            interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(interval);
                        setOtpResendDisabled(false);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOtpResendDisabled]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle email submission (Step 1)
    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        const apiUrl = SearchType === 'teacher'
            ? 'https://api.srtutorsbureau.com/api/v1/teacher/teacher-Password-Change-Request'
            : 'https://api.srtutorsbureau.com/api/v1/student/Student-Password-Change-Request';

        setLoading(true); // Start loading

        try {
            await axios.post(apiUrl, { Email: formData.Email });
            toast.success('OTP sent to your contact number!');
            setStep(2);
            setIsEmailVerified(true); // Mark email as verified
            setOtpResendDisabled(true); // Disable resend OTP for a period
            setTimer(120); // Reset timer to 2 minutes
        } catch (error) {
            toast.error(error.response?.data?.message || 'Please enter a valid email');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Handle OTP and password reset in the same step (Step 2)
    const handleSubmitOtpAndPassword = async (e) => {
        e.preventDefault();

        // OTP validation: must be a 6-digit number
        const otpPattern = /^\d{6}$/;
        if (!otpPattern.test(formData.otp)) {
            toast.error("OTP must be a 6-digit number");
            return;
        }

        // Password validation: length between 6 and 20 characters
        if (formData.password.length < 6 || formData.password.length > 20) {
            toast.error("Password must be between 6 and 20 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        const apiUrl = SearchType === 'teacher'
            ? 'https://api.srtutorsbureau.com/api/v1/teacher/teacher-Password-Verify-Otp'
            : 'https://api.srtutorsbureau.com/api/v1/student/Student-Password-Verify-Otp';

        setLoading(true); // Start loading

        try {
            await axios.post(apiUrl, {
                Email: formData.Email,
                otp: formData.otp,
                newPassword: formData.password
            });
            toast.success('OTP verified and password changed successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP or password reset failed. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Handle OTP Resend
    const handleResendOtp = async () => {
        const apiUrl = SearchType === 'teacher'
            ? 'https://api.srtutorsbureau.com/api/v1/teacher/teacher-Password-resend-otp'
            : 'https://api.srtutorsbureau.com/api/v1/student/Student-Password-resend-Otp';

        setLoading(true); // Start loading

        try {
            await axios.post(apiUrl, { Email: formData.Email });
            toast.success('OTP resent successfully!');
            setOtpResendDisabled(true); // Disable resend OTP button for 2 minutes
            setTimer(120); // Reset timer to 2 minutes
        } catch (error) {
            toast.error('Failed to resend OTP. Please try again later.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="container mx-auto py-5">
            <div className='col-md-6 mx-auto'>
                {step === 1 && (
                    <form onSubmit={handleSubmitEmail} className="border p-4 rounded">
                        <h3 className="text-center mb-4">Forget Password</h3>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="Email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                placeholder="Enter your registered email"
                                required
                            />
                        </div>
                        <button type="submit" className={`btn btn-primary w-100 ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmitOtpAndPassword} className="border p-4 rounded">
                        <h3 className="text-center mb-4">Verify OTP & Reset Password</h3>
                        <div className="mb-3">
                            <label htmlFor="otp" className="form-label">OTP</label>
                            <input
                                type="text"
                                className="form-control"
                                id="otp"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter the OTP sent to your contact number"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">New Password (6-20 characters)</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <p style={{ cursor: 'pointer', fontSize: '20px', margin: 0 }}>
                                        {showPassword ? '👁️‍🗨️' : '👁️'}
                                    </p>
                                </button>

                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <div className="input-group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <p style={{ cursor: 'pointer', fontSize: '20px', margin: 0 }}>
                                        {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                                    </p>
                                </button>

                            </div>
                        </div>
                        <button type="submit" className={`btn btn-primary w-100 ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP & Reset Password'}
                        </button>

                        {/* Resend OTP Button */}
                        <button
                            type="button"
                            className="btn btn-link mt-3"
                            onClick={handleResendOtp}
                            disabled={isOtpResendDisabled}
                        >
                            Resend OTP {isOtpResendDisabled && `(${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')})`}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;
