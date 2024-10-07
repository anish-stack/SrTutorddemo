import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const TeacherProfileOtp = () => {
    const [otp, setOtp] = useState('');
    const location = new URLSearchParams(window.location.search);
    const tokenQuery = location.get('token');
    const IdQuery = location.get('encoded');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otploading, setOtpLoading] = useState(false);
    const [otpCount, setotpCount] = useState(0);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const savedOtpCount = localStorage.getItem('otpCount');
        if (savedOtpCount) {
            setotpCount(Number(savedOtpCount));
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer((prevTimer) => prevTimer - 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(
                'https://api.srtutorsbureau.com/api/v1/teacher/Verify-profile-otp',
                { otp },
                {
                    headers: {
                        Authorization: `Bearer ${tokenQuery}`,
                    },
                }
            );
            console.log(res.data);
            toast.success("🎉 Profile verified successfully!");
            setTimeout(() => {
                window.location.href = "/Teacher-dashboard?login=true";
            }, 1200);
        } catch (error) {
            setError('Invalid OTP or verification failed.');
            toast.error("❌ Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setOtpLoading(true);
        setError('');
        
        if (otpCount >= 3) {
            toast.error("You have reached the maximum number of OTP requests.");
            setOtpLoading(false);
          
        }

        try {
            const res = await axios.post(
                'https://api.srtutorsbureau.com/api/v1/teacher/profile-otp',
                { HowManyRequest: otpCount },
                {
                    headers: {
                        Authorization: `Bearer ${tokenQuery}`,
                    },
                }
            );
            console.log(res.data);
            toast.success("🔄 OTP resent successfully!");
            setOtpLoading(false);
            const newOtpCount = otpCount + 1; // Increment the count
            setotpCount(newOtpCount);
            localStorage.setItem('otpCount', newOtpCount); // Save new count to localStorage
            setTimer(120); // Reset timer
        } catch (error) {
            console.log(error);
            setOtpLoading(false);
            setError(error.response?.data?.message || "An error occurred.");
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setOtpLoading(false);
        }
    };
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="text-center mb-3">Verify Your Profile</h3>
                <p className="text-muted text-center">Enter the OTP sent to your Whataspp Number </p>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-2"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
                <div className="text-center link-underline-primary">
                    <a
                        className='link-underline-primary'
                        onClick={handleResend}
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        disabled={timer > 0 || otploading}
                    >
                        {otploading ? 'Please Wait ....' : 'Resend OTP'}
                    </a>
                    {timer > 0 && (
                        <p className="text-muted">You can resend OTP in {timer} seconds</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherProfileOtp;
