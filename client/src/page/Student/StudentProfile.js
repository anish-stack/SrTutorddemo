import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Student from "./student.png";
import "./StudentProfile.css"; // Import your custom CSS file
import axios from "axios";

const StudentProfile = () => {
  const [studentToken, setStudentToken] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [post, setPost] = useState([]);
  const [subscribed, setSubscribed] = useState([]);
  const [subscribedPage, setSubscribedPage] = useState(1);
  const [subscribedPerPage] = useState(5); // Number of subscribed teachers per page
  const [totalSubscribed, setTotalSubscribed] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of posts per page
  const [totalPosts, setTotalPosts] = useState(0);

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

  const MyPost = async () => {
    try {
      const { data } = await axios.get('http://localhost:7000/api/v1/student/Get-My-Post', {
        headers: {
          Authorization: `Bearer ${studentToken}`
        },
        params: {
          page: currentPage,
          limit: postsPerPage
        }
      });
      setPost(data.data);
      setTotalPosts(data.data.length);
    } catch (error) {
      console.log(error);
      setPost([]);
    }
  };

  const MySubscribed = async () => {
    try {
      const { data } = await axios.get('http://localhost:7000/api/v1/student/Get-My-Subscribed-Teacher', {
        headers: {
          Authorization: `Bearer ${studentToken}`
        }
      });
      //  console.log(data)  
      setSubscribed(data.data)

    } catch (error) {
      console.log(error);

    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    MyPost();
  };

  if (!studentToken) {
    return (
      <div className="unauthorized">
        <h3>Unauthorized Access</h3>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="student-profile bg-white container mt-4">
      <div className="student-back-side bg-white position-relative text-white py-4 rounded">
        <div className="row mt-4">
          <div className="col-md-4 text-center">
            <div className="student-image mb-3">
              <img
                src={Student}
                alt="Student"
                className="img-fluid rounded-circle"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-user mt-5 row">
        <div className="col-md-9">
          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="student-info">
              <p>
                <strong>Email:</strong> {studentDetails?.Email}
              </p>
              <p>
                <strong>Name:</strong> {studentDetails?.StudentName}
              </p>
              <p>
                <strong>Phone Number:</strong> {studentDetails?.PhoneNumber}
              </p>
              <p>
                <strong>Joined Date:</strong>{" "}
                {new Date(studentDetails?.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {activeTab === "editProfile" && (
            <div className="edit-profile">
              <h3>Edit Profile</h3>
              <form>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={studentDetails?.Email}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={studentDetails?.StudentName}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={studentDetails?.PhoneNumber}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </form>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="posts mt-50">
              {post && post.length > 0 ? (
                <>
                  <div className="row">
                    {post.map((item, index) => (
                      <div className="col-md-4 mb-4" key={index}>
                        <div className="card glass h-100">
                          <div className="card-body">
                            <h5 className="card-title">{item.className}</h5>
                            <p className="card-text"><strong>Subject:</strong> {item.Subject}</p>
                            <p className="card-text"><strong>Date of Post:</strong> {new Date(item.createdAt).toLocaleDateString('en-GB')}</p>
                          </div>
                          <div className="card-footer text-center">
                            <button className="btn btn-primary">View Details</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                      </li>
                      {[...Array(Math.ceil(totalPosts / postsPerPage))].map((_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'bg-danger' : 'bg-danger'}`}>
                          <button className="page-link bg-danger text-white" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === Math.ceil(totalPosts / postsPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                      </li>
                    </ul>
                  </nav>
                </>
              ) : (
                <div className="text-center">
                  <h3>Posts You've Done</h3>
                  <p>No posts available</p>
                </div>
              )}
            </div>
          )}

          <>
            {activeTab === "subscribedTeachers" && (
              <div className="container" style={{ marginTop: '4rem' }}>
                {subscribed && subscribed.length > 0 ? (
                  <div className="row">
                    <div className="col-md-12">

                      {subscribed.map((item, index) => (
                        <div key={index} className="mb-4">
                          <div className="card border-light shadow-sm rounded-lg">
                            <div className="card-body">
                              <h5 className="card-title">Subscribed Teacher</h5>
                              <div className="row">
                                <div className="col-md-6 mb-2">
                                  <div className="detail-item"><strong>Teacher Name:</strong> {item.teacherInfo.TeacherName}</div>
                                  <div className="detail-item"><strong>Email:</strong> {item.teacherInfo.Email}</div>
                                </div>
                                <div className="col-md-6 mb-2">
                                  <div className="detail-item"><strong>Phone:</strong> {item.teacherInfo.PhoneNumber}</div>
                                  <div className="detail-item"><strong>Class Start Date:</strong> {new Date(item.StartDate).toLocaleDateString()}</div>
                                </div>
                                <div className="col-md-6 mb-2">
                                  <div className="detail-item"><strong>Location:</strong> {item.Location}</div>
                                  <div className="detail-item"><strong>Subject:</strong> {item.Subject.join(', ')}</div>
                                </div>
                                <div className="col-md-6 mb-2">
                                  <div className="detail-item"><strong>Teaching Mode:</strong> {item.TeachingMode}</div>
                                  <div className="detail-item"><strong>Experience:</strong> {item.TeachingExperience} years</div>
                                </div>
                              </div>
                            </div>
                            <div className="">
                              <span className={`badge tags  float-right`}>
                                {item.isDealDone ? 'Subscribed' : 'Un-Subscribed'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Subscribed Teachers</h4>
                    <p>No subscribed teachers</p>
                  </div>
                )}
              </div>
            )}

          </>
        </div>

        <div className="sticky-nav-vertical col-md-4">
          {/* Navigation Tabs */}
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a
                href="#"
                className={`nav-link text-danger fw-bold ${activeTab === "profile" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                href="#"
                className={`nav-link text-danger fw-bold ${activeTab === "editProfile" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("editProfile")}
              >
                Edit Profile
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                href="#"
                className={`nav-link text-danger fw-bold ${activeTab === "posts" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts You've Done
              </a>
            </li>

            <li className="nav-item mb-2">
              <a
                href="#"
                className={`nav-link text-danger fw-bold ${activeTab === "subscribedTeachers" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("subscribedTeachers")}
              >
                Subscribed Teachers
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                href="#"
                className="nav-link text-danger fw-bold"
                onClick={() => {
                  Cookies.remove("studentToken");
                  Cookies.remove("studentUser");
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = "/";
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
