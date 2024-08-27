import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "./Loader";
import toast from "react-hot-toast";
import SubjectModel from "./SubjectModel";

const LoginModal = ({ isOpen, modalType, onClose }) => {
  
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const [loading, setLoading] = useState(false);
  const close = ()=>{
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
        setLoading(false);
        toast.success("Login successful");
        console.log("Login successful:", response.data);
        setTimeout(() => {
          window.location.reload();
          close()
        }, 500);
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
        `Login failed: ${
          error.response ? error.response.data : error.message
        }`
      );
    }
  };

  const modalContent = {
    student: {
      title: "Find Perfect Home Tutors",
      url: "/Student-register?source=home",
      forgetPassword: "/Student-forget-Password?source=home",
      DashboardUrl: `/Student-dashboard`,
    },
    teacher: {
      title: "Go Check Students Are Coming",
      url: "/teacher-register?source=home",
      forgetPassword: "/teacher-forget-Password?source=home",
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
          <span aria-hidden="true">&times;</span>
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
              Create A Free Account!!
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
