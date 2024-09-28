import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
// import { Modal, Button,  Row,  Container } from "react-bootstrap";

import axios from "axios";
import Cookies from "js-cookie";
import { ClassSearch } from "../../Slices/Class.slice";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useGeolocated } from "react-geolocated";
import { Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const ContactTeacherModal = ({ isOpen, isClose, teachersData }) => {
  // console.log(teachersData)
  const [loading, setLoading] = useState(false)
  const [teacherData, setTeacherData] = useState([]);
  const [studentToken, setStudentToken] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    Gender: "",
    TeachingExperience: "",
    VehicleOwned: "",
    TeachingMode: "All",
    Location: "",
    Subject: [],
    MinRange: 0,
    ClassLangUage: '',
    StartDate: "",
    MaxRange: 0,
    SpecificRequirement: "",
    HowManyClassYouWant: "",
    ClassId: '',
    className: '',
    teacherId: '',
    locality: '',
    StudentName: '',
    StudentEmail: '',
    StudentContact: '',
    latitude: '',
    longitude: '',
    teacherId: '',
    isBestFaculty: false,
  });
  const navigate = useNavigate();
  const [loginNumber, setLoginNumber] = useState()
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [concatenatedData, setConcatenatedData] = useState([]);

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.Class);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });
  const [login, setLogin] = useState(false)

  const url = new URLSearchParams(window.location.search)
  const otpValue = url.get('otpSent')
  const [sessionData, setSessionData] = useState({
    otpSent: false,
    number: ''
  })
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState()
  const [ClickLatitude, setClickLatitude] = useState(null);
  const [ClickLongitude, setClickLongitude] = useState(null);
  useEffect(() => {
    if (coords) {
      setFormData(prevState => ({
        ...prevState,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    }
  }, [coords]);


  useEffect(() => {
    if (teachersData) {
      setTeacherData(teachersData);
      setFormData((prevFormData) => ({
        ...prevFormData,
        Gender: teachersData.gender || prevFormData.Gender,
        TeachingExperience: teachersData.experience || prevFormData.TeachingExperience,
        TeachingMode: teachersData.teachingMode || prevFormData.TeachingMode,
        Location: teachersData.location || prevFormData.Location,
        Subject: teachersData.UserSubject || prevFormData.Subject,
        teacherId: teachersData.TeacherId,
        ClassId: teachersData.UserclassId,
      }));
    }
  }, [teachersData]);

  useEffect(() => {
    const student = Cookies.get("studentToken");
    setStudentToken(student || null);
  }, []);
  useEffect(() => {
    if (studentToken) {
      setLogin(true)
    } else {
      setLogin(false)
    }
  }, [studentToken])
  useEffect(() => {
    dispatch(ClassSearch());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      const filterOutClasses = ['I-V', 'VI-X', 'X-XII'];
      const filteredClasses = data
        .filter(item => !filterOutClasses.includes(item.Class))
        .map(item => ({ class: item.Class, id: item._id }));

      const rangeClasses = data
        .filter(item => item.InnerClasses && item.InnerClasses.length > 0)
        .flatMap(item => item.InnerClasses.map(innerClass => ({
          class: innerClass.InnerClass,
          id: innerClass._id
        })));

      const concatenatedData = rangeClasses.concat(filteredClasses);
      setConcatenatedData(concatenatedData);

      const userClass = concatenatedData.find(item => item.id === teacherData.UserclassId);
      if (userClass) {
        setSelectedClass(userClass.id);
        fetchSubjects(userClass.id);
      }
    }
  }, [data, teacherData]);

  useEffect(() => {
    if (formData.ClassId) {
      console.log("id", formData.ClassId)
      const selectedClass = concatenatedData.find(item => item.id === formData.ClassId);
      console.log("i am done", selectedClass)
      if (selectedClass) {
        setFormData(prevFormData => ({
          ...prevFormData,
          className: selectedClass.class,
        }));
      }
    }
  }, [formData.ClassId, concatenatedData]);

  const fetchSubjects = async (classId) => {
    try {
      const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/admin/Get-Class-Subject/${classId}`);
      const fetchedSubjects = response.data.data.Subjects;

      if (fetchedSubjects) {
        setSubjects(fetchedSubjects);
        if (!formData.Subject.length) {
          setFormData(prevFormData => ({
            ...prevFormData,
            Subject: fetchedSubjects,
          }));
        }
      } else {
        setSubjects([]);
        setFormData(prevFormData => ({
          ...prevFormData,
          Subject: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };
  const handleSelectChange = (name) => (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  }
  const ClasessOptions = [
    { value: 'Two Classes a Week', label: 'Two Classes a Week' },
    { value: 'Three Classes a Week', label: 'Three Classes a Week' },
    { value: 'Four Classes a Week', label: 'Four Classes a Week' },
    { value: 'Five Classes a Week', label: 'Five Classes a Week' },
    { value: 'Six Classes a Week', label: 'Six Classes a Week' },
  ];
  const modeoptions = [
    { value: 'Online Class', label: 'Online Class' },
    { value: 'Home Tuition at My Home', label: 'Home Tuition at My Home' },
    { value: 'Willing to travel to Teacher Home', label: 'Willing to travel to Teacher Home' },
    { value: 'Require Teacher to Travel to My Home', label: 'Require Teacher to Travel to My Home' },
  ];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "Location") {
      handleLocationFetch(value);
    }




  };
  const handleLocationLatAndLngFetch = async (address) => {
    const options = {
      method: 'GET',
      url: `https://api.srtutorsbureau.com/geocode?address=${address}`
    };

    try {
      const response = await axios.request(options);
      const result = response.data;
      console.log("Result from us", result)
      if (result) {
        // Update state with latitude and longitude from the result
        setClickLatitude(result?.latitude);
        setClickLongitude(result?.longitude);
      }
      console.log("Result from setClickLatitude", ClickLatitude)
      console.log("Result from setClickLongitude", ClickLongitude)

    } catch (error) {
      console.error("Error fetching location coordinates:", error);
    }
  };
  useEffect(() => {
    console.log("Updated ClickLatitude:", ClickLatitude);
    console.log("Updated ClickLongitude:", ClickLongitude);
  }, [ClickLatitude, ClickLongitude]);

  const handleLocationFetch = async (input) => {
    try {
      const res = await axios.get(
        `https://api.srtutorsbureau.com/autocomplete?input=${input}`);

      setLocationSuggestions(res.data || []);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleTeachingModeChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      TeachingMode: e.target.value,
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prevState => ({
      ...prevState,
      Location: location.description,
    }));
    handleLocationLatAndLngFetch(location.description)
    setLocationSuggestions([]);
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: Number(value),
    }));
  };

  const handleBestFacultyChange = () => {
    setFormData(prevState => ({
      ...prevState,
      isBestFaculty: !prevState.isBestFaculty,
    }));
  };

  const handleSubjectChange = (selectedOptions) => {
    setFormData(prevState => ({
      ...prevState,
      Subject: selectedOptions ? selectedOptions.map(option => option.label) : [],
    }));
  };

  const handleClassChange = (e) => {
    const classId = e ? e.target.value : "";
    setSelectedClass(classId);
    setFormData(prevState => ({ ...prevState, Subject: [] }));
    fetchSubjects(classId);
  };

  const validateFields = () => {
    let isValid = true;
    if (step === 1) {
      if (!formData.Gender) {
        isValid = false;
        toast.error("Please fill out the Gender field.");
      }
      if (!formData.StudentName) {
        isValid = false;
        toast.error("Please fill out the Name field.");
      }
      if (!formData.StudentEmail) {
        isValid = false;
        toast.error("Please fill out the Email field.");
      }
      if (!formData.StudentContact) {
        isValid = false;
        toast.error("Please fill out the Contact Details field.");
      }
    }
    if (step === 2) {
      if (!selectedClass) {
        isValid = false;
        toast.error("Please select a class.");
      }
      if (formData.Subject.length === 0) {
        isValid = false;
        toast.error("Please choose at least one subject.");
      }
    }
    if (step === 3) {
      if (!formData.StartDate) {
        isValid = false;
        toast.error("Please select a preferred start date.");
      }
      if (!formData.Location) {
        isValid = false;
        toast.error("Please enter your preferred location.");
      }
    }
    if (step === 4) {
      if (!formData.TeachingMode) {
        isValid = false;
        toast.error("Please select a teaching mode.");
      }
      if (formData.TeachingExperience <= 0) {
        isValid = false;
        toast.error("Please specify the teaching experience.");
      }
      if (formData.MinRange <= 0) {
        isValid = false;
        toast.error("Please specify the minimum budget range.");
      }
      if (formData.MaxRange <= 0) {
        isValid = false;
        toast.error("Please specify the maximum budget range.");
      }
    }
    return isValid;
  };

  const handleNextStep = () => {
    if (validateFields()) {
      setStep(prevStep => prevStep + 1);
    }
  };
  const handleLoginChange = (e) => {
    setLoginNumber(e.target.value); // Directly set the value
  };

  const handlePreviousStep = () => {
    setStep(prevStep => prevStep - 1);
  };


  const resendOtp = async () => {
    console.log(loginNumber)
    try {

      const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/resent-otp', { PhoneNumber: loginNumber });
      console.log(response.data)
      toast.success(response.data.message);

    } catch (error) {
      console.log(error)
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
      setStudentToken(token)
      setLogin(true)
      setStep(1);

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };


  const handleLoginNumberCheck = async (e) => {
    e.preventDefault()



    try {
      const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/checkNumber-request', {
        userNumber: loginNumber
      })
      console.log(response.data)
      setShowOtp(true)
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('otpSent', 'true');
      newUrl.searchParams.set('number', loginNumber);
      newUrl.searchParams.set('verified', 'false');

      sessionStorage.setItem('OtpSent', true)
      sessionStorage.setItem('number', loginNumber)
      sessionStorage.setItem('verified', false)


      navigate(`${window.location.pathname}?${newUrl.searchParams.toString()}`, { replace: true });
    } catch (error) {
      console.log(error.response)

      if (error.response?.data?.success === false &&
        error.response?.data?.message === "User with this phone number already exists.") {
        setShowOtp(true)
        setStep(1); // Correctly set the state
      }
    }
  }







  const handleSubmit = async () => {
    if (!formData.latitude || !formData.longitude) {
      if (isGeolocationAvailable && isGeolocationEnabled) {

        // Trigger location update if not already available
        setFormData(prevState => ({
          ...prevState,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }));

      }
    }

    const student = Cookies.get("studentToken");
    const submittedData = {
      requestType: "Particular Teacher Request",
      classId: formData?.ClassId || null,
      className: formData?.className,
      subjects: formData?.Subject,
      ClassLangUage: formData.ClassLangUage,
      interestedInTypeOfClass: formData?.TeachingMode,
      teacherGenderPreference: formData?.Gender,
      numberOfSessions: formData?.HowManyClassYouWant,
      experienceRequired: formData?.TeachingExperience,
      minBudget: formData?.MinRange,
      maxBudget: formData?.MaxRange,
      locality: formData?.locality,
      startDate: formData?.StartDate,
      specificRequirement: formData?.SpecificRequirement,
      location: {
        type: 'Point',
        coordinates: [ClickLongitude, ClickLatitude]
      },
      teacherId: formData?.teacherId,
      studentInfo: {
        studentName: formData.StudentName,
        contactNumber: formData.StudentContact,
        emailAddress: formData.StudentEmail,
      },
    };
    console.log("submittedData", submittedData)
    setLoading(true);
    try {
      const response = await axios.post('https://api.srtutorsbureau.com/api/v1/student/universal-request', submittedData, {
        headers: { Authorization: `Bearer ${student || studentToken}` }
      });
      console.log(response.data)
      setLoading(false);
      toast.success("Request Submit Successful")

      window.location.href = "/thankYou";
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Server Error, Please try again later.");
    }

  };




  const isAllSubjectsSelected =
    subjects.length > 0 &&
    subjects.every((subject) => formData.Subject.includes(subject._id));

  const subjectOptions = subjects.map((subject) => ({
    value: subject._id,
    label: subject.SubjectName,
  }));

  const classOptions = classes.map((cls) => ({
    value: cls.id,
    label: cls.label,
  }));

  // if (!studentToken) {
  //   return (
  //     <div className="unauthorized">
  //       <h3>Unauthorized Access</h3>
  //       <p>Please log in to access this page.</p>
  //     </div>
  //   );
  // }

  return (
    <div
      className={`modal fade ${isOpen ? "show d-block" : ""}`}
      style={{ display: isOpen ? "block" : "none" }}
      tabIndex="-1"
      aria-labelledby="contactTeacherModalLabel"
      aria-hidden={!isOpen}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="contactTeacherModalLabel">
              Contact Teacher
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={isClose}
              aria-label="Close"
            ></button>
          </div>




          <div className="modal-body">
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
                <>
                  <h4>Step 1: Basic Details</h4>
                  <div className="mb-3">
                    <label htmlFor="Gender" className="form-label">
                      Teacher Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      id="Gender"
                      required
                      name="Gender"
                      value={formData.Gender}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Any">Any</option>
                    </select>
                  </div>
                  <Col md={12}>
                    <Form.Group className="mb-3"
                      required>
                      <Form.Label>Student Name <b className="text-danger fs-5">*</b></Form.Label>
                      <div className="mb-3">

                        <input
                          type="text"
                          id="StudentName"
                          required
                          name="StudentName"
                          value={formData.StudentName}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter Your Name"
                        />

                      </div>

                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3"
                      required>
                      <Form.Label>Student Email <b className="text-danger fs-5">*</b></Form.Label>
                      <div className="mb-3">

                        <input
                          type="Email"
                          id="Email"
                          required
                          name="StudentEmail"
                          value={formData.StudentEmail}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter Your Email"
                        />

                      </div>

                    </Form.Group>
                  </Col>  <Col md={12}>
                    <Form.Group className="mb-3"
                      required>
                      <Form.Label>Contact Details <b className="text-danger fs-5">*</b></Form.Label>
                      <div className="mb-3">

                        <input
                          type="text"
                          id="Contact"
                          required
                          name="StudentContact"
                          value={formData.StudentContact}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter Your Contact Details"
                        />

                      </div>

                    </Form.Group>
                  </Col>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h4>Step 2: Academic Details</h4>
                  <div className="mb-3">
                    <label htmlFor="Class" className="form-label">
                      Select the class you are interested in{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      id="Class"
                      value={selectedClass}
                      onChange={handleClassChange}
                      className="form-select"
                    >
                      <option value="" disabled>
                        Select Class
                      </option>
                      {concatenatedData.map((cls, index) => (
                        <option key={index} value={cls.id ? cls.id : cls._id}>
                          {cls.class}
                        </option>
                      ))}

                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Subject" className="form-label">
                      Choose the subjects you want to learn{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <Select
                      isMulti
                      required
                      name="Subject"
                      value={subjectOptions.filter((option) =>
                        formData.Subject.includes(option.label)
                      )}
                      onChange={handleSubjectChange}
                      options={subjectOptions}
                      placeholder="Select Subjects"
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                  <Col md={12}>
                    <Form.Group className="mb-3"
                      required>
                      <Form.Label>In Which Language You Want To Do Class <b className="text-danger fs-5">*</b></Form.Label>
                      <input
                        type="text"
                        id="Contact"
                        required
                        name="ClassLangUage"
                        value={formData.ClassLangUage}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter Your Language For Classe"
                      />

                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3"
                      required>
                      <Form.Label>How Many Classes You Want  <b className="text-danger fs-5">*</b></Form.Label>
                      <Select
                        name="HowManyClassYouWant"
                        options={ClasessOptions}
                        onChange={handleSelectChange('HowManyClassYouWant')}
                        value={ClasessOptions.find(option => option.value === formData.HowManyClassYouWant) || null}
                      />

                    </Form.Group>
                  </Col>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                </>
              )}

              {step === 3 && (
                <>
                  <h4>Step 3: Additional Information</h4>
                  <div className="mb-3">
                    <label htmlFor="StartDate" className="form-label">
                      Preferred Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="StartDate"
                      required
                      name="StartDate"
                      value={formData.StartDate}
                      onChange={handleInputChange}
                      className="form-control"
                      min={new Date().toISOString().split("T")[0]} // This sets the minimum date to today's date
                    />

                  </div>
                  <div className="mb-3">
                    <label htmlFor="Location" className="form-label">
                      Write Your Complete Address Where You Want tutor{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="locality"
                      required
                      name="locality"
                      value={formData.locality}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Write Your Complete Address Where You Want tutor"
                    />

                  </div>
                  <div className="mb-3">
                    <label htmlFor="Location" className="form-label">
                      Search Your Near By Place{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="Location"
                      required
                      name="Location"
                      value={formData.Location}
                      onChange={handleInputChange}
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
                  <div className="mb-3">
                    <label htmlFor="SpecificRequirement" className="form-label">
                      Specific Requirement <span className="text-danger">(Optional)</span>
                    </label>
                    <textarea

                      id="SpecificRequirement"

                      name="SpecificRequirement"
                      value={formData.SpecificRequirement}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                </>
              )}

              {step === 4 && (
                <>
                  <h4>Step 4: Teaching Preferences</h4>
                  <div className="mb-3">
                    <label htmlFor="TeachingMode" className="form-label">
                      Choose your preferred teaching mode (e.g., online,
                      in-person) <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={modeoptions}
                      onChange={handleSelectChange("TeachingMode")}
                      value={modeoptions.find(
                        (option) => option.value === formData.TeachingMode
                      )}
                      className="form-control-sm"
                    />
                    {/* <select
                      id="TeachingMode"
                      required
                      name="TeachingMode"
                      value={formData.TeachingMode}
                      onChange={handleTeachingModeChange}
                      className="form-select"
                    >
                      <option value="" disabled>
                        Select Teaching Mode
                      </option>
                      <option value="Online Class">Online Class</option>
                      <option value="Home Tuition at My Home">
                        Home Tuition at My Home
                      </option>
                      <option value="Willing to travel to Teacher's Home">
                        Willing to travel to Teacher's Home
                      </option>
                    </select> */}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="TeachingExperience" className="form-label">
                      Select the required teaching experience{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      id="TeachingExperience"
                      required
                      name="TeachingExperience"
                      value={formData.TeachingExperience}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="MinRange" className="form-label">
                      Specify the minimum budget range{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="MinRange"
                      required
                      name="MinRange"
                      value={formData.MinRange}
                      onChange={handleRangeChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="MaxRange" className="form-label">
                      Specify the maximum budget range{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="MaxRange"
                      required
                      name="MaxRange"
                      value={formData.MaxRange}
                      onChange={handleRangeChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      id="isBestFaculty"
                      checked={formData.isBestFaculty}
                      onChange={handleBestFacultyChange}
                      className="form-check-input"
                    />
                    <label htmlFor="isBestFaculty" className="form-check-label">
                      Check if you are looking for the best faculty
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                </>
              )}

              {step === 5 && (
                <>
                  <h4 className="text-center mb-4">Step 5: Review Your Information</h4>
                  <div className="scrollable-container mb-4">
                    <ul className="list-group mb-3">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Teacher Gender:</strong> <span>{formData.Gender}</span>
                      </li>

                      {
                        formData.className? (
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                          <strong>Class:</strong> <span>{formData.className}</span>
                        </li>
                        ):null
                      }
                   
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Subjects:</strong>
                        <span>
                          {Array.isArray(formData.Subject)
                            ? formData.Subject.length > 0
                              ? formData.Subject.length === 1
                                ? formData.Subject[0]
                                : formData.Subject.join(", ")
                              : "No Subject"
                            : formData.Subject || "No Subject"}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Preferred Start Date:</strong> <span>{formData.StartDate}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Classes You Want:</strong> <span>{formData.HowManyClassYouWant}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Near By Location:</strong> <span>{formData.Location.substring(0, 12)}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Current Location:</strong> <span>{formData.locality.substring(0, 7) + ' ....'}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Teaching Mode:</strong> <span>{formData.TeachingMode}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Specific Requirement:</strong> <span>{formData.SpecificRequirement || "No Specific Requirement"}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Teaching Experience:</strong> <span>{formData.TeachingExperience} years</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Minimum Range:</strong> <span>{formData.MinRange}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Maximum Range:</strong> <span>{formData.MaxRange}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Is Best Faculty:</strong> <span>{formData.isBestFaculty ? "Yes" : "No"}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handlePreviousStep}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      {loading ? 'Please Wait...' : 'Submit'}
                    </button>
                  </div>
                </>

              )}
            </>
            }




          </div>
        </div>
      </div>
    </div>
  );
};

ContactTeacherModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isClose: PropTypes.func.isRequired,
};

export default ContactTeacherModal;
