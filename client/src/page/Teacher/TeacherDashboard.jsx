import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import axios from 'axios';
import CompleteProfile from './CompleteProfile'
import MyClasses from './MyClasses'
import MyLocations from './MyLocations';
import EditClassModel from './EditClassModel';
import gif from './open-gift.gif'
const TeacherDashboard = () => {
    const locations = window.location.hash

    const [teacherToken, setTeacherToken] = useState(null);
    const [teacherUser, setTeacherUser] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [profileInfo, setProfileInfo] = useState(null);
    const [teacherClass, setClass] = useState(null);
    const [teachingLocations, setTeachingLocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (locations === "") {
            setActiveTab('profile')
        } else if (locations === "#completeProfile") {
            setActiveTab('profile')

        }
        else if (locations === "#showClass") {
            setActiveTab('showClass')

        }
        else if (locations === "#resetLocation") {
            setActiveTab('resetLocation')

        }
        else if (locations === "#editProfile") {
            setActiveTab('editProfile')

        }else if(locations === "#activity"){
            setActiveTab('activity')
        }
    }, [locations])

    // UseEffect to handle token and user details
    useEffect(() => {
        const token = Cookies.get('teacherToken');
        const teacherDetails = Cookies.get('teacherUser');
        if (token && teacherDetails) {
            setTeacherToken(token);
            setTeacherUser(JSON.parse(teacherDetails));
        } else {
            setTeacherToken(false);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (teacherToken && teacherUser) {
            const handleFetch = async () => {
                try {
                    const { data } = await axios.get(`http://localhost:7000/api/v1/teacher/Get-Teacher/${teacherUser._id}`, {
                        headers: {
                            Authorization: `Bearer ${teacherToken}`,
                        },
                    });
                    console.log(data.data)
                    setProfileInfo(data.data);
                    // console.log(data.data.RangeWhichWantToDoClasses);
                    setTeachingLocations(data?.data?.RangeWhichWantToDoClasses || [])
                } catch (error) {
                    console.error("Error fetching teacher data", error);
                }
            };
            handleFetch();
        }
    }, [teacherToken, teacherUser])

    useEffect(() => {
        if (teacherToken && teacherUser) {
            const handleClassFetch = async () => {
                try {
                    const { data } = await axios.get(`http://localhost:7000/api/v1/teacher/Get-My-Classes`, {
                        headers: {
                            Authorization: `Bearer ${teacherToken}`,
                        },
                    });

                    console.log(data)
                    setClass(data.data.classes);

                } catch (error) {
                    console.error("Error fetching teacher data", error);
                }
            };
            handleClassFetch();
        }
    }, [teacherToken, teacherUser]);

    // Redirect to login if no token

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!teacherToken) {
        return (
            <div className="unauthorized">
                <h3>Unauthorized Access</h3>
                <p>Please log in to access this page.</p>
            </div>
        );
    }

    const handleLogout = () => {
        Cookies.remove('teacherToken');
        Cookies.remove('teacherUser');
        window.location.href = "/";
    };

    return (
        <div className='container my-5'>
            <div className='row'>
                <div className='col-md-3'>
                    <ul className="nav flex-column nav-pills">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                href="#profile"
                                onClick={() => setActiveTab('profile')}
                            >
                                Profile
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'completeProfile' ? 'active' : ''}`}
                                href="#completeProfile"
                                onClick={() => setActiveTab('completeProfile')}
                            >
                                Complete Profile
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'showClass' ? 'active' : ''}`}
                                href="#showClass"
                                onClick={() => setActiveTab('showClass')}
                            >
                                Show My Classes
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'resetLocation' ? 'active' : ''}`}
                                href="#resetLocation"
                                onClick={() => setActiveTab('resetLocation')}
                            >
                                Location
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'editProfile' ? 'active' : ''}`}
                                href="#editProfile"
                                onClick={() => setActiveTab('editProfile')}
                            >
                                Edit Profile
                            </a>
                        </li>

                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                                href="#activity"
                                onClick={() => setActiveTab('activity')}
                            >
                                Activity
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='col-md-9'>
                    {activeTab === 'profile' && (
                        <div className="student-back-sides bg-white  position-relative  rounded">
                            <div className="row">
                                <div className="teacher-profile position-relative   ">
                                    <div className="teacher-image ">
                                        <div className='image-div'>
                                            <img
                                                src={teacherUser.gender === 'Female' ? "https://img.freepik.com/free-photo/woman-teaching-classroom_23-2151696438.jpg?t=st=1724232283~exp=1724235883~hmac=d01096c59b0d03a03a6020486c0b7c1823a6e76bf18c2b8fed75fee81449b614&w=360" : 'https://img.freepik.com/free-photo/man-wearing-waistcoat-reading-book_1368-3209.jpg?t=st=1724234252~exp=1724237852~hmac=2e3feea5181e91b45675ac8f9defead4d16f9bab1e8cf54ad4b2051ea2e7bd7b&w=360'}
                                                alt="Teacher Profile"
                                            />
                                        </div>
                                    </div>
                                    <div className="teacher-basic-details">
                                        <h1>{profileInfo?.FullName || 'N/A'}</h1>
                                        <p><strong>Email:</strong> {teacherUser?.Email || 'N/A'}</p>
                                        <p><strong>Phone Number:</strong> {profileInfo?.ContactNumber || 'N/A'}</p>
                                        <p><strong>Age:</strong> {teacherUser?.Age || 'N/A'}</p>
                                        <p><strong>Date of Birth:</strong> {profileInfo?.DOB || 'N/A'}</p>
                                        <p><strong>Gender:</strong> {profileInfo?.Gender || 'N/A'}</p>
                                        <p><strong>Alternate Number:</strong> {profileInfo?.AlternateContact || 'N/A'}</p>
                                        <span onClick={handleLogout} className="logout">
                                            <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
                                        </span>
                                    </div>
                                    {teacherUser.isTeacherVerified && (
                                        <span className="verified-tags">
                                            <i className="fa fa-check-circle"></i> Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>


                    )}
                    {activeTab === 'completeProfile' && (
                        <CompleteProfile title={"Complete "} readable={true} profileInfo={profileInfo} />
                    )}
                    {activeTab === 'showClass' && (
                        <MyClasses Class={teacherClass} />
                    )}
                    {activeTab === 'resetLocation' && (
                        <MyLocations locations={teachingLocations} />
                    )}
                    {activeTab === 'editProfile' && (
                        <CompleteProfile title={"Edit"} readable={false} profileInfo={profileInfo} />
                    )}
                    {activeTab === 'activity' && (
                       <div className="activity-section text-center p-5 rounded shadow-lg bg-white">
            
                       <div className='mb-4'>
                         <img src={gif} alt="Special Feature" className="w-25 img-fluid" />
                       </div>
                       <h3 className="mb-3">Unlock Exclusive Features with <span className='text-center text-danger'>Sr Tutors</span></h3>
                       <p className="mb-4 text-muted">
                         Upgrade to a paid membership to access exclusive features and attract more students.
                       </p>
                       <div className="d-flex justify-content-center">
                         <button
                           onClick={() => navigate('/upgrade')}
                           className="btn btn-primary btn-lg"
                         >
                           Upgrade Now
                         </button>
                       </div>
                     </div>
                     
                    )}
                </div>
            </div >

        </div >
    );
}

export default TeacherDashboard;
