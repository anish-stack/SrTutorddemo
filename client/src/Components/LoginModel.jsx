import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "./Loader";
import toast from "react-hot-toast";
import SubjectModel from "./SubjectModel";

const LoginModal = ({ isOpen, modalType, onClose }) => {

  const [formData, setFormData] = useState({
    anyPhoneAndEmail: "",
    Password: "",
  });

  const [loading, setLoading] = useState(false);
  const close = () => {
    onClose()
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    setLoading(true);
  
    try {
      let response;
      let userPrefix = "";
  
      if (modalType === "student") {
        response = await axios.post(
          "https://api.srtutorsbureau.com/api/v1/student/login",
          formData
        );
        userPrefix = "student";
      } else if (modalType === "teacher") {
        response = await axios.post(
          "https://api.srtutorsbureau.com/api/v1/teacher/Teacher-Login",
          formData
        );
        userPrefix = "teacher";
      }
  
      if (response && response.data) {
        const { token, user } = response.data;
        
        // Save the token and user info before checking for profile completion
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
  
        toast.success("Login successful");
        console.log("Login successful:", response.data);
        window.location.reload();
        setFormData({
          Email: "",
          Password: "",
        });
        onClose()
        // Replace window.reload with navigation if needed
        setTimeout(() => {
          close();
        }, 500);
      } else {
        console.log("Login failed: No response data");
        toast.error("Login failed: No response data");
      }
    } catch (error) {
      onClose()
      toast.error(
        `Login failed: ${error.response ? error.response.data : error.message}`
      );
    } finally {
      onClose()
      setLoading(false);
    }
  };
  

  const modalContent = {
    student: {
      title: "Find Perfect Home Tutors",
      url: "/Student-register?source=home",
      acountOpen:'Register As a Student',

      forgetPassword: "/Forget-Password?source=home&type=student",
      DashboardUrl: `/Student-dashboard`,
    },
    teacher: {
      title: "Become Part of our Team",
      acountOpen:'Create A Tutor Account',
      url: "/teacher-register?source=home",
      forgetPassword: "/Forget-Password?source=home&type=teacher",
      DashboardUrl: `/Teacher-dashboard`,
    },
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={close}
        
        contentLabel={modalContent[modalType]?.title}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="container d-flex align-items-end justify-content-end">
          <button
            type="button"
            className="close"
            onClick={close}
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
              <label htmlFor="anyPhoneAndEmail">Email address</label>
              <input
                type="email"
                className="form-control"
                id="anyPhoneAndEmail"
                name="anyPhoneAndEmail"
                value={formData.anyPhoneAndEmail}
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
            <div className="d-flex align-items-center justify-content-between mt-3">
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
                {`${modalContent[modalType]?.acountOpen}`}
              </a>
            </div>
          </form>
        </div>
      </Modal>
      {/* <SubjectModel open={true} /> */}
    </>
  );
};

export default LoginModal;
