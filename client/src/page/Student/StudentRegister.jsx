import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { User, Phone, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import OtpVerificationModal from './OtpVerificationModal';
import './StudentRegistration.css';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    StudentName: '',
    PhoneNumber: '',
    Email: '',
    Password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.StudentName.trim()) {
      newErrors.StudentName = 'Name is required';
    }

    if (!formData.PhoneNumber.trim()) {
      newErrors.PhoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.PhoneNumber)) {
      newErrors.PhoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.Email.trim()) {
      newErrors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'Please enter a valid email address';
    }

    if (!formData.Password) {
      newErrors.Password = 'Password is required';
    } else if (formData.Password.length < 6) {
      newErrors.Password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.srtutorsbureau.com/api/v1/student/Create-Student',
        formData
      );
      setShowOtpModal(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (userData) => {
    const { token, user } = userData;
    Cookies.set('studentToken', token, { expires: 1 });
    Cookies.set('studentUser', JSON.stringify(user), { expires: 1 });
    window.location.href = '/';
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-image">
          <div className="overlay"></div>
          <div className="image-content">
            <h2>Welcome to SR Tutors Bureau</h2>
            <p>Join our community of learners and get access to the best tutors.</p>
          </div>
        </div>

        <div className="registration-form-container">
          <div className="form-header">
            <h1>Student Registration</h1>
            <p>Create your account to get started</p>
          </div>

          {errors.submit && (
            <div className="alert alert-danger">{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <div className="input-group">
                <span className="input-icon">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  name="StudentName"
                  value={formData.StudentName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={errors.StudentName ? 'error' : ''}
                />
              </div>
              {errors.StudentName && <span className="error-message">{errors.StudentName}</span>}
            </div>

            <div className="form-group">
              <div className="input-group">
                <span className="input-icon">
                  <Phone size={20} />
                </span>
                <input
                  type="tel"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={errors.PhoneNumber ? 'error' : ''}
                />
              </div>
              {errors.PhoneNumber && <span className="error-message">{errors.PhoneNumber}</span>}
            </div>

            <div className="form-group">
              <div className="input-group">
                <span className="input-icon">
                  <Mail size={20} />
                </span>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={errors.Email ? 'error' : ''}
                />
              </div>
              {errors.Email && <span className="error-message">{errors.Email}</span>}
            </div>

            <div className="form-group">
              <div className="input-group">
                <span className="input-icon">
                  <Lock size={20} />
                </span>
                <input
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={errors.Password ? 'error' : ''}
                />
              </div>
              {errors.Password && <span className="error-message">{errors.Password}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  <span>Register</span>
                </>
              )}
            </button>

            {/* <div className="form-footer">
              Already have an account?{' '}
              <a href="/login" className="login-link">
                Login here
              </a>
            </div> */}
          </form>
        </div>
      </div>

      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        phoneNumber={formData.PhoneNumber}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
};

export default StudentRegistration;