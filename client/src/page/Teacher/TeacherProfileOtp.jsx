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

    const [timer, setTimer] = useState(0);

    // Timer countdown for OTP resend
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
                { otp }, // OTP should be sent as an object
                {
                    headers: {
                        Authorization: `Bearer ${tokenQuery}`,
                    },
                }
            );
            console.log(res.data);
            toast.success("🎉 Profile verified successfully!");
            setTimeout(() => {
                window.location.href="/Teacher-dashboard?login=true"
            }, 1200);
        } catch (error) {
            setError('Invalid OTP or verification failed.');
            toast.error("❌ Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return; // Prevent resending if the timer is still active
        setOtpLoading(true);
        setError('');
        try {
            const res = await axios.post(
                'https://api.srtutorsbureau.com/api/v1/teacher/profile-otp',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${tokenQuery}`,
                    },
                }
            );
            console.log(res.data);
            toast.success("🔄 OTP resent successfully!");
            setOtpLoading(false)
            setTimer(120); // Reset timer
        } catch (error) {
            console.log(error)
            setOtpLoading(false)
            setError(error.response.data.message);
            toast.error(error.response.data.message);
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
