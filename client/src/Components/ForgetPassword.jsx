import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        contactNumber: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });

    const [step, setStep] = useState(1); // Step 1: Enter Contact, Step 2: Enter OTP, Step 3: Enter Password

    const [isContactVerified, setIsContactVerified] = useState(false); // Track if contact is verified
    const [isOtpVerified, setIsOtpVerified] = useState(false); // Track if OTP is verified

    // Parse the step from the query parameter if it exists
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const stepFromQuery = queryParams.get('step');
        const parsedStep = parseInt(stepFromQuery);

      
        if (parsedStep) {
            if (parsedStep === 2 && !isContactVerified) {
                // User cannot access OTP step without verifying contact
                setStep(1);
                updateQueryParams(1);
                toast.error('Please verify your contact number first.');
            } else if (parsedStep === 3 && (!isContactVerified || !isOtpVerified)) {
                // User cannot access password reset without verifying OTP
                setStep(isContactVerified ? 2 : 1);
                updateQueryParams(isContactVerified ? 2 : 1);
                toast.error('Please complete the previous steps.');
            } else {
                setStep(parsedStep);
            }
        }
    }, [location.search, isContactVerified, isOtpVerified]);

    // Update the query parameter whenever the step changes
    const updateQueryParams = (stepValue) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('step', stepValue);
        navigate(`?${queryParams.toString()}`, { replace: true });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitContact = (e) => {
        e.preventDefault();
        if (formData.contactNumber) {
         
            setIsContactVerified(true); // Mark contact as verified
            console.log(isContactVerified)
            toast.success('OTP sent to your contact number!');
            setStep(2);
            updateQueryParams(2);
        } else {
            toast.error('Please enter a valid contact number');
        }
    };

    const handleSubmitOtp = (e) => {
        e.preventDefault();
        if (formData.otp) {
            // Simulate OTP verification and move to step 3
            setIsOtpVerified(true); // Mark OTP as verified
            toast.success('OTP verified successfully!');
            setStep(3);
            updateQueryParams(3);
        } else {
            toast.error('Please enter the OTP');
        }
    };

    const handleSubmitPassword = (e) => {
        e.preventDefault();
        if (formData.password && formData.password === formData.confirmPassword) {
            // Simulate password reset
            toast.success('Password reset successful!');
            // Reset form or redirect to login page
            setStep(1);
            updateQueryParams(1); // Reset the step in query params
        } else {
            toast.error('Passwords do not match or fields are empty');
        }
    };


    return (
        <div className="container mx-auto py-5">

        <div className='col-md-6 mx-auto'>

            {step === 1 && (
                <form onSubmit={handleSubmitContact} className="border p-4 rounded">
                    <h3 className="text-center mb-4">Forget Password</h3>
                    <div className="mb-3">
                        <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="Enter your contact number"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Send OTP</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmitOtp} className="border p-4 rounded">
                    <h3 className="text-center mb-4">Verify OTP</h3>
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
                    <button type="submit" className="btn btn-primary w-100">Verify OTP</button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleSubmitPassword} className="border p-4 rounded">
                    <h3 className="text-center mb-4">Reset Password</h3>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your new password"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your new password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                </form>
            )}
        </div>
        </div>
    );
};

export default ForgetPassword;
