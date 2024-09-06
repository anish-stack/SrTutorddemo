import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "./Loader";
import Modal from "react-modal";
import toast from "react-hot-toast";
import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import { useGeolocated } from "react-geolocated";
Modal.setAppElement("#root");

function Header() {
  const [teacherToken, setTeacherToken] = useState(null);
  const [studentToken, setStudentToken] = useState(null);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });
  const [locationData, setLocationData] = useState({
    lng: '',
    lat: '',
  })
  useEffect(() => {
    // Check if coords is defined
    if (coords) {
      setLocationData({
        lng: coords.longitude,
        lat: coords.latitude
      });
    }
  }, [coords]);
  useEffect(() => {
    const token = Cookies.get("teacherToken");
    setTeacherToken(token || null);

    const student = Cookies.get("studentToken");
    setStudentToken(student || null);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggle = () => {
    document.body.classList.toggle("mobile-menu-visible");
  };

  const mobilesubMenu = () => {
    document.getElementsByClassName("subMenu")[0].classList.toggle("d-block");
  };

  const handleModalShow = (type) => {
    setModalType(type);
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setModalType(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let response;
      let userPrefix = "";

      if (modalType === "student") {
        setLoading(true);
        response = await axios.post(
          "https://www.sr.apnipaathshaala.in/api/v1/student/login",
          formData
        );
        userPrefix = "student";
      } else if (modalType === "teacher") {
        setLoading(true);
        response = await axios.post(
          "https://www.sr.apnipaathshaala.in/api/v1/teacher/Teacher-Login",
          formData
        );
        userPrefix = "teacher";
      }

      if (response && response.data) {
        const { token, user } = response.data;

        Cookies.set(`${userPrefix}Token`, token, { expires: 1 });
        Cookies.set(`${userPrefix}User`, JSON.stringify(user), { expires: 1 });

        // Check if the teacher needs to complete their profile
        if (userPrefix === 'teacher') {
          const checkProfileId = user.TeacherProfile;
          console.log(checkProfileId)
          if (!checkProfileId) {
            window.location.href = `/Complete-profile?token=${token}&encoded=${user._id}`;
            return; // Exit early if redirecting
          }
        }
        setLoading(false);
        toast.success("Login successful");
        console.log("Login successful:", response.data);
        setTimeout(() => {
          window.location.reload();
          handleModalClose();
        }, 500); // Close the modal on success
        setFormData({
          Email: "",
          Password: "",
        });
      } else {
        console.log("Login failed: No response data");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const modalContent = {
    student: {
      title: "Find Perfect Home Tutors",
      url: "/Student-register?source=home",
      forgetPassword: "/Student-forget-Password?source=home",
      DashboardUrl: `/Student-dashboard?login=${studentToken ? true : false}`,
    },
    teacher: {
      title: "Go Check Students Are Coming",
      url: "/teacher-register?source=home",
      forgetPassword: "/teacher-forget-Password?source=home",
      DashboardUrl: `/Teacher-dashboard?login=${teacherToken ? true : false}`,
    },
  };

  return (
    <>
      <div id="header-fixed-height" />
      <header className="tg-header__style-two">
        <div id="sticky-header" className="tg-header__area">
          <div className="container custom-container">
            <div className="row">
              <div className="col-12">
                <div onClick={handleToggle} className="mobile-nav-toggler">
                  <i className="fa fa-bars" />
                </div>
                <div className="tgmenu__wrap">
                  <nav className="tgmenu__nav">
                    <div className="logo">
                      <Link to="/">
                        <img src="assets/img/logo/srtutor.webp" alt="Logo" />
                      </Link>

                    </div>
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex">
                      <ul className="navigation">
                        <li className="active">
                          <Link to="/"> Home </Link>
                        </li>
                        <li className="">
                          <Link to="about-us">About Us</Link>
                        </li>
                        <li className="">
                          <Link to="services">Services</Link>
                        </li>
                        <li className="menu-item">
                          <Link to="#">
                            One-to-One Class{" "}
                            <i className="ri-arrow-down-s-line"></i>
                          </Link>
                          <ul className="sub-menu">
                            <li>
                              <Link to="#">Home Tuition</Link>
                            </li>
                            <li>
                              <Link to="#">Hire a Tutor</Link>
                            </li>
                            <li>
                              <Link to="#">Tutor Section</Link>
                            </li>
                            <li>
                              <Link to="#">Apply as Tutor</Link>
                            </li>
                          </ul>
                        </li>
                        <li className="">
                          <Link to="#">Membership</Link>
                        </li>
                        <li className="">
                          <Link to="contact-us">Contact us</Link>
                        </li>
                      </ul>
                    </div>
                    <div className="tgmenu__categories d-none d-md-block">
                      <div className="dropdown">
                        <Link
                          style={{ border: "1px solid gray" }}
                          className="dropdown-toggle category-btn"
                          to={`/Browse-Tutors?lat=${locationData.lat}&lng=${locationData.lng}`}
                        >
                          <svg
                            width={8}
                            height={8}
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 12H6.85714V6.85714H12V12ZM5.14286 12H0V6.85714H5.14286V12ZM12 5.14286H6.85714V0H12V5.14286ZM5.14286 5.14286H0V0H5.14286V5.14286Z"
                              fill="currentcolor"
                            />
                          </svg>
                          Browse Tutors
                        </Link>

                      </div>
                    </div>
                    <div className="tgmenu__action">
                      <ul className="list-wrap">
                        <li className="header-phone d-none d-lg-block d-xl-none d-xxl-block">
                          <Link className="fs-6" to="tel:+919811382915">
                            <i className="flaticon-phone-call fs-6" /> +91
                            9811382915
                          </Link>
                        </li>
                      </ul>
                    </div>
                    {/* Conditionally render based on tokens */}
                    {teacherToken ? (
                      // Render button for teacher dashboard

                      <Link
                        to={`${modalContent.teacher.DashboardUrl}`}
                        style={{ fontSize: "12px" }}
                        className="btn responive btn-primary"
                      >
                        Teacher Dashboard
                      </Link>
                    ) : studentToken ? (
                      // Render button for student dashboard
                      <Link
                        to={`${modalContent.student.DashboardUrl}`}
                        style={{ fontSize: "10px" }}
                        className="btn btn-primary"
                      >
                        Student Dashboard
                      </Link>
                    ) : (
                      <div className="tgmenu__categories d-none d-md-block">
                        <DropdownButton
                          id="dropdownMenuButton1"
                          title={
                            <Button className="signin-btn">
                              <svg
                                width="15px"
                                height="15px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx={12}
                                  cy={6}
                                  r={4}
                                  stroke="#fff"
                                  strokeWidth="1.5"
                                />
                                <path
                                  d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634"
                                  stroke="#fff"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span style={{ color: "#fff" }}>Sign In</span>
                            </Button>
                          }
                        >
                          <Dropdown.Item
                            onClick={() => handleModalShow("teacher")}
                          >
                            As a Tutor
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleModalShow("student")}
                          >
                            As a Student
                          </Dropdown.Item>
                        </DropdownButton>
                      </div>
                    )}
                  </nav>
                </div>
                <div className="tgmobile__menu showMenu">
                  <nav className="tgmobile__menu-box">
                    <div className="close-btn">
                      <i className="ri-menu-3-line"></i>
                    </div>
                    <div className="nav-logo">
                      <Link to="/">
                        <img src="assets/img/logo/srtutor.webp" alt="Logo" />
                      </Link>
                      <div onClick={handleToggle} className="mobile-nav-toggler">
                        <i className="fa fa-close" />
                      </div>
                    </div>

                    <div className="tgmobile__search">
                      <form action="#">
                        <input type="text" placeholder="Search..." />
                        <button type="submit">
                          <i className="fa fa-search" />
                        </button>
                      </form>
                    </div>
                    <div className="tgmobile__menu-outer">
                      <ul className="navigation">
                        <li className="active">
                          <Link to="/">Home</Link>
                        </li>
                        <li>
                          <Link to="/about-us">About Us</Link>
                        </li>
                        <li>
                          <Link to="/services">Services</Link>
                        </li>
                        <li>
                          <Link to="#">One-to-One Class</Link>
                          <ul className="sub-menu">
                            <li>
                              <Link to="#">Home Tuition</Link>
                            </li>
                            <li>
                              <Link to="#">Hire a Tutor</Link>
                            </li>
                            <li>
                              <Link to="#">Tutor Section</Link>
                            </li>
                            <li>
                              <Link to="#">Apply as Tutor</Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link to="#">Membership</Link>
                        </li>
                        <li>
                          <Link to="/contact-us">Contact Us</Link>
                        </li>
                      </ul>
                    </div>
                    <div className="tg-social">
                      <ul className="list-wrap">
                        <li>
                          <Link to="#">
                            <i className="fab fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="#">
                            <i className="fab fa-twitter"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="#">
                            <i className="fab fa-linkedin-in"></i>
                          </Link>
                        </li>
                        <li>
                          <Link to="#">
                            <i className="fab fa-youtube"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
                <div className="tgmobile__menu-backdrop"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* React Modal */}
      <Modal
        isOpen={isOpen}
        onRequestClose={handleModalClose}
        contentLabel={modalContent[modalType]?.title}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="container d-flex align-item-end justify-content-end">
          <button
            type="button"
            className="close"
            onClick={handleModalClose}
            aria-label="Close"
          >
            <span aria-hidden="true"><i className="fa-solid fa-xmark"></i></span>
          </button>
        </div>
        <div className="text-center mb-3">
          <a href="#!">
            <img
              src="assets/img/logo/srtutor.webp"
              alt="srtutor Logo"
              width={175}
            />
          </a>
        </div>
        <div className="modal-header">
          <h5 className="modal-title">{modalContent[modalType]?.title}</h5>
        </div>
        <div className="modal-body">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="Email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="Email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="Password">Password</label>
              <input
                type="password"
                className="form-control"
                id="Password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                required
              />
            </div>
            {loading ? (
              <Loader />
            ) : (
              <button type="submit" className="btn mt-4 btn-primary">
                Login
              </button>
            )}
            <div className="d-flex align-item-center justify-content-between mt-3">
              <a
                href={`${modalContent[modalType]?.forgetPassword}`}
                className="link-danger text-decoration-none"
              >
                Forgot password?
              </a>
              <a
                href={`${modalContent[modalType]?.url}`}
                className="link-danger text-decoration-none"
              >
                Create A free Account !!
              </a>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default Header;
