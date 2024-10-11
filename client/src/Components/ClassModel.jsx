import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import Select from "react-select";
import Cookies from 'js-cookie';
import useSessionStorageState from 'use-session-storage-state';
import LoginModal from "./LoginModel";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ClassModel = ({ showModal, handleClose, subject }) => {

  const { Class, Subjects = [], isClass } = subject;
  const navigate = useNavigate();
  const [loginNumber, setLoginNumber] = useState()
  const [resendButtonClick, setResendButtonClick] = useState(0);
  const [resendError, setResendError] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const token = Cookies.get('studentToken') || false;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Subject: [],
    Class: "",
    Location: "",
    ClassLangUage: "",
    Interested: "",
    HowManyClassYouWant: "",
    MinimumBudget: "",
    teacherExperience: "",
    location: {
      type: 'Point',
      coordinates: []
    },
    MaximumBudget: "",
    StartDate: "",
    TeacherGender: "",
    userContactInfo: {
      Name: "",
      email: "",
      contactNumber: "",
    },
    specificRequirement: ""
  });
  const [login, setLogin] = useState(false)
  const maxResendAttempts = 3;
  const url = new URLSearchParams(window.location.search)
  const otpValue = url.get('otpSent')
  const [sessionData, setSessionData] = useState({
    otpSent: false,
    number: ''
  })
  const [showOtp, setShowOtp] = useState(false)
  const [disabledButton, setDisabledButton] = useState(false)
  const [otp, setOtp] = useState()
  const [ClickLatitude, setClickLatitude] = useState(null);
  const [ClickLongitude, setClickLongitude] = useState(null);
  const [storedFormData, setStoredFormData] = useSessionStorageState('beforeLoginData', {
    defaultValue: formData,
  });
  const [step, setStep] = useState(1);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      Class: Class || "",
      Subject: [], // Clear subject selection on new modal open
    }));
  }, [Class, Subjects]);

  useEffect(() => {
    if (token) {
      setLogin(true)
    } else {
      setLogin(false)
    }
  }, [token])

  const handleLoginChange = (e) => {
    setLoginNumber(e.target.value); // Directly set the value
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "Location") {
      handleLocationFetch(value);
    }
  };

  const handleSelectChange = (name) => (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleStepChange = (location) => {
    if (location > step) {
      if (step) {
        if (!formData.Class || !formData.Subject || !formData.Interested || !formData.Location || !formData.HowManyClassYouWant) {
          toast.error('Please fill all required fields in Step 1');

          return;
        } else {
          setStep(location)
          return;
        }
      }

      if (location === 2) {
        if (!formData.MaximumBudget || !formData.teacherExperience || !formData.TeacherGender || !formData.StartDate) {
          toast.error('Please fill all required fields in Step 2');
          return;
        } else {
          setStep(location)
          return;
        }
      }
    }


    setStep(location);
  };

  const handleLocationLatAndLngFetch = async (address) => {
    const options = {
      method: 'GET',
      url: `https://api.srtutorsbureau.com/geocode?address=${address}`
    };

    try {
      const response = await axios.request(options);
      const result = response.data;
      if (result.latitude && result.longitude) {
        setFormData((prevData) => ({
          ...prevData,
          location: {
            type: 'Point',
            coordinates: [result.latitude, result.longitude]
          }
        }));
        console.log("FormData at location lat and long", formData)
      } else {
        console.error("Invalid location data:", result);
      }

    } catch (error) {
      console.error("Error fetching location coordinates:", error);
    }
  };

  const fetchLocation = async () => {
    try {
      const { data } = await axios.post('https://api.srtutorsbureau.com/Fetch-Current-Location')
      const address = data?.data?.address
      console.log(address)
      if (address) {
        setFormData((prev) => ({
          ...prev,
          Location: address?.completeAddress,
          location: {
            type: 'Point',
            coordinates: [address.lat, address.lng]
          }
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchLocation()
  }, [])

  const handleChangeUserContactInfo = (field, value) => {
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFormData({
        ...formData,
        userContactInfo: {
          ...formData.userContactInfo,
          [field]: value,
        },
      });
    } else {
      toast.error('Please enter a valid 10-digit phone number');
    }
  };

  const handleLocationFetch = async (input) => {
    try {
      const res = await axios.get(
        `https://api.srtutorsbureau.com/autocomplete?input=${input}`);

      setLocationSuggestions(res.data || []);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code outside the 2xx range
        console.error("Error response from server:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error in setting up request:", error.message);
      }
    }
  };

  const handleLocationSelect = (location) => {
    setFormData(prevState => ({
      ...prevState,
      Location: location.description,
    }));
    handleLocationLatAndLngFetch(location.description);
    setLocationSuggestions([]);
  };

  useEffect(() => {
    const storedResendCount = localStorage.getItem('resendButtonClickCheckClass');
    if (storedResendCount) {
      setResendButtonClick(Number(storedResendCount));
    }
  }, []);

  useEffect(() => {
    console.log('Resend Button Click Count:', resendButtonClick); // Log the count
    localStorage.setItem('resendButtonClickCheckClass', resendButtonClick);
  }, [resendButtonClick]);

  const resendOtp = async () => {
    try {

      const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/resent-otp', { PhoneNumber: loginNumber, HowManyHit: resendButtonClick });
      console.log(response.data)
      toast.success(response.data.message);
      setResendButtonClick((prev) => prev + 1);
    } catch (error) {
      console.log(error)
      // setResendError(error.response?.data.message);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const verifyOtp = async () => {
    try {

      const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/Verify-Student', {
        PhoneNumber: loginNumber,
        otp
      });
      toast.success("Student Verified Successfully");
      const { token, user } = response.data;
      console.log(response.data)
      Cookies.set('studentToken', token, { expires: 1 });
      Cookies.set('studentUser', JSON.stringify(user), { expires: 1 });
      sessionStorage.removeItem('OtpSent')
      sessionStorage.removeItem('number')
      sessionStorage.removeItem('verified')

      setLogin(true)
      setStep(1);

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };



  const handleLoginNumberCheck = async (e) => {
    e.preventDefault();

    // Validate loginNumber
    if (!loginNumber) {
      setResendError('Please enter a valid phone number.');
      return;
    }

    if (resendButtonClick >= maxResendAttempts) {
      toast.error('Maximum resend attempts reached. You are blocked for 24 hours.');
      return;
    }

    try {
      const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/checkNumber-request', {
        userNumber: loginNumber,
        HowManyHit: resendButtonClick,
      });

      if (response.data && response.data.success) {
        // Incrementing safely
        setResendError('');
        setShowOtp(true);

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('otpSent', 'true');
        newUrl.searchParams.set('number', loginNumber);
        newUrl.searchParams.set('verified', 'false');

        sessionStorage.setItem('OtpSent', true);
        sessionStorage.setItem('number', loginNumber);
        sessionStorage.setItem('verified', false);
        // setDisabledButton(true)
        navigate(`${window.location.pathname}?${newUrl.searchParams.toString()}`, { replace: true });
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error(error.response); // Log the error for debugging

      if (error.response?.data?.success === false &&
        error.response?.data?.message === "User with this phone number already exists.") {
        setShowOtp(true);
        setStep(1); // Correctly set the state
      } else {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    }
  };





  const handleSubmit = async (e) => {
    e.preventDefault();

    const submittedData = {
      requestType: "Class Teacher",
      classId: subject?._id || null,
      className: formData.Class,
      ClassLangUage: 'Hindi',
      subjects: isClass ? formData.Subject : Subjects,
      interestedInTypeOfClass: formData.Interested,
      teacherGenderPreference: formData.TeacherGender,
      numberOfSessions: formData.HowManyClassYouWant,
      experienceRequired: formData.teacherExperience,
      minBudget: '520',
      maxBudget: formData.MaximumBudget,
      locality: formData.Location,
      startDate: formData.StartDate,
      specificRequirement: 'No',
      location: formData.location,
      studentInfo: {
        studentName: formData.userContactInfo.Name,
        contactNumber: formData.userContactInfo.contactNumber,
        emailAddress: 'no email',
      },
    };
    console.log(submittedData)
    setLoading(true);
    try {
      const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/universal-request', submittedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data)
      setLoading(false);
      toast.success("Request Submited Successful")

      window.location.href = "/thankYou";
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Server Error, Please try again later.");
    }
  };

  const ClasessOptions = [
    { value: 'Two Classes a Week', label: 'Two Classes a Week' },
    { value: 'Three Classes a Week', label: 'Three Classes a Week' },
    { value: 'Four Classes a Week', label: 'Four Classes a Week' },
    { value: 'Five Classes a Week', label: 'Five Classes a Week' },
    { value: 'Six Classes a Week', label: 'Six Classes a Week' },
  ];
  const modeoptions = [
    { value: 'Online Class', label: 'Online Class' },
    { value: 'Offline Class', label: 'Offline Class' }

  ];

  const closeLoginModal = () => setIsLoginModalOpen(false);

  const subjectOptions = Array.isArray(Subjects)
    ? [{ value: "All", label: "All" }, ...Subjects.map(sub => ({
      value: sub.SubjectName,
      label: sub.SubjectName,
    }))]
    : [{ value: "All", label: "All" }];

  return (
    <div>
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Class Request Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {!login ? (
              <div className="container-fluid">
                <Form.Group>
                  <label htmlFor="">Enter Your Whatsapp Number </label>
                  <Form.Control
                    type="text"
                    name="loginNumber"
                    value={showOtp ? (loginNumber || sessionStorage.getItem('number')) : loginNumber} // Ternary condition for showing value
                    onChange={handleLoginChange}
                    required
                  />

                </Form.Group>
                {showOtp && (
                  <Form.Group>
                    <label htmlFor="">Enter Otp </label>
                    <Form.Control
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}
                <div className="mt-4 d-flex align-item-center justify-content-between">
                  {showOtp ? (
                    <Button onClick={() => verifyOtp(otp)} variant="success" type="button">
                      {loading ? 'Please Wait....' : 'Verify Number'}
                    </Button>
                  ) : (
                    <Button onClick={handleLoginNumberCheck} variant="success" type="button">
                      {loading ? 'Please Wait....' : 'Submit'}
                    </Button>
                  )}


                  <Button onClick={resendOtp} variant="success" type="button">
                    Resend Otp
                  </Button>
                </div>

              </div>
            ) : <>

              {step === 1 && (
                <Container fluid>
                  <Row className="mb-md-3">
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-md-3">
                        <Form.Label>Class <span className="text-danger fs-4" >*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="Class"
                          readOnly
                          value={formData.Class}
                          placeholder="Enter Class"
                          className="form-control"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-md-3">
                        <Form.Label>Subject Name <span className="text-danger fs-4" >*</span></Form.Label>
                        <Select
                          options={subjectOptions}
                          isMulti
                          onChange={(selectedOptions) => {
                            setFormData((prevData) => ({
                              ...prevData,
                              Subject: selectedOptions
                                ? selectedOptions.map((option) => option.value)
                                : [],
                            }));
                          }}
                          value={subjectOptions.filter((option) =>
                            formData.Subject.includes(option.value)
                          )}
                          className="form-control-sm"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* <Col md={12}>
                    <Form.Group className="mb-3"
                      required>
                      <Form.Label>In Which Language You Want To Do Class <b className="text-danger fs-5">*</b></Form.Label>
                      <input
                        type="text"
                        id="Contact"
                        required
                        name="ClassLangUage"
                        value={formData.ClassLangUage}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter Your Language For Classe"
                      />

                    </Form.Group>
                  </Col> */}
                  <Row className="mb-md-3">
                    <Col xs={12}>
                      <div className="mb-3">
                        <label htmlFor="Location" className="form-label">
                          Enter your preferred location  <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          id="Location"
                          required
                          name="Location"
                          value={formData.Location}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Search Location"
                        />
                        {locationSuggestions.length > 0 && (
                          <ul className="list-group mt-2">
                            {locationSuggestions.map((location) => (
                              <li
                                key={location.place_id}
                                className="list-group-item"
                                onClick={() => handleLocationSelect(location)}
                              >
                                {location.description}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-md-3">
                    <Col xs={12} md={6}>

                      <Form.Group>
                        <Form.Label>Interested In Type Of Classes <span className="text-danger fs-4" >*</span></Form.Label>
                        <Select
                          options={modeoptions}
                          onChange={handleSelectChange("Interested")}
                          value={modeoptions.find(
                            (option) => option.value === formData.Interested
                          )}
                          className="form-control-sm"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group>

                        <Form.Label>Number of Classes <span className="text-danger fs-4">*</span></Form.Label>
                        <Select
                          options={ClasessOptions}
                          onChange={handleSelectChange("HowManyClassYouWant")}
                          value={ClasessOptions.find(
                            (option) => option.value === formData.HowManyClassYouWant
                          )}
                          className="form-control-sm"
                        />
                      </Form.Group>
                    </Col>

                  </Row>
                  <Row>
                    <Col>
                      <Button
                        variant="primary"
                        className="btn-sm w-100 mt-3"
                        onClick={() => handleStepChange(2)}
                      >
                        Next Step
                      </Button>
                    </Col>
                  </Row>
                </Container>
              )}
              {step === 2 && (
                <Container fluid>
                  <Row className="mb-md-3">

                    <Col xs={12} md={12}>
                      <Form.Group className="mb-md-3">
                        <Form.Label>Budget <span className="text-danger fs-4">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="MaximumBudget"
                          value={formData.MaximumBudget}
                          onChange={(e) => {
                            const value = e.target.value;

                            if (value === '' || /^[0-9]*$/.test(value)) {
                              handleChange(e);
                            }
                          }}
                          className="form-control-sm"
                        />
                      </Form.Group>
                    </Col>

                  </Row>
                  <Row className="mb-md-3">
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-md-3">
                        <Form.Label>Teacher Experience <span className="text-danger fs-4" >*</span></Form.Label>
                        <Form.Control
                          type="number"
                          name="teacherExperience"
                          value={formData.teacherExperience}
                          onChange={handleChange}
                          min={'1'}
                          className="form-control-sm"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-md-3">
                        <Form.Label>Teacher Gender Preference <span className="text-danger fs-4" >*</span></Form.Label>
                        <Form.Control
                          as="select"
                          name="TeacherGender"
                          value={formData.TeacherGender || ''}
                          onChange={handleChange}
                          className="form-control-sm"
                        >
                          <option value="">Select Gender Preference</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Any">Any</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>

                  </Row>
                  <Row>
                    <Col xs={12} md={12}>
                      <Form.Group className="mb-md-3">
                        <Form.Label>Preferred Start Date <span className="text-danger fs-4" >*</span> </Form.Label>
                        <Form.Control
                          type="date"
                          name="StartDate"
                          value={formData.StartDate}
                          onChange={handleChange}
                          className="form-control-sm"
                          min={`${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}-01`} // First day of current month
                          max={`${new Date().getFullYear()}-12-31`}
                        />
                      </Form.Group>
                    </Col>

                  </Row>
                  <Row>
                    <Col xs={6}>
                      <Button
                        variant="secondary"
                        className="btn-sm w-100 mt-3"
                        onClick={() => handleStepChange(1)}
                      >
                        Back
                      </Button>
                    </Col>
                    <Col xs={6}>

                      <Button
                        variant="primary"
                        className="btn-sm w-100 mt-3"
                        onClick={() => handleStepChange(3)}
                      >
                        Next Step
                      </Button>


                    </Col>
                  </Row>
                </Container>
              )}
              {step === 3 && (
                <Container fluid>
                  <Row className="mb-md-1">
                    <Col xs={12} md={12}>
                      <Form.Group className="mb-md-1">
                        <Form.Label>Student Name (Optional)</Form.Label>
                        <Form.Control
                          type="text"
                          name="Name"
                          value={formData.userContactInfo.Name}
                          onChange={(e) =>
                            handleChangeUserContactInfo('Name', e.target.value)
                          }

                          className="form-control-sm"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={12}>
                      <Form.Group className="mb-md-1">
                        <Form.Label>Student Contact Number <span className="text-danger fs-4" >*</span> </Form.Label>
                        <Form.Control
                          type="text"
                          name="contactNumber"
                          value={formData.userContactInfo.contactNumber}
                          onChange={(e) =>
                            handleChangeUserContactInfo('contactNumber', e.target.value)
                          }
                          required
                          className="form-control-sm"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <Button
                        variant="secondary"
                        className="btn-sm w-100 mt-3"
                        onClick={() => handleStepChange(step - 1)}
                      >
                        Back
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button
                        type="submit"
                        variant="primary"
                        className="btn-sm w-100 mt-3"
                        disabled={loading}
                      >
                        {loading ? 'Please Wait ...' : ' Submit'}
                      </Button>
                    </Col>
                  </Row>
                </Container>
              )}
            </>
            }


          </Form>
        </Modal.Body>
      </Modal>

      {isLoginModalOpen && (
        <LoginModal
          showModal={isLoginModalOpen}
          handleClose={closeLoginModal}
          afterLogin={() => {
            setFormData(storedFormData);
            handleSubmit();
          }}
        />
      )}
    </div>
  );
};

export default ClassModel;
