import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import Select from "react-select";
import Cookies from 'js-cookie'
import LoginModal from "./LoginModel";
import useSessionStorageState from 'use-session-storage-state'
import toast from "react-hot-toast";
import Loader from "./Loader";
const SubjectModel = ({ showModal, handleClose, subject }) => {

    const token = Cookies.get('studentToken') || false

    const [login, setLogin] = useState(true)

    const [isLoading, setLoading] = useState(false)
    const { Class, Subjects = [], isClass, id } = subject || {}; // Default Subjects to an empty array if it's not an array
    const [locationSuggestions, setLocationSuggestions] = useState([]);
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
    const [storedFormData, setStoredFormData] = useSessionStorageState('beforeLoginDataSubject', {
        defaultValue: formData,
    });
    const ClasessOptions = [
        { value: 'Two Classes a Week', label: 'Two Classes a Week' },
        { value: 'Three Classes a Week', label: 'Three Classes a Week' },
        { value: 'Four Classes a Week', label: 'Four Classes a Week' },
        { value: 'Five Classes a Week', label: 'Five Classes a Week' },
        { value: 'Six Classes a Week', label: 'Six Classes a Week' },
    ];
    const [loginShow, setLoginShow] = useState(false)
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
    const handleStepChange = (nextStep) => {
        let valid = true;

        // Validation based on the current step
        if (step === 1) {
            // Validate fields for step 1
            if (!formData.Interested || !formData.Location) {
                toast.error("Please fill all required fields.");
                valid = false;
            }
        } else if (step === 2) {
            // Validate fields for step 2
            if (!formData.HowManyClassYouWant) {
                toast.error("How many classes you want is required.");
                valid = false;
            }
            if (formData.MinumBudegt <= 499) {
                toast.error("Minimum budget must be at least 500.");
                valid = false;
            }  
         
            if (!formData.StartDate) {
                toast.error("Start date is required.");
                valid = false;
            }
            if (!formData.TeaherGender) {
                toast.error("Choose teacher gender preference.");
                valid = false;
            }
        }

        // Change step if validation passes
        if (valid) {
            setStep(nextStep);
        }
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
    const validateForm = () => {
        let valid = true;
        const errors = {};

        // Validate required fields
        Object.keys(formData).forEach((key) => {
            if (key !== "userconetcIfo" && key !== "specificrequirement" && !formData[key]) {
                valid = false;
                errors[key] = "This field is required.";
            }
        });


        return { valid, errors };
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const submittedData = {
            ...formData,
            Subject: isClass ? formData.Subject : Subjects,
        };
        setLoading(true)
        try {
            const response = await axios.post('https://www.sr.apnipaathshaala.in/api/v1/student/Subject-teacher-Request', submittedData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log(response)
            setLoading(false)
            // window.location.href="/thankYou"
        } catch (error) {
            console.log(error)
            toast.error("Server Error Exist Please try After Sometimes")
            setLoading(false)

        }


        // console.log("Form Data Submitted:", submittedData);
    };

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
            {login ? (
                <Modal show={login ? showModal : ''} onHide={handleClose} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Subject Request Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {step === 1 && (
                                <Container>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3"
                                                required>
                                                <Form.Label>Subject</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="Subject"
                                                    readOnly
                                                    value={formData.Subject.join(", ") || Subjects}
                                                    placeholder="Enter Subject"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3"
                                                required>
                                                <Form.Label>Class</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="Class"
                                                    onChange={handleChange}
                                                    value={formData.Class}
                                                    placeholder="Enter Class in Which You Learn"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mb-md-3">
                                        <Col xs={12}>
                                            <div className="mb-3"
                                                required>
                                                <label htmlFor="Location" className="form-label">
                                                    Enter your preferred location{" "}
                                                    <b className="text-danger fs-5">*</b>
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
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3"
                                                required>
                                                <Form.Label>Interested In  <b className="text-danger fs-5">*</b></Form.Label>
                                                <Select
                                                    options={[
                                                        {
                                                            value: "Home Tuition at My Home",
                                                            label: "Home Tuition at My Home",
                                                        },
                                                        {
                                                            value: "Willing to Travel to Teacher's Home",
                                                            label: "Willing to Travel to Teacher's Home",
                                                        },
                                                        { value: "Online Class", label: "Online Class" },
                                                    ]}
                                                    onChange={handleSelectChange("Interested")}
                                                    value={
                                                        formData.Interested
                                                            ? {
                                                                value: formData.Interested,
                                                                label: formData.Interested,
                                                            }
                                                            : null
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Container>
                            )}

                            {step === 2 && (
                                <Container>
                                    <Row>
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
                                        <Col md={6}>
                                            <Form.Group className="mb-3"
                                                required>
                                                <Form.Label>Budget (Min)  <b className="text-danger fs-5">*</b></Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="MinumBudegt"
                                                    value={formData.MinumBudegt}
                                                    onChange={handleChange}
                                                    placeholder="Enter Minimum Budget"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3"
                                                required>
                                                <Form.Label>Budget (Max)  <b className="text-danger fs-5">*</b></Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="Maxmimu"
                                                    value={formData.Maxmimu}
                                                    onChange={handleChange}
                                                    placeholder="Enter Maximum Budget"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3"
                                                required>
                                                <Form.Label>Start Date  <b className="text-danger fs-5">*</b></Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="StartDate"
                                                    value={formData.StartDate}
                                                    onChange={handleChange}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3"
                                                required>
                                                <Form.Label>Teacher Gender Preference  <b className="text-danger fs-5">*</b></Form.Label>
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
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Container>
                            )}
                            {step === 3 && (
                                <Container>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3"
                                                required>
                                                <Form.Label>User Contact Info  <b className="text-danger fs-5">*</b></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="Name"
                                                    className="mb-3"
                                                    required
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
                                                />
                                                <Form.Control
                                                    type="email"
                                                    className="mb-3"
                                                    required
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
                                                />
                                                <Form.Control
                                                    type="text"
                                                    className="mb-3"
                                                    required
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
                                                />
                                                <Form.Control
                                                    as="textarea"
                                                    className="mb-3"
                                                    required
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
                                <Button disabled={isLoading} variant="primary" onClick={handleSubmit}>
                                    {isLoading ? "Please wait..." : "Submit"}
                                </Button>
                            </>
                        )}
                    </Modal.Footer>
                </Modal>
            ) : (
                <LoginModal
                    isOpen={isLoginModalOpen}
                    modalType="student"
                    onClose={closeLoginModal}
                />
            )}


        </div>
    )
}

export default SubjectModel