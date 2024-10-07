import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const MAX_RESEND_ATTEMPTS = 3; // Maximum resend attempts allowed

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
    const [timer, setTimer] = useState(300);
    const [resendCount, setResendCount] = useState(0); // Track resend attempts

    useEffect(() => {
        // Load the number of resend attempts from localStorage on component mount
        const storedResendCount = localStorage.getItem('resendForgetPasswordClickCount');
        setResendCount(Number(storedResendCount) || 0);

        if (resendCount >= MAX_RESEND_ATTEMPTS) {
            setOtpResendDisabled(true);
        }

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
    }, [isOtpResendDisabled, resendCount]);

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
            ? 'http://localhost:7000/api/v1/teacher/teacher-Password-Change-Request'
            : 'http://localhost:7000/api/v1/student/Student-Password-Change-Request';

        setLoading(true); // Start loading

        try {
            await axios.post(apiUrl, { Email: formData.Email });
            toast.success('OTP sent to your Whatsapp  number!');
            setStep(2);
            setIsEmailVerified(true); // Mark email as verified
            setOtpResendDisabled(true); // Disable resend OTP for a period
            setTimer(300); // Reset timer to 2 minutes
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
            ? 'http://localhost:7000/api/v1/teacher/teacher-Password-Verify-Otp'
            : 'http://localhost:7000/api/v1/student/Student-Password-Verify-Otp';

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
        // Check if resend attempts exceeded
        if (resendCount >= MAX_RESEND_ATTEMPTS) {
            toast.error(`You have reached the maximum resend attempts. Please try again later.`);
            return;
        }

        const apiUrl = SearchType === 'teacher'
            ? 'http://localhost:7000/api/v1/teacher/teacher-Password-resend-otp'
            : 'http://localhost:7000/api/v1/student/Student-Password-resend-Otp';

        setLoading(true); // Start loading

        try {
            await axios.post(apiUrl, { Email: formData.Email, howManyHit: resendCount });
            toast.success('OTP resent successfully!');

            // Increment resend attempts and update localStorage
            const updatedResendCount = resendCount + 1;
            setResendCount(updatedResendCount);
            localStorage.setItem('resendForgetPasswordClickCount', updatedResendCount);

            setOtpResendDisabled(true);
            setTimer(300);
        } catch (error) {
            toast.error(error?.response?.data.message);
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
                                placeholder="Enter the OTP sent to your Whatsapp number"

                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">New Password (6-20 characters)</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control py-2"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your new password"

                                />
                                <button
                                    type="button"
                                    className="btn p-1 btn-outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <p style={{ cursor: 'pointer', fontSize: '20px', margin: 0 }}>
                                        {showPassword ? '👁️‍🗨️' : '👁️'}
                                    </p>
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                            <div className="input-group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    className="btn p-1 btn-outline-secondary"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <p style={{ cursor: 'pointer', fontSize: '20px', margin: 0 }}>
                                        {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                                    </p>
                                </button>
                            </div>
                        </div>
                        <button type="submit" className={`btn btn-primary w-100 ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit OTP & Reset Password'}
                        </button>

                        <div className="mt-4 text-center">
                            <button
                                className="btn btn-link"
                                onClick={handleResendOtp}
                                disabled={isOtpResendDisabled || resendCount >= MAX_RESEND_ATTEMPTS}
                            >
                                {isOtpResendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;
