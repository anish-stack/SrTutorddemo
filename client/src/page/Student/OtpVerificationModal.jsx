import React, { useState } from 'react';
import axios from 'axios';
import { X, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import './OtpVerificationModal.css';

const OtpVerificationModal = ({ isOpen, onClose, phoneNumber, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.srtutorsbureau.com/api/v1/student/Verify-Student',
        { PhoneNumber: phoneNumber, otp }
      );
      onSuccess(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://api.srtutorsbureau.com/api/v1/student/resent-otp',
        { PhoneNumber: phoneNumber }
      );
      setError('OTP resent successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <h2>Verify Your Phone Number</h2>
          <p>Enter the OTP sent to {phoneNumber}</p>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleVerify} className="otp-form">
          <div className="otp-input-group">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="resend-button"
              onClick={handleResendOtp}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Resending...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>Resend OTP</span>
                </>
              )}
            </button>

            <button
              type="submit"
              className="verify-button"
              disabled={loading || !otp}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Verify OTP</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationModal;