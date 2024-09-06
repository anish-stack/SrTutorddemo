import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Card.css";
import LoginModal from "../Components/LoginModel";
import Cookies from "js-cookie";
import ContactTeacherModal from "./Student/ContactModel";
import Loader from "../Components/Loader";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [Location, setLocation] = useState("");
  const [ClassId, setClassId] = useState("");
  const [Subject, setSubject] = useState("");

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const locationParam = params.get("Location");
    const classIdParam = params.get("ClassId");
    const subjectParam = params.get("Subject");
    const latParam = params.get("lat");
    const longParam = params.get("lng");
    console.log(latParam,longParam)
    if (locationParam && classIdParam && subjectParam) {
      setLocation(locationParam);
      setClassId(classIdParam);
      setSubject(subjectParam);

      const fetchResults = async () => {
        try {
          const response = await axios.get(
            `https://www.sr.apnipaathshaala.in/api/v1/teacher/Get-Min-search/${locationParam}/${classIdParam}/${subjectParam}?lat=${latParam}&lng=${longParam}`
          );
          setResults(response.data.results);
          setCount(response.data.count);
        } catch (error) {
          console.error("Error fetching results:", error);
          setError("An error occurred while fetching results.");
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    } else {
      setError("Missing search parameters.");
      setLoading(false);
    }
  }, []);

  const handleContactClick = (teacher) => {
    const isLoggedIn = Boolean(Cookies.get("studentToken"));

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      setSelectedTeacher({
        gender: teacher.Gender,
        experience: teacher.TeachingExperience,
        profileId: teacher._id,
        TeacherId: teacher.TeacherUserId,
        teachingMode: teacher.TeachingMode,
        alternateContact: teacher.AlternateContact,
        UserclassId: ClassId,
        UserSubject: Subject,
        UserSearchlocation: Location,
      });
      setIsContactModalOpen(true);
    }
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };
  useEffect(() => {
    if (error) {
      setLoading(true);

      const timer = setTimeout(() => {
        setLoading(false);
        setShowError(true);
      }, 3000);

      return () => clearTimeout(timer); // Clean up the timer on component unmount
    }
  }, [error]);

  if (loading) {
    return <div style={{ width: "100%", height: "100vh" }}><Loader /></div>;
  }
  if (showError) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 ">
        <div className="text-white text-center p-4 rounded border border-light">
          <h2 className="mb-3">Oops! Something went wrong</h2>
          <p className="lead">{error}</p>
          <button className="btn btn-light mt-3" onClick={() => setError(null)}>Close</button>
        </div>
      </div>
    );
  }
  return (
    <div className="search-results">
      <h3 className="title">
        Search Results for <span>{Subject}</span> in Location {Location}
      </h3>
      <p>Total Found Results: {count}</p>
      <hr />
      <div className="results-containes">
        <div className="results-containers">
          {results.length > 0 ? (
            results.map((teacher, index) => {
              const genderImage =
                teacher.Gender === "Male"
                  ? "https://i.ibb.co/MDMfwVV/Men-Teacher.png"
                  : "https://i.ibb.co/8YZgKMd/teacher.png";

              return (
                <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                  <div className="card teacher-card">
                    <div className="card-header">
                      <div className="teacher-image">
                        <img src={genderImage} alt="User-Profile-Image" />
                      </div>
                      <div className="teacher-info">
                        <h6 className="teacher-name">{teacher.FullName}</h6>
                        <p className="teacher-details">
                          {teacher.TeachingExperience} | {teacher.Gender} |{" "}
                          {new Date(teacher.DOB).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="card-section">
                        <i className="fa fa-graduation-cap"></i>
                        <p>{teacher.Qualification}</p>
                      </div>
                      <div className="card-section">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                        <p>Fees: ₹{teacher.ExpectedFees}</p>
                      </div>
                      <div className="card-section">
                        <i className="fa fa-book"></i>
                        <p>
                          {teacher.AcademicInformation.reduce(
                            (acc, item) => acc + item.SubjectNames.length - 1,
                            0
                          )}{" "}
                          + Subjects Taught
                        </p>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button className="btn-view">View</button>
                      <button
                        className="btn-contact"
                        onClick={() => handleContactClick(teacher)}
                      >
                        Contact
                      </button>
                    </div>
                    {teacher.isAllDetailVerified && (
                      <span className="verified-tag">
                        <i className="fa fa-check-circle"></i> Verified
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        modalType="student"
        onClose={closeLoginModal}
      />
      <ContactTeacherModal
        isOpen={isContactModalOpen}
        isClose={closeContactModal}
        teachersData={selectedTeacher}
      />
    </div>
  );
};

export default SearchResults;
