import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Student from "./student.png";
import "./StudentProfile.css"; // Import your custom CSS file

const StudentProfile = () => {
  const [studentToken, setStudentToken] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const student = Cookies.get("studentToken");
    setStudentToken(student || null);

    if (student) {
      const details = JSON.parse(Cookies.get("studentUser"));
      setStudentDetails(details);
    }
  }, [studentToken]);

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
            <div className="posts">
              <h3>Posts You've Done</h3>
              <p>No posts available</p>
            </div>
          )}

          {activeTab === "postRequirement" && (
            <div className="post-requirement">
              <h3>Post Requirement</h3>
              <form>
                <div className="mb-3">
                  <label className="form-label">Requirement</label>
                  <textarea className="form-control" rows="3"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Post Requirement
                </button>
              </form>
            </div>
          )}

          {activeTab === "subscribedTeachers" && (
            <div className="subscribed-teachers">
              <h3>Subscribed Teachers</h3>
              <p>No subscribed teachers</p>
            </div>
          )}
        </div>

        <div className="sticky-nav-vertical col-md-4">
          {/* Navigation Tabs */}
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a
                href="#"
                className={`nav-link text-danger fw-bold ${
                  activeTab === "profile" ? "active" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                href="#"
                className={`nav-link text-danger fw-bold ${
                  activeTab === "editProfile" ? "active" : ""
                }`}
                onClick={() => setActiveTab("editProfile")}
              >
                Edit Profile
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                href="#"
                className={`nav-link text-danger fw-bold ${
                  activeTab === "posts" ? "active" : ""
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts You've Done
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
              href="/Student-Post-For-Teacher"
                className={`nav-link text-danger fw-bold ${
                  activeTab === "postRequirement" ? "active" : ""
                }`}
           
              >
                Post Requirement
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                href="#"
                className={`nav-link text-danger fw-bold ${
                  activeTab === "subscribedTeachers" ? "active" : ""
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
