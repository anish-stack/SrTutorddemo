import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Subject: '',
    Message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post(
        'https://api.srtutorsbureau.com/api/v1/uni/create-contact',
        formData
      );

      if (response.data.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully.'
        });
        setFormData({
          Name: '',
          Email: '',
          Phone: '',
          Subject: '',
          Message: ''
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Sorry, something went wrong. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <h3 className="contact-form-title">Get in Touch</h3>
      <p className="contact-form-subtitle">Have questions? We'd love to hear from you.</p>

      {status.message && (
        <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            placeholder="Your Phone"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="Subject"
            value={formData.Subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <textarea
            name="Message"
            value={formData.Message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            className="form-control"
            rows="4"
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;