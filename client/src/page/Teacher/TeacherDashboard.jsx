import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import './profile.css'
const TeacherDashboard = () => {
    const [teacherToken, setTeacherToken] = useState(null);
    const [teacherUser, setTeacherUser] = useState(null);
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile'); // Default tab
    useEffect(() => {
        const token = Cookies.get('teacherToken');
        if (token) {
            const teacherDetails = Cookies.get('teacherUser');
            setTeacherUser(JSON.parse(teacherDetails));
        }
        setTeacherToken(token || false);
    }, []);

    if (!teacherToken) {
        return (
            <div className="unauthorized">
                <h3>Unauthorized Access</h3>
                <p>Please log in to access this page.</p>
            </div>
        );
    }
    const handleLogout = () => {
        Cookies.remove('teacherToken')
        Cookies.remove('teacherUser');
        window.location.href = "/"
    }

    return (

        <div className='container mx-auto'>
            <div className='row'>
                <div className='col-md-3'>
                    <ul className="mytab" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a
                                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                id="profile-tab"
                                data-bs-toggle="tab"
                                href="#profile"
                                role="tab"
                                aria-controls="profile"
                                aria-selected={activeTab === 'profile'}
                                onClick={() => setActiveTab('profile')}
                            >
                                Profile
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                                id="settings-tab"
                                data-bs-toggle="tab"
                                href="#settings"
                                role="tab"
                                aria-controls="settings"
                                aria-selected={activeTab === 'settings'}
                                onClick={() => setActiveTab('settings')}
                            >
                                Settings
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                                id="activity-tab"
                                data-bs-toggle="tab"
                                href="#activity"
                                role="tab"
                                aria-controls="activity"
                                aria-selected={activeTab === 'activity'}
                                onClick={() => setActiveTab('activity')}
                            >
                                Activity
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='col-md-9'>
                    <div className="student-back-sides bg-white  position-relative  py-4 rounded">
                        <div className="row mt-4">
                            <div className="teacher-profile position-relative   ">
                                <div className="teacher-image ">
                                    <div className='image-div'>
                                        <img
                                            src={teacherUser.gender === 'Female' ? '"https://img.freepik.com/free-photo/woman-teaching-classroom_23-2151696438.jpg?t=st=1724232283~exp=1724235883~hmac=d01096c59b0d03a03a6020486c0b7c1823a6e76bf18c2b8fed75fee81449b614&w=360"' : 'https://img.freepik.com/free-photo/man-wearing-waistcoat-reading-book_1368-3209.jpg?t=st=1724234252~exp=1724237852~hmac=2e3feea5181e91b45675ac8f9defead4d16f9bab1e8cf54ad4b2051ea2e7bd7b&w=360'}
                                            alt="Teacher Profile"
                                        />
                                    </div>
                                </div>
                                <div className="teacher-basic-details">
                                    <h1>{teacherUser?.TeacherName || 'N/A'}</h1>
                                    <p><strong>Email:</strong> {teacherUser?.Email || 'N/A'}</p>
                                    <p><strong>Phone Number:</strong> {teacherUser?.PhoneNumber || 'N/A'}</p>
                                    <p><strong>Age:</strong> {teacherUser?.Age || 'N/A'}</p>
                                    {/* <p><strong>Date of Birth:</strong> {new Date(teacherUser?.DOB).toLocaleDateString() || 'N/A'}</p> */}
                                    <p><strong>Gender:</strong> {teacherUser?.gender || 'N/A'}</p>
                                    <p><strong>Alternate Number:</strong> {teacherUser?.AltNumber || 'N/A'}</p>
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
                </div>
            </div>
        </div>

    );
}

export default TeacherDashboard;
