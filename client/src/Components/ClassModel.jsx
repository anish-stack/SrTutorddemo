import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import Select from "react-select";
import Cookies from 'js-cookie'

import useSessionStorageState from 'use-session-storage-state'
import LoginModal from "./LoginModel";
import toast from "react-hot-toast";


const ClassModel = ({ showModal, handleClose, subject }) => {
  const { Class, Subjects = [], isClass, id } = subject; // Default Subjects to an empty array if it's not an array
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const token = Cookies.get('studentToken') || false
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Subject: [],
    Class: "",
    Location: "",
    Interested: "", // Home Tuition at My Home, Willing to Travel to Teacher's Home, Online Class
    HowManyClassYouWant: "",
    MinumBudegt: "",
    Maxmimu: "",
    StartDate: "",
    TeaherGender: "",
    userconetcIfo: {
      Name: "",
      email: "",
      contactnumver: "",
    },
    specificrequirement: ""
  });
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

  const handleStepChange = (step) => {
    setStep(step);
  };


  const handleLocationFetch = async (input) => {
    try {
      const res = await axios.get(
        "https://place-autocomplete1.p.rapidapi.com/autocomplete/json",
        {
          params: { input, radius: "500" },
          headers: {
            "x-rapidapi-key": "75ad2dad64msh17034f06cc47c06p18295bjsn18e367df005b",
            "x-rapidapi-host": "place-autocomplete1.p.rapidapi.com",
          },
        }
      );
      setLocationSuggestions(res.data.predictions || []);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };
  const handleLocationSelect = (location) => {
    setFormData(prevState => ({
      ...prevState,
      Location: location.description,
    }));
    setLocationSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submittedData = {
      ...formData,
      Subject: isClass ? formData.Subject : Subjects, // Set to Subjects if not class-based
    };

    try {
      const response = await axios.post('http://localhost:7000/api/v1/student/Subject-teacher-Request', submittedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response)

      window.location.href = "/thankYou"
    } catch (error) {
      console.log(error)
      toast.error("Server Error Exist Please try After Sometimes")


    }


  };
  const ClasessOptions = [
    { value: 'Two Classes a Week', label: 'Two Classes a Week' },
    { value: 'Three Classes a Week', label: 'Three Classes a Week' },
    { value: 'Four Classes a Week', label: 'Four Classes a Week' },
    { value: 'Five Classes a Week', label: 'Five Classes a Week' },
    { value: 'Six Classes a Week', label: 'Six Classes a Week' },
  ];
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // Ensure Subjects is an array and generate options for the subjects dropdown
  const subjectOptions = Array.isArray(Subjects)
    ? [
      { value: "All", label: "All" },
      ...Subjects.map((sub) => ({
        value: sub.SubjectName,
        label: sub.SubjectName,
      })),
    ]
    : [{ value: "All", label: "All" }];

  return (
    <div>
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Class Request Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {step === 1 && (
              <Container fluid>
                <Row className="mb-md-3">
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-md-3">
                      <Form.Label className="">Class (Optional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="Class"
                        readOnly
                        value={formData.Class}
                        onChange={handleChange}
                        placeholder="Enter Class"
                        className="form-control-sm"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-md-3">
                      <Form.Label className="">Subject Name</Form.Label>
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
                <Row className="mb-md-3">
                  <Col xs={12}>
                    <div className="mb-3">
                      <label htmlFor="Location" className="form-label">
                        Enter your preferred location{" "}
                        <span className="text-danger">*</span>
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
                  <Col xs={12}>
                    <Form.Group className="mb-md-3">
                      <Form.Label className="">Interested In</Form.Label>
                      <Select
                        options={[
                          { value: "Home Tuition at My Home", label: "Home Tuition at My Home" },
                          { value: "Willing to Travel to Teacher's Home", label: "Willing to Travel to Teacher's Home" },
                          { value: "Online Class", label: "Online Class" },
                        ]}
                        onChange={handleSelectChange("Interested")}
                        value={
                          formData.Interested
                            ? { value: formData.Interested, label: formData.Interested }
                            : null
                        }
                        className="form-control-sm"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
            )}

            {step === 2 && (
              <Container fluid>
                <Row className="mb-md-3">
                  <Col md={6}>
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
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-md-3">
                      <Form.Label className="">Budget (Min)</Form.Label>
                      <Form.Control
                        type="number"
                        name="MinumBudegt"
                        value={formData.MinumBudegt}
                        onChange={handleChange}
                        placeholder="Enter Minimum Budget"
                        className="form-control-sm"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-md-3">
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-md-3">
                      <Form.Label className="">Budget (Max)</Form.Label>
                      <Form.Control
                        type="number"
                        name="Maxmimu"
                        value={formData.Maxmimu}
                        onChange={handleChange}
                        placeholder="Enter Maximum Budget"
                        className="form-control-sm"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-md-3">
                      <Form.Label className="">Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="StartDate"
                        value={formData.StartDate}
                        onChange={handleChange}
                        className="form-control-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-md-3">
                  <Col xs={12}>
                    <Form.Group className="mb-md-3">
                      <Form.Label className="">Teacher Gender Preference</Form.Label>
                      <Select
                        options={[
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                          { value: "Any", label: "Any" },
                        ]}
                        onChange={handleSelectChange("TeaherGender")}
                        value={{
                          value: formData.TeaherGender,
                          label: formData.TeaherGender,
                        }}
                        className="form-control-sm"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
            )}

            {step === 3 && (
              <Container fluid>
                <Row className="mb-md-3">
                  <Col xs={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="">User Contact Info</Form.Label>
                      <Form.Control
                        type="text"
                        name="Name"
                        value={formData.userconetcIfo.Name}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            userconetcIfo: {
                              ...prevData.userconetcIfo,
                              Name: e.target.value,
                            },
                          }))
                        }
                        placeholder="Enter Name"
                        className="form-control mb-3"
                      />
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.userconetcIfo.email}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            userconetcIfo: {
                              ...prevData.userconetcIfo,
                              email: e.target.value,
                            },
                          }))
                        }
                        placeholder="Enter Email"
                        className="form-control mb-3"
                      />
                      <Form.Control
                        type="text"
                        name="contactnumver"
                        value={formData.userconetcIfo.contactnumver}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            userconetcIfo: {
                              ...prevData.userconetcIfo,
                              contactnumver: e.target.value,
                            },
                          }))
                        }
                        placeholder="Enter Contact Number"
                        className="form-control mb-3"
                      />
                      <Form.Control
                        as="textarea"
                        className="mb-3"
                        name="specificrequirement"
                        value={formData.specificrequirement}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            specificrequirement: e.target.value,
                          }))
                        }
                        placeholder="Specific Requirement"
                      />

                    </Form.Group>
                  </Col>
                </Row>
              </Container>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {step === 1 && (
            <Button variant="secondary" onClick={() => handleStepChange(2)}>
              Next
            </Button>
          )}
          {step === 2 && (
            <>
              <Button variant="secondary" onClick={() => handleStepChange(1)}>
                Back
              </Button>
              <Button variant="primary" onClick={() => handleStepChange(3)}>
                Next
              </Button>
            </>
          )}
          {step === 3 && (
            <>
              <Button variant="secondary" onClick={() => handleStepChange(2)}>
                Back
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <LoginModal
        isOpen={isLoginModalOpen}
        modalType="student"
        onClose={closeLoginModal}
      />
    </div>
  )
}

export default ClassModel
