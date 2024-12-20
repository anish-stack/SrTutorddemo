import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import axios from 'axios';
import CompleteProfile from './CompleteProfile'
import MyClasses from './MyClasses'

import ImageUploader from 'react-image-upload'
import 'react-image-upload/dist/index.css'
import gif from './open-gift.gif'
import toast from 'react-hot-toast';
import StudentRequest from './StudentRequest';
import AcceptRequetsByYou from './AcceptRequest';
import SubscribedStudent from './SubscribedStudent';
import Upload from './Uplaod';
import ModelPop from './Model.Pop';
const TeacherDashboard = () => {
    const locations = window.location.hash
    const [teacherToken, setTeacherToken] = useState(null);
    const [teacherUser, setTeacherUser] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [profileInfo, setProfileInfo] = useState(null);
    const [teacherClass, setClass] = useState(null);
    const [teachingLocations, setTeachingLocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileFile, setProfileFile] = useState({})
    const navigate = useNavigate();
    const [showUploader, setShowUploader] = useState(false);

    useEffect(() => {
        console.log("i am hit at 1st")
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
                    const { data } = await axios.get(`https://api.srtutorsbureau.com/api/v1/teacher/Get-Teacher/${teacherUser._id}`, {
                        headers: {
                            Authorization: `Bearer ${teacherToken}`,
                        },
                    });


                    setProfileInfo(data.data);

                    const createdDate = new Date(data?.data?.createAt);
                    const referenceDate = new Date("2024-10-24");
                    if (createdDate < referenceDate) {
                        setTeachingLocations(data?.data?.RangeWhichWantToDoClasses || []);
                    } else {
                        setTeachingLocations(data?.data?.TeachingLocation || []);
                    }
                    console.log("i am good", teachingLocations)

                } catch (error) {
                    console.error("Error fetching teacher data", error);

                }

            };
            handleFetch();
        }
    }, [teacherToken, teacherUser])
    const handleDoubleClick = () => {
        setShowUploader(true);
    };
    const handleUploadProfilePic = async () => {
        const fileViaUpload = profileFile.file;
        const formData = new FormData();
        formData.append('image', fileViaUpload);
        console.log(profileInfo)
        setLoading(true)
        try {
            const response = await axios.post(
                `https://api.srtutorsbureau.com/api/v1/teacher/teacher-profile-pic/${profileInfo.TeacherUserId?._id}`,
                formData, // Send formData directly here
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log(response.data);
            setLoading(false)

            toast.success("Profile Pic Uploaded Successfully");
            setTimeout((
                window.location.reload()
            ), 700)
        } catch (error) {
            console.error(error);
            setLoading(false)

        } finally {
            setLoading(false)

        }
    };

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

        } else if (locations === "#Document") {
            setActiveTab('Document')
        }
        else if (locations === "#editProfile") {
            setActiveTab('editProfile')

        } else if (locations === "#activity") {
            setActiveTab('activity')
        }
    }, [locations])



    useEffect(() => {
        if (teacherToken && teacherUser) {
            const handleClassFetch = async () => {
                try {
                    const { data } = await axios.get(`https://api.srtutorsbureau.com/api/v1/teacher/Get-My-Classes`, {
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
    function getImageFileObject(imageFile) {
        const file = imageFile
        if (file) {

            setProfileFile(file)
        } else {
            toast.error("Please Upload image")
        }
    }

    function runAfterImageDelete(file) {
        console.log({ file })
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

        <>
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
                                    className={`nav-link ${activeTab === 'Subscribed' ? 'active' : ''}`}
                                    href="#Subscribed"
                                    onClick={() => setActiveTab('Subscribed')}
                                >
                                    Subscribed Students
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'Document' ? 'active' : ''}`}
                                    href="#Document"
                                    onClick={() => setActiveTab('Document')}
                                >
                                    Documents
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'Request' ? 'active' : ''}`}
                                    href="#Request"
                                    onClick={() => setActiveTab('Request')}
                                >
                                    Request For You
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'accepted' ? 'active' : ''}`}
                                    href="#Request"
                                    onClick={() => setActiveTab('accepted')}
                                >
                                    Accepted Request
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
                                            <div className="image-div">
                                                {profileInfo?.ProfilePic && !showUploader ? (
                                                    <>
                                                        <img
                                                            src={profileInfo?.ProfilePic?.url}
                                                            alt="Teacher Profile"
                                                            style={{ height: 200, width: 200, borderRadius: '50%', objectFit: 'cover' }}
                                                            onDoubleClick={handleDoubleClick} // Trigger uploader on double-click
                                                        />
                                                        <p style={{ fontSize: 12 }}>*For Update Image Double Click Your Image</p>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column align-items-center justify-content-center text-center">
                                                        <ImageUploader
                                                            style={{ height: 200, width: 200, borderRadius: '60%' }} // Custom styles for the image uploader
                                                            onFileAdded={(img) => getImageFileObject(img)}
                                                            onFileRemoved={(img) => runAfterImageDelete(img)}
                                                            className="mb-2" // Adding margin-bottom for spacing
                                                        />
                                                        <p className="mb-0">Upload Your Original Picture</p> {/* Remove margin for paragraph to keep it compact */}
                                                    </div>

                                                )}

                                                <div>
                                                    {Object.keys(profileFile).length === 0 ? null : (
                                                        <button
                                                            disabled={loading}
                                                            onClick={handleUploadProfilePic}
                                                            className="btn-upload"
                                                        >
                                                            {loading ? (
                                                                <>
                                                                    Please Wait...

                                                                </>
                                                            ) : (
                                                                'Upload Profile Picture'
                                                            )}
                                                        </button>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                        <div className="teacher-basic-details">
                                            <h1>{profileInfo?.FullName || 'N/A'}</h1>
                                            <p><strong>Email:</strong> {teacherUser?.Email || 'N/A'}</p>
                                            <p><strong>Phone Number:</strong> {profileInfo?.ContactNumber || 'N/A'}</p>

                                            <p><strong>Date of Birth:</strong> {profileInfo?.DOB || 'N/A'}</p>
                                            <p><strong>Gender:</strong> {profileInfo?.Gender || 'N/A'}</p>

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
                            <MyClasses Profile={profileInfo} Class={teacherClass} />
                        )}
                        {activeTab === 'Document' && (
                            <Upload teacherId={profileInfo} />
                        )}

                        {activeTab === 'editProfile' && (
                            <CompleteProfile title={"Edit"} readable={false} profileInfo={profileInfo} />
                        )}
                        {activeTab === 'Request' && (
                            <StudentRequest id={profileInfo?._id} />
                        )}
                        {activeTab === 'accepted' && (
                            <AcceptRequetsByYou id={profileInfo?._id} />
                        )}

                        {activeTab === 'Subscribed' && (
                            <SubscribedStudent id={profileInfo?._id} />
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

            </div>
            {profileInfo?.TeacherUserId?.QualificationDocument?.QualificationImageUrl ? null : <ModelPop />}

        </>

    );
}

export default TeacherDashboard;
