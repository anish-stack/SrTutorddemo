import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Toast from 'react-bootstrap/Toast';
import {
    User,
    Phone,
    Mail,
    GraduationCap,
    MapPin,
    Calendar,
    FileText,
    Clock,
    Users,
    Award,
    DollarSign,
    CheckCircle2,
    MailCheck,
    MessageSquare,
    Send
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './details.css';

const StudentDetails = ({ student, teacher }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [showMessage, setShowMessage] = useState(false);
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const [formData, setFormData] = useState({
        request_id: '',
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('https://api.srtutorsbureau.com/api/v1/uni/class-request', formData)
            console.log(data)
            alert('We Will Contact You Soon For This Class Student')
            setShowMessage(false);
        } catch (error) {
            console.log(error)
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/student/SingleAllData/${id}`);
            if (response.data.data) {
                setData(response.data.data);
                setShowToast(true);
                setLocation({
                    lat: response.data.data?.location?.coordinates[1],
                    lng: response.data.data?.location?.coordinates[0],
                });
            }

            setFormData((prev) => ({
                ...prev,
                request_id: id
            }))
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="sd-loader">
                <div className="sd-loader__spinner"></div>
                <p className="sd-loader__text">Loading student details...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="sd-error">
                <div className="sd-error__content">
                    <h4 className="sd-error__title">No Data Found</h4>
                    <p className="sd-error__message">Unable to load student information.</p>
                    <button className="sd-error__button" onClick={() => window.history.back()}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="sd-container">
                <div className="sd-content">
                    {/* Profile Section */}
                    <div className="sd-profile">
                        <div className="sd-profile__image-container">
                            <img
                                src={`https://ui-avatars.com/api/?name=${data.studentInfo.studentName}&size=200&background=random`}
                                alt={data.studentInfo.studentName}
                                className="sd-profile__image"
                            />
                            <span className="sd-profile__status">
                                {data.dealDone ? 'Teacher Assigned' : 'Looking for Teacher'}
                            </span>
                        </div>

                        <div className="sd-profile__details">
                            <h2 className="sd-profile__name">{data.studentInfo.studentName}</h2>

                            <div className="sd-profile__info-grid">
                                <div className="sd-profile__info-item">
                                    <Phone className="sd-profile__icon" />
                                    <div>
                                        <span className="sd-profile__label">Contact</span>
                                        <span className="sd-profile__value">XXXXXXXXXX</span>
                                    </div>
                                </div>

                                <div className="sd-profile__info-item">
                                    <Mail className="sd-profile__icon" />
                                    <div>
                                        <span className="sd-profile__label">Email</span>
                                        <span className="sd-profile__value">{data.studentInfo.emailAddress || 'This information is unavailable.'}</span>
                                    </div>
                                </div>

                                <div className="sd-profile__info-item">
                                    <GraduationCap className="sd-profile__icon" />
                                    <div>
                                        <span className="sd-profile__label">Class</span>
                                        <span className="sd-profile__value">{data.className}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requirements Section */}
                    <div className="sd-requirements">
                        <div className="sd-requirements__card">
                            <h3 className="sd-requirements__title">
                                <FileText className="sd-requirements__icon" />
                                Student Requirements
                            </h3>

                            <div className="sd-requirements__grid">
                                <div className="sd-requirements__item">
                                    <MapPin className="sd-requirements__item-icon" />
                                    <div>
                                        <span className="sd-requirements__label">Location</span>
                                        <span className="sd-requirements__value">
                                            {data.locality || data.currentAddress || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="sd-requirements__item">
                                    <Calendar className="sd-requirements__item-icon" />
                                    <div>
                                        <span className="sd-requirements__label">Start Date</span>
                                        <span className="sd-requirements__value">
                                            {data.startDate || 'Flexible'}
                                        </span>
                                    </div>
                                </div>

                                <div className="sd-requirements__item">
                                    <Clock className="sd-requirements__item-icon" />
                                    <div>
                                        <span className="sd-requirements__label">Sessions</span>
                                        <span className="sd-requirements__value">{data.numberOfSessions}</span>
                                    </div>
                                </div>

                                <div className="sd-requirements__item">
                                    <Users className="sd-requirements__item-icon" />
                                    <div>
                                        <span className="sd-requirements__label">Class Type</span>
                                        <span className="sd-requirements__value">{data.interestedInTypeOfClass}</span>
                                    </div>
                                </div>

                                <div className="sd-requirements__item">
                                    <Award className="sd-requirements__item-icon" />
                                    <div>
                                        <span className="sd-requirements__label">Experience Required</span>
                                        <span className="sd-requirements__value">{data.experienceRequired} years</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sd-requirements__card">
                            <h3 className="sd-requirements__title">
                                <DollarSign className="sd-requirements__icon" />
                                Budget Details
                            </h3>

                            <div className="sd-budget">
                                <div className="sd-budget__range">
                                    <span className="sd-budget__min">₹{data.minBudget}</span>
                                    <span className="sd-budget__max">₹{data.maxBudget}</span>
                                </div>
                                <div className="sd-budget__bar">
                                    <div className="sd-budget__progress"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    {location.lat && location.lng && (
                        <div className="sd-map">
                            <h3 className="sd-map__title">
                                <MapPin className="sd-map__icon" />
                                Location
                            </h3>
                            <div className="sd-map__container">
                                <MapContainer
                                    center={[location.lat, location.lng]}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                    className="sd-map__leaflet"
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    />
                                    <Marker position={[location.lat, location.lng]}>
                                        <Popup>{data.studentInfo.studentName}'s Location</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    )}
                    <div className="sd-fixed-button">
                        <a href='tel:+91 9811382915'>
                            <Phone style={{ fontSize: 18 }} className="text-white mr-2" />
                            <span>Contact Us</span>
                        </a>

                        <a onClick={() => setShowMessage(true)}>
                            <MailCheck style={{ fontSize: 18 }} className="text-white mr-2" />
                            <span>Message</span>
                        </a>
                    </div>


                    {/* Toast Notification */}
                    <Toast
                        show={showToast}
                        onClose={() => setShowToast(false)}
                        delay={5000}
                        autohide
                        className="sd-toast"
                    >
                        <Toast.Header closeButton={false}>
                            <CheckCircle2 className="sd-toast__icon" />
                            <strong className="sd-toast__title">New Student Request</strong>
                            <small>{new Date(data.createdAt).toLocaleDateString()}</small>
                        </Toast.Header>
                        <Toast.Body className="sd-toast__body">
                            New request from {data.studentInfo.studentName}. Review the details and respond.
                        </Toast.Body>
                    </Toast>
                </div>


            </div>
            {showMessage && (

                <div className="sd-modal-overlay">
                    <div className="sd-modal-container">
                        <div className="sd-form-container">

                            <form onSubmit={handleSubmit} className="sd-form">
                                <button className="sd-modal-close" onClick={() => setShowMessage(false)}>X</button>

                                <h2 className="sd-form-title">Get in Touch</h2>

                                <div className="sd-input-group">
                                    <User className="sd-icon" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        className="sd-input"
                                        required
                                    />
                                </div>

                                <div className="sd-input-group">
                                    <Mail className="sd-icon" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        className="sd-input"
                                        required
                                    />
                                </div>

                                <div className="sd-input-group">
                                    <Phone className="sd-icon" size={20} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="sd-input"
                                        required
                                    />
                                </div>

                                <div className="sd-input-group">

                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your Message"
                                        className="sd-textarea"
                                        required
                                    />
                                </div>

                                <button type="submit" className="sd-submit-btn">
                                    <Send size={20} className="sd-submit-icon" />
                                    Send Message
                                </button>
                            </form>

                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default StudentDetails;