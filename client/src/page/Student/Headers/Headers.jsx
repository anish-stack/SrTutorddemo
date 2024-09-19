import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import './Student.css'
import Cookies from "js-cookie";
import axios from "axios";
import { Pagination } from 'react-bootstrap';
import { useLocation } from "react-router-dom";
const Headers = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation()
    const path = location.hash
    const [hashPath, sethashPath] = useState("#Home")
    const [studentToken, setStudentToken] = useState(null);
    const [studentDetails, setStudentDetails] = useState(null);
    const [activeTab, setActiveTab] = useState("Home");
    const [post, setPost] = useState([]);
    const [subscribed, setSubscribed] = useState([]);
    const [subscribedPage, setSubscribedPage] = useState(1);
    const [subscribedPerPage] = useState(5); // Number of subscribed teachers per page
    const [totalSubscribed, setTotalSubscribed] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5); // Number of posts per page
    const [totalPosts, setTotalPosts] = useState(0);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const student = Cookies.get("studentToken");
        setStudentToken(student || null);

        if (student) {
            const details = JSON.parse(Cookies.get("studentUser"));
            setStudentDetails(details);
            MyPost();
            MySubscribed()
        }
    }, [studentToken, currentPage]);

    useEffect(() => {
        if (path === "#Home") {
            setActiveTab('Home')
        } else if (path === "#Post") {
            setActiveTab('Post')
        } else if (path === "#Profile") {
            setActiveTab('Profile')
        } else if (path === "#Reviews") {
            setActiveTab('Reviews')
        } else if (path === "#Share") {
            setActiveTab('Share')
        } else if (path === "#teacher") {
            setActiveTab('teacher')
        } else if (path === "#Help") {
            setActiveTab('Help')
        } else {
            setActiveTab('Home')
        }
    }, [location.hash])


    const MyPost = async () => {
        try {
            const { data } = await axios.get('https://api.srtutorsbureau.com/api/v1/student/Get-My-Post', {
                headers: {
                    Authorization: `Bearer ${studentToken}`
                },
                params: {
                    page: currentPage,
                    limit: postsPerPage
                }
            });

            setPost(data.data);
            console.log(data.data)
            setTotalPosts(data.data.length);
        } catch (error) {
            console.log(error);
            setPost([]);
        }
    };

    const MySubscribed = async () => {
        try {
            const { data } = await axios.get('https://api.srtutorsbureau.com/api/v1/student/Get-My-Subscribed-Teacher', {
                headers: {
                    Authorization: `Bearer ${studentToken}`
                }
            });
            console.log(data.data)
            setSubscribed(data.data)

        } catch (error) {
            console.log(error);

        }
    };

    const handleLogout = () => {
        Cookies.remove('StudentUser');
        Cookies.remove('studentToken');

        window.location.href = "/"

    };

    // Pagination logic
    const indexOfLastTeacher = subscribedPage * subscribedPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - subscribedPerPage;
    const currentTeachers = subscribed?.slice(indexOfFirstTeacher, indexOfLastTeacher);

    const handleTeacherPageChange = (pageNumber) => {
        setSubscribedPage(pageNumber);
    };


    const subscribedTeachers = 15;
    const friendsCount = 30;
    const specialOffers = 5;
    const reviewsCount = 75;

    const reviews = [
        {
            id: 1,
            reviewer: 'John Doe',
            rating: 5,
            comment: 'Absolutely fantastic tutor! Their expertise in Biology is unparalleled. Highly recommended! 🌟',
        },
        {
            id: 2,
            reviewer: 'Jane Smith',
            rating: 4,
            comment: 'Great experience overall. The tutor was very knowledgeable and engaging. 👏',
        },
        {
            id: 3,
            reviewer: 'Alice Johnson',
            rating: 5,
            comment: 'A wonderful learning experience. The tutor made complex topics easy to understand. 🚀',
        },
        {
            id: 4,
            reviewer: 'Bob Brown',
            rating: 4,
            comment: 'Very good tutor with clear explanations. A bit more interaction would be appreciated. 👍',
        }
    ];


    const handleEditProfile = () => {
    };
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        MyPost();
    };
    return (
        <>
            {studentToken && studentDetails ? (
                <div className="w-100">
                    <div className="row h-100">
                        {/* Header with Logo and Toggle Button */}
                        <div className="d-flex  position-fixed  py-2 align-items-start justify-content-between bg-smoke w-100" style={{ height: 70 }}>
                            <h4 className="text-black  navbar-brand  px-12 m-0"><img src="https://srtutors.hoverbusinessservices.com/assets/img/logo/srtutor.webp" width="95" height="52" className="img-fluid  navbar-brand" alt="" /></h4>
                            <div className=" d-md-block mt-2 border-none text-center px-12     d-none">
                                <a href="#" className="align-items-center text-black text-decoration-none " aria-expanded="false">
                                    <img src={studentDetails?.profilePic} alt="" width="32" height="32" className="rounded-circle me-2" />

                                </a><br />
                                <strong>

                                    {studentDetails?.StudentName} </strong>
                            </div>
                            <button className="btn btn-dark mt-2 border-none  px-12 d-md-none" onClick={toggleSidebar}>
                                <i className="fas fa-bars"></i>
                            </button>
                        </div>

                        {/* Sidebar */}
                        <nav
                            className={`col-md-3 border-none position-fixed col-lg-2 bg-smoke text-black sidebar ${isOpen ? 'position-fixed' : ''} d-md-block ${isOpen ? 'show' : 'collapse'}`}
                            style={{ height: isOpen ? '100dvh' : '94dvh', top: isOpen ? '70px' : '100px', transition: 'all 0.3s', borderRight: '1px solid ', zIndex: isOpen ? '1050' : '0' }}
                        >
                            <div className="position-sticky pt-3 px-4">


                                <ul className="nav flex-column mb-auto">
                                    <li style={{ lineHeight: '2' }} className="nav-item">
                                        <a href="#Home" onClick={() => setActiveTab('Home')} className="nav-link active text-black">
                                            <i className="fas fa-home me-2"></i>
                                            Home
                                        </a>
                                    </li>
                                    <li style={{ lineHeight: '2' }}>
                                        <a href="#Post" onClick={() => setActiveTab('Post')} className="nav-link text-black">
                                            <i className="fas fa-tachometer-alt me-2"></i>
                                            Post
                                        </a>
                                    </li>
                                    <li style={{ lineHeight: '2' }}>
                                        <a href="#Profile" onClick={() => setActiveTab('Profile')} className="nav-link text-black">
                                            <i className="fas fa-box me-2"></i>
                                            Profile
                                        </a>
                                    </li>
                                    <li style={{ lineHeight: '2' }}>
                                        <a href="#Reviews" onClick={() => setActiveTab('Reviews')} className="nav-link text-black">
                                            <i className="fas fa-tags me-2"></i>
                                            Reviews
                                        </a>
                                    </li>
                                    <li style={{ lineHeight: '2' }}>
                                        <a href="#Share" onClick={() => setActiveTab('Share')} className="nav-link text-black">
                                            <i className="fa-solid fa-share me-2"></i>
                                            Share
                                        </a>
                                    </li>
                                    <li style={{ lineHeight: '2' }}>
                                        <a href="#teacher" onClick={() => setActiveTab('teacher')} className="nav-link text-black">
                                            <i className="fa-solid fa-chalkboard-user me-2"></i>
                                            Explore Teachers
                                        </a>
                                    </li>
                                    <li style={{ lineHeight: '2' }}>
                                        <a href="/" className="nav-link text-black">
                                            <i className="fa-solid fa-globe me-2"></i>
                                            Website
                                        </a>
                                    </li>
                                    <hr className="border-1" />
                                    <li style={{ lineHeight: '2' }}>
                                        <a href="#Help" onClick={() => setActiveTab('Help')} className="nav-link text-black">
                                            <i class="fa-solid fa-headset me-2"></i>
                                            Help
                                        </a>
                                    </li>
                                    <li onClick={handleLogout} style={{ lineHeight: '0' }}>
                                        <a className="nav-link text-black">
                                            <i className="fa-solid fa-right-from-bracket me-2"></i>
                                            Logout
                                        </a>
                                    </li>

                                </ul>


                            </div>
                        </nav>

                        {/* Main Content */}
                        <main style={{ marginTop: '3%' }} className="col-md-9  main-section-dash h-100  ms-sm-auto col-lg-10 px-md-4">
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                {activeTab === 'Home' && (
                                    <div className="container-fluid py-5">
                                        <div className="row">
                                            <div className="col-12 text-center mb-4">
                                                <h1 className="h2">Dashboard</h1>
                                            </div>

                                            {/* Dashboard Cards */}
                                            <div className="row">
                                                {/* Total Posts */}
                                                <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-4">
                                                    <div className="card w-100 h-100"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                                            borderRadius: '15px',
                                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                            transition: 'transform 0.3s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title">📚 Total Posts</h5>
                                                            <p className="card-text fw-bold fs-4 ">{post.length || 0}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Subscribed Teachers */}
                                                <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-4">
                                                    <div className="card w-100 h-100"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #f0f4c3 0%, #dce775 100%)',
                                                            borderRadius: '15px',
                                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                            transition: 'transform 0.3s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title">👩‍🏫 Subscribed Teachers</h5>
                                                            <p className="card-text fw-bold fs-4 ">{subscribedTeachers}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Friends Count */}
                                                <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-4">
                                                    <div className="card w-100 h-100"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #fff3e0 0%, #ffccbc 100%)',
                                                            borderRadius: '15px',
                                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                            transition: 'transform 0.3s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title">👫Website share With Friends Friends</h5>
                                                            <p className="card-text fw-bold fs-4 ">{friendsCount}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Special Offers */}
                                                <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-4">
                                                    <div className="card w-100 h-100"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)',
                                                            borderRadius: '15px',
                                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                            transition: 'transform 0.3s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title">🎉 Special Offers</h5>
                                                            <p className="card-text fw-bold fs-4 ">{specialOffers}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reviews Count */}
                                                <div className="col-xl-3 col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-4">
                                                    <div className="card w-100 h-100"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #fce4ec 0%, #f48fb1 100%)',
                                                            borderRadius: '15px',
                                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                            transition: 'transform 0.3s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title">⭐ Reviews</h5>
                                                            <p className="card-text fw-bold fs-4 ">{reviewsCount}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div>
                                {activeTab === 'Post' && (
                                    <div className="container-fluid">
                                        <div className="row">
                                            {post && post.length > 0 ? (
                                                post.map((item, index) => (
                                                    <div key={index} className="col-xl-3 col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-4">
                                                        <div className="card w-100 h-100"
                                                            style={{
                                                                background: index % 2 === 0
                                                                    ? 'linear-gradient(135deg, #f0f7ff 0%, #c4d7ff 100%)'
                                                                    : 'linear-gradient(135deg, #fff0f0 0%, #ffdcdc 100%)',
                                                                borderRadius: '15px',
                                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                                transition: 'transform 0.3s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                        >
                                                            <div className="card-body bg-transparent px-4">
                                                                <ul className="list-group w-100 mb-3 list-group-flush">
                                                                    <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                        <span className="mb-0">📅 Date:</span>
                                                                        <strong>{new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                                                                    </li>
                                                                    <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                        <span className="mb-0">🏫 Class:</span>
                                                                        <strong>{item.className}</strong>
                                                                    </li>
                                                                    <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                        <span className="mb-0">📘 Subject:</span>
                                                                        <strong>{Array.isArray(item?.subjects) ? item.subjects.map((sub) => <span key={sub} className="badge bg-primary me-1">{sub}</span>) : 'No subjects available'}</strong>
                                                                    </li>
                                                                    <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                        <span className="mb-0">❤️ Interested:</span>
                                                                        <strong>{item.interestedInTypeOfClass}</strong>
                                                                    </li>
                                                                    <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                        <span className="mb-0">📚 Classes Requested:</span>
                                                                        <strong>{item.numberOfSessions}</strong>
                                                                    </li>
                                                                    <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                        <span className="mb-0">💵 Budget:</span>
                                                                        <strong>₹{item.minBudget} - ₹{item.maxBudget}</strong>
                                                                    </li>
                                                                    <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                        <span>👨‍🏫 Teacher Gender:</span>
                                                                        <strong>{item.teacherGenderPreference}</strong>
                                                                    </li>
                                                                    <li className="list-group-item text-white mt-2 px-2 d-flex justify-content-between"
                                                                        style={{ backgroundColor: index % 2 === 0 ? '#4CAF50' : '#FF5722', borderRadius: '8px' }}>
                                                                        <span><i className="me-2"></i>🔔 Status</span>
                                                                        <strong>{item.statusOfRequest}</strong>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-lg-12">
                                                    <div className="alert alert-info text-center py-5" role="alert" style={{ borderRadius: '15px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#f0f8ff' }}>
                                                        <h3 className="mb-3" style={{ color: '#007bff' }}>
                                                            🤔 No Posts Found
                                                        </h3>
                                                        <p className="mb-4" style={{ fontSize: '1.1rem', color: '#555' }}>
                                                            It seems like there are no posts available right now. Why not create a new one? 🚀
                                                        </p>
                                                        <div style={{ fontSize: '2rem' }}>📢📝</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}



                                {activeTab === 'teacher' && (
                                    <div className="container-fluid py-5">
                                        <div className="row">
                                            <div className="col-12 text-center">
                                                <h2 className="text-primary">My Subscribed Teachers</h2>
                                            </div>
                                        </div>

                                        {currentTeachers && currentTeachers.length > 0 ? (
                                            <>
                                                <div className="row">
                                                    {currentTeachers.map((teacher, index) => (
                                                        <div key={index} className="col-xl-3 col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-4">
                                                            <div className="card w-100 h-100"
                                                                style={{
                                                                    background: index % 2 === 0
                                                                        ? 'linear-gradient(135deg, #f0f7ff 0%, #c4d7ff 100%)'
                                                                        : 'linear-gradient(135deg, #fff0f0 0%, #ffdcdc 100%)',
                                                                    borderRadius: '15px',
                                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                                    transition: 'transform 0.3s'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                            >
                                                                <div className="card-body bg-transparent px-4">
                                                                    <ul className="list-group w-100 mb-3 list-group-flush">
                                                                        <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                            <span className="mb-0">👨‍🏫 Teacher Name:</span>
                                                                            <strong>{teacher.teacherInfo.TeacherName}</strong>
                                                                        </li>
                                                                        <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                            <span className="mb-0">📧 Email</span>
                                                                            <strong>{teacher.teacherInfo.Email}</strong>
                                                                        </li>
                                                                        <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                            <span className="mb-0">☎️ Contact Number:</span>
                                                                            <strong>{teacher.teacherInfo.PhoneNumber}</strong>
                                                                        </li>
                                                                        <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                            <span className="mb-0">🏫 Class</span>
                                                                            <strong>{teacher.className}</strong>
                                                                        </li>
                                                                        <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                            <span className="mb-0">📘 Subject:</span>
                                                                            <strong>{Array.isArray(teacher.Subject) ? teacher.Subject.map(sub => <span key={sub} className="badge bg-primary me-1">{sub}</span>) : 'No subjects available'}</strong>
                                                                        </li>
                                                                        <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                            <span className="mb-0">📅 Experience:</span>
                                                                            <strong>{teacher.TeachingExperience} Years</strong>
                                                                        </li>
                                                                        <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                            <span className="mb-0">🌍 Location:</span>
                                                                            <strong>{teacher.Location}</strong>
                                                                        </li>
                                                                        <li className="list-group-item px-2 bg-transparent rounded d-flex justify-content-between">
                                                                            <span className="mb-0">💵 Budget:</span>
                                                                            <strong>₹{teacher.MinRange} - ₹{teacher.MaxRange}</strong>
                                                                        </li>
                                                                        <li className="list-group-item text-white mt-2 px-2 d-flex justify-content-between"
                                                                            style={{ backgroundColor: index % 2 === 0 ? '#4CAF50' : '#FF5722', borderRadius: '8px' }}>
                                                                            <span><i className="me-2"></i>Status:</span>
                                                                            <strong>{teacher.statusOfRequest}</strong>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Pagination Component */}
                                                <div className="row">
                                                    <div className="col-12 d-flex justify-content-center">
                                                        <Pagination>
                                                            {[...Array(Math.ceil((subscribed?.length || 0) / subscribedPerPage)).keys()].map(number => (
                                                                <Pagination.Item
                                                                    key={number + 1}
                                                                    active={number + 1 === currentPage}
                                                                    onClick={() => handleTeacherPageChange(number + 1)}
                                                                >
                                                                    {number + 1}
                                                                </Pagination.Item>
                                                            ))}
                                                        </Pagination>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="alert alert-warning text-center py-5" role="alert" style={{ borderRadius: '15px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fffbe7' }}>
                                                        <h3 className="mb-3" style={{ color: '#ff9800' }}>
                                                            😕 Oops! No Teachers Found
                                                        </h3>
                                                        <p className="mb-4" style={{ fontSize: '1.1rem', color: '#555' }}>
                                                            It seems like we couldn't find any subscribed teachers for you right now. Try refreshing or explore new options! 📚
                                                        </p>
                                                        <div style={{ fontSize: '2rem' }}>🔍💡</div>
                                                    </div>
                                                </div>
                                            </div>

                                        )}
                                    </div>
                                )}

                                {activeTab === 'Reviews' && (
                                    <div>
                                        <div className="container-fluid py-5">
                                            <div className="row">
                                                <div className="col-12 text-center mb-4">
                                                    <h1 className="h2">Reviews</h1>
                                                </div>

                                                <div className="row">
                                                    {reviews.map((review, index) => (
                                                        <div key={review.id} className="col-xl-6 col-md-12 mb-4">
                                                            <div className="card w-100 h-100"
                                                                style={{
                                                                    background: index % 2 === 0
                                                                        ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
                                                                        : 'linear-gradient(135deg, #f0f4c3 0%, #dce775 100%)',
                                                                    borderRadius: '15px',
                                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                                    transition: 'transform 0.3s'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                            >
                                                                <div className="card-body bg-transparent px-4">
                                                                    <h5 className="card-title d-flex align-items-center">
                                                                        <span className="me-2">👤</span>
                                                                        <strong>{review.reviewer}</strong>
                                                                    </h5>
                                                                    <div className="d-flex mb-2">
                                                                        <span className="me-2">Rating:</span>
                                                                        {[...Array(review.rating)].map((_, i) => (
                                                                            <span key={i} className="text-warning">⭐</span>
                                                                        ))}
                                                                    </div>
                                                                    <p className="card-text">{review.comment}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'Share' && (
                                    <div className="container d-flex justify-content-center align-items-center my-5">
                                        <div className="card w-100 p-4 text-center"
                                            style={{
                                                maxWidth: '600px',
                                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                                borderRadius: '15px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            }}>
                                            <h3 className="mb-4" style={{ color: '#6A73FA', fontWeight: 'bold' }}>Share SR Tutors with Your Friends!</h3>
                                            <p>Help your friends find the best tutors by sharing SR Tutors with them on social media.</p>

                                            <div className="d-flex justify-content-center my-4">
                                                {/* Facebook */}
                                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mx-2">
                                                    <i className="fab fa-facebook fa-2x"
                                                        style={{ color: '#4267B2', transition: 'transform 0.2s' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    ></i>
                                                </a>

                                                {/* Twitter */}
                                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out SR Tutors!`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mx-2">
                                                    <i className="fab fa-twitter fa-2x"
                                                        style={{ color: '#1DA1F2', transition: 'transform 0.2s' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    ></i>
                                                </a>

                                                {/* LinkedIn */}
                                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mx-2">
                                                    <i className="fab fa-linkedin fa-2x"
                                                        style={{ color: '#0A66C2', transition: 'transform 0.2s' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    ></i>
                                                </a>

                                                {/* WhatsApp */}
                                                <a href={`https://api.whatsapp.com/send?text=Check out SR Tutors! ${window.location.href}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mx-2">
                                                    <i className="fab fa-whatsapp fa-2x"
                                                        style={{ color: '#25D366', transition: 'transform 0.2s' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                    ></i>
                                                </a>
                                            </div>

                                            <button className="btn btn-primary px-4"
                                                style={{ backgroundColor: '#6A73FA', border: 'none', borderRadius: '25px', fontWeight: 'bold' }}>
                                                Share Now!
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Help' && (
                                    <div className="container-fluid py-5">
                                        <div className="row mb-5">
                                            <div className="col-12 text-center">
                                                <h2 className="text-primary"><span className="text-danger">Need Assistance?</span> We're Here to Help!</h2>
                                                <p className="text-muted">Reach out to us for any questions or inquiries. We're just a message away!</p>
                                            </div>
                                        </div>

                                        <div className="row mb-5 justify-content-center">
                                            <div className="col-md-10 p-4" style={{
                                                background: 'linear-gradient(135deg, #e0f7fa 0%, #ffccbc 100%)',
                                                borderRadius: '15px',
                                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                                            }}>
                                                <h4 className="mb-4 text-center text-dark">Contact Us</h4>
                                                <ul className="list-unstyled d-flex justify-content-around text-center text-md-start">
                                                    <li><i className="fas fa-phone me-2 text-primary"></i> +123-456-7890</li>
                                                    <li><i className="fas fa-envelope me-2 text-primary"></i> help@yourdomain.com</li>
                                                    <li className="d-flex">
                                                        <a href="https://facebook.com" className="btn btn-outline-primary me-2"><i className="fab fa-facebook-f"></i></a>
                                                        <a href="https://twitter.com" className="btn btn-outline-info me-2"><i className="fab fa-twitter"></i></a>
                                                        <a href="https://instagram.com" className="btn btn-outline-danger"><i className="fab fa-instagram"></i></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="row align-items-center">


                                            <div className="col-lg-10 mx-auto">
                                                <form className="p-4 rounded ">
                                                    <h5 className="mb-4 text-center">Send Us a Message</h5>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="name">Your Name</label>
                                                        <input type="text" className="form-control" id="name" placeholder="Enter your name" />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="email">Your Email</label>
                                                        <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="message">Message</label>
                                                        <textarea className="form-control" id="message" rows="4" placeholder="Enter your message"></textarea>
                                                    </div>
                                                    <div className="text-center">
                                                        <button type="submit" className="btn btn-primary">Send Message</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Profile' && (
                                    <div>
                                        <div className="container-fluid">
                                            <div className="row justify-content-center">
                                                <div className="col-lg-8 col-md-10 col-sm-12">
                                                    <div className="card rounded-lg bg-transparent p-4" >
                                                        <div className="card-body text-center">
                                                            <div className="profile-avatar mb-4">
                                                                <img
                                                                    src={studentDetails?.profilePic}
                                                                    alt="Profile"
                                                                    className="rounded-circle shadow"
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #6A73FA' }}
                                                                />
                                                            </div>
                                                            <h3 className="mb-3 " style={{ color: '#333', fontWeight: 'bold' }}>{studentDetails.StudentName || 'Student Name'}</h3>
                                                            <p className="text-muted mb-4">{studentDetails.Email || 'student@example.com'}</p>

                                                            <ul className="list-group w-100 list-group-flush text-left mb-4">
                                                                <li className="list-group-item  w-100 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #ddd' }}>
                                                                    <span>Phone Number:</span> <strong>{studentDetails.PhoneNumber}</strong>
                                                                </li>
                                                                <li className="list-group-item d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #ddd' }}>
                                                                    <span>Status:</span> <strong>{studentDetails.isStudentVerified ? 'Verified' : 'Not Verified'}</strong>
                                                                </li>
                                                            </ul>

                                                            <div className="d-flex justify-content-center mt-3">
                                                                <button
                                                                    className="btn btn-primary me-2"
                                                                    style={{ backgroundColor: '#6A73FA', borderColor: '#6A73FA', padding: '10px 20px', borderRadius: '30px' }}
                                                                    onClick={handleEditProfile}
                                                                >
                                                                    Edit Profile
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger"
                                                                    style={{ padding: '10px 20px', borderRadius: '30px' }}
                                                                    onClick={handleLogout}
                                                                >
                                                                    Logout
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </main>
                    </div>
                </div>
            ) : (
                <div style={{ height: '100dvh', width: '100%' }} className="mx-auto ">
                    <div className="alert alert-warning text-center" role="alert" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #fff9c4 0%, #fdd835 100%)', color: '#333' }}>
                        <h4 className="alert-heading">🚫 Access Denied!</h4>
                        <p className="mb-0">It looks like you're not logged in yet. Please Login or Register to access your dashboard and enjoy our services.</p>
                        <hr />
                        <p className="mb-0">If you need help, don't hesitate to contact our support team! 📞</p>
                    </div>

                </div>

            )}

        </>


    );
};

export default Headers;
