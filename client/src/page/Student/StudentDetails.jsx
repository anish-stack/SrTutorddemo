import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import leaflet CSS
import L from 'leaflet';
import Toast from 'react-bootstrap/Toast';
import LoginModal from '../../Components/LoginModel';
import Loader from '../../Components/Loader';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const StudentDetails = ({ student, teacher }) => {

    // console.log(student)
    // console.log(teacher)

    const isBlurred = !teacher;
    const [showLoginModel, setShowLoginModel] = useState(false)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [location, setLocation] = useState({
        lat: null,
        lng: null,
    });

    const FetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:7000/api/v1/student/SingleAllData/${id}`);
            console.log(data.data);
            if (data.data) {
                setData(data.data);
                setShowToast(true); // Show toast when data is fetched
                setLocation({
                    lat: data?.data?.location?.coordinates[1], // Leaflet uses [lat, lng]
                    lng: data?.data?.location?.coordinates[0],
                });

            } else {
                setData(null);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowLoginModel(false)
    }
    useEffect(() => {
        if (!teacher) {
            setShowLoginModel(true)

        } else {
            setShowLoginModel(false)
        }

        FetchData();
    }, [id, student, teacher]);

    return (
        <div className='detail-container'>
            {loading ? (
                <Loader/>
            ) : data ? (
                <div>
                <div className={`container mx-auto mt-4 pt-5 ${isBlurred ? 'blurThis' : ''}`}
                    style={isBlurred ? { filter: 'blur(15px)', pointerEvents: 'none' } : {}}>
                    <div className='row shadow-sm position-relative mt-5 mb-5'>
                        <div className='col-lg-4 px-4 py-3'>
                            <div className='image-details d-flex align-item-center justify-content-center'>
                                <img src={`https://ui-avatars.com/api/?name=${data?.studentInfo?.studentName}`} className='w-50 img-fluid rounded-circle' alt="" />
                            </div>
                        </div>
                        <div className='col-lg-8 mt-4 px-4 py-3'>
                            <div className='container-fluid'>
                                <ul className='list-unstyled'>
                                    <li className='l'><strong>Name Of Student: </strong>{data?.studentInfo?.studentName}</li>
                                    <li className='l'><strong>Contact Of Student: </strong>{data?.studentInfo?.contactNumber}</li>
                                    <li className='l'><strong>Email: </strong>{data?.studentInfo?.emailAddress}</li>
                                    <li className='l'><strong>Student Class: </strong>{data?.className}</li>
                                </ul>
                            </div>
                        </div>
                        <div className='tag-details'>
                            <span>{new Date(data?.createdAt).toLocaleDateString('es-us') || "N/A"}</span>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-lg-6 col-md-6 mb-4">
                            <ul className="list-unstyled">
                                <li className="mb-3 l">
                                    <strong className="text-secondary">Student's Locality: </strong>
                                    <span className="text-dark">{data?.locality || data?.currentAddress || 'N/A'}</span>
                                </li>
                                <li className="mb-3 l">
                                    <strong className="text-secondary">Student Wants Classes From: </strong>
                                    <span className="text-dark">{data?.startDate || 'N/A'}</span>
                                </li>
                                <li className="mb-2"><strong className="text-secondary">Requirement: </strong></li>
                                <div className="mb-3">
                                    <textarea className="form-control w-100" rows="4" value={data?.specificRequirement || ''} readOnly></textarea>
                                </div>
                                <li className="mb-3 l">
                                    <strong className="text-secondary">Student Waiting For You: </strong>
                                    <span className="text-dark">{data?.dealDone ? 'Studnet Got a Teacher' : 'Studnet Waiting For Your Request'}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            
 
                            {/* <div className="mb-4">
   
                            <div className="mb-4">
   
                                <label htmlFor="disabledRangeMin" className="form-label">
                                    Minimum Budget: {data?.minBudget || 'N/A'}
                                </label>
                                <input type="range" className="form-range" readOnly min="0" max={data?.minBudget + 100} value={data?.minBudget} />
 
                            </div> */}
   
                            </div>
   
                            <div>
                            <h3 className="text-danger mb-4">Budget Of Student</h3>
                                <label htmlFor="disabledRangeMax" className="form-label">
                                    Maximum Budget: {data?.maxBudget || 'N/A'}
                                </label>

                                <input type="range" className="form-range" readOnly min="0" max={data?.maxBudget + 100} value={data?.maxBudget} />
                            </div>
                        </div>
                 </div>
                    <div className='row w-75 mx-auto border py-4 mb-4'>
                        <div className='col-md-5 mb-5'>
                            {location.lat && location.lng ? (
                                <MapContainer
                                    center={[location.lat, location.lng]}
                                    zoom={13}

                                    scrollWheelZoom={false}
                                    style={{ height: '350px', zIndex: 9 }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[location.lat, location.lng]}>
                                        <Popup>
                                            {data?.studentInfo?.studentName}'s Location
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className='d-flex justify-content-center align-items-center' style={{ height: '250px' }}>
                                    <span>Loading Map...</span>
                                </div>
                            )}
                        </div>
                        <div className='col-md-7'>
                            <ul className="list-unstyled custom-list">
                                <li className='mb-3 l'>
                                    <i className='bi bi-check-circle custom-check-icon'></i>
                                    <strong className='ms-2'>Interested In Type Of Class: </strong>
                                    {data?.interestedInTypeOfClass}
                                </li>
                                <li className='mb-3 l'>
                                    <i className='bi bi-check-circle custom-check-icon'></i>
                                    <strong className='ms-2'>Teacher Gender Preference: </strong>
                                    {data?.teacherGenderPreference}
                                </li>
                                <li className='mb-3 l'>
                                    <i className='bi bi-check-circle custom-check-icon'></i>
                                    <strong className='ms-2'>Number Of Sessions: </strong>
                                    {data?.numberOfSessions}
                                </li>
                                <li className='mb-3 l'>
                                    <i className='bi bi-check-circle custom-check-icon'></i>
                                    <strong className='ms-2'>Experience Required: </strong>
                                    {data?.experienceRequired}
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            ) : (
                <div className="container lert alert-danger text-center my-5">
                    <i className="bi bi-x-circle me-3" style={{ fontSize: '3rem' }}></i>
                    <div className="alert alert-danger d-flex align-items-center justify-content-center" role="alert" style={{ height: '200px' }}>
                        <div>
                            <h4 className="alert-heading">Oops!</h4>
                            <p className="mb-0">It looks like we couldn't find any data. Please try again later or go back to the previous page.</p>
                        </div>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={() => window.history.back()}>
                        Go Back
                    </button>
                </div>


            )}

            {/* Toast Notification */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={5000}
                autohide
                style={{ zIndex: 999 }}
                className="position-fixed bg-danger bottom-0 end-0 m-3"
            >
                <Toast.Header closeButton={false}>
                    <img src={`https://ui-avatars.com/api/?name=${data?.studentInfo?.studentName}`} className="rounded me-2" alt="..." />
                    <strong className="me-auto">{data?.className}</strong>
                    <small>{new Date(data?.createdAt).toLocaleDateString()}</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </Toast.Header>
                <Toast.Body className='text-white'> Hello, Please check this student's details and respond to them.</Toast.Body>
            </Toast>


            <LoginModal
                isOpen={showLoginModel}
                modalType={'teacher'}
                onClose={handleClose}
            />

        </div>
    );
};

export default StudentDetails;
